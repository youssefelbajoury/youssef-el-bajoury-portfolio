/**
 * The site's material system — every surface, on every section, in one file.
 *
 * ONE LIGHT SOURCE: upper-left, roughly 135°.
 *
 * That single rule generates every value below and is never broken. Top and
 * left edges catch the light; right and bottom edges fall into shadow; every
 * cast shadow is offset down-and-right; every fill gradient runs 135deg from
 * lit to unlit. Consistency of light direction across a whole page is something
 * almost nobody bothers with and everybody feels — it is most of the difference
 * between "rendered" and "photographed".
 *
 * REFLECTED, NEVER EMITTED. Nothing here glows. A glow is light *emitted* by an
 * object, which would put a second light source in a composition where every
 * other value is derived from one, and the eye catches that inconsistency long
 * before it can name it. Highlights move with the pointer because a surface
 * under a fixed lamp does; halos that switch on under the pointer are what a
 * component library gives you for free.
 *
 * This began as the Hero's own material and was promoted here unchanged, so the
 * Hero is pixel-identical to what it was — see features/marketing/hero/
 * heroMaterial.ts, which now re-exports these and keeps only what is genuinely
 * Hero-only.
 *
 * Colours are written as explicit rgba() rather than Tailwind alpha modifiers
 * (`bg-white/[0.04]`). This project's colour tokens are CSS variables, and
 * Tailwind silently drops the alpha modifier on a var()-based colour, emitting
 * a fully opaque fill instead. Explicit rgba is the only reliable form here.
 */

/* ---------------------------------------------------------------------------
   The drafted page — rules, ticks, crop marks.

   Three values, and the spread between them is what makes the frame read as a
   drawing rather than as a border: the rule is the lightest thing on the sheet,
   the ticks that measure it sit a step above, and the crop marks that trim it
   are the brightest. Flatten them to one alpha and you have a box.
--------------------------------------------------------------------------- */

/** Frame hairlines — the drafted border of the page, and every section seam. */
export const RULE_COLOR = "rgba(255,255,255,0.06)";
/** Ticks and crop marks sit a step above the rules so the frame reads as drawn. */
export const TICK_COLOR = "rgba(255,255,255,0.11)";
export const CROP_MARK_COLOR = "rgba(255,255,255,0.16)";

/**
 * The lede rule, tapered along its length.
 *
 * A flat 48px hairline is a border; a hairline that gives up value as it runs is
 * a line that was *drawn*. The taper also states the direction — it fades the
 * way the rule draws itself on entry (origin-left), so the mark and its
 * animation agree.
 */
export const LEDE_RULE =
  "linear-gradient(90deg, rgba(255,255,255,0.21) 0%, rgba(255,255,255,0.115) 58%, rgba(255,255,255,0.045) 100%)";

/* ---------------------------------------------------------------------------
   Light and atmosphere.
--------------------------------------------------------------------------- */

/**
 * The key light, placed at the top-left corner of whatever box mounts it so the
 * falloff — not the source — is what shows. This is the layer that makes a
 * composition read as lit rather than flat, and it is the physical reason every
 * bevel below points the way it does.
 *
 * The two radii are custom properties because they are the one value here that
 * cannot be a constant: they are percentages of the *section box*, and a section
 * is landscape on a display and portrait on a phone. Callers set --key-light-w
 * and --key-light-h per breakpoint so what reads at every width is one lamp
 * above the top-left corner.
 */
export const KEY_LIGHT =
  "radial-gradient(var(--key-light-w) var(--key-light-h) at 10% -4%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 34%, transparent 72%)";

/**
 * Film grain. Near-black gradients band badly on 8-bit displays; a little
 * noise dithers them away and gives #08090a a photographic quality rather
 * than a flat digital one.
 */
export const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Grain over a whole section. The Hero's value, applied page-wide. */
export const GRAIN_OPACITY = 0.035;

/* ---------------------------------------------------------------------------
   The specimen plate — the singular object.

   A real plate is a physical object resting on the page, so it gets a contact
   shadow tight underneath it and a soft ambient shadow further out, both thrown
   down and to the right. The four inset lines are the object's own edges: two
   lit, two in shadow.
--------------------------------------------------------------------------- */

/*
  The 135° face, over an opaque base of the page's own colour.

  The base is the fix for the one thing that gives a plate away as a div. Every
  value in the gradient is white at under 7%, so the plate would otherwise be a
  window: the page's background schematic would render *through* its face. An
  object you can see the room through is not resting on the page — it is a
  translucent panel floating above it, and that single cue undoes the shadows,
  the bevels and the registration marks all at once. #08090a is
  --color-background exactly, so the plate occludes what is behind it without
  changing its own value by a shade.
*/
export const PLATE_FILL =
  "linear-gradient(135deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.022) 38%, rgba(255,255,255,0.007) 100%), #08090a";

