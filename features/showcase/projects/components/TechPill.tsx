import type { ReactNode } from "react";

interface TechPillProps {
  children: ReactNode;
  /**
   * "quiet" for the in-flow stack list; "signal" for the small number of pills
   * that float over a screenshot and have to survive a busy background.
   */
  tone?: "quiet" | "signal";
  className?: string;
}

const TONE_CLASSES: Record<"quiet" | "signal", string> = {
  quiet:
    "border-white/[0.08] bg-white/[0.03] text-text-secondary hover:border-[rgb(var(--project-accent-rgb)/35%)] hover:text-text-primary",
  signal:
    "border-[rgb(var(--project-accent-rgb)/30%)] bg-[rgb(var(--project-accent-rgb)/10%)] text-[var(--project-accent-bright)] shadow-[0_8px_24px_-10px_rgba(0,0,0,0.9)] backdrop-blur-glass",
};

export function TechPill({ children, tone = "quiet", className = "" }: TechPillProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-12 py-4 font-mono text-badge tracking-wide transition-colors duration-medium ease-standard ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
