"use client";

import { SectionKicker } from "@/components/shared/SectionKicker";
import { Badge } from "@/components/ui/Badge";
import { FeatureGrid } from "@/features/showcase/projects/components/FeatureGrid";
import { RULE_COLOR } from "@/styles/material";
import type { ArchitectureLayer, ProjectCaseStudy, ShowcaseProject } from "@/types/project";

import { CaseStudyActions } from "./CaseStudyActions";

import type { CSSProperties, ReactNode } from "react";

/**
 * The hatch on a reserved area.
 *
 * 135°, which is the direction of the one light this whole site is lit from, so
 * the fill agrees with every bevel and cast shadow around it rather than
 * introducing a second angle. 3.5% white: the lines are found by looking, never
 * seen at a glance, and they never compete with the sentence printed over them.
 * Wide spacing (10px) because a tight hatch reads as a texture where a loose one
 * reads as a drawing.
 */
const RESERVED_HATCH =
  "repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 10px)";

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
 */
export function CaseStudyPanel({ project, titleId }: CaseStudyPanelProps) {
  const { caseStudy } = project;
  const pending = pendingSections(caseStudy);

  /*
    The stagger, as a list of what is actually on screen.

    Six of the blocks below are conditional, so the indices cannot be literals —
    a project with an architecture and no challenges would leave a hole in the
    cadence and every block after it would arrive a beat late for no reason.
    Deriving the order first and looking positions up in it keeps the sequence
    contiguous whatever the project happens to carry.
  */
  const order = [
    "kicker",
    "title",
    "badges",
    "description",
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
    <div className="px-24 pb-96 pt-48 lg:col-span-5 lg:px-48 lg:pt-64">
      {/*
        `in`, unconditionally — the same attribute the sections use for their
        scroll reveal, but here there is nothing to wait for: the panel only
        exists while the viewer is open, so it mounts already on screen and the
        stagger runs once, on arrival. One keyframe and one delay rule serve both
        surfaces (styles/globals.css).
      */}
      <div data-reveal="in" className="max-w-readable">
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

        <Section title="Tech Stack" style={at("technologies")}>
          {/* Every one of them, unlike the showcase tile, which shows a handful
              and says the full stack belongs here. This is here. */}
          <ul className="flex flex-wrap gap-8">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <Badge>{technology}</Badge>
              </li>
            ))}
          </ul>
        </Section>

        {caseStudy.architecture.length > 0 ? (
          <Section title="Architecture" style={at("architecture")}>
            <ArchitectureStack layers={caseStudy.architecture} />
          </Section>
        ) : null}

        <Section title="Features" style={at("features")}>
          {/* The showcase's own grid, icons and all — a second visual language
              for the same six labels would be the tell that this was bolted on. */}
          <FeatureGrid features={project.features} />
        </Section>

        {caseStudy.challenges.length > 0 ? (
          <Section title="Challenges" style={at("challenges")}>
            <Notes items={caseStudy.challenges} />
          </Section>
        ) : null}

        {caseStudy.solutions.length > 0 ? (
          <Section title="Solutions" style={at("solutions")}>
            <Notes items={caseStudy.solutions} />
          </Section>
        ) : null}

        {caseStudy.results.length > 0 ? (
          <Section title="Results" style={at("results")}>
            <Notes items={caseStudy.results} />
          </Section>
        ) : null}

        {caseStudy.lessons.length > 0 ? (
          <Section title="Lessons Learned" style={at("lessons")}>
            <Notes items={caseStudy.lessons} />
          </Section>
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

/**
 * One block of the write-up.
 *
 * The rule above it is what separates the sections — at this width a heading
 * alone is not enough separation, and a card around each one would turn a
 * continuous read into eight boxes. The label is the site's mono register at
 * 11px, the same specification every field on the page is set in.
 */
function Section({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{ ...style, borderColor: RULE_COLOR }} className="mt-48 border-t pt-32">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
        {title}
      </h3>
      <div className="mt-20">{children}</div>
    </section>
  );
}

/**
 * The architecture, top-down and numbered.
 *
 * Hairlines come from a 1px gap over a rule-coloured background rather than
 * per-row borders, which is how FeatureGrid draws the same idea — it collapses
 * the doubled edge between neighbours without anyone having to remember which
 * row is last.
 */
function ArchitectureStack({ layers }: { layers: ArchitectureLayer[] }) {
  return (
    <ol className="space-y-px overflow-hidden rounded-sm bg-[rgba(255,255,255,0.06)]">
      {layers.map((layer, layerIndex) => (
        <li key={layer.name} className="flex gap-16 bg-[#0c0d0f] px-16 py-16">
          <span
            aria-hidden
            className="font-mono text-[11px] tabular-nums leading-6 text-text-tertiary"
          >
            {String(layerIndex + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--project-accent-bright)]">
              {layer.name}
            </p>
            <p className="mt-8 text-paragraph-sm text-text-secondary">{layer.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Challenges, solutions, results and lessons all read as one-idea entries. */
function Notes({ items }: { items: string[] }) {
  return (
    <ul className="space-y-16">
      {items.map((item) => (
        <li key={item} className="flex gap-12 text-paragraph text-text-secondary">
          {/* A drawn tick on the rule, not a coloured disc — the same mark the
              Rolex tile's capability list uses. Optically centred on the first
              line: the paragraph's line box is 26px tall, so it sits at 12. */}
          <span
            aria-hidden
            className="mt-12 h-px w-8 shrink-0 bg-[rgb(var(--project-accent-rgb)/70%)]"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Which parts of the write-up have not been written.
 *
 * Derived in the panel rather than inside the note, because the answer decides
 * two separate things: whether the note renders at all, and whether it occupies
 * a place in the entrance stagger. One source for both.
 */
function pendingSections(caseStudy: ProjectCaseStudy): string[] {
  return [
    caseStudy.architecture.length === 0 ? "architecture" : null,
    caseStudy.challenges.length === 0 ? "challenges" : null,
    caseStudy.solutions.length === 0 ? "solutions" : null,
    caseStudy.results.length === 0 ? "results" : null,
    caseStudy.lessons.length === 0 ? "lessons learned" : null,
  ].filter((entry): entry is string => entry !== null);
}

/**
 * What is still being written, named.
 *
 * It disappears on its own — the moment every list in case-studies.ts has an
 * entry there is nothing to report and nothing renders. Naming the sections
 * rather than gesturing at them is the point: it tells a reader exactly what is
 * coming, and it is the author's checklist.
 */
function PendingNote({ pending, style }: { pending: string[]; style?: CSSProperties }) {
  if (pending.length === 0) return null;

  const single = pending.length === 1;
  const list = single
    ? pending[0]
    : `${pending.slice(0, -1).join(", ")} and ${pending[pending.length - 1]}`;

  return (
    /*
      A reserved plate, not a dashed box.

      A dashed border is what every component library hands you for "empty", and
      it says the content is missing. A drafting sheet says something else about
      the same square of space: hatched and cornered means *reserved* —
      allocated, not yet printed. Same information, and it reads as a decision
      rather than as a gap.

      Three marks, all from the vocabulary already on this site: the section's
      own hairline, the Hero's registration corners, and a 135° hatch running
      with the one light source everything else here is lit by.
    */
    <div
      style={{ ...style, backgroundImage: RESERVED_HATCH, borderColor: RULE_COLOR }}
      className="relative mt-48 rounded-sm border p-24"
    >
      <ReservedCorners />

      <p className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.24em] text-text-tertiary">
        <span aria-hidden className="h-px w-8 shrink-0 bg-[rgb(var(--project-accent-rgb)/70%)]" />
        Reserved
      </p>
      <p className="mt-16 text-paragraph-sm text-text-secondary">
        The {list} {single ? "section" : "sections"} of this write-up {single ? "is" : "are"} still
        being written, and {single ? "is" : "are"} left out above rather than filled in with
        placeholder text.
      </p>
    </div>
  );
}

/**
 * Registration corners on the reserved plate.
 *
 * The Hero's crop marks, at a quarter of the length and set inside the box
 * rather than outside it: outside they trim a sheet, inside they bracket an
 * area. Four separate spans rather than a border, because a border draws all
 * four sides and the whole point is that only the corners are drawn.
 */
function ReservedCorners() {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 text-[rgba(255,255,255,0.16)]">
      {corners.map((corner) => (
        <span key={corner} className={`absolute size-8 border-current ${corner}`} />
      ))}
    </div>
  );
}
