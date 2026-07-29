"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

import { GitHubGlyph } from "@/components/shared/BrandGlyphs";

import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

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
 */
export function ProjectActions({ slug, title, repoUrl, className = "" }: ProjectActionsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-12 ${className}`}>
      <Magnetic>
        <Link
          href={`/projects/${slug}`}
          className="inline-flex items-center gap-8 rounded-full bg-[var(--project-accent)] px-24 py-12 text-paragraph-sm font-semibold tracking-tight text-background shadow-[0_0_24px_-6px_rgb(var(--project-accent-rgb)/55%)] transition-shadow duration-medium ease-standard hover:shadow-[0_0_40px_-6px_rgb(var(--project-accent-rgb)/75%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--project-accent)]"
        >
          Explore Case Study
          <ArrowRight className="size-16" aria-hidden />
          <span className="sr-only">for {title}</span>
        </Link>
      </Magnetic>

      {repoUrl ? (
        <Magnetic>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-8 rounded-full border border-border px-24 py-12 text-paragraph-sm font-semibold tracking-tight text-text-primary transition-colors duration-medium ease-standard hover:border-[rgb(var(--project-accent-rgb)/45%)] hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong"
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
          className="inline-flex cursor-not-allowed items-center gap-8 rounded-full border border-border bg-disabled-surface px-24 py-12 text-paragraph-sm font-semibold tracking-tight text-text-tertiary"
          title="Repository is not public yet"
        >
          <Lock className="size-16" aria-hidden />
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
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}
