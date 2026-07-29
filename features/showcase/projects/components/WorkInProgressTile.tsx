"use client";

import { motion, useReducedMotion } from "framer-motion";

import { buildRevealVariants, REVEAL_VIEWPORT } from "./revealMotion";

import type { CSSProperties } from "react";

/**
 * The third slot in the showcase, held open rather than filled.
 *
 * Deliberately the quietest surface on the page: no mockup, no metrics, no
 * invented stack. It states that something is in progress and nothing more —
 * a placeholder that oversells would undercut the two projects above it.
 *
 * The status is carried by motion instead of copy: a pulsing node and a single
 * light sweeping a hairline, which reads as "in progress" without a progress
 * bar implying a percentage nobody can verify.
 */
export function WorkInProgressTile() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  const accentVars = {
    "--project-accent": "var(--color-accent)",
    "--project-accent-bright": "var(--color-accent-strong)",
    "--project-accent-rgb": "46 230 255",
  } as CSSProperties;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={container}
      style={accentVars}
    >
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl border border-dashed border-border bg-surface/60 p-32 md:p-48"
      >
        {/* Hatching — the only texture on the page, and only here, because this
            is the one surface that is meant to read as unfinished. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_11px,rgb(255_255_255_/_2%)_11px,rgb(255_255_255_/_2%)_12px)]"
        />

        <div className="relative flex flex-col gap-24 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-8 font-mono text-label uppercase tracking-[0.24em] text-text-tertiary">
              <span
                aria-hidden
                className="size-8 animate-node-pulse rounded-full bg-[var(--project-accent)]"
              />
              Work in Progress
            </p>

            <p className="mt-16 max-w-readable text-h5 font-medium tracking-tight text-text-primary">
              Currently building a new confidential project.
            </p>

            <p className="mt-8 text-paragraph-sm text-text-secondary">
              It will appear here once it is ready to be shown.
            </p>
          </div>

          {/* Indeterminate hairline — status without a fabricated percentage */}
          <div
            aria-hidden
            className="relative h-px w-full overflow-hidden bg-border md:w-[14rem] md:shrink-0"
          >
            <span className="absolute inset-y-0 left-0 w-1/3 animate-wip-sweep bg-gradient-to-r from-transparent via-[var(--project-accent)] to-transparent" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
