"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PANEL_BORDER, RULE_COLOR } from "@/styles/material";
import type { AssistantMessage, KnowledgeCitation } from "@/types/assistant";

/** `--ease-apple`, as control points Framer can read. */
const EASE_APPLE = [0.32, 0.72, 0, 1] as const;

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

interface MessageBubbleProps {
  message: AssistantMessage;
  /** False for the server-rendered pass, so the timestamp is client-only. */
  mounted: boolean;
}

/**
 * One line of the transcript.
 *
 * The two sides are the same object mirrored, not two components: same square
 * corner, same hairline, same type. The only asymmetries are the avatar and the
 * side the bubble hangs from, which is all a chat transcript needs to be
 * legible — a tail, a gradient and a second accent would be decoration arguing
 * with the page's material.
 *
 * THE AUTHOR IS ANNOUNCED IN TEXT, NOT BY THE AVATAR. An avatar is `aria-hidden`
 * because a monogram is a visual shorthand; a screen reader gets "Portfolio
 * assistant said" before the words, which is the part that matters.
 */
export function MessageBubble({ message, mounted }: MessageBubbleProps) {
  const prefersReducedMotion = useReducedMotion();
  const isVisitor = message.author === "visitor";

  return (
    <motion.li
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [...EASE_APPLE] }}
      className={`flex items-start gap-12 ${isVisitor ? "flex-row-reverse" : ""}`}
    >
      <span
        aria-hidden
        className="mt-4 inline-flex size-[28px] shrink-0 items-center justify-center rounded-sm border bg-[rgba(255,255,255,0.02)] font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary"
        style={{ borderColor: isVisitor ? RULE_COLOR : PANEL_BORDER }}
      >
        {isVisitor ? "You" : "YB"}
      </span>

      <div
        className={`flex min-w-0 max-w-[85%] flex-col gap-8 ${
          isVisitor ? "items-end" : "items-start"
        }`}
      >
        <span className="sr-only">{isVisitor ? "You said:" : "Portfolio assistant said:"}</span>

        <div
          className={`rounded-sm border px-16 py-12 ${
            isVisitor ? "bg-[rgba(255,255,255,0.035)]" : "bg-[rgba(255,255,255,0.02)]"
          }`}
          style={{ borderColor: isVisitor ? "rgba(255,255,255,0.12)" : PANEL_BORDER }}
        >
          {message.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-paragraph-sm ${
                index > 0 ? "mt-8" : ""
              } ${isVisitor ? "text-text-primary" : "text-text-secondary"}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {message.citations.length > 0 ? (
          <ul aria-label="Sources for this answer" className="flex flex-wrap gap-8">
            {message.citations.map((citation) => (
              <li key={`${citation.label}-${citation.href}`}>
                <CitationChip citation={citation} />
              </li>
            ))}
          </ul>
        ) : null}

        {mounted && message.at !== null ? (
          <time
            dateTime={new Date(message.at).toISOString()}
            className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary"
          >
            {TIME_FORMAT.format(message.at)}
          </time>
        ) : null}
      </div>
    </motion.li>
  );
}

const CHIP_CLASSES =
  "inline-flex min-h-[44px] items-center gap-4 rounded-sm border border-[rgba(255,255,255,0.09)] px-12 font-mono text-[11px] tracking-[0.08em] text-text-tertiary transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

/**
 * A citation, opened the way its destination requires.
 *
 * A project is a route inside this app, so it goes through `Link` and keeps
 * client navigation. A section is an anchor. A document or an external profile
 * leaves the page, so it opens a new tab and says so to a screen reader — the
 * one place a citation's behaviour differs, and therefore the one place it is
 * stated.
 */
function CitationChip({ citation }: { citation: KnowledgeCitation }) {
  const opensNewTab = citation.kind === "document" || citation.kind === "external";

  if (citation.kind === "project") {
    return (
      <Link href={citation.href} className={CHIP_CLASSES}>
        {citation.label}
      </Link>
    );
  }

  return (
    <a
      href={citation.href}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noreferrer" : undefined}
      className={CHIP_CLASSES}
    >
      {citation.label}
      {opensNewTab ? (
        <>
          <ArrowUpRight className="size-12" strokeWidth={1.25} aria-hidden />
          <span className="sr-only">, opens in a new tab</span>
        </>
      ) : null}
    </a>
  );
}
