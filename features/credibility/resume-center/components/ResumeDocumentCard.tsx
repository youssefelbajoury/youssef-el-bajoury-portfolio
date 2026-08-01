"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, FileText } from "lucide-react";

import {
  PANEL_BORDER,
  PANEL_EDGES,
  PANEL_EDGES_HOVER,
  PANEL_FILL,
  RULE_COLOR,
  SECONDARY_ACTION_BORDER,
} from "@/styles/material";

import { resumeActionClasses, RESUME_ACTION_STYLE } from "../resumeAction";
import { CARD_HOVER, GLYPH_HOVER, HOVER_TRANSITION } from "../resumeMotion";

import type { ResumeDocument } from "../resumeDocuments";
import type { CSSProperties } from "react";

/**
 * One resume, as a panel.
 *
 * It is drawn from PANEL_FILL and PANEL_EDGES — the same surface as every other
 * card-like block on the site, lit by the same lamp in the upper left — so it
 * reads as a piece of the portfolio rather than as modal furniture.
 *
 * WHAT HOVER DOES. Two pixels of lift, the lit edges gaining about half again,
 * one hairline stepping from the panel border to the action border, and the
 * document glyph rising two pixels. Four small things on one curve, and none of
 * them switches anything on: no ring, no glow, no scale. A card that answers the
 * pointer by acquiring a coloured outline is a card that was styled rather than
 * lit.
 *
 * The lift is Framer's (it owns transform here, and an inline transform would
 * fight a CSS one); the shadow and the border are the site's own CSS transitions
 * on `duration-medium ease-premium`, which is the same 400ms Framer is given in
 * HOVER_TRANSITION. One speed, two mechanisms, and nothing to notice.
 *
 * `initial` and `animate` are both pinned to "rest" rather than left to
 * inherit. The card sits inside a list that runs a hidden/visible stagger, and
 * an un-pinned child would take its labels from that list instead of from its
 * own two-state hover.
 */

/**
 * Both shadows and both border colours travel as custom properties so hover can
 * be a Tailwind variant. An inline `boxShadow` or `borderColor` outranks every
 * class in the cascade — see the same note in components/ui/Card.tsx, which is
 * where this technique comes from.
 */
const CARD_SURFACE: CSSProperties = {
  background: PANEL_FILL,
  "--resume-card-border": PANEL_BORDER,
  "--resume-card-border-hover": SECONDARY_ACTION_BORDER,
  "--resume-card-shadow": PANEL_EDGES,
  "--resume-card-shadow-hover": PANEL_EDGES_HOVER,
} as CSSProperties;

const CARD_CLASSES = [
  "flex h-full flex-col rounded-sm border p-20",
  "[border-color:var(--resume-card-border)] shadow-[shadow:var(--resume-card-shadow)]",
  "transition-[box-shadow,border-color] duration-medium ease-premium",
  "hover:[border-color:var(--resume-card-border-hover)] hover:shadow-[shadow:var(--resume-card-shadow-hover)]",
].join(" ");

export function ResumeDocumentCard({ resume }: { resume: ResumeDocument }) {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={CARD_HOVER}
      transition={HOVER_TRANSITION}
      style={CARD_SURFACE}
      className={CARD_CLASSES}
    >
      <div className="flex items-start justify-between gap-16">
        {/* Hairline stroke, matching the frame rules and the crop marks. An icon
            set's default 2px stroke would be the heaviest line in the dialog,
            which is precisely backwards for a glyph this small. */}
        <motion.span
          aria-hidden
          variants={GLYPH_HOVER}
          transition={HOVER_TRANSITION}
          className="inline-flex text-text-tertiary"
        >
          <FileText className="size-24" strokeWidth={1.25} />
        </motion.span>

        {/* The language code, in the mono voice — the machine's label for the
            document, the way every other meta string on the site is set. */}
        <span
          aria-hidden
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary"
        >
          {resume.code}
        </span>
      </div>

      <h3 className="mt-20 text-paragraph font-medium tracking-tight text-text-primary">
        {resume.language}
      </h3>
      <p className="mt-4 text-paragraph-sm text-text-secondary">{resume.description}</p>

      {/* `mt-auto` on the rule rather than on the actions: the two cards sit in
          a grid row and their descriptions wrap to different depths, so the two
          action rows have to be pushed to a shared baseline or the dialog reads
          as two cards that were laid out separately.

          The padding is not a spacing preference, it is the floor `mt-auto`
          does not have. Stacked in one column the cards size to their own
          content, there is no free space left for the auto margin to take, and
          the rule collapses flat against a one-line description — where a
          hairline immediately under a sentence stops reading as a divider and
          starts reading as an underline. */}
      <div aria-hidden className="mt-auto pt-20">
        <div className="h-px w-full" style={{ backgroundColor: RULE_COLOR }} />
      </div>

      <div className="mt-16 flex gap-8">
        {/* Peers, and deliberately so. Neither action is the accent: the page
            allows one saturated object per composition, and two cards each
            offering a cyan control would make four. */}
        <a
          href={resume.file}
          target="_blank"
          rel="noreferrer"
          style={RESUME_ACTION_STYLE}
          className={resumeActionClasses("compact", "min-w-0 flex-1")}
        >
          Open
          <ArrowUpRight
            aria-hidden
            className="size-16 transition-transform duration-medium ease-premium group-hover/action:translate-x-[2px] group-hover/action:translate-y-[-2px]"
            strokeWidth={1.25}
          />
          {/* "Open" alone is ambiguous with two cards on screen, and a screen
              reader reaching this out of context has no card heading to lean
              on. */}
          <span className="sr-only">— {resume.language}, opens in a new tab</span>
        </a>

        <a
          href={resume.file}
          download={resume.downloadName}
          style={RESUME_ACTION_STYLE}
          className={resumeActionClasses("compact", "min-w-0 flex-1")}
        >
          Download
          <Download
            aria-hidden
            className="size-16 transition-transform duration-medium ease-premium group-hover/action:translate-y-[2px]"
            strokeWidth={1.25}
          />
          <span className="sr-only">— {resume.language}, PDF</span>
        </a>
      </div>
    </motion.div>
  );
}
