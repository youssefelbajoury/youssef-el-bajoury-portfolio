"use client";

import { useSyncExternalStore } from "react";

import {
  PANEL_BORDER,
  PANEL_EDGES,
  PANEL_FILL,
  STATUS_LENS,
  STATUS_LENS_SHADOW,
} from "@/styles/material";

const TIME_ZONE = "Africa/Casablanca";

/**
 * Formatter is built once, not per tick. `shortOffset` is derived rather than
 * hardcoded: Morocco sits at UTC+1 for most of the year but returns to UTC+0
 * for Ramadan, so a literal "GMT+1" in the markup would be wrong for several
 * weeks annually. The IANA zone handles that shift on its own.
 */
const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "shortOffset",
});

/**
 * The wall clock is an external mutable source, so it is read through
 * `useSyncExternalStore` rather than mirrored into state from an effect.
 *
 * The snapshot is a primitive string ("14:32|GMT+1") on purpose: the hook
 * compares snapshots by identity, so returning a fresh object each call would
 * re-render forever.
 */
function getSnapshot() {
  const parts = FORMATTER.formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("hour")}:${value("minute")}|${value("timeZoneName")}`;
}

/** Local time is unknowable during SSR; the badge renders its placeholder. */
function getServerSnapshot() {
  return "";
}

function subscribe(onStoreChange: () => void) {
  // Align to the top of the next minute, then tick once a minute — a 1s
  // interval would wake the main thread 60x more often for no visible gain.
  let interval: ReturnType<typeof setInterval> | undefined;

  const timeout = setTimeout(
    () => {
      onStoreChange();
      interval = setInterval(onStoreChange, 60_000);
    },
    (60 - new Date().getSeconds()) * 1000
  );

  return () => {
    clearTimeout(timeout);
    if (interval) clearInterval(interval);
  };
}

/**
 * A "LIVE" pill that is actually live: it reports the current local time where
 * the work happens. A static badge reading LIVE is decoration; this one is the
 * smallest possible piece of real telemetry, which is the point of the section.
 *
 * Space is reserved with a tabular-figure placeholder so the badge never
 * reflows when the client value arrives.
 */
export function LocalTimeBadge() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [clock, offset] = snapshot ? snapshot.split("|") : [];

  return (
    <div
      className="inline-flex items-center gap-8 rounded-sm border px-12 py-8 backdrop-blur-glass sm:gap-12 sm:px-16"
      style={{ background: PANEL_FILL, borderColor: PANEL_BORDER, boxShadow: PANEL_EDGES }}
    >
      {/* The site's one lamp specification: lit from the upper left, never
          emitting, and never a coloured disc with a ripple behind it. */}
      <span
        aria-hidden
        className="size-[6px] shrink-0 rounded-full"
        style={{ background: STATUS_LENS, boxShadow: STATUS_LENS_SHADOW }}
      />

      <span className="font-mono text-tooltip uppercase tracking-[0.22em] text-text-secondary">
        Live
      </span>

      <span aria-hidden className="h-12 w-px bg-[rgba(255,255,255,0.11)]" />

      <span className="font-mono text-tooltip tabular-nums tracking-[0.08em] text-text-primary">
        {clock ? (
          <>
            <span className="sr-only">Local time in Casablanca: </span>
            {clock}
            {/* Dropped on the narrowest screens — at 375px the badge would
                otherwise span two thirds of the plate it sits on. */}
            <span className="ml-8 hidden text-text-tertiary sm:inline">{offset}</span>
          </>
        ) : (
          <span aria-hidden className="opacity-0">
            00:00 GMT+1
          </span>
        )}
      </span>
    </div>
  );
}
