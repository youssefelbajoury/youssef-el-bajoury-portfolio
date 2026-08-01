/**
 * Hero motion — the whole timeline in one file.
 *
 * heroMaterial.ts owns every surface; this owns every movement. The split is
 * the same discipline: when the choreography lives in one place you can read
 * the entrance as a score rather than hunting delays across seven components.
 *
 * TWO RULES, and neither is broken:
 *
 *   ONE CURVE.  Everything decelerates on the same expo-out curve. Mixed
 *     easing across a single entrance is what makes a sequence feel assembled
 *     from parts; one curve makes it feel like one object arriving.
 *
 *   NOTHING POPS.  Every element enters from below, out of focus, and settles.
 *     No scale-up from nothing, no bounce, no overshoot. Overshoot is playful,
 *     and playful is the opposite of the brief.
 *
 * All values are transform/opacity/filter only — no width, height, top or left
 * is animated anywhere in the Hero, so nothing here can trigger layout.
 */

/**
 * The single easing curve. Expo-out: almost all the distance is covered in the
 * first third, then a long settle. It is the curve that reads as "heavy object,
 * well damped" rather than "element sliding into place".
 *
 * Matches `ease-premium` in tailwind.config.ts — the same curve the rest of the
 * site already uses for hover transitions, so the entrance and the interactions
 * share a physics.
 */
export const EASE_PREMIUM = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The entrance timeline, in milliseconds from first paint.
 *
 * The frame itself — rules, ticks, crop marks — is deliberately absent from
 * this list. The drafted page is not animated in: it is already there, and the
 * content is placed onto it. That is what makes the sequence read as printing
 * rather than as a UI booting up, and it means the composition's structure is
 * legible at 0ms even on a slow connection.
 *
 * The stagger inside each group (line 2 after line 1, coordinates after the
 * availability line) is 60–90ms — long enough to read as sequence, short
 * enough that the pair still reads as one gesture.
 */
export const ENTRANCE = {
  availability: 150,
  coordinates: 210,
  headlineFirstLine: 300,
  headlineSecondLine: 390,
  ledeRule: 430,
  statement: 450,
  capabilityIndex: 600,
  /** Per-item stagger across the six domains. Six × 45ms = 225ms to sweep. */
  capabilityStep: 45,
  primaryAction: 700,
  secondaryAction: 760,
  /* The resume trigger, on its own line under the pair above. 60ms after the
     GitHub control — the same in-group stagger used everywhere else — because
     the three of them are one gesture arriving, not two gestures and an
     afterthought. It still lands before the plate, which settles last. */
  resumeAction: 820,
  plate: 850,
  /**
   * The plate's delay below `md`, where the composition puts it first.
   *
   * A staged entrance has to arrive in the order the eye reads, and on a phone
   * the plate is no longer the last thing in the frame — it is the first, above
   * the headline. Entering it at 850ms there meant the type assembled around a
   * hole and the anchor dropped in afterwards, which is the one arrangement that
   * makes a sequence feel like assets loading rather than a page being printed.
   *
   * 280 puts it 70ms after the coordinate readout — the same in-group stagger
   * used everywhere above — and 20ms before the headline's first line. It still
   * settles last of everything, because at 1100ms it has by far the longest
   * duration: the heaviest object arrives first and takes the longest to come to
   * rest, which is exactly how mass reads.
   */
  plateCompact: 280,
} as const;

/**
 * Durations. Longer for larger objects, which is simply how mass reads: the
 * headline takes nearly a second to settle, an 11px label takes half of that.
 * Uniform durations are the most common reason a staged entrance feels cheap.
 */
export const DURATION = {
  line: 950,
  plate: 1100,
  element: 700,
  rule: 620,
} as const;

/**
 * Pointer parallax depths, in pixels of travel at full deflection.
 *
 * The brief caps the whole field at 4px, and nothing here exceeds it. The
 * point is not the distance — it is that the layers disagree about it. Equal
 * movement across every layer reads as the page sliding; unequal movement
 * reads as depth, and 4px of disagreement is enough to feel it without ever
 * being able to point at it.
 *
 * Sign is inverted for the trace field: the background drifts *against* the
 * pointer, which is what separates it from the foreground rather than simply
 * placing it behind.
 */
export const PARALLAX = {
  headline: 2.2,
  plate: 3.8,
  traces: -1.6,
  keyLight: 3,
} as const;

/**
 * Scroll depth, in pixels of lag over the section's exit.
 *
 * A positive value means the layer is translated *down* as the page scrolls
 * up — so it falls behind the scroll and reads as further away. The plate lags
 * hardest because it is the nearest thing the composition has to a physical
 * object; the headline barely lags at all and instead loses opacity, because
 * type that drifts out of alignment with its own grid looks broken rather than
 * distant.
 */
export const SCROLL_DEPTH = {
  /** Opacity the headline block falls to as the section leaves. */
  headlineFade: 0.78,
  headlineLag: 26,
  tracesLag: 74,
  plateLag: 116,
} as const;

/**
 * Pointer smoothing factor, applied per animation frame.
 *
 * Raw pointer coordinates are jittery and land the composition on a new
 * sub-pixel every frame. Easing toward the target at 12% per frame gives the
 * field a short tail — the layers keep moving very slightly after the pointer
 * stops, which is the difference between "tracking the mouse" and "responding
 * to it".
 */
export const POINTER_SMOOTHING = 0.12;
