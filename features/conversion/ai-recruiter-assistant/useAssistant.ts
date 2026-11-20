"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { retrieveAnswer } from "@/data/assistant/retrieval";
import type { AssistantMessage, AssistantPhase } from "@/types/assistant";

/*
  ─────────────────────────────────────────────────────────────────────────────
  THE ASSISTANT'S CLIENT STATE
  ─────────────────────────────────────────────────────────────────────────────
  One hook, one transcript, one phase. Retrieval is synchronous, so the only
  transient phase is `searching`: it is held for a single short beat so the
  answer's entrance is a transition rather than a jump, and so the status line
  is perceivable. It is not a model "thinking", and nothing in the copy says it
  is.

  THE ERROR PATH EXISTS EVEN THOUGH RETRIEVAL IS PURE. A pure function can still
  throw on a malformed record, and a transcript that silently loses a question
  when that happens is worse than one that says so. The failed question is kept
  so Retry can re-run it without duplicating the visitor's message.
*/

const GREETING_ID = "assistant-greeting";

/**
 * The server-rendered greeting.
 *
 * `at` is null here on purpose: the timestamp is assigned after hydration, so
 * the server and the client cannot disagree about the clock. The copy names the
 * retrieval boundary explicitly — this is the one place a reader is told what
 * the assistant is, before they ask it anything.
 */
const GREETING: AssistantMessage = {
  id: GREETING_ID,
  author: "assistant",
  paragraphs: [
    "Hello. I read this site's published records — the projects, the stack, the experience and education, availability, and how to get in touch.",
    "No language model is called. Every answer is retrieved from an approved knowledge base and cites where it came from.",
  ],
  citations: [],
  at: null,
};

/** Long enough for the 220ms entrance to read, short enough not to feel padded. */
const SEARCH_BEAT_MS = 240;

/*
  Hydration, without a state-setting effect.

  `useSyncExternalStore` returns the server snapshot for the hydrating render and
  the client snapshot immediately after, which is exactly the boundary the
  greeting's timestamp needs. The client reading is taken once at module load,
  so it is a stable value rather than a new clock reading on every render.
*/
const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getHydratedServerSnapshot = () => false;
const CLIENT_GREETING_AT = typeof window === "undefined" ? 0 : Date.now();
const getGreetingSnapshot = () => CLIENT_GREETING_AT;
const getGreetingServerSnapshot = () => 0;

function useHydrated(): boolean {
  return useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getHydratedServerSnapshot);
}

interface UseAssistantResult {
  messages: readonly AssistantMessage[];
  /** False during hydration, true afterwards. Drives client-only timestamps. */
  mounted: boolean;
  phase: AssistantPhase;
  error: string | null;
  failedQuestion: string | null;
  /** True while the opening suggestions should be offered. */
  showSuggestions: boolean;
  ask: (question: string) => void;
  retry: () => void;
  clear: () => void;
}

export function useAssistant(): UseAssistantResult {
  const [rawMessages, setRawMessages] = useState<readonly AssistantMessage[]>([GREETING]);
  const [phase, setPhase] = useState<AssistantPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);

  const hydrated = useHydrated();
  const greetingAt = useSyncExternalStore(
    subscribeToHydration,
    getGreetingSnapshot,
    getGreetingServerSnapshot
  );

  /** Guards against a second submission while the first is still resolving. */
  const busyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exchangeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* The greeting gets its clock reading only once the client owns the tree. */
  const messages =
    hydrated && greetingAt > 0
      ? rawMessages.map((message) =>
          message.id === GREETING_ID && message.at === null
            ? { ...message, at: greetingAt }
            : message
        )
      : rawMessages;

  const ask = useCallback((rawQuestion: string) => {
    const question = rawQuestion.trim();

    if (!question || busyRef.current) return;

    busyRef.current = true;
    exchangeRef.current += 1;
    const exchange = exchangeRef.current;

    setError(null);
    setFailedQuestion(null);
    setPhase("searching");

    setRawMessages((current) => [
      ...current,
      {
        id: `visitor-${exchange}`,
        author: "visitor",
        paragraphs: [question],
        citations: [],
        at: Date.now(),
      },
    ]);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        const answer = retrieveAnswer(question);

        setRawMessages((current) => [
          ...current,
          {
            id: `assistant-${exchange}`,
            author: "assistant",
            paragraphs: answer.paragraphs,
            citations: answer.citations,
            at: Date.now(),
          },
        ]);
        setPhase("idle");
      } catch {
        setError(
          "The retrieval engine could not complete that search. Your question is still here, and you can retry it."
        );
        setFailedQuestion(question);
        setPhase("idle");
      } finally {
        busyRef.current = false;
      }
    }, SEARCH_BEAT_MS);
  }, []);

  const retry = useCallback(() => {
    if (!failedQuestion || busyRef.current) return;

    /*
      Re-run without appending a second visitor bubble: the question is already
      in the transcript. `ask` would append one, so the failed message is
      answered through the same engine here.
    */
    busyRef.current = true;
    setError(null);
    setPhase("searching");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        const answer = retrieveAnswer(failedQuestion);

        setRawMessages((current) => [
          ...current,
          {
            id: `assistant-retry-${Date.now()}`,
            author: "assistant",
            paragraphs: answer.paragraphs,
            citations: answer.citations,
            at: Date.now(),
          },
        ]);
        setFailedQuestion(null);
        setPhase("idle");
      } catch {
        setError(
          "The retrieval engine still could not complete that search. Try again, or ask a suggested question."
        );
        setPhase("idle");
      } finally {
        busyRef.current = false;
      }
    }, SEARCH_BEAT_MS);
  }, [failedQuestion]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    busyRef.current = false;
    exchangeRef.current = 0;

    setRawMessages([{ ...GREETING, at: Date.now() }]);
    setPhase("idle");
    setError(null);
    setFailedQuestion(null);
  }, []);

  const last = messages[messages.length - 1];
  const lastIsRefusal =
    last !== undefined &&
    last.author === "assistant" &&
    last.id !== GREETING_ID &&
    last.citations.length === 0;

  /*
    Suggestions are the opening menu and the recovery path. They are offered
    while the transcript is still only the greeting, and again after a refusal —
    the two moments a reader most needs to know what can be answered. A real
    answer retires them.
  */
  const showSuggestions = messages.length === 1 || lastIsRefusal;

  return {
    messages,
    mounted: hydrated,
    phase,
    error,
    failedQuestion,
    showSuggestions,
    ask,
    retry,
    clear,
  };
}
