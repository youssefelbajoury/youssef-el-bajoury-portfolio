/**
 * The engineering scene's registry and coordinates.
 *
 * THE IDEA. The Hero already names six domains in the capability index. This
 * layer draws them, in the same order, so the index at the foot of the frame
 * reads as the legend for the drawing above it. A recruiter who gives the page
 * three seconds and reads nothing still sees a laptop, a service stack, a
 * database, a cloud, a microcontroller and a model — which is the brief.
 *
 * It does not duplicate GlobalBackground. That is a node graph: topology, no
 * objects. This is an elevation: things, drawn square on, standing on a datum.
 * Two registers of the same system, which is the same discipline that keeps
 * the typographic trace field from fighting the node graph it sits over.
 *
 * WHERE IT GOES, AND WHY IT IS MEASURED RATHER THAN GUESSED. The first cut of
 * this layer spanned the whole section on a fixed viewBox, and at 1280 it put
 * the microcontroller and the model underneath the plate's label and laid its
 * annotations across the capability index. The section's free space was then
 * measured at three widths:
 *
 *              scene box   actions end   plate end   index starts
 *   1280×800    1280×744       493          602          659
 *   1440×900    1280×858       556          693          774
 *   1920×1080   1280×994       586          799          909
 *
 * Full width, the band that clears both the plate and the index is 57–110px —
 * far too little. Left of the plate it is 166–323px. So the drawing lives in
 * the lower-left band only, anchored to the bottom of the content column and
 * capped at 65% of its width, which clears the plate at every one of those
 * widths by 49px or more. The band is anchored in CSS rather than in viewBox
 * units precisely so it tracks that geometry instead of assuming it.
 */

/**
 * The drawing's coordinate space — the band, not the section.
 *
 * The aspect ratio here *is* the container's aspect ratio, so the SVG scales
 * uniformly and nothing distorts. 840 × 128 at 65% of a 1280 content box comes
 * out at 832 × 127 device pixels: near enough 1:1 that the hairlines stay
 * hairlines.
 */
export const SCENE_VIEWBOX = { width: 840, height: 128 } as const;

/** The line every station stands on. */
export const SCENE_DATUM = 112;
/** The API run: the horizontal transport threading all six stations. */
export const SCENE_RUN = 94;
/** The base of the object outlines. */
export const SCENE_OBJECT_BASE = 78;

export interface SceneStation {
  /** Matches the capability index entry it draws. The index is the legend. */
  index: string;
  /**
   * The name of a technology that is actually in the work — never a metric.
   *
   * Annotations on a real drawing name what a thing *is*, not how well it
   * performs, and that is the only kind of label that can go here honestly.
   * Each tag below is a row in data/skills.ts or data/projects.ts, so the
   * drawing can be checked against the rest of the site line by line.
   *
   * The first cut of this registry read HTTP / REST / SQL / TLS / MQTT / INFER,
   * which was generic protocol vocabulary rather than fact: this stack stores
   * to MongoDB and not to SQL, terminates no TLS of its own, publishes over no
   * MQTT broker, and "INFER" is not the name of anything. Plausible-sounding
   * infrastructure is the same failure as a fabricated number — it is a claim
   * the page has not earned. Do not add a tag that is not evidenced.
   *
   * Printed above the object rather than below it, and without the index
   * number, so it never reads as a second, misaligned copy of the capability
   * index sitting directly beneath.
   */
  tag: string;
  /** Horizontal centre in viewBox units. */
  x: number;
}

/**
 * Six stations, evenly spaced, in the order the index lists them — which runs
 * the headline backwards: interface nearest the reader, sensor furthest away.
 */
export const SCENE_STATIONS: readonly SceneStation[] = [
  { index: "01", tag: "REACT", x: 74 },
  { index: "02", tag: "NODE", x: 204 },
  { index: "03", tag: "MONGODB", x: 334 },
  { index: "04", tag: "DOCKER", x: 464 },
  { index: "05", tag: "ESP32", x: 594 },
  { index: "06", tag: "AI", x: 724 },
] as const;

export interface SceneParticle {
  /** Percentages of the content column, so they place like the trace field. */
  left: string;
  top: string;
  /** Seconds. Long, and mutually prime-ish, so the field never resynchronises. */
  duration: number;
  delay: number;
}

/**
 * Ten particles.
 *
 * Not a particle *system* — no emitter, no physics, no runtime randomness. Ten
 * fixed points that drift a few pixels and return, each on its own long cycle.
 * The brief's range is 10–20 and this sits at the floor of it, for two reasons:
 * a field sparse enough to count reads as deliberate where anything denser
 * reads as a screensaver, and each one is a separately animated element.
 *
 * That second reason is the only measurement that pointed the same way twice
 * when this layer was profiled — hiding the particles was the one change that
 * consistently reduced the number of frames over 20ms. The profiling
 * environment was too noisy to trust for attribution (see the note in the
 * report), so this is not a claimed optimisation; it is choosing the cheaper
 * end of a range the brief already allows.
 *
 * They carry their own layer rather than riding inside the drawing, because the
 * drawing occupies a 128px band and dust confined to a thin strip reads as a
 * defect in that strip. Placement follows the same empty regions the trace
 * field uses: above the headline, the open column 8, and the left flank below
 * the call to action.
 */
export const SCENE_PARTICLES: readonly SceneParticle[] = [
  { left: "6%", top: "4%", duration: 26, delay: 0 },
  { left: "44%", top: "3%", duration: 23, delay: -9 },
  { left: "61%", top: "12%", duration: 29, delay: -2 },
  { left: "64%", top: "38%", duration: 27, delay: -7 },
  { left: "60%", top: "52%", duration: 33, delay: -18 },
  { left: "63%", top: "64%", duration: 25, delay: -5 },
  { left: "3%", top: "72%", duration: 30, delay: -21 },
  { left: "38%", top: "76%", duration: 32, delay: -16 },
  { left: "51%", top: "84%", duration: 24, delay: -24 },
  { left: "9%", top: "88%", duration: 35, delay: -3 },
] as const;
