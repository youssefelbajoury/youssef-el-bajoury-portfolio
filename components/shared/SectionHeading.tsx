import { LEDE_RULE } from "@/styles/material";

import { SectionKicker } from "./SectionKicker";

import type { ReactNode } from "react";

/**
 * The head of a section: numbered field, title, lede rule, statement.
 *
 * Composed exactly as the Hero's type column is, at three steps down in size —
 * a mono catalogue line, a sans title, a tapered hairline, then the sentence.
 * The rule is the piece that matters: an editorial rule between a title and its
 * standfirst is what stops the paragraph reading as a second, smaller headline,
 * and it is the mark that ties every section back to the Hero's lede.
 *
 * Titles are set at weight 500, not 600. Display type wants less weight as it
 * gets larger; a semibold grotesque at this size clots and its counters close
 * up. The Hero learned that at 100px and the sections inherit it.
 */

interface SectionHeadingProps {
  /** The section's number in the document — "01" through "05". */
  index: string;
  kicker: string;
  title: ReactNode;
  /** The standfirst under the rule. Optional: some sections are title-only. */
  statement?: ReactNode;
  /** Id for the <h2>, so the section can be `aria-labelledby` it. */
  titleId?: string;
  /**
   * Centred is for the closing call to action only, where the page stops being
   * a document and becomes an invitation. Everywhere else the head hangs off
   * the frame's left edge with the rest of the type.
   */
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  kicker,
  title,
  statement,
  titleId,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      <SectionKicker index={index} className={centered ? "justify-center" : ""}>
        {kicker}
      </SectionKicker>

      <h2
        id={titleId}
        className={`mt-24 text-title font-medium tracking-tight text-text-primary ${
          centered ? "mx-auto max-w-readable" : "max-w-readable"
        }`}
      >
        {title}
      </h2>

      {/* Draws from its left end, ahead of the sentence it introduces, which is
          the order a ruled line is actually made in. Centred heads mirror it to
          the middle rather than flipping the taper — a rule that fades toward
          its own start reads as a mistake. */}
      <div
        aria-hidden
        className={`mt-32 h-px w-48 ${centered ? "mx-auto" : ""}`}
        style={{ backgroundImage: LEDE_RULE }}
      />

      {statement ? (
        <p
          className={`mt-24 max-w-readable text-paragraph-lg text-text-secondary ${
            centered ? "mx-auto" : ""
          }`}
        >
          {statement}
        </p>
      ) : null}
    </header>
  );
}
