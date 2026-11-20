"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  GraduationCap,
  Languages,
  MapPin,
} from "lucide-react";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EDUCATION, EXPERIENCE, LANGUAGES, OPPORTUNITIES } from "@/data/experience/experience";
import { RULE_COLOR } from "@/styles/material";

/**
 * Experience, education, languages, and availability — one section because they
 * answer the same question.
 *
 * A recruiter reads these together: where has this person worked, what did they
 * study, what can they speak, and are they available. Splitting them into four
 * sections would make the page longer without making the answer any clearer, so
 * the record is set as one sheet with the professional entries leading.
 *
 * Every entry comes from data/experience/experience.ts. There are no proficiency
 * bars and no percentages: the page states the role, the institution, and the
 * stated language level, and lets a reader judge the rest.
 */
export function ExperienceSection() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  return (
    <SectionShell id="experience" labelledBy="experience-title" air="tall">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="03"
            kicker="Experience & Education"
            titleId="experience-title"
            title="The record so far."
            statement="Roles, study, languages, and the engagements I am open to next — stated plainly, with no inflated titles and no invented outcomes."
          />
        </motion.div>

        <div className="mt-64 grid grid-cols-1 gap-48 lg:grid-cols-12 lg:gap-64">
          <div className="lg:col-span-8">
            <motion.div variants={item}>
              <p className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                <Briefcase
                  className="size-16 shrink-0 text-text-tertiary"
                  strokeWidth={1.25}
                  aria-hidden
                />
                Professional Experience
              </p>

              <ol className="mt-24 space-y-24">
                {EXPERIENCE.map((entry) => (
                  <li key={entry.id}>
                    <Card className="p-24 md:p-32">
                      <div className="flex flex-wrap items-start justify-between gap-16">
                        <div className="min-w-0">
                          <h3 className="text-h5 font-medium tracking-tight text-text-primary">
                            {entry.role}
                          </h3>

                          <div className="mt-12 flex flex-wrap items-center gap-x-16 gap-y-8 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                            <span className="inline-flex items-center gap-8">
                              <Building2
                                className="size-16 shrink-0"
                                strokeWidth={1.25}
                                aria-hidden
                              />
                              {entry.company}
                            </span>
                            <span className="inline-flex items-center gap-8">
                              <MapPin className="size-16 shrink-0" strokeWidth={1.25} aria-hidden />
                              {entry.location}
                            </span>
                            <span className="inline-flex items-center gap-8">
                              <CalendarDays
                                className="size-16 shrink-0"
                                strokeWidth={1.25}
                                aria-hidden
                              />
                              {entry.period}
                            </span>
                          </div>
                        </div>

                        <Badge className="shrink-0">{entry.type}</Badge>
                      </div>

                      <div
                        aria-hidden
                        className="mt-24 h-px w-full"
                        style={{ backgroundColor: RULE_COLOR }}
                      />

                      <p className="mt-24 text-paragraph-sm leading-[1.75] text-text-secondary">
                        {entry.summary}
                      </p>

                      {entry.highlights.length > 0 ? (
                        <ul className="mt-20 space-y-12">
                          {entry.highlights.map((highlight) => (
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
                      ) : null}

                      {entry.technologies.length > 0 ? (
                        <ul className="mt-20 flex flex-wrap gap-8">
                          {entry.technologies.map((technology) => (
                            <li key={technology}>
                              <Badge>{technology}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div variants={item} className="mt-64">
              <p className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                <GraduationCap
                  className="size-16 shrink-0 text-text-tertiary"
                  strokeWidth={1.25}
                  aria-hidden
                />
                Education
              </p>

              <ol className="mt-24">
                {EDUCATION.map((entry) => (
                  <li key={entry.id} className="border-t py-24" style={{ borderColor: RULE_COLOR }}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-24 gap-y-8">
                      <h3 className="text-h6 font-medium tracking-tight text-text-primary">
                        {entry.programme}
                      </h3>
                      <span className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-text-tertiary">
                        {entry.period}
                      </span>
                    </div>

                    <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-text-secondary">
                      {entry.institution}
                      {entry.location ? ` · ${entry.location}` : ""}
                    </p>

                    {entry.focus && entry.focus.length > 0 ? (
                      <ul className="mt-12 flex flex-wrap gap-8">
                        {entry.focus.map((area) => (
                          <li key={area}>
                            <Badge>{area}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          <aside className="lg:col-span-4">
            <motion.div variants={item}>
              <Card className="p-24 md:p-32">
                <p className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                  <Languages
                    className="size-16 shrink-0 text-text-tertiary"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  Languages
                </p>

                <ul className="mt-24">
                  {LANGUAGES.map((entry) => (
                    <li
                      key={entry.language}
                      className="flex items-baseline justify-between gap-16 border-t py-16"
                      style={{ borderColor: RULE_COLOR }}
                    >
                      <span className="text-paragraph-sm font-medium text-text-primary">
                        {entry.language}
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                        {entry.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={item} className="mt-24">
              <Card className="p-24 md:p-32">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                  Open To
                </p>

                <ul className="mt-24 space-y-20">
                  {OPPORTUNITIES.map((entry) => (
                    <li key={entry.id} className="flex gap-12">
                      <BadgeCheck
                        className="mt-2 size-16 shrink-0 text-text-tertiary"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-paragraph-sm font-medium text-text-primary">
                          {entry.label}
                        </p>
                        <p className="mt-4 text-paragraph-sm leading-[1.7] text-text-secondary">
                          {entry.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div
                  aria-hidden
                  className="mt-24 h-px w-full"
                  style={{ backgroundColor: RULE_COLOR }}
                />

                <p className="mt-16 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                  Casablanca, Morocco
                </p>
              </Card>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </SectionShell>
  );
}
