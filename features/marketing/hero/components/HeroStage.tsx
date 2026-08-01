"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { POINTER_SMOOTHING } from "../heroMotion";

import type { ReactNode } from "react";

/**
 * The Hero's `<section>`, and the only thing in the composition that listens.
 *
 * It publishes three numbers as CSS custom properties on the section element
 * and does nothing else:
 *
 *   --hero-px, --hero-py   pointer deflection, -1 … 1 from the centre
 *   --hero-scroll          0 … 1 across the section's exit from the viewport
 *
 * Everything downstream is CSS. That matters more than it looks: `children`
 * is passed in from the server component above, so the headline, the plate,
 * the traces and the index are all still server-rendered — this file is the
 * *only* client boundary the Hero's layout crosses, and the composition ships
 * as HTML exactly as it did before Phase 2. What used to be "zero client JS"
 * is now one listener; it is not a client-side Hero.
 *
 * Why custom properties rather than React state: state would re-render the
 * whole subtree on every pointer frame. Writing a variable on one element
 * mutates no DOM structure, runs no React work, and leaves the browser to
 * recompute the handful of transforms that reference it — which it does on the
 * compositor, because every consumer animates transform and opacity only.
 */
interface HeroStageProps {
  children: ReactNode;
  className?: string;
}

export function HeroStage({ children, className = "" }: HeroStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    /* A coarse pointer has no hover position to track, and a phone reporting
       touch coordinates as parallax makes the composition lurch on every tap.
       Scroll depth still runs; the pointer field does not. */
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    /* Target is where the pointer is; current is where the field has eased to.
       The gap between them is the tail — see POINTER_SMOOTHING. */
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scroll = 0;

    let frame = 0;
    let settled = true;

    /* Last value actually written to the DOM for each property. */
    let writtenX = "";
    let writtenY = "";
    let writtenScroll = "";

    function publish() {
      frame = 0;

      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * POINTER_SMOOTHING;
      currentY += dy * POINTER_SMOOTHING;

      /* Below a thousandth of full deflection the movement is far under one
         device pixel. Snapping and standing down there keeps an idle page off
         the animation frame queue entirely rather than easing toward the
         target forever at diminishing precision. */
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        currentX = targetX;
        currentY = targetY;
        settled = true;
      }

      const element = sectionRef.current;
      if (!element) return;

      /* Write only what changed.
         Setting a custom property invalidates style for everything that
         references it, and the pointer and the scroll almost never move on the
         same frame — a pointer sweep would otherwise re-invalidate the plate
         and the trace field on every frame for a scroll value that has not
         moved since the last one. Comparing four decimal places against the
         last written string is far cheaper than the recalc it avoids. */
      const nextX = currentX.toFixed(4);
      const nextY = currentY.toFixed(4);
      const nextScroll = scroll.toFixed(4);

      if (nextX !== writtenX) {
        element.style.setProperty("--hero-px", nextX);
        writtenX = nextX;
      }
      if (nextY !== writtenY) {
        element.style.setProperty("--hero-py", nextY);
        writtenY = nextY;
      }
      if (nextScroll !== writtenScroll) {
        element.style.setProperty("--hero-scroll", nextScroll);
        writtenScroll = nextScroll;
      }

      if (!settled) request();
    }

    function request() {
      if (frame === 0) frame = window.requestAnimationFrame(publish);
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = section!.getBoundingClientRect();
      /* Clamped, because the pointer can be over the section's overhanging
         crop marks or arrive from a neighbouring section mid-transition. */
      targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      settled = false;
      request();
    }

    function handlePointerLeave() {
      targetX = 0;
      targetY = 0;
      settled = false;
      request();
    }

    function handleScroll() {
      const rect = section!.getBoundingClientRect();
      /* Progress of the section's *exit*: 0 while its top edge is at or below
         the viewport top, 1 once a full section height has passed. Measured
         from the section rather than from window.scrollY so it stays correct
         no matter what ends up above the Hero later. */
      scroll = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      settled = false;
      request();
    }

    if (finePointer) {
      section.addEventListener("pointermove", handlePointerMove, { passive: true });
      section.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      if (finePointer) {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
      }
      window.removeEventListener("scroll", handleScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className={className}
      /* Seeded so the first paint — and every reduced-motion paint, where the
         effect never runs — has real numbers to compute transforms from rather
         than falling back to `calc()` against an undefined variable. */
      style={{ "--hero-px": 0, "--hero-py": 0, "--hero-scroll": 0 } as React.CSSProperties}
    >
      {children}
    </section>
  );
}

function clamp(value: number, min = -1, max = 1) {
  return Math.min(Math.max(value, min), max);
}
