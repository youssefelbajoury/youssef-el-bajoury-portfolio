import { PROFILE } from "@/constants/profile";
import heroPortrait from "@/public/portrait/youssef-el-bajoury.jpeg";

import type { StaticImageData } from "next/image";

/**
 * Hero copy and technical data.
 *
 * Text and numbers only — no components and no icons, so this module stays
 * safely in the server graph and the Hero can render with zero client JS.
 *
 * Every value here is factual. Per constants/profile.ts, the site is
 * evidence-based: nothing on this page may be invented to sound impressive.
 */

/**
 * The headline, one array entry per line.
 *
 * Held as explicit lines rather than a string with <br />: the break is a
 * typographic decision, not a consequence of the container's width, and it
 * must survive every viewport unchanged.
 */
export const HERO_HEADLINE = ["From the sensor", "to the screen."] as const;

/**
 * Optical left correction per headline line, in em.
 *
 * A glyph does not begin where its box begins. Every element down the left of
 * this column — the status lamp, the lede rule, the sentence, the primary
 * action, the domain index — has ink flush to the column edge, measured at
 * 112.0px on a 1440 viewport. The headline did not: line 1's "F" started at
 * 120.0 and line 2's "t" at 116.33, because both carry a left side bearing that
 * scales with the type. At 92px that is 8.0px and 4.33px of empty air, so the
 * largest element on the page sat visibly indented from a margin everything
 * else respected — and, worse, its own two lines disagreed with each other by
 * 3.67px, which reads as a ragged edge rather than as a flush-left block.
 *
 * The numbers below are those measured bearings divided by the font size, so
 * they are the bearing itself expressed as a ratio: -8.0/92 and -4.33/92. In em
 * they hold at every breakpoint without a media query, because the bearing and
 * the correction scale by the same factor — 3.4px and 1.9px at the mobile 39.5px,
 * 8.0px and 4.33px at the desktop cap.
 *
 * This is per line and not per element, and it has to be: one offset cannot
 * align two different opening glyphs. That couples these values to the words in
 * HERO_HEADLINE above — change the first letter of either line and the number
 * beside it is wrong. Re-measure rather than guess; the letter-spacing does not
 * enter into it, since tracking is applied after each glyph and never before
 * the first.
 */
export const HERO_HEADLINE_OPTICAL = ["-0.087em", "-0.047em"] as const;

/** One sentence. It states a position; it does not describe a skill set. */
export const HERO_STATEMENT = "One engineer. The whole system.";

/** Casablanca, to four decimal places — the machine's voice, so: mono. */
export const HERO_COORDINATES = {
  latitude: "33.5731° N",
  longitude: "7.5898° W",
} as const;

export const HERO_AVAILABILITY = "Available for full-time";

/**
 * The specimen plate's label — the museum card beneath the object.
 *
 * Name and location are read from PROFILE rather than restated, so the Hero
 * can never drift out of sync with the rest of the site. `role` is local:
 * it is the position this page claims, set deliberately in the singular
 * ("Software Engineer", not a list), and it is a Hero copy decision rather
 * than a profile fact.
 *
 * The label is independent of whether the plate is filled. A specimen is
 * catalogued before it is mounted, so the name belongs here from the start —
 * not as a caption the photo brings with it.
 */
export const HERO_PLATE_LABEL = {
  identity: PROFILE.name,
  role: "Software Engineer",
  location: PROFILE.location,
} as const;

/**
 * The portrait. Null is still a supported state — SpecimenPlate draws a
 * registered empty plate for it, which is what a plate awaiting its specimen
 * looks like in a drawing office — and nothing in the composition moves when
 * the photo lands, because the plate is a fixed 4:5 box either way.
 *
 * A STATIC IMPORT, NOT A PATH STRING, and that is the whole reason the type
 * changed. Next reads a statically imported image at build time and hands the
 * component its intrinsic dimensions plus a generated blur placeholder; a
 * string path gives neither, so the site's one priority image — the LCP
 * candidate, above the fold, on the plate a reader looks at first — would have
 * been the only image on the page loading into an empty box. Every other image
 * here is imported this way; this is now consistent with them.
 *
 * The source is 1097 × 1280 (0.857) against a 4:5 plate (0.8), so cover trims a
 * little off the top and bottom and nothing off the sides. Centred.
 */
export const HERO_PORTRAIT: StaticImageData | null = heroPortrait;

export interface CapabilityDomain {
  /** Two-digit index, kept as a string so the leading zero is never lost. */
  index: string;
  name: string;
}

/**
 * Eleven disciplines, collapsed into six domains.
 *
 * The collapse is the point. A list of eleven capabilities reads as a résumé
 * padding itself out; six domains read as a system with named subsystems.
 *
 *   INTERFACE     frontend, UI/UX
 *   SERVICES      backend, APIs
 *   DATA          databases
 *   CLOUD         cloud, deployment
 *   EDGE          mobile, IoT, embedded
 *   INTELLIGENCE  AI systems
 *
 * Software architecture is deliberately absent. Listing it as a seventh peer
 * would demote it to the same rank as the others; it is instead the claim the
 * row makes as a whole — that these six are one system rather than six lines
 * on a CV.
 */
