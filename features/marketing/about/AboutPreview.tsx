"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, Code2, Layers, Router, User } from "lucide-react";

import { SectionKicker } from "@/components/shared/SectionKicker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ABOUT_INTRO, CORE_EXPERTISE, ENGINEERING_HIGHLIGHTS } from "@/content/about/about";
import type { EngineeringHighlight } from "@/content/about/about";

import type { Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const HIGHLIGHT_ICONS: Record<EngineeringHighlight["icon"], LucideIcon> = {
  fullstack: Code2,
  iot: Router,
  ai: BrainCircuit,
  product: Layers,
};

export function AboutPreview() {
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
    <section className="border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="mx-auto max-w-content px-24 py-96 md:px-32"
      >
        <motion.div variants={itemVariants}>
          <SectionKicker>About Me</SectionKicker>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-24 max-w-readable text-title font-semibold text-text-primary"
        >
          An Engineer Who Thinks in Systems
        </motion.h2>

        <div className="mt-48 grid grid-cols-1 gap-48 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-64">
          <div>
            <motion.p
              variants={itemVariants}
              className="max-w-readable text-paragraph-lg text-text-secondary"
            >
              {ABOUT_INTRO}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-32">
              <p className="font-mono text-label uppercase tracking-[0.2em] text-text-tertiary">
                Core Expertise
              </p>
              <ul className="mt-16 flex flex-wrap gap-8">
                {CORE_EXPERTISE.map((area) => (
                  <li key={area}>
                    <Badge>{area}</Badge>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-40">
              <Button variant="secondary" size="sm" disabled>
                Learn More About Me
              </Button>
              <p className="mt-12 text-caption text-text-tertiary">Full About page coming soon.</p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mx-auto w-full max-w-[20rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgb(46_230_255_/_10%),transparent_65%)]"
              />
              <div className="relative flex h-full flex-col items-center justify-center gap-16 p-24 text-center">
                <div className="flex size-64 items-center justify-center rounded-full border border-border bg-glass-background backdrop-blur-glass">
                  <User className="size-24 text-text-secondary" aria-hidden />
                </div>
                <p className="font-mono text-label uppercase tracking-[0.2em] text-text-tertiary">
                  Portrait Coming Soon
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-64 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ENGINEERING_HIGHLIGHTS.map((highlight) => {
            const Icon = HIGHLIGHT_ICONS[highlight.icon];
            return (
              <Card key={highlight.label} className="flex items-center gap-12 p-20">
                <Icon className="size-20 shrink-0 text-accent" aria-hidden />
                <span className="text-paragraph-sm font-medium text-text-primary">
                  {highlight.label}
                </span>
              </Card>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
