"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, GitBranch, LayoutGrid, Router, Server, Smartphone } from "lucide-react";

import { SectionKicker } from "@/components/shared/SectionKicker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SKILLS } from "@/data/skills/skills";
import type { SkillCategory } from "@/types/skill";

import type { Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ORDER: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Databases",
  "Mobile",
  "IoT",
  "DevOps & Tools",
];

const CATEGORY_ICONS: Record<SkillCategory, LucideIcon> = {
  Frontend: LayoutGrid,
  Backend: Server,
  Databases: Database,
  Mobile: Smartphone,
  IoT: Router,
  "DevOps & Tools": GitBranch,
};

const SKILLS_BY_CATEGORY = CATEGORY_ORDER.map((category) => ({
  category,
  skills: SKILLS.filter((skill) => skill.category === category),
}));

export function SkillsPreview() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.13 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgb(46_230_255_/_8%),transparent_60%)]"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="relative mx-auto max-w-content px-24 py-96 md:px-32"
      >
        <motion.div variants={itemVariants}>
          <SectionKicker>Technical Skills</SectionKicker>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-24 max-w-readable text-title font-semibold text-text-primary"
        >
          Every Layer of the Stack
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mt-16 max-w-readable text-paragraph-lg text-text-secondary"
        >
          From interactive frontends to embedded hardware, I work across the full stack &mdash;
          choosing the right tool for the system, not just the trend.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-64 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SKILLS_BY_CATEGORY.map(({ category, skills }) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <Card key={category} className="p-24">
                <div className="flex items-center gap-12">
                  <Icon className="size-20 shrink-0 text-accent" aria-hidden />
                  <h3 className="text-h6 font-semibold text-text-primary">{category}</h3>
                </div>

                <ul className="mt-16 flex flex-wrap gap-8">
                  {skills.map((skill) => (
                    <li key={skill.name}>
                      <Badge>{skill.name}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-48">
          <Button variant="secondary" size="sm" disabled>
            View Full Tech Stack
          </Button>
          <p className="mt-12 text-caption text-text-tertiary">Full tech stack page coming soon.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
