import type { Variants } from "framer-motion";

/**
 * The loader's choreography and its clock, in one file.
 *
 * TWO RULES, and neither is broken:
 *
 *   ONE CURVE.  Everything decelerates on `--ease-apple`. Mixed easing across a
 *     single entrance is what makes a sequence feel assembled from parts; one
 *     curve makes it feel like one object arriving.
 *
 *   NOTHING POPS.  Every element enters from below and settles. No scale-up
 *     from nothing, no bounce, no overshoot, no rotation. Overshoot is playful,
 *     and playful is the opposite of the brief.
 *
 * Everything below animates transform and opacity only, so nothing here can
 * invalidate layout and every frame composites on the GPU. The overlay is
 * `fixed inset-0` and out of flow, so it contributes exactly zero to CLS.
 */

/*
  Annotated as a four-tuple rather than left to inference: Framer's `Easing`
  accepts a bezier as exactly `[number, number, number, number]`, and inference
  over an array literal gives `number[]`, which it rejects.
*/
type Bezier = [number, number, number, number];

/** `--ease-apple` from styles/globals.css, as control points Framer can read. */
const EASE_APPLE: Bezier = [0.32, 0.72, 0, 1];

/* ---------------------------------------------------------------------------
   The clock.

   Both bounds are measured from *navigation start*, not from the moment this
   component hydrates — `performance.now()` is relative to the time origin, so
   it is already the number of milliseconds since the reader asked for the page.
   Timing the floor from hydration instead would quietly turn "at least 1.8s"
   into "1.8s after whenever the bundle happened to arrive", which on a slow
   connection is a loader that overstays by seconds on the one visit where the
   reader is least patient.
--------------------------------------------------------------------------- */

/**
 * The floor. A loader that leaves before it has been read is worse than no
 * loader — the reader registers a flash and nothing else, which is the exact
 * impression the whole sequence exists to avoid. This site is statically
 * rendered and usually finishes well inside it.
 */
export const MIN_VISIBLE_MS = 1800;

/**
 * The ceiling, and it is absolute. Whatever is still loading at three seconds
 * is no longer worth holding a reader in front of a monogram for; the page is
 * interactive underneath either way, and images that arrive late arrive into a
 * page the reader is already looking at.
 */
export const MAX_VISIBLE_MS = 3000;

/* ---------------------------------------------------------------------------
   The entrance.
--------------------------------------------------------------------------- */

/**
 * The composition's cascade: monogram, rule, first line, second line, progress.
 *
 * `delayChildren` holds the whole group back a beat after first paint, so the
 * background is established as a surface before anything is placed on it. The
 * 90ms step is the site's own in-group stagger — long enough to read as
 * sequence, short enough that the five marks still arrive as one gesture.
 */
export function buildLoaderVariants(prefersReducedMotion: boolean | null): {
  group: Variants;
  item: Variants;
  rule: Variants;
} {
  const reduced = Boolean(prefersReducedMotion);

  return {
    group: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: reduced ? 0 : 0.18,
          staggerChildren: reduced ? 0 : 0.09,
        },
      },
    },

    /*
      Six pixels of travel, and no scale. Past about 16px an element stops
      arriving and starts sliding; at the size of a loader composition, six is
      where the arrival still registers and nobody could describe what moved.
    */
    item: {
      hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduced ? 0 : 0.52, ease: EASE_APPLE },
      },
    },

    /*
      The engineering rule draws rather than fades, and it draws from its
      centre outward because the composition is centred — a rule that grew from
      one end under a centred mark would be the one element disagreeing with
      the axis everything else is aligned to. It takes noticeably longer than
      the type around it: a drawn line is a slower gesture than a printed word,
      and giving both the same duration is the most common reason a staged
      sequence reads as a single timeline rather than as several.
    */
    rule: {
      hidden: { opacity: reduced ? 1 : 0, scaleX: reduced ? 1 : 0 },
      visible: {
        opacity: 1,
        scaleX: 1,
        transition: { duration: reduced ? 0 : 0.72, ease: EASE_APPLE },
      },
    },
  };
}

