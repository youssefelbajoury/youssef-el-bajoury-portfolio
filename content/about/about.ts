/**
 * About Preview content — grounded in MASTER_SPECIFICATION.md "Brand Strategy"
 * (Brand Positioning, Core Identity) and "2. Executive Snapshot" (Engineering
 * Focus). No invented companies, awards, achievements, or experience duration.
 */

export const ABOUT_INTRO =
  "I think in systems, not just features — how a frontend, an API, a database, and a piece of embedded hardware all fit together, and what happens when one of them fails. That systems mindset, paired with a genuine curiosity for IoT and AI, is what shapes the way I build software.";

export interface EngineeringHighlight {
  label: string;
  icon: "fullstack" | "iot" | "ai" | "product";
}

/** Mirrors the spec's "Engineering Focus" list verbatim. */
export const ENGINEERING_HIGHLIGHTS: EngineeringHighlight[] = [
  { label: "Full Stack Software Engineering", icon: "fullstack" },
  { label: "IoT Engineering", icon: "iot" },
  { label: "AI Engineering", icon: "ai" },
  { label: "Product Engineering", icon: "product" },
];

export const CORE_EXPERTISE = [
  "Full Stack Development",
  "Cloud Architecture",
  "Artificial Intelligence",
  "Internet of Things",
  "Backend Systems",
  "Frontend Engineering",
  "Mobile Development",
  "Databases",
] as const;
