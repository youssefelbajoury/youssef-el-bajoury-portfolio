"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { SectionKicker } from "@/components/shared/SectionKicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PROFILE, SOCIAL_LINKS } from "@/constants/profile";

import type { Variants } from "framer-motion";

export function ContactPreview() {
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgb(46_230_255_/_9%),transparent_60%)]"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="relative mx-auto max-w-content px-24 py-96 text-center md:px-32"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <SectionKicker>Get In Touch</SectionKicker>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mx-auto mt-24 max-w-readable text-title font-semibold text-text-primary"
        >
          Let&apos;s Talk About What&apos;s Next
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-16 max-w-readable text-paragraph-lg text-text-secondary"
        >
          I&apos;m currently open to full-time opportunities where I can contribute as a full stack,
          IoT, or AI-focused engineer. If that sounds like a fit, I&apos;d love to hear from you.
        </motion.p>

        <motion.div variants={itemVariants} className="mx-auto mt-48 max-w-[28rem]">
          <Card hover={false} className="flex flex-col items-center gap-24 p-32">
            <AvailabilityBadge />

            <div className="flex flex-col items-center gap-12">
              <a
                href={SOCIAL_LINKS.email}
                className="inline-flex items-center gap-8 rounded-sm font-mono text-paragraph-sm text-text-secondary transition-colors duration-fast ease-standard hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Mail className="size-16" aria-hidden />
                {PROFILE.contactEmail}
              </a>
              <span className="inline-flex items-center gap-8 text-paragraph-sm text-text-secondary">
                <MapPin className="size-16" aria-hidden />
                {PROFILE.location}
              </span>
            </div>

            <Button href={SOCIAL_LINKS.email} variant="primary" className="w-full justify-center">
              Let&apos;s Build Something Great
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
