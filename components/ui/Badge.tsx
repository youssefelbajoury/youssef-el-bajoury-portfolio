import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "info";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/**
 * A specification chip — a field on a drawing, not a pill on a dashboard.
 *
 * Square-cornered (`rounded-sm`, matching the plate and the actions), mono,
 * hairline-bordered, and lit from the top like everything else: the 6% inset
 * highlight along the top edge is the same mark the panels carry, four steps
 * quieter because the object is 24px tall.
 *
 * Neutral is the only tone with a job on this page — the three coloured tones
 * exist for states that do not exist yet, so they stay defined and stay unused.
 * They carry a tinted hairline and tinted ink but no fill wash: a filled chip is
 * a saturated object, and the page allows one of those per composition.
 */
const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "border-[rgba(255,255,255,0.09)] text-text-secondary",
  success: "border-[color-mix(in_srgb,var(--color-success)_38%,transparent)] text-success",
  warning: "border-[color-mix(in_srgb,var(--color-warning)_38%,transparent)] text-warning",
  info: "border-[color-mix(in_srgb,var(--color-accent)_38%,transparent)] text-accent",
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border bg-[rgba(255,255,255,0.018)] px-12 py-4 font-mono text-badge tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
