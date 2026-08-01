"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

import { GitHubGlyph } from "@/components/shared/BrandGlyphs";
import { useCaseStudyOpener } from "@/features/showcase/case-studies";
import {
  ACTION_GLASS,
  PRIMARY_ACTION_SHADOW,
  SECONDARY_ACTION_BORDER,
  SECONDARY_ACTION_BORDER_HOVER,
  SECONDARY_ACTION_SHADOW,
} from "@/styles/material";

import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react";

interface ProjectActionsProps {
  slug: string;
  title: string;
  repoUrl?: string;
  className?: string;
}

const MAGNETIC_PULL = 8;
const SPRING = { stiffness: 150, damping: 14, mass: 0.4 } as const;

/**
 * The showcase's own action pair rather than the shared `Button`, for two
 * reasons: these have to carry the per-project accent (a project-agnostic
 * button cannot), and the case-study action must be a `next/link` so the
 * placeholder route is prefetched and navigates client-side.
 *
 * The material is the page's, though — the same lit top bevel, shaded
 * underside and down-right shadow every action on the site carries, at the same
 * 8px radius, with the project's accent as the fill. What went was the halo:
 * `shadow-[0_0_24px_-6px_accent]`, growing to 40px on hover, which is a lamp
 * switching on inside the button. The page has one light source, in the upper
 * left, and a button is not allowed to be a second one.
 */
const ACTION_BASE =
  "inline-flex h-48 items-center gap-8 rounded-sm px-24 text-paragraph-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

export function ProjectActions({ slug, title, repoUrl, className = "" }: ProjectActionsProps) {
  const open = useCaseStudyOpener();

  /*
    A link that opens a modal, and it stays a link on purpose.

    The href points at the real /projects/<slug> route, and only the plain left
    click is intercepted. That costs three lines and keeps everything a modal
    normally throws away: the target has a URL, so it can be middle-clicked into
    a new tab, copied, opened in a new window, and followed by anything that
    reads links rather than running effects. Modifier clicks are handed straight
    to the browser — a reader who meant "open this somewhere else" gets that.
  */
  function handleOpen(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    open(slug);
  }

  return (
    <div className={`flex flex-wrap items-center gap-12 ${className}`}>
      <Magnetic>
        <Link
          href={`/projects/${slug}`}
          onClick={handleOpen}
          className={`${ACTION_BASE} relative overflow-hidden bg-[var(--project-accent)] text-background focus-visible:outline-[var(--project-accent)]`}
          style={{ boxShadow: PRIMARY_ACTION_SHADOW }}
        >
          {/* Glass, always on: the curvature of the surface, not a state. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: ACTION_GLASS }}
          />
          <span className="relative inline-flex items-center gap-8">
            Explore Case Study
            <ArrowRight className="size-16" strokeWidth={1.25} aria-hidden />
          </span>
          <span className="sr-only">for {title}</span>
        </Link>
      </Magnetic>

      {repoUrl ? (
        <Magnetic>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className={`${ACTION_BASE} border text-text-primary transition-colors duration-medium ease-premium hover:[border-color:var(--action-border-hover)] focus-visible:outline-border-strong`}
            style={
              {
                borderColor: SECONDARY_ACTION_BORDER,
                boxShadow: SECONDARY_ACTION_SHADOW,
                "--action-border-hover": SECONDARY_ACTION_BORDER_HOVER,
              } as CSSProperties
            }
          >
            <GitHubGlyph className="size-16" aria-hidden />
            GitHub
            <span className="sr-only">repository for {title}</span>
          </a>
        </Magnetic>
      ) : (
        /* No verified public repository yet — a disabled, labelled control
           beats a link that 404s. Adding `repoUrl` to the project data is the
           only change needed to activate it. */
        <span
          className={`${ACTION_BASE} cursor-not-allowed border bg-disabled-surface text-text-tertiary`}
          style={{ borderColor: SECONDARY_ACTION_BORDER }}
          title="Repository is not public yet"
        >
          <Lock className="size-16" strokeWidth={1.25} aria-hidden />
          GitHub
          <span className="sr-only">repository for {title} is not public yet</span>
        </span>
      )}
    </div>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  function handleMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * MAGNETIC_PULL);
    y.set(((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * MAGNETIC_PULL);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={prefersReducedMotion ? undefined : { x, y }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      /*
        `tabIndex={-1}` is not belt-and-braces — it undoes something.

        Framer Motion puts `tabIndex="0"` on any motion component carrying
        `whileTap` that is not already focusable, so that a press gesture can be
        driven from the keyboard. On a wrapper that is not the control that is
        exactly wrong: it added a second tab stop in front of every "Explore
        Case Study" link, on a bare <div> that does nothing when activated. A
        keyboard reader tabbed onto an invisible nothing, pressed Enter, got no
        response, and had to tab again to reach the real link.

        The gesture is not lost. The child <a> is focusable and activates
        normally; only the decorative wrapper has been taken out of the tab
        order, which is where a decorative wrapper belongs.
      */
      tabIndex={-1}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}