export const PLATE_EDGES = [
  /* top edge — faces the light most directly, so it is the brightest line */
  "inset 0 1px 0 0 rgba(255,255,255,0.155)",
  /* left edge — lit, one step down from the top */
  "inset 1px 0 0 0 rgba(255,255,255,0.115)",
  /* right edge — turned away from the light */
  "inset -1px 0 0 0 rgba(0,0,0,0.30)",
  /* bottom edge — deepest shadow */
  "inset 0 -1px 0 0 rgba(0,0,0,0.42)",
  /* contact shadow, thrown down-right */
  "8px 10px 18px -10px rgba(0,0,0,0.55)",
  /* ambient shadow, same direction, much softer */
  "28px 36px 68px -30px rgba(0,0,0,0.85)",
].join(", ");

/** Border sits under the inset edges and carries none of the lighting itself. */
export const PLATE_BORDER = "rgba(255,255,255,0.07)";

/**
 * Print grain on the plate's own face.
 *
 * Held a step below the section's 3.5% so the plate reads as a smoother stock
 * than the page it lies on, which is what separates a mounted print from the
 * sheet. It also restores the dither the opaque base takes away — the face is a
 * three-stop gradient running from 6.5% to 0.7% white across a few hundred
 * pixels of near black, which is the exact condition 8-bit displays band under.
 */
export const PLATE_GRAIN_OPACITY = 0.028;

/** Print-bleed guide inside the plate — a real plate has one. */
export const PLATE_GUIDE = "rgba(255,255,255,0.035)";
/** Centre registration target, drawn on a plate that has nothing mounted yet. */
export const PLATE_TARGET = "rgba(255,255,255,0.10)";

/**
 * The plate's specular highlight, tracking the pointer via --plate-px/py. Broad
 * and weak — a matte-varnished print picking up the room, not a mirror. The 62%
 * stop keeps the falloff well inside the plate so the highlight never touches an
 * edge, which is what would give away that it is a gradient rather than a
 * reflection.
 */
export const PLATE_REFLECTION =
  "radial-gradient(26rem circle at var(--plate-px) var(--plate-py), rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.022) 34%, transparent 62%)";

/**
 * The hover light sweep — a single pass of the key light across a face, as
 * though the object were being turned under it. Narrow, skewed by the
 * animation, and gone in just over a second.
 */
export const PLATE_SWEEP =
  "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.055) 45%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.055) 55%, transparent 100%)";

/* ---------------------------------------------------------------------------
   The panel — the plate's material at a fraction of its amplitude.

   Every card-like block on the page (a project tile, a skills group, the
   contact card) is drawn from this rather than from the plate itself, and the
   difference in amplitude is the hierarchy. The plate is one object on the page
   and is allowed to sit proudly off it; a grid of six panels lit that hard
   reads as six competing objects and the page turns to soup.

   Same light, same direction, same order of edges — half the contrast, a
   quieter contact shadow, and a translucent base rather than an opaque one so
   the page's own atmosphere still carries through a panel that is only ever a
   surface, never a mounted print.
--------------------------------------------------------------------------- */

export const PANEL_FILL =
  "linear-gradient(135deg, rgba(255,255,255,0.042) 0%, rgba(255,255,255,0.014) 42%, rgba(255,255,255,0.005) 100%), rgba(12,13,15,0.86)";

export const PANEL_EDGES = [
  "inset 0 1px 0 0 rgba(255,255,255,0.085)",
  "inset 1px 0 0 0 rgba(255,255,255,0.055)",
  "inset -1px 0 0 0 rgba(0,0,0,0.24)",
  "inset 0 -1px 0 0 rgba(0,0,0,0.34)",
  "6px 8px 16px -12px rgba(0,0,0,0.5)",
  "22px 28px 56px -34px rgba(0,0,0,0.8)",
].join(", ");

/**
 * Hover is a step further into the light, not a new effect: the lit edges gain
 * about half again, the shadows deepen a touch, and nothing switches on. A
 * panel that answers the pointer by acquiring a coloured ring is a panel that
 * was styled rather than lit.
 */
export const PANEL_EDGES_HOVER = [
  "inset 0 1px 0 0 rgba(255,255,255,0.135)",
  "inset 1px 0 0 0 rgba(255,255,255,0.085)",
  "inset -1px 0 0 0 rgba(0,0,0,0.26)",
  "inset 0 -1px 0 0 rgba(0,0,0,0.38)",
  "8px 10px 20px -12px rgba(0,0,0,0.58)",
  "26px 34px 64px -34px rgba(0,0,0,0.85)",
].join(", ");

export const PANEL_BORDER = "rgba(255,255,255,0.055)";

