import { randomUUID } from "node:crypto";

import { SOCIAL_LINKS } from "@/constants/profile";
import type {
  ContactErrorCode,
  ContactErrorResponse,
  ContactFieldErrors,
} from "@/features/conversion/contact-form/contactSchema";
import { validateContact } from "@/features/conversion/contact-form/contactSchema";
import { DeliveryNotConfiguredError, getDeliveryAdapter } from "@/lib/contact/delivery";
import { buildHandoff } from "@/lib/contact/handoff";
import { checkRateLimit, clientAddressFrom, hashClientAddress } from "@/lib/contact/rateLimit";
import { serverEnv } from "@/lib/env.server";

import type { NextRequest } from "next/server";

/*
  ─────────────────────────────────────────────────────────────────────────────
  POST /api/contact — the only backend route in the project
  ─────────────────────────────────────────────────────────────────────────────
  There is no GET. Nothing about a submission is cached, enumerated, stored, or
  echoed back. The body exists in memory for the length of the request and is
  then gone.

  THE ORDER IS THE DEFENCE:
    1. content type     — cheap, and rejects anything that is not JSON
    2. origin           — the form must come from this site
    3. rate limit       — before any parsing or validation work
    4. body size        — streamed with a hard 16 kB ceiling
    5. honeypot/timing  — silent success, because telling a bot it failed
                          only teaches it what to change
    6. schema           — the server's parse is the only one that decides
    7. delivery         — `none` today, which is a handoff, not an error

  LOGGING CARRIES NO PERSONAL DATA. One line per request:
  `{ requestId, durationMs, outcome, code }`. No name, no address, no message,
  no IP. The request id is what ties a visitor's report to a server line.
*/

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 16 kB, checked twice: on the header when present, and while streaming. */
const MAX_BODY_BYTES = 16 * 1024;

/** A submission younger than this is a script; older than the ceiling is stale. */
const MIN_RENDER_AGE_MS = 2_500;
const MAX_RENDER_AGE_MS = 30 * 60 * 1000;

/** The process-wide ceiling, independent of the per-client window. */
const GLOBAL_WINDOW_MS = 60_000;
const GLOBAL_MAX = 100;

type Outcome =
  | "accepted"
  | "handoff"
  | "validation"
  | "origin"
  | "media_type"
  | "too_large"
  | "rate_limit"
  | "timeout"
  | "internal";

interface Submission {
  requestId: string;
  startedAt: number;
  duration: () => number;
}

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
  });
}

function errorResponse(
  code: ContactErrorCode,
  status: number,
  fields?: ContactFieldErrors,
  retryAfter?: number
): Response {
  const body: ContactErrorResponse = { ok: false, code };

  if (fields) body.fields = fields;
  if (retryAfter !== undefined) body.retryAfter = retryAfter;

  return jsonResponse(
    body,
    status,
    retryAfter !== undefined ? { "retry-after": String(retryAfter) } : undefined
  );
}

/**
 * The silent bot response.
 *
 * It is a well-formed handoff, identical in shape to a real one, and it carries
 * no value from the request. A bot learns nothing from it; a human never sees it
 * because a human never fills the honeypot or submits in under 2.5 seconds.
 */
function silentHandoff(): Response {
  return jsonResponse(
    {
      ok: true,
      status: "handoff",
      handoff: { channel: "email", href: SOCIAL_LINKS.email },
    },
    200
  );
}

/**
 * Read the body with a ceiling, rather than trusting `content-length`.
 *
 * `request.text()` would buffer an arbitrary payload before the cap could be
 * applied. The stream is counted chunk by chunk and cancelled the moment it
 * crosses the limit.
 */
async function readBody(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;

  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }

    chunks.push(value);
  }

  const merged = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(merged);
}

