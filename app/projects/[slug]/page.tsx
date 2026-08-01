import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CropMarks, FrameRule } from "@/components/shared/PageFrame";
import { SectionKicker } from "@/components/shared/SectionKicker";
import { SHOWCASE_PROJECTS } from "@/data/projects/projects";
import { STATUS_LENS, STATUS_LENS_SHADOW } from "@/styles/material";

import type { Metadata } from "next";
import type { CSSProperties } from "react";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Placeholder case study.
 *
 * Deliberately structural only — the route exists so "Explore Case Study"
 * navigates somewhere real, and the page states plainly that the write-up is
 * still being written rather than padding itself with invented sections.
 *
 * One dynamic segment serves both projects, driven by the same data the
 * showcase renders from, so a third project needs no new route.
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

            <div className="mt-48 max-w-readable">
              <SectionKicker>{project.discipline}</SectionKicker>

              <h1 className="mt-24 text-title font-medium tracking-tight text-text-primary">
                {project.title}
              </h1>

              <div className="mt-24 flex flex-wrap gap-8">
                <span className="rounded-sm border border-[rgb(var(--project-accent-rgb)/28%)] bg-[rgba(255,255,255,0.018)] px-12 py-4 font-mono text-badge tracking-wide text-[var(--project-accent-bright)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {project.context}
                </span>
                <span className="rounded-sm border border-[rgba(255,255,255,0.09)] px-12 py-4 font-mono text-badge tracking-wide text-text-tertiary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {project.year}
                </span>
              </div>

              <p className="mt-32 text-paragraph-lg text-text-secondary">{project.description}</p>
            </div>

            <div
              className="mt-64 rounded-sm border border-dashed p-32"
              style={{
                borderColor: "rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.012)",
              }}
            >
              <p className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.24em] text-text-tertiary">
                <span
                  aria-hidden
                  className="size-[6px] shrink-0 rounded-full"
                  style={{ background: STATUS_LENS, boxShadow: STATUS_LENS_SHADOW }}
                />
                In Progress
              </p>
              <p className="mt-16 max-w-readable text-paragraph text-text-secondary">
                The full case study — problem, research, architecture, engineering decisions, and
                lessons learned — is being written. It will replace this page rather than sit
                alongside it.
              </p>
            </div>
          </div>

          <FrameRule />
        </div>
      </div>
    </main>
  );
}
