export type SkillCategory =
  "Frontend" | "Backend" | "Databases" | "Mobile" | "IoT" | "DevOps & Tools";

export interface Skill {
  name: string;
  category: SkillCategory;
}
