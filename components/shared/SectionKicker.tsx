import type { ReactNode } from "react";

interface SectionKickerProps {
  children: ReactNode;
  className?: string;
}

export function SectionKicker({ children, className = "" }: SectionKickerProps) {
  return (
    <p
      className={`flex items-center gap-8 font-mono text-label uppercase tracking-[0.2em] text-accent ${className}`}
    >
      <span aria-hidden className="text-text-tertiary">
        {"//"}
      </span>
      {children}
    </p>
  );
}
