import type { Transition, Variants } from "framer-motion";

/**
 * The resume dialog's choreography, in one file.
 *
 * ONE GESTURE: the sheet is set down on the page. Nothing scales up from
 * nothing, nothing springs, nothing overshoots — a modal that fades *and*
 * scales *and* bounces is three gestures competing to describe one event, and
 * the third one is always the one that makes it feel cheap.
 *
 * The numbers are small on purpose. 8px of travel and 320ms is under the
 * threshold at which anyone can describe what moved; they only register that
 * the panel arrived rather than appeared. Past about 16px a dialog stops
 * arriving and starts sliding, and the eye tracks the movement instead of
 * reading the two choices it was opened to offer.
 *
 * WHY THESE ARE PROP OBJECTS AND NOT `Variants` (the panel and the backdrop).
 * A motion component whose `animate` is a variant *label* propagates that label
 * to every motion descendant that does not define its own. The panel contains a
 * list that runs its own hidden/visible stagger, and sharing state names across
 * the two layers would silently make the outer one the conductor of the inner
 * one. Explicit initial/animate/exit objects do not participate in propagation
 * at all, so each layer animates itself.
 *
 * `prefersReducedMotion` collapses travel, stagger and duration to zero rather
 * than merely shortening them: a 20ms fade is still a fade, and a reader who
 * asked for less motion should get the end state on the first frame.
 */

/*
  Both curves are annotated as four-tuples rather than left to inference.
  Framer's `Easing` accepts a bezier as exactly `[number, number, number, number]`
  and an array of *values* is not that: without the annotation TypeScript infers
  `(0 | 1 | 0.32 | 0.72)[]`, which is a list of literals of unknown length and is
  rejected at every call site with a twelve-line error about `Easing`.
*/
type Bezier = [number, number, number, number];

/** `--ease-apple` from styles/globals.css, as control points Framer can read. */
const EASE_APPLE: Bezier = [0.32, 0.72, 0, 1];

/** `ease-premium` from tailwind.config.ts — the site's hover curve. */
const EASE_PREMIUM: Bezier = [0.16, 1, 0.3, 1];

/*
  Deliberately un-annotated return type. The backdrop and the panel below are
  spread straight onto motion components as `initial` / `animate` / `exit`, and
  Framer's target types are structural — a hand-written interface over them
  widens the shapes just enough that the spread stops type-checking. Inference
  is both narrower and correct.
*/
export function buildResumeMotion(prefersReducedMotion: boolean | null) {
  const reduced = Boolean(prefersReducedMotion);
  const ease = EASE_APPLE;

  return {
    /*
      The dim. Out is faster than in, because a reader who has asked to leave
      should not be made to watch the leaving.
    */
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: reduced ? 0 : 0.24, ease } },
      exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.16, ease } },
    },

    /*
      The sheet. It leaves along the same axis it arrived on but only half as
      far — an exit that retraces the entrance exactly reads as a rewind.
    */
    panel: {
      initial: { opacity: 0, y: reduced ? 0 : 8 },
      animate: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.32, ease } },
      exit: { opacity: 0, y: reduced ? 0 : 4, transition: { duration: reduced ? 0 : 0.16, ease } },
    },

    /*
      The contents, printed onto the sheet after it lands. `delayChildren` is
      roughly where the panel above has covered most of its distance, so the
      type is never being moved and faded at the same time as the surface
      carrying it.
    */
    list: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: reduced ? 0 : 0.08,
          staggerChildren: reduced ? 0 : 0.05,
        },
      },
    },

    listItem: {
      hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 },
      visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.42, ease } },
    },
  };
}

/**
 * Hover, everywhere in the dialog and on the triggers.
 *
 * Matches `duration-medium ease-premium` — the curve and the timing every other
 * hover on the site already uses, so a card that lifts here and a panel that
 * lifts in About are responding at the same speed.
 */
export const HOVER_TRANSITION: Transition = { duration: 0.4, ease: EASE_PREMIUM };

/** A card, one step further off the page. Two pixels. Nothing more. */
export const CARD_HOVER: Variants = {
  rest: { y: 0 },
  hover: { y: -2 },
};

/**
 * The document glyph — inside a card, and on both triggers. The same two pixels
 * as the card itself: on a 16px icon that is an eighth of its own height and
 * plainly visible, where on a 280px card the identical distance is barely a
 * lift. One number, two amplitudes, because the amplitude is set by what moves.
 */
export const GLYPH_HOVER: Variants = {
  rest: { y: 0 },
  hover: { y: -2 },
};
