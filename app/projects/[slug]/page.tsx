import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CropMarks, FrameRule } from "@/components/shared/PageFrame";
import { SectionKicker } from "@/components/shared/SectionKicker";
import { Badge } from "@/components/ui/Badge";
import { SHOWCASE_PROJECTS } from "@/data/projects/projects";
import { CaseStudyActions } from "@/features/showcase/case-studies/components/CaseStudyActions";
import {
  ArchitectureStack,
  CaseStudySection,
  MetricsGrid,
  Notes,
  PendingNote,
  pendingSections,
} from "@/features/showcase/case-studies/components/CaseStudySections";
import { FeatureGrid } from "@/features/showcase/projects/components/FeatureGrid";
import { RULE_COLOR } from "@/styles/material";

import type { Metadata } from "next";
import type { CSSProperties } from "react";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * The standalone case study.
 *
 * The modal viewer is for a reader who is still on the home page; this route is
 * for a reader who followed a link, opened a new tab, or wants the whole
 * document at once. It renders the same source data and the same shared
 * sections as the viewer, so the two cannot disagree.
 *
 * The gallery here is a full grid rather than the viewer's one-at-a-time stage:
 * on a long document a reader wants to scan every screenshot, not step through
 * them behind a fixed frame. The viewer keeps the stage because it has limited
 * height; the route does not.
 */
export function generateStaticParams() {
  return SHOWCASE_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = SHOWCASE_PROJECTS.find((entry) => entry.slug === slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — ${project.discipline}`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = SHOWCASE_PROJECTS.find((entry) => entry.slug === slug);

  if (!project) {
    notFound();
  }

  const accentVars = {
    "--project-accent": project.accent.base,
    "--project-accent-bright": project.accent.bright,
    "--project-accent-rgb": project.accent.rgb,
  } as CSSProperties;

  const { caseStudy } = project;
  const pending = pendingSections(caseStudy);
  const hasMetrics = Boolean(project.metrics && project.metrics.length > 0);

  return (
    <main style={accentVars}>
      <div className="mx-auto max-w-content px-24 py-96 md:px-32">
        <div className="relative">
          {/* The same drafted sheet every section on the home page is set on. */}
          <CropMarks />
          <FrameRule withTicks />

          <div className="py-56 md:py-72">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-8 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary transition-colors duration-medium ease-premium hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong"
            >
              <ArrowLeft className="size-16" strokeWidth={1.25} aria-hidden />
              Back to projects
            </Link>

            <header className="mt-48 max-w-readable">
              <SectionKicker>{project.discipline}</SectionKicker>

              <h1 className="mt-24 text-title font-medium tracking-tight text-text-primary">
                {project.title}
              </h1>

              <div className="mt-24 flex flex-wrap gap-8">
                <Badge className="border-[rgb(var(--project-accent-rgb)/28%)] text-[var(--project-accent-bright)]">
                  {project.context}
                </Badge>
                <Badge className="text-text-tertiary">{project.year}</Badge>
              </div>

              <p className="mt-32 text-paragraph-lg text-text-secondary">{project.description}</p>
            </header>

            {project.gallery.length > 0 ? (
              <section className="mt-64" aria-labelledby="screens-title">
                <div className="flex items-baseline justify-between gap-16">
                  <h2
                    id="screens-title"
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary"
                  >
                    Screens
                  </h2>
                  <span className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-text-tertiary">
                    {String(project.gallery.length).padStart(2, "0")}
                  </span>
                </div>

                <ul className="mt-24 grid grid-cols-1 gap-16 md:grid-cols-2">
                  {project.gallery.map((shot, index) => (
                    <li
                      key={shot.alt}
                      className="overflow-hidden rounded-sm border"
                      style={{
                        borderColor: RULE_COLOR,
                        background: "rgba(255,255,255,0.012)",
                      }}
                    >
                      <figure>
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          placeholder="blur"
                          className="h-auto w-full"
                        />
                        <figcaption
                          className="flex items-baseline gap-12 border-t px-16 py-12"
                          style={{ borderColor: RULE_COLOR }}
                        >
                          <span
                            aria-hidden
                            className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-text-tertiary"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {shot.caption ? (
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--project-accent-bright)]">
                              {shot.caption}
                            </span>
                          ) : null}
                          <span className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                            Screen {index + 1} of {project.gallery.length}
                          </span>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-64 grid grid-cols-1 gap-48 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-64">
              <div className="max-w-readable">
                {hasMetrics && project.metrics ? (
                  <CaseStudySection title="At a Glance">
                    <MetricsGrid metrics={project.metrics} note={project.metricNote} />
                  </CaseStudySection>
                ) : null}

                <CaseStudySection title="Tech Stack">
                  <ul className="flex flex-wrap gap-8">
                    {project.technologies.map((technology) => (
                      <li key={technology}>
                        <Badge>{technology}</Badge>
                      </li>
                    ))}
                  </ul>
                </CaseStudySection>

                {caseStudy.architecture.length > 0 ? (
                  <CaseStudySection title="Architecture">
                    <ArchitectureStack layers={caseStudy.architecture} />
                  </CaseStudySection>
                ) : null}

                <CaseStudySection title="Features">
                  <FeatureGrid features={project.features} />
                </CaseStudySection>

                {caseStudy.challenges.length > 0 ? (
                  <CaseStudySection title="Challenges">
                    <Notes items={caseStudy.challenges} />
                  </CaseStudySection>
                ) : null}

                {caseStudy.solutions.length > 0 ? (
                  <CaseStudySection title="Solutions">
                    <Notes items={caseStudy.solutions} />
                  </CaseStudySection>
                ) : null}

                {caseStudy.results.length > 0 ? (
                  <CaseStudySection title="Results">
                    <Notes items={caseStudy.results} />
                  </CaseStudySection>
                ) : null}

                {caseStudy.lessons.length > 0 ? (
                  <CaseStudySection title="Lessons Learned">
                    <Notes items={caseStudy.lessons} />
                  </CaseStudySection>
                ) : null}

                <PendingNote pending={pending} />

                <div className="mt-48 border-t pt-32" style={{ borderColor: RULE_COLOR }}>
                  <CaseStudyActions
                    title={project.title}
                    repoUrl={project.repoUrl}
                    liveUrl={project.liveUrl}
                  />
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <dl className="border-t" style={{ borderColor: RULE_COLOR }}>
                  {[
                    { label: "Discipline", value: project.discipline },
                    { label: "Context", value: project.context },
                    { label: "Year", value: project.year },
                    {
                      label: "Screens",
                      value: project.gallery.length > 0 ? String(project.gallery.length) : "—",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-16 border-b py-16"
                      style={{ borderColor: RULE_COLOR }}
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                        {row.label}
                      </dt>
                      <dd className="text-right font-mono text-[11px] tracking-[0.14em] text-text-primary">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>

          <FrameRule />
        </div>
      </div>
    </main>
  );
}
