"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, GitBranch, LayoutGrid, Router, Server, Smartphone } from "lucide-react";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SKILLS } from "@/data/skills/skills";
import { RULE_COLOR } from "@/styles/material";
import type { SkillCategory } from "@/types/skill";

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

/**
 * Technical skills, set as a six-panel index.
 *
 * Each panel is numbered and ruled like a sheet in a drawing set — the number
 * is the reason six near-identical boxes read as one index rather than as six
 * repetitions of a card component. Icons carry the frame's own hairline stroke
 * and the frame's own value; they used to be set in the accent, which put six
 * saturated marks in a section that is otherwise entirely white and grey.
 */
export function SkillsPreview() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  return (
    <SectionShell id="experience" labelledBy="experience-title">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="03"
            kicker="Technical Skills"
            titleId="experience-title"
            title="Every layer of the stack."
            statement={
              <>
                From interactive frontends to embedded hardware, I work across the full stack
                &mdash; choosing the right tool for the system, not just the trend.
              </>
            }
          />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-64 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SKILLS_BY_CATEGORY.map(({ category, skills }, index) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <Card key={category} className="p-24">
                <div className="flex items-center gap-12">
                  <Icon
                    className="size-20 shrink-0 text-text-tertiary"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <h3 className="text-h6 font-medium tracking-tight text-text-primary">
                    {category}
                  </h3>
                  {/* The sheet number, flush right. Two digits, tabular, and
                      the one field on the panel set as a machine would set it. */}
                  <span
                    aria-hidden
                    className="ml-auto font-mono text-[11px] tabular-nums tracking-[0.1em] text-text-tertiary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div aria-hidden className="mt-16 h-px" style={{ backgroundColor: RULE_COLOR }} />

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

        <motion.div variants={item} className="mt-48">
          <Button variant="secondary" size="sm" disabled>
            View Full Tech Stack
          </Button>
          <p className="mt-12 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
            Full tech stack page coming soon.
          </p>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