export const CAPABILITY_INDEX: readonly CapabilityDomain[] = [
  { index: "01", name: "Interface" },
  { index: "02", name: "Services" },
  { index: "03", name: "Data" },
  { index: "04", name: "Cloud" },
  { index: "05", name: "Edge" },
  { index: "06", name: "Intelligence" },
] as const;

export interface HeroTrace {
  text: string;
  /**
   * Placement at `lg` and up, anchored to a 12-column boundary — (n - 1) / 12 —
   * so the field is on the same grid as everything else. Scattered placement
   * would read as noise; placement on the grid reads as a layer that was
   * drafted.
   */
  left: string;
  top: string;
  /**
   * Placement between `md` and `lg`, or omitted to hold the trace back to `lg`.
   *
   * Tablet is a different composition, not a narrower one, so the desktop
   * coordinates are not merely tighter there — they are wrong. Three of them
   * land inside the tablet's portrait: at 768 the plate occupies columns 9–12
   * from the second row down, and "POST /api/sensors" at 58.3% / 30% is printed
   * across it. The old rule (a `wideOnly` flag, everything else placed once)
   * only ever worked because the tablet's right half was empty, which was the
   * bug this pass exists to fix.
   *
   * Three traces carry a tablet placement and seven wait for the desktop. That
   * is not a compromise: tablet has one genuinely empty band — the strip under
   * the call to action, left of the plate's lower half — and a discovery layer
   * printed anywhere else on that composition would be printed over something.
   */
  tablet?: { left: string; top: string };
  /**
   * Runs a hairline packet off the end of the trace.
   *
   * Set only on the traces that name something a packet could actually travel
   * along — a transport, an endpoint, a device sending telemetry. A packet
   * leaving "Docker Build" is nonsense, and nonsense is legible even at 3%.
   * Four of ten carry one; a field where everything moves has no signal in it.
   */
  packet?: boolean;
}

/**
 * The trace field: fragments of the systems behind the work, printed onto the
 * page at roughly 3% and discovered rather than read.
 *
 * They sit behind everything at rgba(255,255,255,0.03) on a #08090a canvas,
 * which cannot affect the contrast of any text above them — the composited
 * background shifts by about four values out of 255.
 */
export const HERO_TRACES: readonly HeroTrace[] = [
  /*
    PLACEMENT. Every coordinate below is measured, not arithmetic. An earlier
    cut derived them from a column boundary and a blind percentage of section
    height, and at 1280 and 1440 four of them landed on top of something: two
    rendered *inside* the specimen plate, one collided with the coordinate
    readout, and one sat across the bottom frame rule beside the capability
    index. A discovery layer that overlaps the foreground does not read as a
    secret, it reads as a rendering fault.

    They now sit in bands the composition genuinely leaves empty: the strip
    above the headline, the open column 8 between the type and the plate, and
    the far left flank. Everything below 68% belongs to the engineering scene,
    so no trace is placed there.

    WHAT MAY BE PRINTED HERE. Log lines only — a transport, an endpoint, a
    device state, a system that exists. Never a measurement. Four labels have
    been removed on exactly that rule: "mqtt://broker" named a protocol no
    project in data/projects.ts actually uses, "Edge Runtime" and "API Gateway"
    named infrastructure this stack does not run, and "Latency 18ms" and
    "Deploy Success" were invented telemetry. A single fabricated number found
    here costs more trust than the whole layer buys, and at 3% opacity nobody
    is reading it for information anyway — so there is nothing to trade.

    Every label that remains is evidenced by data/projects.ts or
    data/skills.ts. Nothing may be added here that is not.
  */
  { text: "Docker Build", left: "33.3333%", top: "5%" },
  { text: "Telemetry Active", left: "8.3333%", top: "8%", packet: true },
  /*
    The three tablet coordinates are measured against the composition at 768 and
    834, not chosen on a rhythm. The band runs from the bottom of the call to
    action (676 of 942 at 768 — 72%) to the closing frame rule (877 — 93%), and
    only the columns left of the plate are free. The first cut placed them at 69
    and 74%, which put one trace behind the primary action and the other two
    hard against its shadow; 76 and 82% clear the button by 40px and the rule by
    100. Everything at 0% is flush to the type's own left edge, on the grid.
  */
  {
    text: "Sensor Network",
    left: "16.6667%",
    top: "13%",
    tablet: { left: "0%", top: "76%" },
    packet: true,
  },
  { text: "Node Online", left: "66.6667%", top: "6%", tablet: { left: "38%", top: "82%" } },
  {
    text: "POST /api/sensors",
    left: "58.3333%",
    top: "30%",
    tablet: { left: "0%", top: "82%" },
    packet: true,
  },
  { text: "ESP32 Telemetry", left: "58.3333%", top: "44%", packet: true },
  { text: "Device Registered", left: "58.3333%", top: "57%" },
  { text: "REST API", left: "0%", top: "20%" },
  { text: "Database Ready", left: "0%", top: "62%" },
  { text: "Realtime Sync", left: "0%", top: "67%" },
] as const;
