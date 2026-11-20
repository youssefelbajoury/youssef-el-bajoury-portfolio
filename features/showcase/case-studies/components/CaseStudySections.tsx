import { RULE_COLOR } from "@/styles/material";
import type { ArchitectureLayer, ProjectCaseStudy, ProjectMetric } from "@/types/project";

import type { CSSProperties, ReactNode } from "react";

/**
 * The written half of a case study, shared by the modal panel and the standalone
 * route.
 *
 * One implementation rather than two: the viewer and /projects/<slug> show the
 * same architecture, results and reserved sections, and the only way to keep
 * them from drifting is to render them from the same code. Everything here is
 * server-safe — no hooks, no motion — so the route can import it directly while
 * the client panel imports it into its own graph.
 */

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

/**
 * One block of the write-up.
 *
 * The rule above it is what separates the sections — at this width a heading
 * alone is not enough separation, and a card around each one would turn a
 * continuous read into eight boxes. The label is the site's mono register at
 * 11px, the same specification every field on the page is set in.
 */
export function CaseStudySection({
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
export function ArchitectureStack({ layers }: { layers: ArchitectureLayer[] }) {
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
export function Notes({ items }: { items: string[] }) {
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
 * The counted evidence, set as an instrument panel.
 *
 * A grid of values with a label under each, divided by the same 1px rules the
 * feature grid uses. It renders only when a project actually has metrics; the
 * screenshot-led tiles never grow an empty table.
 */
export function MetricsGrid({
  metrics,
  note,
  className = "",
}: {
  metrics: ProjectMetric[];
  note?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-[rgba(255,255,255,0.06)]">
        {metrics.map((metric) => (
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
      {note ? (
        <p className="mt-12 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-text-tertiary">
          {note}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Which parts of the write-up have not been written.
 *
 * Derived in the panel rather than inside the note, because the answer decides
 * two separate things: whether the note renders at all, and whether it occupies
 * a place in the entrance stagger. One source for both.
 */
export function pendingSections(caseStudy: ProjectCaseStudy): string[] {
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
export function PendingNote({ pending, style }: { pending: string[]; style?: CSSProperties }) {
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
