"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";

import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { SectionKicker } from "@/components/shared/SectionKicker";
import { Button } from "@/components/ui/Button";
import { PROFILE, SOCIAL_LINKS } from "@/constants/profile";

import { RotatingRole } from "./components/RotatingRole";
import { ScrollIndicator } from "./components/ScrollIndicator";

import type { Variants } from "framer-motion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.14,
        delayChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto w-full max-w-content px-24 py-128 md:px-32"
      >
        <div className="max-w-[54rem]">
          <motion.div variants={itemVariants}>
            <SectionKicker>
              <RotatingRole />
            </SectionKicker>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-32 text-hero font-semibold text-text-primary"
          >
            Software that
            <br />
            scales. Systems
            <br />
            that last.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-40 max-w-readable text-paragraph-lg text-text-secondary"
          >
            I&apos;m a full stack and cloud engineer who designs production-grade systems &mdash;
            from web platforms to embedded IoT &mdash; with the architectural discipline to keep
            them reliable as they grow.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-48 flex flex-wrap items-center gap-16">
            <Button href={SOCIAL_LINKS.email} variant="primary">
              Let&apos;s Work Together
            </Button>
            <Button href={SOCIAL_LINKS.github} variant="secondary" external>
              View GitHub
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-56 flex flex-wrap items-center gap-16">
            <AvailabilityBadge />
            <span className="inline-flex items-center gap-8 font-mono text-paragraph-sm text-text-tertiary">
              <MapPin className="size-16" aria-hidden />
              {PROFILE.location}
            </span>
          </motion.div>
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
