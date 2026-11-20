import { createHash } from "node:crypto";

/*
  ─────────────────────────────────────────────────────────────────────────────
  AN IN-MEMORY SLIDING WINDOW
  ─────────────────────────────────────────────────────────────────────────────
  Keyed by a SHA-256 hash of the client address. The address itself is never
  stored: the map cannot be turned back into a list of visitors, and the log
  line never sees it either.

  THIS IS A SPEED BUMP, NOT A WALL. Counters live in one process and reset on a
  cold start, so a multi-instance deployment under-counts. That limitation is
  stated in the report and is the reason the honeypot and the render-time check
  carry more of the load. A shared store is a later, separately approved
  integration.

  The map has a hard cap. Without one, a spray of unique addresses is itself a
  memory-exhaustion attack — the rate limiter would become the vulnerability.
*/

export interface RateLimitOptions {
  /** Sliding window length in milliseconds. */
  windowMs: number;
  /** Requests allowed per window. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Whole seconds until the oldest request leaves the window. */
  retryAfter: number;
  /** How many requests remain in the current window. */
  remaining: number;
}

/** Enough for a busy single instance; small enough to be harmless if full. */
const MAX_TRACKED_KEYS = 5_000;

const buckets = new Map<string, number[]>();

/** The address is an input to the hash and never a key. */
export function hashClientAddress(address: string): string {
  return createHash("sha256").update(address).digest("hex");
}

/** The first hop in `x-forwarded-for`, falling back to the socket address. */
export function clientAddressFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}

function pruneExpired(now: number, windowMs: number): void {
  for (const [key, timestamps] of buckets) {
    const live = timestamps.filter((at) => now - at < windowMs);

    if (live.length === 0) buckets.delete(key);
    else if (live.length !== timestamps.length) buckets.set(key, live);
  }
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const { windowMs, max } = options;

  /* Expired keys are swept before a new one is added, so the cap bounds live
     data rather than all data ever seen. */
  if (buckets.size >= MAX_TRACKED_KEYS) pruneExpired(now, windowMs);

  /* If the sweep freed nothing, evict the oldest key. Insertion order is the
     only ordering a Map offers, and under attack any eviction is better than
     unbounded growth. */
  if (buckets.size >= MAX_TRACKED_KEYS) {
    const oldest = buckets.keys().next();
    if (!oldest.done) buckets.delete(oldest.value);
  }

  const recent = (buckets.get(key) ?? []).filter((at) => now - at < windowMs);

  if (recent.length >= max) {
    const oldest = recent[0] ?? now;
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));

    buckets.set(key, recent);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  recent.push(now);
  buckets.set(key, recent);

  return { allowed: true, retryAfter: 0, remaining: Math.max(0, max - recent.length) };
}

/**
 * The two limits every submission passes: per client, and a global ceiling that
 * protects the process when the per-client key is easy to rotate.
 */
export interface RateLimitVerdict {
  allowed: boolean;
  retryAfter: number;
}

export function enforceRateLimits(
  clientKey: string,
  options: RateLimitOptions & { globalMax: number }
): RateLimitVerdict {
  const global = checkRateLimit("global", {
    windowMs: options.windowMs,
    max: options.globalMax,
  });

  if (!global.allowed) return { allowed: false, retryAfter: global.retryAfter };

  const client = checkRateLimit(clientKey, {
    windowMs: options.windowMs,
    max: options.max,
  });

  if (!client.allowed) return { allowed: false, retryAfter: client.retryAfter };

  return { allowed: true, retryAfter: 0 };
}

/** Test seam only — the QA script and route tests use it between cases. */
export function resetRateLimits(): void {
  buckets.clear();
}
