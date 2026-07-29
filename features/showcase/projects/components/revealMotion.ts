import type { Variants } from "framer-motion";

/**
 * Shared reveal choreography for the showcase. Extracted rather than repeated
 * per section so the two projects and the work-in-progress tile share one
 * cadence — a stagger that drifts out of sync between neighbouring blocks
 * reads as a bug, not as motion design.
 *
 * `prefersReducedMotion` collapses both the stagger and the transform to zero
 * instead of merely shortening them.
 */
export function buildRevealVariants(prefersReducedMotion: boolean | null): {
  container: Variants;
  item: Variants;
} {
  const reduced = Boolean(prefersReducedMotion);

  return {
    container: {
      hidden: {},
      visible: {
        transition: { staggerChildren: reduced ? 0 : 0.11 },
      },
    },
    item: {
      hidden: {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 22,
        scale: reduced ? 1 : 0.985,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: reduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };
}

/** Shared viewport trigger — fires once, slightly before the block is centred. */
export const REVEAL_VIEWPORT = { once: true, margin: "-90px" } as const;
