"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionKicker } from "@/components/shared/SectionKicker";

import { buildRevealVariants, REVEAL_VIEWPORT } from "./components/revealMotion";
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
    <section id="projects" className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgb(46_230_255_/_7%),transparent_58%)]"
      />

      <div className="relative mx-auto max-w-content px-24 py-128 md:px-32">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          variants={container}
          className="max-w-readable"
        >
          <motion.div variants={item}>
            <SectionKicker>Featured Projects</SectionKicker>
          </motion.div>

          <motion.h2 variants={item} className="mt-24 text-title font-semibold text-text-primary">
            Two projects, end to end.
          </motion.h2>

          <motion.p variants={item} className="mt-24 text-paragraph-lg text-text-secondary">
            Not a gallery. Two systems I can walk through line by line — what the problem was, how
            the architecture answers it, and what I would build differently now.
          </motion.p>
        </motion.header>

        <div className="mt-80 flex flex-col gap-128">
          <SmartHealthRoomShowcase />
          <RolexExperienceShowcase />
        </div>

        <div className="mt-96">
          <WorkInProgressTile />
        </div>
      </div>
    </section>
  );
}
