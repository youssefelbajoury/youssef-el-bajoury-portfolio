"use client";

import { motion, useReducedMotion } from "framer-motion";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { SHOWCASE_PROJECTS } from "@/data/projects/projects";
import { CaseStudyProvider } from "@/features/showcase/case-studies";

import { RolexExperienceShowcase } from "./components/RolexExperienceShowcase";
import { SmartHealthRoomShowcase } from "./components/SmartHealthRoomShowcase";
import { WorkInProgressTile } from "./components/WorkInProgressTile";

/**
 * Featured Projects.
 *
 * Two projects, each composed by hand rather than mapped over a shared card —
 * that is the point of the section. `SmartHealthRoomShowcase` and
 * `RolexExperienceShowcase` share primitives (TiltCard, LaptopMockup,
 * BrowserFrame, TechPill) but not a layout, so neither reads as the other one
 * retinted.
 *
 * Spacing is the section's other job: 8rem of air between projects, so each
 * one is read on its own rather than compared side by side.
 */
export function ProjectShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  return (
    <SectionShell id="projects" labelledBy="projects-title" air="tall">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="01"
            kicker="Featured Projects"
            titleId="projects-title"
            title="Two projects, end to end."
            statement="Not a rail of thumbnails. Two systems I can walk through line by line — what the problem was, how the architecture answers it, and what I would build differently now."
          />
        </motion.div>
      </motion.div>

      {/*
        The provider owns which case study is open, and nothing else. It wraps
        the tiles rather than living inside them so that opening a study is a
        section-level event: one viewer exists at a time, mounted next to the
        tiles rather than inside one of them, which is what lets it be full
        screen without any tile needing to know it.
      */}
      <CaseStudyProvider projects={SHOWCASE_PROJECTS}>
        <div className="mt-80 flex flex-col gap-128">
          <SmartHealthRoomShowcase />
          <RolexExperienceShowcase />
        </div>
      </CaseStudyProvider>

      <div className="mt-96">
        <WorkInProgressTile />
      </div>
    </SectionShell>
  );
}
