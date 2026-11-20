import type { Transition, Variants } from "framer-motion";

/**
 * The technology panel's choreography, in one file.
 *
 * ONE GESTURE: a compact sheet is set down over the page. It fades, travels ten
 * pixels and settles from a two-percent reduction in scale; it does not spring,
 * grow from nothing or overshoot. The resume dialog established the sheet
 * language, and this panel is a sibling of that surface rather than a second
 * vocabulary for the same event.
 *
 * Reduced motion does not shorten the sequence — it removes it. A reader who
 * asked for less motion receives the final state on the first frame.
 */

type Bezier = [number, number, number, number];

/** `--ease-apple` from styles/globals.css, as control points Framer can read. */
const EASE_APPLE: Bezier = [0.32, 0.72, 0, 1];

export function buildSkillPanelMotion(prefersReducedMotion: boolean | null) {
  const reduced = Boolean(prefersReducedMotion);
  const ease = EASE_APPLE;

  return {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: reduced ? 0 : 0.24, ease } },
      exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.16, ease } },
    },

    panel: {
      initial: { opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.985 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: reduced ? 0 : 0.32, ease },
      },
      exit: {
        opacity: 0,
        y: reduced ? 0 : 5,
        scale: reduced ? 1 : 0.99,
        transition: { duration: reduced ? 0 : 0.16, ease },
      },
    },

    list: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: reduced ? 0 : 0.08,
          staggerChildren: reduced ? 0 : 0.045,
        },
      },
      exit: {
        transition: {
          staggerChildren: reduced ? 0 : 0.02,
          staggerDirection: -1 as const,
        },
      },
    },

    /** The gallery scroller orchestrates its own cards so they stagger after
        the sheet's header has settled, rather than all arriving at once. */
    listGrid: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: reduced ? 0 : 0.06,
          staggerChildren: reduced ? 0 : 0.045,
        },
      },
      exit: {
        transition: {
          staggerChildren: reduced ? 0 : 0.02,
          staggerDirection: -1 as const,
        },
      },
    },

    listItem: {
      hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduced ? 0 : 0.36, ease },
      },
      hover: {
        y: reduced ? 0 : -2,
        transition: { duration: reduced ? 0 : 0.18, ease },
      },
      exit: {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : -4,
        transition: { duration: reduced ? 0 : 0.14, ease },
      },
    },
  };
}

/** A restrained hover response on the technology cards. */
export const TECHNOLOGY_HOVER: Transition = { duration: 0.18, ease: EASE_APPLE };

/** Shared vocabulary for surfaces that lift a card without rotating it. */
export const TECHNOLOGY_CARD_VARIANTS: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -2, scale: 1.01, transition: TECHNOLOGY_HOVER },
};
