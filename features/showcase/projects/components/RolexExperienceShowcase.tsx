"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { TiltCard } from "@/components/shared/TiltCard";
import { ROLEX_EXPERIENCE } from "@/data/projects/projects";
import { CaseStudySurface, CaseStudyTrigger } from "@/features/showcase/case-studies";

import { BrowserFrame } from "./BrowserFrame";
import { LaptopMockup } from "./LaptopMockup";
import { ProjectActions } from "./ProjectActions";
import { TechPill } from "./TechPill";

import type { CSSProperties } from "react";

const FLOATING = ["Editorial Layout", "Design System"] as const;

/**
 * Rolex Experience — the luxury personality of the pair, deliberately built as
 * the inverse of Smart Health Room rather than the same card retinted.
 *
 * Where the health platform leads with its render, this leads with words: the
 * identity panel takes the left, the screenshot follows, and the capability
 * list is set as hairline-ruled text with no icons, because boxed icon grids
 * are the opposite of retail restraint.
 *
 * IT NO LONGER SETS ITS OWN TYPE. The tile used to carry a serif display face
 * and 0.42em eyebrows, which made it the only place on the site with a third
 * typeface. The page has two voices and no more — SANS IS THE PERSON, MONO IS
 * THE MACHINE — and a project that opts out of that is a second design system
 * wearing the first one's layout. The restraint the brief is about now comes
 * from the composition and from the gold, which survives as ink: the eyebrow,
 * the capability ticks, the context chip. Not one of them emits.
 */
export function RolexExperienceShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);
  const project = ROLEX_EXPERIENCE;

  const accentVars = {
    "--project-accent": project.accent.base,
    "--project-accent-bright": project.accent.bright,
    "--project-accent-rgb": project.accent.rgb,
  } as CSSProperties;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={container}
      style={accentVars}
      className="grid grid-cols-1 gap-16 lg:grid-cols-12"
      aria-labelledby="project-rolex-experience"
    >
      {/* Identity — leads, rather than follows, the imagery */}
      <motion.div variants={item} className="lg:col-span-5">
        <TiltCard className="h-full" maxTilt={3.5}>
          <div className="flex h-full flex-col p-24 md:p-32">
            <div className="flex items-start justify-between gap-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--project-accent-bright)]">
                {project.discipline}
              </p>
              <div className="flex shrink-0 flex-wrap justify-end gap-8">
                <span className="rounded-sm border border-[rgb(var(--project-accent-rgb)/28%)] bg-[rgba(255,255,255,0.018)] px-12 py-4 font-mono text-badge tracking-wide text-[var(--project-accent-bright)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {project.context}
                </span>
                <span className="rounded-sm border border-[rgba(255,255,255,0.09)] px-12 py-4 font-mono text-badge tracking-wide text-text-tertiary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {project.year}
                </span>
              </div>
            </div>

            <h3
              id="project-rolex-experience"
              className="mt-32 text-h2 font-medium tracking-tight text-text-primary"
            >
              {project.title}
            </h3>

            {/* Signature: engraved gold hairline */}
            <div
              aria-hidden
              className="mt-24 h-px w-64 bg-gradient-to-r from-[var(--project-accent)] to-transparent"
            />

            <p className="mt-24 text-paragraph-sm leading-[1.75] text-text-secondary">
              {project.description}
            </p>

            {/* Capability list — hairline-ruled type, no icons */}
            <ul className="mt-32 grid grid-cols-1 gap-x-24 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-baseline gap-12 border-t border-[rgba(255,255,255,0.06)] py-12"
                >
                  <span
                    aria-hidden
                    className="h-px w-8 shrink-0 translate-y-[-4px] bg-[rgb(var(--project-accent-rgb)/70%)]"
                  />
                  <span className="text-paragraph-sm text-text-secondary">{feature.label}</span>
                </li>
              ))}
            </ul>

            <ProjectActions
              slug={project.slug}
              title={project.title}
              repoUrl={project.repoUrl}
              className="mt-auto pt-32"
            />
          </div>
        </TiltCard>
      </motion.div>

      {/* Collection landing — and the surface the case study is lifted out of. */}
      <motion.div variants={item} className="lg:col-span-7">
        <CaseStudySurface slug={project.slug} className="h-full">
          <TiltCard className="h-full">
            <div className="relative flex h-full flex-col justify-center p-24 md:p-32">
              <LaptopMockup
                shot={project.shots.hero}
                reflection
                sizes="(min-width: 1024px) 55vw, 92vw"
              />

              {FLOATING.map((tech, index) => (
                <span
                  key={tech}
                  className={`pointer-events-none absolute ${
                    index === 0
                      ? "left-20 top-24 animate-float-soft"
                      : "bottom-40 right-20 animate-float-soft-late"
                  }`}
                >
                  <TechPill tone="signal">{tech}</TechPill>
                </span>
              ))}
            </div>
          </TiltCard>

          <CaseStudyTrigger slug={project.slug} title={project.title} />
        </CaseStudySurface>
      </motion.div>

      {/* Product plate — a single watch, spotlit, as a retail display would */}
      <motion.div variants={item} className="lg:col-span-4">
        <TiltCard className="h-full" maxTilt={4}>
          <div className="flex h-full flex-col p-24 md:p-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
              Product Page
            </p>

            {project.shots.tertiary ? (
              <div className="relative mt-24 flex-1 overflow-hidden rounded-sm border border-[rgba(255,255,255,0.09)]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={project.shots.tertiary.src}
                    alt={project.shots.tertiary.alt}
                    fill
                    /* Deliberately far wider than the tile: a landscape capture
                       cropped into a 4:5 portrait shows only ~40% of its width,
                       so requesting the tile's own width would upscale the
                       dial roughly 2x. */
                    sizes="(min-width: 1024px) 56vw, 92vw"
                    placeholder="blur"
                    /* Centred, like every image on the site that is not a
                       full-page website capture. The old 54% / 55% was a
                       hand-nudged crop of the dial, and a hand-nudged crop is a
                       value nobody can re-derive when the screenshot is
                       replaced — it survives exactly as long as this one file. */
                    className="object-cover object-center transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.05]"
                  />
                  {/* Spotlight — a soft warm pool over the dial */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_16%,rgba(255,255,255,0.10),transparent_62%)]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.55)]"
                  />
                </div>
              </div>
            ) : null}

            <ul className="mt-24 flex flex-wrap gap-8">
              {project.technologies.slice(0, 3).map((tech) => (
                <li key={tech}>
                  <TechPill>{tech}</TechPill>
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>
      </motion.div>

      {/* Model index */}
      <motion.div variants={item} className="lg:col-span-8">
        <TiltCard className="h-full" maxTilt={2.5} magnetism={4}>
          <div className="flex h-full flex-col p-24 md:p-32">
            <div className="mb-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                Model Index
              </p>
              <p className="mt-8 max-w-readable text-paragraph-sm text-text-secondary">
                A filterable catalogue where whitespace and pacing carry the brand, and the
                interface stays out of the product&apos;s way.
              </p>
            </div>

            <BrowserFrame
              shot={project.shots.secondary}
              label="/watches/all-models"
              aspect="aspect-[16/8]"
              sizes="(min-width: 1024px) 52vw, 92vw"
            />
          </div>
        </TiltCard>
      </motion.div>
    </motion.article>
  );
}
