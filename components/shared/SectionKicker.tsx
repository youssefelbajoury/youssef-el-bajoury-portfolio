import type { CSSProperties, ReactNode } from "react";

interface SectionKickerProps {
  children: ReactNode;
  /**
   * The section's number in the document — "02". Set as a drawing-office field
   * rather than as decoration: a numbered sheet is the reason the page reads as
   * one document rather than as five independent blocks.
   */
  index?: string;
  className?: string;
  /** For callers that place the kicker in a stagger and need to pass an index. */
  style?: CSSProperties;
}

/**
 * The label above a section title.
 *
 * Mono, 11px, uppercase, 0.2em — the same specification as the Hero's
 * availability line and its capability index, because this is the same voice
 * saying the same kind of thing. That is the site's one typographic rule
 * applied without exception: SANS IS THE PERSON, MONO IS THE MACHINE. A kicker
 * is a catalogue field, so it is mono.
 *
 * It used to be set in the accent colour with a `//` prefix. Both are gone.
 * Cyan on every kicker put five saturated objects on a page whose whole colour
 * argument rests on there being one per composition, and `//` is a code comment
 * borrowed as ornament — the numeral and the hairline that replaced it are
 * marks this page actually uses elsewhere.
 */
export function SectionKicker({ children, index, className = "", style }: SectionKickerProps) {
  return (
    <p
      style={style}
      className={`flex items-baseline gap-12 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary ${className}`}
    >
      {index ? (
        <span aria-hidden className="tabular-nums tracking-[0.1em] text-text-tertiary">
          {index}
        </span>
      ) : (
        /* No number to print: a drawn mark rather than a glyph, at the frame's
           own value, so the row still opens on something the drawing owns.
           `translate-y` because a hairline has no baseline of its own and would
           otherwise sit on the type's. */
        <span
          aria-hidden
          className="h-px w-16 shrink-0 -translate-y-[3px] bg-[rgba(255,255,255,0.16)]"
        />
      )}
      {children}
    </p>
  );
}
