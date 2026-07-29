import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "info";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface text-text-secondary",
  success:
    "border-[color-mix(in_srgb,var(--color-success)_45%,transparent)] text-success bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]",
  warning:
    "border-[color-mix(in_srgb,var(--color-warning)_45%,transparent)] text-warning bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]",
  info: "border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] text-accent bg-[color-mix(in_srgb,var(--color-accent)_12%,transparent)]",
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-12 py-4 font-mono text-badge tracking-wide ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
