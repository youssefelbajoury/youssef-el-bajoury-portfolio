import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Disable the hover lift for cards that are purely decorative, not focal. */
  hover?: boolean;
}

/**
 * The one "hardware" surface treatment shared by every card-like block on
 * the page (ProjectCard, About's highlights, Skills' categories, Contact's
 * card) — solid elevation + hairline border + inner top highlight, so depth
 * reads from material, not from a drop shadow that would be invisible
 * against the near-black canvas.
 */
export function Card({ children, className = "", hover = true }: CardProps) {
  const hoverClasses = hover
    ? "transition-[transform,box-shadow,border-color] duration-medium ease-standard hover:-translate-y-4 hover:border-border-strong hover:shadow-card-hover"
    : "";

  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-card ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
