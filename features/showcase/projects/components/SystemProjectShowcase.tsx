"use client";

import { motion, useReducedMotion } from "framer-motion";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { TiltCard } from "@/components/shared/TiltCard";
import { CaseStudySurface, CaseStudyTrigger } from "@/features/showcase/case-studies";
import type { SystemShowcaseProject } from "@/types/project";

import { FeatureGrid } from "./FeatureGrid";
import { ProjectActions } from "./ProjectActions";
import { TechPill } from "./TechPill";

import type { CSSProperties } from "react";

interface SystemProjectShowcaseProps {
  project: SystemShowcaseProject;
}

/**
 * A project presented through its measured shape rather than a screenshot.
 *
 * AutoFlow and Morocco Retail are both systems whose strongest evidence is not
 * a picture: it is a schema, an OpenAPI contract, a test run, a set of
 * dashboards. Faking a browser render for either would be the one thing this
 * showcase refuses to do, so the tile leads with the numbers instead — a ruled
 * instrument panel where the other two tiles put a laptop.
 *
 * It is still a composition, not a table. Identity takes the left, evidence the
 * right, capabilities run full width beneath, and the case-study surface wraps
 * the metrics so the same shared-element transition lifts the panel out of a
 * meaningful object rather than a decorative one.
 */
export function SystemProjectShowcase({ project }: SystemProjectShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  const accentVars = {
    "--project-accent": project.accent.base,
    "--project-accent-bright": project.accent.bright,
    "--project-accent-rgb": project.accent.rgb,
  } as CSSProperties;

  const titleId = `project-${project.id}`;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={container}
      style={accentVars}
      className="grid grid-cols-1 gap-16 lg:grid-cols-12"
      aria-labelledby={titleId}
    >
      {/* Identity */}
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

            <h3 id={titleId} className="mt-32 text-h2 font-medium tracking-tight text-text-primary">
              {project.title}
            </h3>

            {/* Signature: the same engraved hairline the Rolex tile uses, in this
                project's own accent. It separates the name from the argument
                without adding an object. */}
            <div
              aria-hidden
              className="mt-24 h-px w-64 bg-gradient-to-r from-[var(--project-accent)] to-transparent"
            />

            <p className="mt-24 text-paragraph-sm leading-[1.75] text-text-secondary">
              {project.description}
            </p>

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

      {/* Evidence — the surface the case study is lifted out of */}
      <motion.div variants={item} className="lg:col-span-7">
        <CaseStudySurface slug={project.slug} className="h-full">
          <TiltCard className="h-full">
            <div className="flex h-full flex-col p-24 md:p-32">
              <div className="flex flex-wrap items-end justify-between gap-16">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                    System at a glance
                  </p>
                  <p className="mt-8 max-w-readable text-paragraph-sm text-text-secondary">
                    {project.metricNote}
                  </p>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--project-accent-bright)]">
                  Measured
                </span>
              </div>

              <ul className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-[rgba(255,255,255,0.06)] sm:grid-cols-3">
                {project.metrics.map((metric) => (
                  <li key={metric.label} className="bg-[#0c0d0f] px-16 py-20">
                    <p className="text-h4 font-medium tabular-nums tracking-tight text-[var(--project-accent-bright)]">
                      {metric.value}
                    </p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-text-tertiary">
                      {metric.label}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                Read the case study
              </p>
            </div>
          </TiltCard>

          <CaseStudyTrigger slug={project.slug} title={project.title} />
        </CaseStudySurface>
      </motion.div>

      {/* Capabilities */}
      <motion.div variants={item} className="lg:col-span-12">
        <TiltCard maxTilt={2.5} magnetism={4} glow={false}>
          <div className="p-24 md:p-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
              Capabilities
            </p>
            <FeatureGrid features={project.features} className="mt-16 lg:grid-cols-4" />
          </div>
        </TiltCard>
      </motion.div>
    </motion.article>
  );
}