/**
 * A panel's specular, tracking --panel-px/py. White, never tinted: a surface
 * reflects the lamp above the page, and the lamp is not cyan. This is what
 * replaced the per-project accent glow — the accent survives as ink on the
 * panel (labels, hairlines, one pill) rather than as light coming off it.
 */
export const PANEL_SPECULAR =
  "radial-gradient(32rem circle at var(--panel-px, 50%) var(--panel-py, -20%), rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.016) 36%, transparent 64%)";

/* ---------------------------------------------------------------------------
   Actions.

   Depth here is lighting, not decoration: a lit top bevel, a shaded bottom
   edge, and a shadow cast down-and-right — the same physics as the plate, and
   deliberately no glow.
--------------------------------------------------------------------------- */

export const PRIMARY_ACTION_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.30)",
  "inset 0 -1px 0 0 rgba(0,0,0,0.22)",
  "6px 8px 20px -10px rgba(0,0,0,0.65)",
].join(", ");

/** Secondary action — the same physics at a fraction of the amplitude. */
export const SECONDARY_ACTION_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.055)",
  "4px 6px 16px -12px rgba(0,0,0,0.5)",
].join(", ");

export const SECONDARY_ACTION_BORDER = "rgba(255,255,255,0.12)";

/**
 * Secondary action on hover — the hairline brightens and nothing else happens.
 * The restraint is the point: two buttons that both respond dramatically read
 * as two primary actions.
 */
export const SECONDARY_ACTION_BORDER_HOVER = "rgba(255,255,255,0.26)";

/**
 * The primary action's glass. A fixed top-down sheen, always on: this is the
 * curvature of the surface, not a state. Paired with the lit top bevel in
 * PRIMARY_ACTION_SHADOW it turns a flat cyan rectangle into something with a
 * face — which is the whole difference between this and a framework button.
 */
export const ACTION_GLASS =
  "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 42%, transparent 60%)";

/**
 * The primary action's specular highlight, tracking --action-px/py. White at
 * 30% over saturated cyan reads as a wet, lacquered surface catching the light;
 * anything stronger reads as a hotspot.
 */
export const ACTION_SPECULAR =
  "radial-gradient(9rem circle at var(--action-px) var(--action-py), rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 38%, transparent 68%)";

/* ---------------------------------------------------------------------------
   The drawing — the line hierarchy every schematic on the page is drawn with.

   Five values, and the spread between them is the whole reason a layer at 3%
   reads as a drawing rather than as a watermark. A technical drawing has a line
   hierarchy: object outlines are heavier than construction lines, which are
   heavier than dimension lines. Flatten those to one alpha and you get a
   texture; keep them apart and you get a drawing, even at 3%.

   Everything sits in the 2–5% band, on a #08090a canvas. The brightest value
   here composites to roughly RGB 20 against a background of RGB 8 — present
   enough to resolve when looked for, nowhere near enough to compete with type
   at 60% or with the one saturated object on the page.

   The page-wide background and the Hero's engineering scene are both drawn from
   this, which is why they read as two views of one drawing rather than as two
   decorative layers that happen to share a screen.
--------------------------------------------------------------------------- */

export const DRAWING = {
  /** Object outlines — the heaviest line. */
  object: "rgba(255,255,255,0.048)",
  /** Connections between stations: the paths. One step down. */
  connection: "rgba(255,255,255,0.036)",
  /** Datum, dimension and construction lines. The lightest thing drawn. */
  construction: "rgba(255,255,255,0.022)",
  /** Connection points and particles — small, so they carry a little more. */
  node: "rgba(255,255,255,0.055)",
  /** Annotation type. Mono, 9–13px, and never a claim — only real technologies. */
  label: "rgba(255,255,255,0.042)",
} as const;

/* ---------------------------------------------------------------------------
   The status lamp — 6px, and the smallest object that obeys the rule.

   Everything else is derived from one upper-left light: the plate, the panels,
   the buttons, the frame. A `rounded-full` fill is the most recognisable tell in
   a composition — a solid disc of accent colour is what a component library
   gives you for free.

   So it gets the same physics as every other object rather than a glow: a white
   specular at 34% / 26% (the light's own direction), a shaded lower edge, and a
   one-pixel contact shadow thrown down-and-right. It does not emit — a lamp that
   emitted would be a second light source, and at 6px what reads is not
   brightness anyway, it is that the thing is round.
--------------------------------------------------------------------------- */

export const STATUS_LENS =
  "radial-gradient(circle at 34% 26%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.16) 38%, rgba(255,255,255,0) 62%), var(--color-accent)";

export const STATUS_LENS_SHADOW = [
  /* the underside, turned away from the light */
  "inset 0 -1px 1px -0.5px rgba(0,0,0,0.45)",
  /* contact shadow, same direction as the plate's and the buttons' */
  "1px 1.5px 2px -1px rgba(0,0,0,0.7)",
].join(", ");