export async function POST(request: NextRequest): Promise<Response> {
  const submission: Submission = {
    requestId: `req_${randomUUID()}`,
    startedAt: Date.now(),
    duration: () => Date.now() - submission.startedAt,
  };

  const finish = (response: Response, outcome: Outcome, code?: string): Response => {
    /*
      The only structured log in the project. `code` is an error code from the
      contract, never a message or a field value.
    */
    console.info(
      JSON.stringify({
        requestId: submission.requestId,
        durationMs: submission.duration(),
        outcome,
        code: code ?? null,
      })
    );

    return response;
  };

  /* 1. Content type. `application/json; charset=utf-8` is accepted; anything
        else is not, including the browser's default form encoding. */
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return finish(
      errorResponse("UNSUPPORTED_MEDIA_TYPE", 415),
      "media_type",
      "UNSUPPORTED_MEDIA_TYPE"
    );
  }

  /* 2. Origin. A same-origin form POST always carries it; a request without one
        is not the form. */
  const origin = request.headers.get("origin");

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(serverEnv.NEXT_PUBLIC_SITE_URL).origin;
  } catch {
    return finish(errorResponse("INTERNAL", 500), "internal", "INTERNAL");
  }

  if (!origin || origin !== allowedOrigin) {
    return finish(errorResponse("ORIGIN", 403), "origin", "ORIGIN");
  }

  /* 3. Rate limits: per client address (hashed) and per process. */
  const clientKey = hashClientAddress(clientAddressFrom(request.headers));

  const clientLimit = checkRateLimit(clientKey, {
    windowMs: serverEnv.RATE_LIMIT_WINDOW_MS,
    max: serverEnv.RATE_LIMIT_MAX,
  });

  if (!clientLimit.allowed) {
    return finish(
      errorResponse("RATE_LIMIT", 429, undefined, clientLimit.retryAfter),
      "rate_limit",
      "RATE_LIMIT"
    );
  }

  const globalLimit = checkRateLimit("global", {
    windowMs: GLOBAL_WINDOW_MS,
    max: GLOBAL_MAX,
  });

  if (!globalLimit.allowed) {
    return finish(
      errorResponse("RATE_LIMIT", 429, undefined, globalLimit.retryAfter),
      "rate_limit",
      "RATE_LIMIT"
    );
  }

  /* 4. Body size. */
  const raw = await readBody(request);

  if (raw === null) {
    return finish(errorResponse("PAYLOAD_TOO_LARGE", 413), "too_large", "PAYLOAD_TOO_LARGE");
  }

  /* 5. JSON, then the two signals that are checked before the schema so a bot
        gets no useful distinction between "filled the trap" and "succeeded". */
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(raw);
  } catch {
    return finish(errorResponse("VALIDATION", 400), "validation", "VALIDATION");
  }

  if (parsedBody === null || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return finish(errorResponse("VALIDATION", 400), "validation", "VALIDATION");
  }

  const record = parsedBody as Record<string, unknown>;

  if (typeof record.website === "string" && record.website.length > 0) {
    return finish(silentHandoff(), "handoff");
  }

  const renderedAt = typeof record.renderedAt === "number" ? record.renderedAt : Number.NaN;
  const age = Date.now() - renderedAt;

  if (!Number.isFinite(renderedAt) || age < MIN_RENDER_AGE_MS || age > MAX_RENDER_AGE_MS) {
    return finish(silentHandoff(), "handoff");
  }

  /* 6. The schema. `website` is already known empty and `renderedAt` already
        known fresh, but both are re-checked because the route trusts its own
        parse and nothing else. */
  const validation = validateContact(parsedBody);

  if (!validation.success) {
    return finish(errorResponse("VALIDATION", 400, validation.fields), "validation", "VALIDATION");
  }

  const payload = validation.data;

  /* 7. Delivery. `none` throws, and that is the shipped behaviour. */
  const adapter = getDeliveryAdapter(serverEnv.CONTACT_DELIVERY_PROVIDER);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.CONTACT_TIMEOUT_MS);

  try {
    const result = await adapter.send(
      { ...payload, requestId: submission.requestId },
      controller.signal
    );

    const body = { ok: true as const, status: "accepted" as const, id: result.id };
    return finish(jsonResponse(body, 200), "accepted");
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) {
      return finish(
        jsonResponse({ ok: true, status: "handoff", handoff: buildHandoff(payload) }, 200),
        "handoff"
      );
    }

    if (controller.signal.aborted) {
      return finish(errorResponse("TIMEOUT", 504), "timeout", "TIMEOUT");
    }

    return finish(errorResponse("INTERNAL", 500), "internal", "INTERNAL");
  } finally {
    clearTimeout(timeout);
  }
}
