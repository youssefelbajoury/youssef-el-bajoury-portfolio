import type { SpringOptions, Transition } from "framer-motion";

/*
  The dock's material and physics constants.

  Kept out of the components so the glass can be re-tuned in one place, and so
  none of it leaks into the global Tailwind theme — the dock is the only
  surface in the portfolio built from these values.

  Every spring below is critically damped or very slightly over-damped
  (damping / 2·sqrt(stiffness·mass) >= 1.0). Motion settles rather than
  bouncing: a spring that overshoots reads as playful, and this dock is meant
  to read as precise.
*/

/**
 * The bezel. A conic — not linear — gradient, so the ring catches light
 * unevenly the way a machined, anodised edge does. A uniform 1px border is
 * the single clearest tell of a generated component.
 *
 * The cool and warm stops a third of a turn apart are dispersion: a real
 * polished edge splits light rather than reflecting it neutrally.
 */
export const BEZEL_GRADIENT =
  "conic-gradient(from 212deg at 50% 50%," +
  " rgba(255,255,255,0.05) 0deg," +
  " rgba(200,240,255,0.26) 54deg," +
  " rgba(46,230,255,0.17) 122deg," +
  " rgba(255,255,255,0.035) 190deg," +
  " rgba(255,255,255,0.21) 264deg," +
  " rgba(255,222,190,0.13) 300deg," +
  " rgba(255,255,255,0.05) 360deg)";

/**
 * The body of the glass.
 *
 * Deliberately thinner than it looks: most of the density comes from
 * `backdrop-brightness` on the surface, which darkens what is *behind* the
 * dock instead of painting over it. Tinting the transmitted light is what
 * separates a pane of glass from a translucent grey rectangle.
 */
export const GLASS_FILL =
  "linear-gradient(180deg," +
  " rgba(28,32,38,0.72) 0%," +
  " rgba(15,17,21,0.66) 46%," +
  " rgba(8,9,11,0.78) 100%)";

/**
 * Meniscus — the bright sliver where the top face curves into the body, and
 * the faint return light off the bottom face. This is what stops the dock
 * reading as a flat rectangle.
 */
export const GLASS_MENISCUS =
  "linear-gradient(180deg," +
  " rgba(255,255,255,0.16) 0%," +
  " rgba(255,255,255,0.03) 13%," +
  " rgba(255,255,255,0) 44%," +
  " rgba(0,0,0,0.12) 88%," +
  " rgba(255,255,255,0.05) 100%)";

/**
 * Fresnel. Light grazing a curved surface reflects far more at the edges than
 * head-on, so the rounded ends stay brighter than the middle no matter what is
 * behind them. Two end gradients double as the corner bloom.
 */
export const GLASS_FRESNEL = [
  "radial-gradient(26% 150% at 0% 50%, rgba(226,246,255,0.085), transparent 72%)",
  "radial-gradient(26% 150% at 100% 50%, rgba(226,246,255,0.085), transparent 72%)",
].join(", ");

/**
 * Volumetric interior — a soft pool of light hanging inside the glass rather
 * than sitting on its face. Placed above the top edge so only its falloff is
 * visible, which reads as depth instead of as a highlight.
 */
export const GLASS_VOLUME =
  "radial-gradient(68% 130% at 50% -14%, rgba(214,240,255,0.08), transparent 64%)";

/**
 * Micro-texture. Real machined surfaces are never optically perfect; a few
 * percent of fractal noise is the cheapest, most convincing way to say
 * "material" rather than "div".
 */
export const GLASS_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)'/%3E%3C/svg%3E\")";

/**
 * The specular blob that rides the cursor. Cool at the core, warm at the
 * fringe — the same dispersion as the bezel, one order of magnitude softer.
 */
export const CURSOR_REFLECTION =
  "radial-gradient(50% 132% at 50% 42%," +
  " rgba(255,255,255,0.115)," +
  " rgba(150,226,255,0.05) 38%," +
  " rgba(255,206,164,0.022) 62%," +
  " transparent 78%)";

/** The lit segment of the top bevel, split cool-to-warm across its length. */
export const BEVEL_HIGHLIGHT =
  "linear-gradient(90deg," +
  " transparent," +
  " rgba(126,224,255,0.18) 24%," +
  " rgba(255,255,255,0.62) 50%," +
  " rgba(255,214,172,0.18) 76%," +
  " transparent)";

/**
 * Floating shadow. Five layers: a hairline contact edge, a tight contact
 * shadow, two body casts at different radii, and one cyan-tinted ambient that
 * ties the dock to the accent without putting colour on the glass itself.
 */
export const DOCK_SHADOW = [
  "0 0 0 0.5px rgba(0,0,0,0.55)",
  "0 1px 1px rgba(0,0,0,0.5)",
  "0 4px 10px -4px rgba(0,0,0,0.55)",
  "0 14px 32px -12px rgba(0,0,0,0.72)",
  "0 32px 64px -24px rgba(0,0,0,0.88)",
  "0 18px 50px -30px rgba(46,230,255,0.26)",
].join(", ");

/** Edge lighting, applied inside the glass rather than as a border. */
export const GLASS_INNER_LIGHT = [
  "inset 0 1px 0 rgba(255,255,255,0.16)",
  "inset 0 -1px 0 rgba(0,0,0,0.5)",
  "inset 0 0 0 0.5px rgba(255,255,255,0.05)",
  "inset 0 -20px 32px -28px rgba(46,230,255,0.55)",
].join(", ");

/** The active capsule's own rim — brighter on top, cyan-lit from below. */
export const CAPSULE_RIM = [
  "inset 0 1px 0 rgba(255,255,255,0.32)",
  "inset 0 0 0 0.5px rgba(255,255,255,0.10)",
  "inset 0 -12px 20px -15px rgba(46,230,255,0.8)",
  "0 2px 14px -8px rgba(46,230,255,0.3)",
].join(", ");

/* ---------------------------------------------------------------- physics */

/**
 * The capsule's travel. Heavy and slightly over-damped: it leans into the
 * move, compresses against the far edge and settles without a rebound.
 */
export const CAPSULE_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 40,
  mass: 1,
};

/** Labels open against enough resistance to settle inside ~200ms. */
export const LABEL_SPRING: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 40,
  mass: 0.62,
};

/** Entrance: heavy enough to read as an object arriving, not a div appearing. */
export const ENTRANCE_SPRING: Transition = {
  type: "spring",
  stiffness: 175,
  damping: 30,
  mass: 1.2,
  delay: 0.28,
};

/**
 * Press feedback. A spring *config* rather than a transition: press folds into
 * the same motion value as magnification, so the two compose instead of
 * fighting over the icon's scale.
 */
export const PRESS_SPRING: SpringOptions = {
  stiffness: 640,
  damping: 34,
  mass: 0.45,
};

/** How far from an icon's centre the magnification field reaches, in px. */
export const MAGNIFY_RADIUS = 96;
/** Peak icon magnification directly under the cursor. */
export const MAGNIFY_GAIN = 0.13;
/** Peak lift, in px, of the icon under the cursor. */
export const MAGNIFY_LIFT = 2.5;
/** Peak sideways drift, in px, of an icon leaning toward the cursor. */
export const MAGNET_PULL = 2.2;

/**
 * Dock padding at rest and while the cursor is on the glass, in px.
 *
 * 6, not 8, because each item carries a 44px hit area around a 40px capsule:
 * the 2px of slack per side lives inside the item, so the glass keeps the same
 * 8px of breathing room it would have had around a 40px row.
 */
export const SHELL_PADDING = [6, 8] as const;
