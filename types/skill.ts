/**
 * The nine areas the stack is grouped into.
 *
 * Categories are organisational, never a ranking: no category is "advanced"
 * and no skill carries a percentage. The order here is the order the section
 * renders them in — interface down to the tools that hold the system together.
 */
export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Mobile"
  | "AI & Machine Learning"
  | "Big Data"
  | "Cloud & DevOps"
  | "IoT & Embedded"
  | "Tools & Practices";

export interface Skill {
  name: string;
  category: SkillCategory;
}
