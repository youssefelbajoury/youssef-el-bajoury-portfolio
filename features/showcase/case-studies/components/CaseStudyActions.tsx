import { GitHubGlyph } from "@/components/shared/BrandGlyphs";
import {
  ACTION_GLASS,
  PRIMARY_ACTION_SHADOW,
  SECONDARY_ACTION_BORDER,
  SECONDARY_ACTION_BORDER_HOVER,
  SECONDARY_ACTION_SHADOW,
} from "@/styles/material";

import type { CSSProperties, ReactNode } from "react";

interface CaseStudyActionsProps {
  title: string;
  repoUrl?: string;
  liveUrl?: string;
}

const ACTION_BASE =
  "inline-flex h-48 items-center gap-8 rounded-sm px-24 text-paragraph-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

/**
 * The two ways out of the case study.
 *
 * Built from the page's own action material — a lit top bevel, a shaded
 * underside, a shadow thrown down and to the right — so the buttons that end a
 * case study are the same objects as the buttons that opened it. No halo: the
 * accent here is the fill of a surface catching the light, never a lamp.
 *
 * A MISSING URL RENDERS A DISABLED, LABELLED CONTROL rather than disappearing.
 * An absent Live Demo is information — it says the project is not deployed —
 * where a quietly missing button says nothing and a dead link lies. Adding the
 * URL in data/projects/projects.ts is the only change needed to activate either.
 */
export function CaseStudyActions({ title, repoUrl, liveUrl }: CaseStudyActionsProps) {
  const secondaryStyle = {
    borderColor: SECONDARY_ACTION_BORDER,
    boxShadow: SECONDARY_ACTION_SHADOW,
    "--action-border-hover": SECONDARY_ACTION_BORDER_HOVER,
  } as CSSProperties;

  return (
    <div className="flex flex-wrap items-center gap-12">
      {repoUrl ? (
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          style={secondaryStyle}
          className={`${ACTION_BASE} border text-text-primary transition-colors duration-medium ease-premium hover:[border-color:var(--action-border-hover)] focus-visible:outline-border-strong`}
        >
          <GitHubGlyph className="size-16" aria-hidden />
          GitHub
          <span className="sr-only">repository for {title}, opens in a new tab</span>
        </a>
      ) : (
        <Unavailable reason="Repository is not public yet">
          <GitHubGlyph className="size-16" aria-hidden />
          GitHub
          <span className="sr-only">repository for {title} is not public yet</span>
        </Unavailable>
      )}

      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          style={{ boxShadow: PRIMARY_ACTION_SHADOW }}
          className={`${ACTION_BASE} relative overflow-hidden bg-[var(--project-accent)] text-background focus-visible:outline-[var(--project-accent)]`}
        >
          {/* Glass, always on: the curvature of the surface, not a state. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: ACTION_GLASS }}
          />
          <span className="relative inline-flex items-center gap-8">
            <ArrowIcon />
            Live Demo
          </span>
          <span className="sr-only">of {title}, opens in a new tab</span>
        </a>
      ) : (
        <Unavailable reason="No public deployment yet">
          <ArrowIcon />
          Live Demo
          <span className="sr-only">for {title} is not available yet</span>
        </Unavailable>
      )}
    </div>
  );
}

/** A control that is deliberately not a control: no href, no tab stop, no lie. */
function Unavailable({ reason, children }: { reason: string; children: ReactNode }) {
  return (
    <span
      title={reason}
      style={{ borderColor: SECONDARY_ACTION_BORDER }}
      className={`${ACTION_BASE} cursor-not-allowed border bg-disabled-surface text-text-tertiary`}
    >
      {children}
    </span>
  );
}

/**
 * Hairline stroke, matching the frame rules and the crop marks. An icon set's
 * default 2px stroke would be the heaviest line in the viewer.
 */
function ArrowIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}
