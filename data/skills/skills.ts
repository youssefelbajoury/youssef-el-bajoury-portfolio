import type { Skill } from "@/types/skill";

/**
 * Technologies drawn only from MASTER_SPECIFICATION.md ("Skills Galaxy",
 * "Technology Stack", "Keywords"). No skill, tool, or version is invented.
 * Cloud and AI are intentionally omitted as categories here — the spec names
 * those as engineering focus areas, not specific tools, so listing them as
 * "technology badges" would fabricate specifics that aren't defined.
 */
export const SKILLS: Skill[] = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "MongoDB", category: "Databases" },
  { name: "Flutter", category: "Mobile" },
  { name: "Arduino", category: "IoT" },
  { name: "ESP32", category: "IoT" },
  { name: "Docker", category: "DevOps & Tools" },
  { name: "Git", category: "DevOps & Tools" },
];
