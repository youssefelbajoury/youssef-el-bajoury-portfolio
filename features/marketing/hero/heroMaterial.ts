/**
 * Hero material — what belongs to this section and nothing else.
 *
 * The surfaces themselves (the plate, the panels, the actions, the frame, the
 * key light, the grain, the status lamp) were promoted to styles/material.ts
 * when the rest of the site adopted them: one light source, one set of bevels,
 * one grain, everywhere. They are re-exported below so every component in this
 * folder still imports from `../heroMaterial` and the Hero renders exactly as it
 * did.
 *
 * What stays here is the Hero's own atmosphere — the scrim over the page-wide
 * background, the marks on the plate, the trace field, the scanning beam, and
 * the engineering scene's line hierarchy. None of those appear in another
 * section, and a value used once does not belong in a shared file.
 *
 * ONE LIGHT SOURCE: upper-left, roughly 135°. See styles/material.ts.
 */

import { DRAWING } from "@/styles/material";

export {
  ACTION_GLASS,
  ACTION_SPECULAR,
  CROP_MARK_COLOR,
  GRAIN_TEXTURE,
  KEY_LIGHT,
  LEDE_RULE,
  PLATE_BORDER,
  PLATE_EDGES,
  PLATE_FILL,
  PLATE_GRAIN_OPACITY,
  PLATE_GUIDE,
  PLATE_REFLECTION,
  PLATE_SWEEP,
  PLATE_TARGET,
  PRIMARY_ACTION_SHADOW,
  RULE_COLOR,
  SECONDARY_ACTION_BORDER,
  SECONDARY_ACTION_BORDER_HOVER,
  SECONDARY_ACTION_SHADOW,
  STATUS_LENS,
  STATUS_LENS_SHADOW,
  TICK_COLOR,
} from "@/styles/material";

/**
 * Registration marks, brightest at the corner nearest the light and dimmest
 * at the corner furthest from it. Four values instead of one is the kind of
 * detail nobody consciously notices and everybody reads as care.
 */
export const REGISTRATION_MARKS = {
  topLeft: "rgba(255,255,255,0.24)",
  topRight: "rgba(255,255,255,0.19)",
  bottomLeft: "rgba(255,255,255,0.17)",
  bottomRight: "rgba(255,255,255,0.12)",
} as const;

/**
 * Registration marks under hover. The same four-corner falloff as
 * REGISTRATION_MARKS, lifted about 60% — enough that the corners register as
 * having responded, not enough to become the brightest thing in the frame.
 */
export const REGISTRATION_MARKS_HOVER = {
  topLeft: "rgba(255,255,255,0.38)",
  topRight: "rgba(255,255,255,0.31)",
  bottomLeft: "rgba(255,255,255,0.28)",
  bottomRight: "rgba(255,255,255,0.20)",
} as const;

/**
 * Scrim over the page-wide GlobalBackground.
 *
 * The background is a drafting layer in the same 2–5% white band the whole page
 * works in, and it is right for every section. The Hero still knocks it back
 * further, because this is the one section that already draws its own schematic
 * — EngineeringScene — and two drawings at the same value in the same frame read
 * as one smudged drawing.
 *
 * Slightly lighter toward the bottom, so the background re-emerges as the Hero
 * hands over to the section below rather than stopping at a hard edge.
 */
export const BACKGROUND_SCRIM =
  "linear-gradient(180deg, rgba(8,9,10,0.955) 0%, rgba(8,9,10,0.94) 58%, rgba(8,9,10,0.86) 100%)";

/** Trace field — the discoverable layer. */
export const TRACE_COLOR = "rgba(255,255,255,0.032)";

/**
 * The scanning beam. Wide enough (a third of the section) that its edges are
 * never resolvable — what the eye picks up is a slow change in level as it
 * passes, never a band crossing the screen.
 */
export const SCAN_BEAM =
  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.014) 42%, rgba(255,255,255,0.022) 50%, rgba(255,255,255,0.014) 58%, transparent 100%)";

/* ---------------------------------------------------------------------------
   The engineering scene — the drafted system beneath the person.

   Its line hierarchy is the page's, not its own: the same five values the
   page-wide background is drawn with, so the schematic under the Hero and the
   schematic behind every other section read as two views of one drawing. See
   DRAWING in styles/material.ts for why the spread between them matters more
   than any one of them.
--------------------------------------------------------------------------- */

/** Object outlines — the laptop, the cylinder, the chip. The heaviest line. */
export const SCENE_OBJECT = DRAWING.object;
/** Connection lines between stations: the API paths. One step down. */
export const SCENE_CONNECTION = DRAWING.connection;
/** Datum, dimension and construction lines. The lightest thing drawn. */
export const SCENE_CONSTRUCTION = DRAWING.construction;
/** Connection points and particles — small, so they carry a little more. */
export const SCENE_NODE = DRAWING.node;
/** Annotation type. Mono, 9–10px, and never a claim — only real technologies. */
export const SCENE_LABEL = DRAWING.label;

/**
 * The reading light: a soft lamp that follows the pointer across the drawing.
 *
 * This is the pass's single cursor interaction, and it is a light shift rather
 * than a parallax or a reflection because the layer it acts on is a *drawing*.
 * A blueprint does not tilt toward you and does not reflect; it resolves under
 * the lamp you move across it. The gradient is deliberately enormous and weak
 * — no edge of it is ever resolvable, so what registers is that the schematic
 * near the cursor is slightly more legible, never that a circle is following
 * the mouse.
 */
export const READING_LIGHT =
  "radial-gradient(38% 42% at 50% 50%, rgba(255,255,255,0.020) 0%, rgba(255,255,255,0.008) 40%, transparent 72%)";
