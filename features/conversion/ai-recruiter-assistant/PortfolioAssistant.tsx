"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { KNOWLEDGE_ENTRIES } from "@/data/assistant/knowledge";
import { SUGGESTED_QUESTIONS } from "@/data/assistant/suggestions";
import { RULE_COLOR, STATUS_LENS, STATUS_LENS_SHADOW } from "@/styles/material";

import { MessageBubble } from "./components/MessageBubble";
import { SuggestionChips } from "./components/SuggestionChips";
import { useAssistant } from "./useAssistant";

import type { FormEvent, KeyboardEvent } from "react";

/** How close to the bottom still counts as "following the conversation". */
const NEAR_BOTTOM_PX = 80;

/**
 * The portfolio assistant.
 *
 * A transcript and an input, inside the same panel the rest of the page uses.
 * It is a section rather than a dock destination because it is part of the
 * record — a reader arrives at it after the projects, the experience and the
 * stack, with questions that the page has already answered in longer form.
 *
 * THE COMPOSITION IS DELIBERATELY QUIET. No robot, no glow, no typing avatar:
 * the material system is the Hero's, the type is the page's, and the only
 * saturated object in the panel is the Send action. The assistant should read
 * as a control on this page, not as a product embedded in it.
 */
export function PortfolioAssistant() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  const { messages, mounted, phase, error, failedQuestion, showSuggestions, ask, retry, clear } =
    useAssistant();

  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const atBottomRef = useRef(true);
  const previousCount = useRef(messages.length);
  const previousPhase = useRef(phase);
  const lastSubmitted = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    node.scrollTop = node.scrollHeight;
    atBottomRef.current = true;
    setUnread(false);
  }, []);

  /*
    Follow the conversation only when the reader is already at the end of it.
    A transcript that yanks itself to the bottom while someone is reading an
    earlier answer is the single most hostile thing a chat can do; the unread
    control below is the alternative.
  */
  useEffect(() => {
    const grew = messages.length > previousCount.current;
    previousCount.current = messages.length;

    if (!grew) return;

    if (atBottomRef.current) {
      scrollToBottom();
      return;
    }

    const last = messages[messages.length - 1];
    if (last?.author !== "assistant") return;

    /*
      Deferred by one frame so the state change lands after the effect that
      detected it, rather than synchronously inside it. The button is a
      follow-up control, not part of the same paint.
    */
    const frame = window.requestAnimationFrame(() => setUnread(true));
    return () => window.cancelAnimationFrame(frame);
  }, [messages, scrollToBottom]);

  /* The status line is part of the composition, so the transcript follows it. */
  useEffect(() => {
    if (phase === "searching" && atBottomRef.current) scrollToBottom();
  }, [phase, scrollToBottom]);

  /*
    Clear the draft only once the answer has arrived. During the search the
    input keeps what was typed, which is what "input preserved" means here; on
    an error it keeps it as well, so Retry is never the only copy of a question.
  */
  useEffect(() => {
    const finished = previousPhase.current === "searching" && phase === "idle";
    previousPhase.current = phase;

    if (!finished || error) return;

    setInput((current) => (current === lastSubmitted.current ? "" : current));
    lastSubmitted.current = null;
  }, [phase, error]);

  const handleScroll = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    const nearBottom = node.scrollHeight - node.scrollTop - node.clientHeight <= NEAR_BOTTOM_PX;

    atBottomRef.current = nearBottom;

    if (nearBottom) setUnread(false);
  }, []);

  const submitQuestion = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || phase === "searching") return;

      lastSubmitted.current = trimmed;
      ask(trimmed);
    },
    [ask, phase]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitQuestion(input);
    },
    [input, submitQuestion]
  );

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    formRef.current?.requestSubmit();
  }, []);

  const handleClear = useCallback(() => {
    clear();
    setInput("");
    setUnread(false);
    lastSubmitted.current = null;

    window.requestAnimationFrame(() => {
      scrollToBottom();
      inputRef.current?.focus();
    });
  }, [clear, scrollToBottom]);

  const handleRetry = useCallback(() => {
    if (!input.trim() && failedQuestion) setInput(failedQuestion);
    retry();
  }, [failedQuestion, input, retry]);

  const searching = phase === "searching";
  const showCounter = input.length > 400;

  return (
    <SectionShell id="assistant" labelledBy="assistant-title">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="07"
            kicker="Portfolio Assistant"
            titleId="assistant-title"
            title="Ask the record."
            statement="Ask about the projects, the stack, the experience and education record, availability, or how to get in touch. Answers are read from this site's published files and cite where they came from — no language model is called."
          />
        </motion.div>

        <motion.div variants={item} className="mx-auto mt-48 max-w-readable">
          <Card hover={false} className="overflow-hidden">
            {/* The panel's own masthead. The lamp is the page's 6px object,
                not a second light source, and the two lines say what this is
                before the reader types. */}
            <div
              className="flex flex-wrap items-center justify-between gap-12 border-b px-20 py-16 sm:px-24"
              style={{ borderColor: RULE_COLOR }}
            >
              <div className="flex items-center gap-12">
                <span
                  aria-hidden
                  className="size-[6px] shrink-0 rounded-full"
                  style={{ background: STATUS_LENS, boxShadow: STATUS_LENS_SHADOW }}
                />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                    Retrieval
                  </p>
                  <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                    No language model is called.
                  </p>
                </div>
              </div>

              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                {KNOWLEDGE_ENTRIES.length} topics
              </p>
            </div>

            <div className="relative">
              <div
                ref={scrollRef}
                tabIndex={0}
                onScroll={handleScroll}
                aria-busy={searching}
                aria-label="Assistant conversation"
                className="h-[24rem] overflow-y-auto overscroll-contain px-16 py-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent sm:h-[28rem] sm:px-24"
              >
                <div role="log" aria-live="polite" aria-relevant="additions">
                  <ol className="flex flex-col gap-24">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} mounted={mounted} />
                    ))}
                  </ol>
                </div>

                {searching ? (
                  <div aria-hidden className="mt-24 flex items-center gap-8 pl-40">
                    <span className="flex gap-4">
                      {[0, 1, 2].map((dot) => (
                        <span key={dot} className="size-[4px] rounded-full bg-text-tertiary" />
                      ))}
                    </span>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
                      Searching portfolio…
                    </p>
                  </div>
                ) : null}

                {error ? (
                  <div
                    role="alert"
                    className="mt-24 rounded-sm border px-16 py-12"
                    style={{ borderColor: "rgba(240,85,90,0.28)" }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-danger)]">
                      Could not search
                    </p>
                    <p className="mt-8 text-paragraph-sm text-text-secondary">{error}</p>
                    {failedQuestion ? (
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-12 inline-flex min-h-[44px] items-center gap-8 rounded-sm border border-[rgba(255,255,255,0.12)] px-12 font-mono text-[11px] tracking-[0.08em] text-text-secondary transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        <RotateCcw className="size-12" strokeWidth={1.25} aria-hidden />
                        Retry
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Only when an answer arrived while the reader was elsewhere in
                  the transcript. It is a control, not an announcement. */}
              {unread ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center">
                  <button
                    type="button"
                    onClick={scrollToBottom}
                    className="pointer-events-auto inline-flex min-h-[44px] items-center gap-8 rounded-sm border border-[rgba(255,255,255,0.12)] bg-background px-12 font-mono text-[11px] tracking-[0.08em] text-text-secondary shadow-sm transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    New answer
                    <ArrowDown className="size-12" strokeWidth={1.25} aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>

            {showSuggestions ? (
              <div className="border-t px-20 py-16 sm:px-24" style={{ borderColor: RULE_COLOR }}>
                <SuggestionChips
                  questions={SUGGESTED_QUESTIONS}
                  onSelect={submitQuestion}
                  disabled={searching}
                />
              </div>
            ) : null}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="border-t px-20 py-16 sm:px-24"
              style={{ borderColor: RULE_COLOR }}
            >
              <label
                htmlFor="assistant-question"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary"
              >
                Ask about the work
              </label>

              <div className="mt-8 flex items-end gap-8">
                <textarea
                  id="assistant-question"
                  ref={inputRef}
                  rows={1}
                  maxLength={500}
                  autoComplete="off"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. What did you build at IZIRY?"
                  className="min-h-[44px] w-full resize-none rounded-sm border border-[rgba(255,255,255,0.09)] bg-transparent px-12 py-10 text-paragraph-sm text-text-primary caret-accent placeholder:text-text-tertiary transition-colors duration-fast ease-premium focus:border-[rgba(255,255,255,0.26)] focus-visible:outline-none"
                />

                <Button
                  type="submit"
                  size="md"
                  disabled={searching || input.trim().length === 0}
                  className="shrink-0"
                >
                  Send
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-between gap-16">
                <p
                  aria-live="polite"
                  className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary"
                >
                  {searching
                    ? "Searching…"
                    : showCounter
                      ? `${input.length} / 500`
                      : "Retrieval only · every answer cites the page"}
                </p>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={messages.length === 1}
                  className="inline-flex min-h-[44px] items-center gap-8 rounded-sm px-8 font-mono text-[11px] tracking-[0.08em] text-text-tertiary transition-colors duration-fast ease-premium hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40"
                >
                  <RotateCcw className="size-12" strokeWidth={1.25} aria-hidden />
                  Clear conversation
                </button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
