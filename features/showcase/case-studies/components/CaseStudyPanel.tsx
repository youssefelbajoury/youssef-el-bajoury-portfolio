"use client";

import { SectionKicker } from "@/components/shared/SectionKicker";
import { Badge } from "@/components/ui/Badge";
import { FeatureGrid } from "@/features/showcase/projects/components/FeatureGrid";
import { RULE_COLOR } from "@/styles/material";
import type { ShowcaseProject } from "@/types/project";

import { CaseStudyActions } from "./CaseStudyActions";
import {
  ArchitectureStack,
  CaseStudySection,
  MetricsGrid,
  Notes,
  PendingNote,
  pendingSections,
} from "./CaseStudySections";

import type { CSSProperties } from "react";

interface CaseStudyPanelProps {
  project: ShowcaseProject;
  titleId: string;
}

/**
 * The right half: everything about the project that is not a picture.
 *
 * THE ORDER IS THE ARGUMENT, and it narrows: what this is → what it is made of
 * → how it is put together → what it does → what it cost → what it produced →
 * the two ways out. A reader who stops after the first screen still leaves
 * knowing what the project is; one who reads to the end gets the engineering.
 *
 * EMPTY SECTIONS DO NOT RENDER. Architecture, challenges, solutions, results and
 * lessons are first-person claims with no source anywhere in this repository, so
 * they ship empty (see data/projects/case-studies.ts) and each appears the
 * moment it has an entry. In the meantime one note names the ones still being
 * written — the opposite of filling the space with prose nobody wrote, and the
 * position the site already takes everywhere else.
 *
 * A PROJECT WITH NO GALLERY TAKES THE WHOLE SHEET. The gallery is a grid cell
 * that renders nothing when a project has no screenshots, so the panel has to
 * stop being the right five columns in that case rather than leaving seven
 * columns of empty paper beside it.
 */
export function CaseStudyPanel({ project, titleId }: CaseStudyPanelProps) {
  const { caseStudy } = project;
  const pending = pendingSections(caseStudy);
  const hasMetrics = Boolean(project.metrics && project.metrics.length > 0);
  const fullWidth = project.gallery.length === 0;

  /*
    The stagger, as a list of what is actually on screen.

    Seven of the blocks below are conditional, so the indices cannot be literals
    — a project with an architecture and no challenges would leave a hole in the
    cadence and every block after it would arrive a beat late for no reason.
    Deriving the order first and looking positions up in it keeps the sequence
    contiguous whatever the project happens to carry.
  */
  const order = [
    "kicker",
    "title",
    "badges",
    "description",
    hasMetrics ? "metrics" : null,
    "technologies",
    caseStudy.architecture.length > 0 ? "architecture" : null,
    "features",
    caseStudy.challenges.length > 0 ? "challenges" : null,
    caseStudy.solutions.length > 0 ? "solutions" : null,
    caseStudy.results.length > 0 ? "results" : null,
    caseStudy.lessons.length > 0 ? "lessons" : null,
    pending.length > 0 ? "pending" : null,
    "actions",
  ].filter((block): block is string => block !== null);

  const at = (block: string) => ({ "--reveal-index": order.indexOf(block) }) as CSSProperties;

  return (
    <div
      className={`px-24 pb-96 pt-48 lg:px-48 lg:pt-64 ${
        fullWidth ? "lg:col-span-12" : "lg:col-span-5"
      }`}
    >
      {/*
        `in`, unconditionally — the same attribute the sections use for their
        scroll reveal, but here there is nothing to wait for: the panel only
        exists while the viewer is open, so it mounts already on screen and the
        stagger runs once, on arrival. One keyframe and one delay rule serve both
        surfaces (styles/globals.css).
      */}
      <div data-reveal="in" className={`max-w-readable ${fullWidth ? "mx-auto" : ""}`}>
        <SectionKicker style={at("kicker")}>{project.discipline}</SectionKicker>

        {/* The dialog's accessible name. Weight 500, not 600 — display type
            wants less weight as it gets larger. */}
        <h2
          id={titleId}
          style={at("title")}
          className="mt-16 text-h2 font-medium tracking-tight text-text-primary"
        >
          {project.title}
        </h2>

        <div style={at("badges")} className="mt-16 flex flex-wrap gap-8">
          <Badge className="border-[rgb(var(--project-accent-rgb)/28%)] text-[var(--project-accent-bright)]">
            {project.context}
          </Badge>
          <Badge className="text-text-tertiary">{project.year}</Badge>
        </div>

        <p style={at("description")} className="mt-32 text-paragraph-lg text-text-secondary">
          {project.description}
        </p>

        {hasMetrics && project.metrics ? (
          <CaseStudySection title="At a Glance" style={at("metrics")}>
            <MetricsGrid metrics={project.metrics} note={project.metricNote} />
          </CaseStudySection>
        ) : null}

        <CaseStudySection title="Tech Stack" style={at("technologies")}>
          {/* Every one of them, unlike the showcase tile, which shows a handful
              and says the full stack belongs here. This is here. */}
          <ul className="flex flex-wrap gap-8">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <Badge>{technology}</Badge>
              </li>
            ))}
          </ul>
        </CaseStudySection>

        {caseStudy.architecture.length > 0 ? (
          <CaseStudySection title="Architecture" style={at("architecture")}>
            <ArchitectureStack layers={caseStudy.architecture} />
          </CaseStudySection>
        ) : null}

        <CaseStudySection title="Features" style={at("features")}>
          {/* The showcase's own grid, icons and all — a second visual language
              for the same labels would be the tell that this was bolted on. */}
          <FeatureGrid features={project.features} />
        </CaseStudySection>

        {caseStudy.challenges.length > 0 ? (
          <CaseStudySection title="Challenges" style={at("challenges")}>
            <Notes items={caseStudy.challenges} />
          </CaseStudySection>
        ) : null}

        {caseStudy.solutions.length > 0 ? (
          <CaseStudySection title="Solutions" style={at("solutions")}>
            <Notes items={caseStudy.solutions} />
          </CaseStudySection>
        ) : null}

        {caseStudy.results.length > 0 ? (
          <CaseStudySection title="Results" style={at("results")}>
            <Notes items={caseStudy.results} />
          </CaseStudySection>
        ) : null}

        {caseStudy.lessons.length > 0 ? (
          <CaseStudySection title="Lessons Learned" style={at("lessons")}>
            <Notes items={caseStudy.lessons} />
          </CaseStudySection>
        ) : null}

        <PendingNote pending={pending} style={at("pending")} />

        <div style={{ ...at("actions"), borderColor: RULE_COLOR }} className="mt-48 border-t pt-32">
          <CaseStudyActions
            title={project.title}
            repoUrl={project.repoUrl}
            liveUrl={project.liveUrl}
          />
        </div>
      </div>
    </div>
  );
}
