import type { Skill } from "@/types/skill";

/**
 * The stack, grouped into nine areas.
 *
 * Every entry is a technology or practice the profile actually uses, and every
 * one of them is evidenced somewhere in this repository or in the projects the
 * site presents: the Smart Health Room hardware and app stack, the AutoFlow
 * platform, the Morocco Retail data platform, and the frontend this site is
 * built on.
 *
 * No percentages, no "advanced / intermediate" labels, and no ordering by
 * supposed mastery. A number beside a skill is a number nobody measured.
 */
export const SKILLS: Skill[] = [
  /* Frontend */
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "HTML5", category: "Frontend" },
  { name: "CSS3", category: "Frontend" },
  { name: "Responsive Design", category: "Frontend" },
  { name: "Accessibility", category: "Frontend" },

  /* Backend */
  { name: "Node.js", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "REST APIs", category: "Backend" },
  { name: "OpenAPI", category: "Backend" },
  { name: "Prisma", category: "Backend" },
  { name: "Python", category: "Backend" },

  /* Databases */
  { name: "PostgreSQL", category: "Databases" },
  { name: "MongoDB", category: "Databases" },
  { name: "Redis", category: "Databases" },
  { name: "SQL", category: "Databases" },
  { name: "Data Modeling", category: "Databases" },

  /* Mobile */
  { name: "Flutter", category: "Mobile" },
  { name: "Dart", category: "Mobile" },

  /* AI & Machine Learning */
  { name: "Machine Learning", category: "AI & Machine Learning" },
  { name: "AI Engineering", category: "AI & Machine Learning" },
  { name: "AI Integration", category: "AI & Machine Learning" },
  { name: "Data Analysis", category: "AI & Machine Learning" },

  /* Big Data */
  { name: "Apache Airflow", category: "Big Data" },
  { name: "dbt", category: "Big Data" },
  { name: "Apache Superset", category: "Big Data" },
  { name: "Great Expectations", category: "Big Data" },
  { name: "MinIO", category: "Big Data" },
  { name: "ETL Pipelines", category: "Big Data" },
  { name: "Data Warehousing", category: "Big Data" },
  { name: "Data Quality", category: "Big Data" },
  { name: "Star Schema", category: "Big Data" },

  /* Cloud & DevOps */
  { name: "Docker", category: "Cloud & DevOps" },
  { name: "Docker Compose", category: "Cloud & DevOps" },
  { name: "Git", category: "Cloud & DevOps" },
  { name: "GitHub Actions", category: "Cloud & DevOps" },
  { name: "CI/CD", category: "Cloud & DevOps" },
  { name: "Linux", category: "Cloud & DevOps" },
  { name: "Prometheus", category: "Cloud & DevOps" },
  { name: "Grafana", category: "Cloud & DevOps" },
  { name: "Cloud Computing", category: "Cloud & DevOps" },

  /* IoT & Embedded */
  { name: "ESP32", category: "IoT & Embedded" },
  { name: "Arduino", category: "IoT & Embedded" },
  { name: "Raspberry Pi", category: "IoT & Embedded" },
  { name: "Sensor Networks", category: "IoT & Embedded" },
  { name: "RFID", category: "IoT & Embedded" },
  { name: "Real-time Telemetry", category: "IoT & Embedded" },

  /* Tools & Practices */
  { name: "System Design", category: "Tools & Practices" },
  { name: "Testing", category: "Tools & Practices" },
  { name: "Technical Documentation", category: "Tools & Practices" },
  { name: "Monorepo", category: "Tools & Practices" },
  { name: "Code Review", category: "Tools & Practices" },
];
