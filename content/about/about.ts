/**
 * About Preview content — grounded in the profile's own record: full stack
 * development, AI and machine learning, big data and cloud, and IoT systems.
 * No invented companies, awards, achievements, or experience duration.
 */

export const ABOUT_INTRO =
  "I work across the whole stack — the interface, the services behind it, the data that feeds them, and the connected hardware at the edge. That range is deliberate: I like problems that only make sense when the frontend, the API, the database, the pipeline, and the device are understood as one system rather than as separate tickets. My current focus is full stack development, with AI and machine learning, big data, and cloud computing as the layers I keep building into.";

export interface EngineeringHighlight {
  label: string;
  icon: "fullstack" | "iot" | "ai" | "product" | "cloud" | "data";
}

/** The disciplines this profile combines, stated as peers rather than a ranking. */
export const ENGINEERING_HIGHLIGHTS: EngineeringHighlight[] = [
  { label: "Full Stack Development", icon: "fullstack" },
  { label: "AI & Machine Learning", icon: "ai" },
  { label: "Big Data Engineering", icon: "data" },
  { label: "Cloud Computing", icon: "cloud" },
  { label: "IoT & Connected Systems", icon: "iot" },
  { label: "Product Engineering", icon: "product" },
];

export const CORE_EXPERTISE = [
  "Software Engineering",
  "Full Stack Development",
  "AI & Machine Learning",
  "Big Data",
  "Cloud Computing",
  "IoT & Connected Systems",
  "Backend Systems",
  "Frontend Engineering",
  "Mobile Development",
  "Databases",
] as const;
