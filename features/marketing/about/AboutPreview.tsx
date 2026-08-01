"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, Code2, FileText, Layers, Router } from "lucide-react";
import Image from "next/image";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PROFILE } from "@/constants/profile";
import { ABOUT_INTRO, CORE_EXPERTISE, ENGINEERING_HIGHLIGHTS } from "@/content/about/about";
import type { EngineeringHighlight } from "@/content/about/about";
import { useResumeDialog } from "@/features/credibility/resume-center";
import aboutPortrait from "@/public/portrait/youssef-el-bajoury-about.jpeg";
import { PLATE_BORDER, PLATE_EDGES, PLATE_FILL, PLATE_GUIDE, RULE_COLOR } from "@/styles/material";

import type { LucideIcon } from "lucide-react";

const HIGHLIGHT_ICONS: Record<EngineeringHighlight["icon"], LucideIcon> = {
  fullstack: Code2,
  iot: Router,
  ai: BrainCircuit,
  product: Layers,
};

/**
 * About.
 *
 * The portrait placeholder is drawn as a specimen plate rather than as a
 * dashed box with an avatar in it — the same 4:5 plate, the same registration
 * target, the same material as the one the Hero mounts. An empty plate is a
 * finished state; a placeholder card is an unfinished one, and the difference
 * is entirely in whether the empty box is drawn to the same standard as the
 * full one.
 */
export function AboutPreview() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);
  const resume = useResumeDialog();

  return (
    <SectionShell id="about" labelledBy="about-title">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="02"
            kicker="About Me"
            titleId="about-title"
            title="An engineer who thinks in systems."
          />
        </motion.div>

        <div className="mt-48 grid grid-cols-1 gap-48 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-64">
          <div>
            <motion.p
              variants={item}
              className="max-w-readable text-paragraph-lg text-text-secondary"
            >
              {ABOUT_INTRO}
            </motion.p>

            <motion.div variants={item} className="mt-32">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
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

            {/* Two controls and a note, and the order is the point: the one
                that does not work yet is stated first and immediately answered
                by one that does. The resume is the site's own primary button —
                the same object the contact card closes with — because a reader
                who has read this far and wants more is being offered the real
                document, not a placeholder. */}
            <motion.div variants={item} className="mt-40">
              <div className="flex flex-col items-start gap-16">
                <Button variant="secondary" size="sm" disabled>
                  Learn More About Me
                </Button>
                <Button variant="primary" size="sm" onClick={resume.open}>
                  <FileText className="size-16" strokeWidth={1.25} aria-hidden />
                  View Resume
                </Button>
              </div>
              <p className="mt-12 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                Full About page coming soon.
              </p>
            </motion.div>
          </div>

          <motion.div variants={item} className="mx-auto w-full max-w-[20rem]">
            <PortraitPlate />
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="mt-64 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ENGINEERING_HIGHLIGHTS.map((highlight) => {
            const Icon = HIGHLIGHT_ICONS[highlight.icon];
            return (
              <Card key={highlight.label} className="flex items-center gap-12 p-20">
                {/* Hairline stroke, matching the frame rules. The icons used to
                    be set in the accent, which put sixteen saturated marks on a
                    page that allows one per composition. */}
                <Icon
                  className="size-20 shrink-0 text-text-tertiary"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <span className="text-paragraph-sm font-medium text-text-primary">
                  {highlight.label}
                </span>
              </Card>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Absent from the DOM until it is opened, and remounted on every open —
          see useResumeDialog. It renders a native modal <dialog>, so it is
          promoted to the top layer and nothing about where it sits in this tree
          affects where it appears. */}
      {resume.dialog}
    </SectionShell>
  );
}

/**
 * The portrait plate — 4:5, a figure caption above, a museum label below.
 *
 * The plate was drawn empty first and mounting the photograph moved nothing:
 * the box was always a fixed 4:5, so the page's layout is identical with and
 * without it. That is the whole reason the empty state was drawn as a
 * *registered* plate rather than as a placeholder box.
 *
 * The source is square (1600 × 1600) against a 4:5 plate, so cover trims about
 * a tenth off each side and nothing off the top or bottom. The subject is
 * centred in frame, so a centred crop keeps the head and shoulders whole.
 */
function PortraitPlate() {
  return (
    <figure className="w-full">
      <div className="mb-12 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
        <span>Fig. 02</span>
        {/* Tracked type is not flush right by default: 0.22em of letter space
            trails the final glyph. The negative margin returns it. */}
        <span aria-hidden className="-mr-[0.22em]">
          4 : 5
        </span>
      </div>

      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border"
        style={{ background: PLATE_FILL, borderColor: PLATE_BORDER, boxShadow: PLATE_EDGES }}
      >
        {/*
          Below the bleed guide, above nothing.

          The guide is a mark on the sheet and the portrait is what is mounted
          on it, so the trim line stays printed over the photograph exactly as
          it was printed over the empty plate — same as the Hero's. What went
          is the centre target: a crosshair is a registration aid for a plate
          with nothing on it, and a crosshair over a face is a defect.

          No `priority`. The page's one priority image is the Hero portrait,
          which is the LCP candidate; this plate is a full viewport below the
          fold and loads lazily with its own blur placeholder.
        */}
        <Image
          src={aboutPortrait}
          alt={`Portrait of ${PROFILE.name}`}
          fill
          placeholder="blur"
          /* The plate is capped at 20rem and sits in a 20rem grid track, so it
             never exceeds 320px — asking for the full-width source here would
             ship a 1600px image into a 320px box. */
          sizes="20rem"
          className="object-cover object-center"
        />

        {/* Bleed guide — the trim boundary inside the plate. */}
        <span
          aria-hidden
          className="absolute inset-[11px] rounded-[2px] border"
          style={{ borderColor: PLATE_GUIDE }}
        />
      </div>

      {/* The label sits outside the plate. A museum label is never printed on
          the artwork. The identity line is the one field that is a person
          rather than a catalogue entry, so it is the one line set in sans. */}
      <figcaption className="mt-16">
        <div aria-hidden className="h-px w-full" style={{ backgroundColor: RULE_COLOR }} />
        <p className="mt-12 text-paragraph-sm font-medium tracking-tight text-text-primary">
          {PROFILE.name}
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
          Software Engineer
        </p>
        <p className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
          {PROFILE.location}
        </p>
      </figcaption>
    </figure>
  );
}
