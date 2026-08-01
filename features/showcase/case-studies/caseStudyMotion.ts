import type { Transition } from "framer-motion";

/**
 * The case study's choreography, in one file.
 *
 * ONE GESTURE: the card is picked up off the page and opened. Everything below
 * serves that single reading, and nothing here exists because it looked nice on
 * its own — a modal that fades in, scales in, slides in *and* blurs is four
 * gestures competing to describe one event.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THESE ARE PROP OBJECTS AND NOT `Variants`
 *
 * A motion component with variants propagates its *labels* down to every motion
 * descendant that does not define its own animate prop. That is the whole point
 * of variants — it is why an orchestrated list needs `staggerChildren` on the
 * parent only — and it is a liability here.
 *
 * The viewer nests three animated layers: the morphing sheet, the contents that
 * fade in after it lands, and the gallery's crossfading stage. All three want
 * the same three state names, because there are only so many ways to say
 * hidden, visible and leaving. Share those names and the outer layer silently
 * becomes the conductor of the inner ones, which is a coupling nobody writes
 * down and everybody debugs later.
 *
 * Explicit `initial` / `animate` / `exit` objects do not participate in variant
 * propagation at all. Each element animates itself; nothing can be driven from
 * above by accident.
 */

/**
 * The shared-layout id a card and the viewer both carry.
 *
 * Framer matches the two by this string and morphs the first into the second,
 * so it has to be derived from the project rather than written twice — a typo
 * in one of two literals produces a modal that appears out of nowhere and a
 * card that never comes back, with no error anywhere.
 */
export const caseStudyLayoutId = (slug: string) => `case-study-surface-${slug}`;

/** `--ease-apple` from styles/globals.css, as control points Framer can read. */
const EASE_APPLE = [0.32, 0.72, 0, 1] as const;

/**
 * The morph.
 *
 * A spring, not a bezier, and the reason is what the two describe. A cubic
 * curve is a fixed path through time: the same 400ms whether the card travels
 * 200px or 1400px, which is why scaled-up modals so often read as *played*
 * rather than *moved*. A spring is a force — it takes longer over a longer
 * distance because it is accelerating a mass, so the same numbers work at every
 * breakpoint without a single tuned duration.
 *
 * ζ = damping / (2 × √(stiffness × mass)) = 34 / (2 × √320) ≈ 0.95. Just under
 * critical: it arrives with no visible overshoot, which is right for a surface
 * the size of the screen. Bounce belongs on a 40px control, not on a sheet
 * carrying a reader's whole field of view — at this size a 4% overshoot is
 * forty pixels of wobble.
 */
export const MORPH_SPRING: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 1,
};

/**
 * Everything below, collapsed to nothing.
 *
 * Not "shortened" — a reader who has asked for less motion should get the end
 * state on the first frame, and a 20ms morph is still a morph. `duration: 0`
 * overrides a spring's physics entirely, which is the only way to stop one.
 */
export const STILL: Transition = { duration: 0 };

/**
 * The backdrop.
 *
 * It is not springing anywhere — it is a value change, so it takes a curve.
 * Out is faster than in, because a reader who has asked to leave should not be
 * made to watch the leaving.
 */
export const BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.28, ease: EASE_APPLE } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: EASE_APPLE } },
} as const;

/**
 * The contents, held back until the sheet has finished travelling.
 *
 * This delay is what makes the morph readable. Content that fades in *during*
 * the expansion is content being scaled by the projection along with everything
 * else — Framer corrects the morphing box's own scale, not the type inside it,
 * so the words stretch. Holding it at zero until the geometry settles means the
 * distortion happens on an empty plate where there is nothing to distort, and
 * the reader sees a surface arrive and then be printed.
 *
 * 0.16s is roughly where the spring above has covered most of its distance.
 */
export const CONTENT = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.16, ease: EASE_APPLE } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE_APPLE } },
} as const;

/**
 * The stage crossfade, when the reader changes screenshot.
 *
 * Two transitions rather than one, and the asymmetry is the point: the outgoing
 * screenshot leaves faster than the incoming one arrives, so for most of the
 * swap the frame is carrying more ink than it would at the midpoint of a
 * symmetric fade. A matched pair dips through a moment where both images are at
 * half — which reads as the stage flashing.
 *
 * Nothing moves. A screenshot that slides is a carousel; this is a plate being
 * changed under a fixed lamp.
 */
export const CROSSFADE = {
  in: { duration: 0.42, ease: EASE_APPLE },
  out: { duration: 0.26, ease: EASE_APPLE },
} as const;
