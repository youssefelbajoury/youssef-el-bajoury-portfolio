"use client";

import { useEffect, useState } from "react";

/** Where on the screen a section counts as "the one you're reading". */
const FOCUS_LINE = 0.42;
/** Slack, in px, for treating the page as scrolled to the very bottom. */
const BOTTOM_EPSILON = 32;

/**
 * Tracks which registered section the reader is currently in.
 *
 * A scroll listener rather than an IntersectionObserver: sections here are
 * full-viewport-ish, so the observer's "is it intersecting" answer is true for
 * two of them at once and flickers at the boundaries. Comparing each section's
 * top against a fixed focus line gives one unambiguous answer per frame.
 *
 * Reads are rAF-coalesced and never interleaved with writes, so a fast scroll
 * costs one batched layout read per frame regardless of scroll velocity.
 */
export function useSectionSpy(sectionIds: readonly string[], enabled: boolean): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Nothing to spy on. The last known value is left alone rather than
    // cleared — callers gate on `enabled` themselves, and holding it means
    // returning to the page restores the section you left from.
    if (!enabled) {
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const focusLine = window.innerHeight * FOCUS_LINE;
      let current = sectionIds[0] ?? null;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= focusLine) {
          current = id;
        }
      }

      // The last section is usually shorter than the focus line allows for, so
      // without this it can never win. Reaching the end of the page means you
      // have arrived at the end of the page.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_EPSILON;
      if (atBottom) {
        current = sectionIds[sectionIds.length - 1] ?? current;
      }

      setActiveId((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionIds, enabled]);

  return activeId;
}
