"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FileCode2 } from "lucide-react";
import Image from "next/image";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ACADEMIC_MODULE, ACADEMIC_PROJECTS } from "@/data/academic/academic";
import { RULE_COLOR } from "@/styles/material";

/**
 * Academic work — the XML / DTD / XSLT exercises from the Data, XML et Web
 * Services module.
 *
 * It sits directly under Experience because it answers the same question that
 * section's education block opens: what has this person actually built in a
 * course, and can it be opened. The two differ in what they show. Experience
 * states roles; this states structure — a document, the schema that constrains
 * it, and the transform that renders it.
 *
 * WHY IT IS NOT IN THE DOCK. The dock carries five destinations, and a sixth
 * would overflow it on a narrow phone. `skills` is already reached by scrolling
 * rather than by the dock, and this section is read in the same pass as
 * Experience, immediately above it. A station here would add a control without
 * adding a way to reach anything new.
 *
 * THE SCREENSHOTS ARE RENDERED OUTPUT. Each one is the XSLT result committed
 * with its exercise, not a mockup, and the caption under the grid says so. The
 * section never presents a diagram or a concept illustration as a screen.
 */
export function AcademicSection() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  return (
    <SectionShell id="academic" labelledBy="academic-title" air="tall">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="04"
            kicker="Academic Work"
            titleId="academic-title"
            title="Four exercises, schema to screen."
            statement="Coursework from the Data, XML et Web Services module — an XML document, the DTD that constrains it, and the XSLT that renders it. Each exercise is a schema and the view built from it."
          />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-40 flex flex-wrap items-baseline justify-between gap-x-24 gap-y-8 border-t pt-20"
          style={{ borderColor: RULE_COLOR }}
        >
          <p className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
            <FileCode2
              className="size-16 shrink-0 text-text-tertiary"
              strokeWidth={1.25}
              aria-hidden
            />
            {ACADEMIC_MODULE.name}
          </p>

          <p className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
            {ACADEMIC_MODULE.programme}
            <span aria-hidden className="px-8 text-text-tertiary">
              ·
            </span>
            <a
              href={ACADEMIC_MODULE.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-4 text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong"
            >
              Repository
              <ArrowUpRight className="size-12" strokeWidth={1.25} aria-hidden />
            </a>
          </p>
        </motion.div>

        <div className="mt-40 grid grid-cols-1 gap-24 lg:grid-cols-2">
          {ACADEMIC_PROJECTS.map((project) => (
            <motion.div key={project.id} variants={item} className="h-full">
              <Card className="flex h-full flex-col overflow-hidden">
                <Image
                  src={project.screenshot}
                  alt={project.screenshotAlt}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="h-auto w-full border-b"
                  style={{ borderColor: RULE_COLOR }}
                />

                <div className="flex flex-1 flex-col p-24 md:p-32">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                    {project.code}
                  </p>

                  <h3 className="mt-8 text-h5 font-medium tracking-tight text-text-primary">
                    {project.title}
                  </h3>

                  <p className="mt-12 text-paragraph-sm leading-[1.75] text-text-secondary">
                    {project.summary}
                  </p>

                  <ul className="mt-20 space-y-12">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-12 text-paragraph-sm text-text-secondary"
                      >
                        <span
                          aria-hidden
                          className="mt-12 h-px w-8 shrink-0 bg-[rgba(255,255,255,0.24)]"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-20 flex flex-wrap gap-8">
                    {project.techniques.map((technique) => (
                      <li key={technique}>
                        <Badge>{technique}</Badge>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-24">
                    <div
                      aria-hidden
                      className="h-px w-full"
                      style={{ backgroundColor: RULE_COLOR }}
                    />
                    <Button
                      className="mt-24"
                      variant="secondary"
                      size="sm"
                      href={project.repoUrl}
                      external
                    >
                      View exercise
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={item}
          className="mt-24 font-mono text-[11px] tracking-[0.14em] text-text-tertiary"
        >
          Screenshots are the rendered XSLT output committed with each exercise.
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
