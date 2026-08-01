import type { Variants } from "framer-motion";

/**
 * The page's one reveal cadence.
 *
 * Every section on the site uses this — the showcase, About, Skills, Location,
 * Contact — so a reader scrolling from the Hero to the footer sees the same
 * gesture repeated rather than four sections that each animate slightly
 * differently. A stagger that drifts between neighbouring blocks reads as a
 * bug, not as motion design; four *different* staggers read as four different
 * sites.
 *
 * The curve is the Hero's, not a new one: 820ms on `--ease-apple`
 * (0.32, 0.72, 0, 1), a decelerate that leaves immediately at speed and spends
 * most of its time arriving. That profile is what reads as an object being
 * *placed* rather than played.
 *
 * TRAVEL IS 14px, NOT 20. Past about 16px a scroll reveal stops being a thing
 * arriving and starts being a thing sliding, and the reader's eye tracks the
 * movement instead of the words. 14px is far enough that the arrival registers
 * and short enough that nobody could describe what moved — which is the whole
 * brief for a reveal on an editorial page. Nothing scales and nothing blurs:
 * both are the tells of a scroll library, and both cost a composite layer per
 * block for an effect that reads as a lens problem rather than as motion.
 *
 * `prefersReducedMotion` collapses the stagger, the transform and the duration
 * to zero rather than merely shortening them.
 */

/** `--ease-apple` from styles/globals.css, as control points Framer can read. */
const EASE_APPLE = [0.32, 0.72, 0, 1] as const;

export function buildRevealVariants(prefersReducedMotion: boolean | null): {
  container: Variants;
  item: Variants;
} {
  const reduced = Boolean(prefersReducedMotion);

  return {
    container: {
      hidden: {},
      visible: {
        transition: { staggerChildren: reduced ? 0 : 0.08 },
      },
    },
    item: {
      hidden: {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 14,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduced ? 0 : 0.82, ease: [...EASE_APPLE] },
      },
    },
  };
}

/**
 * The trigger.
 *
 * `amount: 0.08` is the change that makes sections *appear while scrolling*
 * rather than after it. A margin-only trigger fires on the block's leading
 * edge, which for a two-thousand-pixel project article means the reveal has
 * long finished by the time any of it is on screen — the reader scrolls into
 * content that is simply already there. Asking for a fraction of the element
 * instead ties the trigger to the block rather than to its first pixel, and a
 * small fraction keeps it early: a tall section starts revealing as its top
 * quarter comes up, a short one when it is barely in.
 *
 * The small negative margin holds it back just enough that nothing animates
 * behind the fold on load.
 *
 * `once` because a section that re-animates every time it is scrolled past is
 * a section that never settles, and the second viewing is always worse than
 * the first.
 */
export const REVEAL_VIEWPORT = { once: true, amount: 0.08, margin: "-64px" } as const;
