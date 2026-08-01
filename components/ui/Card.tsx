import { PANEL_BORDER, PANEL_EDGES, PANEL_EDGES_HOVER, PANEL_FILL } from "@/styles/material";

import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Disable the hover response for cards that are purely decorative, not focal. */
  hover?: boolean;
}

/**
 * The panel — the one surface treatment shared by every card-like block on the
 * page (About's highlights, Skills' categories, Contact's card).
 *
 * It is the Hero's specimen plate at a fraction of the amplitude, and it is lit
 * by the same lamp: a bright top edge, a lit left edge, a dark right edge, a
 * darker bottom edge, and two shadows thrown down-and-right. See PANEL_EDGES in
 * styles/material.ts for why the amplitude is lower — one plate on a page may
 * sit proudly off it, a grid of six panels lit that hard turns the page to soup.
 *
 * WHAT HOVER DOES, AND WHAT IT REFUSES TO DO. It steps further into the light:
 * the lit edges gain about half again, the shadows deepen, the panel lifts 4px.
 * It does not acquire a cyan ring, which is what the old `shadow-card-hover`
 * did. A ring of accent light around a surface is emitted light, and this page
 * has exactly one light source.
 *
 * Both shadows are handed over as custom properties so the hover can be a
 * Tailwind variant rather than a second component: an inline `boxShadow` would
 * outrank every class in the cascade and make `hover:` a no-op.
 *
 * The radius is `sm` (8px), not `xl`. The Hero is drawn on a rectilinear grid
 * with square crop marks and a 8px-radius plate; a 28px pill radius on the
 * cards beneath it belongs to a different drawing.
 */
export function Card({ children, className = "", hover = true }: CardProps) {
  /*
    The `shadow:` type hint inside the arbitrary value is not optional.

    Tailwind cannot infer what an arbitrary CSS variable holds, and on a shadow
    utility it guesses *colour* — so the un-hinted form compiles to
    `--tw-shadow-color`, which tints a shadow that was never declared, and every
    panel rendered with `box-shadow: none`: no lit top edge, no shaded
    underside, no contact shadow. The hint says the value is the shadow itself.

    Note also that nothing in this comment may spell a utility class literally.
    Tailwind scans source files as plain text, comments included, so an example
    written out in full is compiled as though it were on an element — an
    invalid one takes the whole stylesheet down with it.
  */
  const hoverClasses = hover
    ? "transition-[transform,box-shadow] duration-medium ease-apple hover:-translate-y-4 hover:shadow-[shadow:var(--panel-shadow-hover)]"
    : "";

  return (
    <div
      style={
        {
          background: PANEL_FILL,
          borderColor: PANEL_BORDER,
          "--panel-shadow": PANEL_EDGES,
          "--panel-shadow-hover": PANEL_EDGES_HOVER,
        } as CSSProperties
      }
      className={`rounded-sm border shadow-[shadow:var(--panel-shadow)] ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