/* ---------------------------------------------------------------------------
   The progress line.

   NO PERCENTAGE, and not because a number would be ugly. A percentage is a
   claim, and this one would be a lie: nothing here knows what fraction of the
   page has arrived, so any figure on screen would be a timer dressed up as
   telemetry. A line that advances says the same honest thing — work is
   happening, it is nearly done — and says it without pretending to measure.
--------------------------------------------------------------------------- */

/**
 * How long the line takes to spend its last eight percent.
 *
 * Named separately because two things need it: the fill, which animates over
 * it, and the exit below, which waits it out. Written twice it would be the
 * kind of number that drifts by 40ms and leaves a completion nobody can quite
 * see.
 */
const PROGRESS_COMPLETE = 0.3;

/**
 * How far the line travels while waiting, and how long it takes.
 *
 * It approaches 92% and stops there, which is the whole trick: the last eight
 * percent is spent the moment loading actually finishes, so the completion is a
 * real event the reader sees rather than a bar that happened to reach the end
 * on schedule. Because the curve is an expo-out, most of the distance is
 * covered early and the tail is a long, slow creep — so a line arriving at 2.6s
 * and a line arriving at 1.8s look like the same line, moving at the same
 * speed, caught at different moments.
 */
export const PROGRESS = {
  /** Starts with the last item of the cascade, not before it. */
  delay: 0.54,
  waitingScale: 0.92,
  waitingDuration: 2.6,
  /** The close, once loading is genuinely done. */
  completeDuration: PROGRESS_COMPLETE,
  ease: EASE_APPLE,
} as const;

/**
 * The scan travelling the length of the rail.
 *
 * This is what the brief means by alive: not a second thing happening, but the
 * same thing being lit. It runs the full track rather than only the drawn part,
 * so what reads is a rail being surveyed end to end — and it is slow (3.4s a
 * pass) because a fast sweep is a loading GIF and a slow one is a machine
 * working.
 */
export const SCAN = {
  duration: 3.4,
  delay: 0.9,
} as const;

/**
 * The breathing, and the last thing to start.
 *
 * Four thousandths of a scale on a 72px mark is a quarter of a pixel across
 * seven seconds — below the threshold at which anyone can see it move, and just
 * above the threshold at which the object stops reading as printed onto the
 * screen. It is the same amplitude and the same period as the Hero's plate, for
 * the same reason.
 */
export const BREATHE = {
  scale: [1, 1.004, 1],
  duration: 7,
  delay: 1.1,
} as const;

/**
 * The exit.
 *
 * A fade, and nothing else. The portfolio is already rendered underneath at its
 * final position — it has never moved and cannot move now — so anything the
 * overlay did on the way out beyond giving up opacity would be motion the page
 * behind it does not share, which is what makes a hand-off read as two screens
 * rather than one. The composition is allowed the six pixels it arrived on,
 * given back.
 *
 * Both are held back long enough for the progress line to visibly close, so the
 * order the reader sees is: the line reaches the end, the composition leaves,
 * the backdrop leaves. Without that beat the fade begins on the same frame the
 * line starts closing, and the completion — the one moment in the whole
 * sequence that corresponds to something real — happens behind a curtain.
 *
 * The delay is two thirds of the completion rather than all of it. On an
 * expo-out the line has covered most of its remaining distance by then, so the
 * beat still reads as "it finished, then it left" while the tail on the whole
 * exit stays under 0.7s — which matters on the slow connection where the loader
 * has already held for its full three seconds and every further frame is one the
 * reader is paying for.
 */
const EXIT_DELAY = 0.2;

export const EXIT = {
  overlay: { duration: 0.46, delay: EXIT_DELAY, ease: EASE_APPLE },
  composition: { duration: 0.3, delay: EXIT_DELAY, ease: EASE_APPLE },
} as const;
