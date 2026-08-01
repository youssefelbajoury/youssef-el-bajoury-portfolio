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

/**
 * The same specification chip as <Badge>, with the showcase's two tones — the
 * quiet one for the stack list in flow, the signal one for the two pills that
 * float over a screenshot and have to survive a busy background.
 *
 * Square-cornered and lit from the top, like every other object on the page.
 * The signal tone keeps the project's accent as *ink* on a dark, lit chip
 * rather than as a tinted fill glowing off the image: a chip that emits is a
 * second light source, and the floating ones sit directly over a photograph
 * where that reads worst.
 */
const TONE_CLASSES: Record<"quiet" | "signal", string> = {
  quiet:
    "border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.018)] text-text-secondary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] hover:text-text-primary",
  signal:
    "border-[rgb(var(--project-accent-rgb)/28%)] bg-[rgba(8,9,10,0.72)] text-[var(--project-accent-bright)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),4px_6px_16px_-10px_rgba(0,0,0,0.9)] backdrop-blur-glass",
};

export function TechPill({ children, tone = "quiet", className = "" }: TechPillProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-sm border px-12 py-4 font-mono text-badge tracking-wide transition-colors duration-medium ease-premium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
