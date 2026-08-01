"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { TiltCard } from "@/components/shared/TiltCard";
import { SMART_HEALTH_ROOM } from "@/data/projects/projects";
import { CaseStudySurface, CaseStudyTrigger } from "@/features/showcase/case-studies";

import { BrowserFrame } from "./BrowserFrame";
import { FeatureGrid } from "./FeatureGrid";
import { LaptopMockup } from "./LaptopMockup";
import { ProjectActions } from "./ProjectActions";
import { TechPill } from "./TechPill";

import type { CSSProperties } from "react";

/**
 * Pills lifted out of the stack list to float over the hero shot. Kept to two,
 * pinned to opposite corners: a third sat over the render itself and obscured
 * the mobile assistant panel, which is the most legible part of the image.
 */
const FLOATING = ["ESP32", "Real-time Telemetry"] as const;

/**
 * Smart Health Room — the engineering personality of the pair.
 *
 * Image-dominant and left-weighted: the hero shot spans two rows so the
 * ecosystem render carries the tile, with the identity and capability panels
 * stacked to its right. The signature is the telemetry rail — a hairline with
 * pulsing nodes, used because this project literally is a sensor network
 * reporting upstream, not because a card needed decoration.
 */
export function SmartHealthRoomShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);
  const project = SMART_HEALTH_ROOM;

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
      aria-labelledby="project-smart-health-room"
    >
      {/* Hero — the ecosystem render, presented as a machine, and the surface
          the case study is lifted out of. The trigger is laid over the tile
          rather than wrapped around it: <a> takes phrasing content and this is
          a figure holding pills and an image. */}
      <motion.div variants={item} className="lg:col-span-7 lg:row-span-2">
        <CaseStudySurface slug={project.slug} className="h-full">
          <TiltCard className="h-full">
            <div className="relative flex h-full flex-col justify-center p-24 md:p-32">
              {/* No `priority`: the page's only priority image is the Hero
                  portrait, which is its LCP candidate. This tile is a full
                  viewport below the fold, so preloading it competes with the
                  one image the reader is actually looking at. */}
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
                      ? "right-20 top-24 animate-float-soft"
                      : "bottom-40 left-20 animate-float-soft-late"
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

      {/* Identity */}
      <motion.div variants={item} className="lg:col-span-5">
        <TiltCard className="h-full" maxTilt={3.5}>
          <div className="flex h-full flex-col p-24 md:p-32">
            {/* Signature: telemetry rail */}
            <div aria-hidden className="mb-24 flex items-center gap-8">
              <span className="size-4 rounded-full bg-[var(--project-accent)] animate-node-pulse" />
              <span className="size-4 rounded-full bg-[var(--project-accent)] animate-node-pulse-slow" />
              <span className="h-px flex-1 bg-gradient-to-r from-[rgb(var(--project-accent-rgb)/45%)] to-transparent" />
              <span className="font-mono text-tooltip uppercase tracking-[0.28em] text-text-tertiary">
                Live System
              </span>
            </div>

            <div className="flex items-start justify-between gap-16">
              {project.logo ? (
                <div className="overflow-hidden rounded-md border border-white/[0.08]">
                  <Image
                    src={project.logo.src}
                    alt={project.logo.alt}
                    width={76}
                    height={44}
                    /* Intrinsic dimensions rather than `fill`, so the box is
                       reserved before the bytes arrive and the row cannot
                       reflow around it. */
                    placeholder="blur"
                    className="h-[44px] w-[76px] object-cover object-center"
                  />
                </div>
              ) : null}

              <div className="flex shrink-0 flex-wrap justify-end gap-8">
                <span className="rounded-sm border border-[rgb(var(--project-accent-rgb)/28%)] bg-[rgba(255,255,255,0.018)] px-12 py-4 font-mono text-badge tracking-wide text-[var(--project-accent-bright)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {project.context}
                </span>
                <span className="rounded-sm border border-[rgba(255,255,255,0.09)] px-12 py-4 font-mono text-badge tracking-wide text-text-tertiary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {project.year}
                </span>
              </div>
            </div>

            <p className="mt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--project-accent)]">
              {project.discipline}
            </p>

            <h3
              id="project-smart-health-room"
              className="mt-12 text-h3 font-semibold tracking-tight text-text-primary"
            >
              {project.title}
            </h3>

            <p className="mt-16 text-paragraph-sm text-text-secondary">{project.description}</p>

            <ul className="mt-24 flex flex-wrap gap-8">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <TechPill>{tech}</TechPill>
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

      {/* Capabilities */}
      <motion.div variants={item} className="lg:col-span-5">
        <TiltCard className="h-full" maxTilt={3} glow={false}>
          <div className="flex h-full flex-col p-24 md:p-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
              Capabilities
            </p>
            <FeatureGrid features={project.features} className="mt-16" />
          </div>
        </TiltCard>
      </motion.div>

      {/* Ecosystem strip — the hardware-to-dashboard view, full bleed */}
      <motion.div variants={item} className="lg:col-span-12">
        <TiltCard maxTilt={2.5} magnetism={4}>
          <div className="p-24 md:p-32">
            <div className="mb-24 flex flex-wrap items-end justify-between gap-16">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                  End to end
                </p>
                <p className="mt-8 max-w-readable text-paragraph-sm text-text-secondary">
                  Control hardware, the web platform, the mobile companion, and the analytics view
                  are one system — not four demos.
                </p>
              </div>
            </div>

            <BrowserFrame
              shot={project.shots.secondary}
              label="/dashboard"
              aspect="aspect-[21/8]"
              sizes="(min-width: 1024px) 76vw, 92vw"
            />
          </div>
        </TiltCard>
      </motion.div>
    </motion.article>
  );
}
