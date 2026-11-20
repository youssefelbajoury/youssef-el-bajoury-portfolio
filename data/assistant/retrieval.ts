import type { AssistantAnswer, KnowledgeEntry } from "@/types/assistant";

import { KNOWLEDGE_ENTRIES } from "./knowledge";

/*
  ─────────────────────────────────────────────────────────────────────────────
  DETERMINISTIC RETRIEVAL
  ─────────────────────────────────────────────────────────────────────────────
  No model, no network, no randomness. The visitor's question is normalised, the
  same normalisation is applied to every entry's triggers, and the best-scoring
  entry wins. If nothing clears the threshold the engine refuses.

  WHY A THRESHOLD AND NOT "CLOSEST MATCH". A nearest-neighbour answer to "what
  is your salary expectation" would return the closest entry it could find —
  which is exactly how a portfolio assistant ends up confidently discussing
  something the record does not say. The threshold makes refusal the default
  state, and an entry has to earn an answer with either a phrase match or at
  least two meaningful shared words.

  SCORING. A matched trigger is worth its word count times four, so a specific
  phrase ("morocco retail") beats a generic single word ("contact"). Shared
  tokens are worth two each. Ties resolve to the earlier entry, which is why
  the array in knowledge.ts is ordered from most specific to most general.
*/

/** Words that carry no retrieval signal. Kept short on purpose. */
const STOPWORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "for",
  "from",
  "give",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "please",
  "show",
  "tell",
  "that",
  "the",
  "their",
  "them",
  "there",
  "these",
  "this",
  "to",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
]);

/** Lowercase, strip diacritics and punctuation, collapse whitespace. */
export function normalizeQuestion(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulTokens(text: string): Set<string> {
  return new Set(
    normalizeQuestion(text)
      .split(" ")
      .filter((token) => token.length > 1 && !STOPWORDS.has(token))
  );
}

interface IndexedEntry {
  entry: KnowledgeEntry;
  triggers: readonly string[];
  tokens: ReadonlySet<string>;
}

const INDEX: readonly IndexedEntry[] = KNOWLEDGE_ENTRIES.map((entry) => ({
  entry,
  triggers: entry.triggers.map(normalizeQuestion).filter(Boolean),
  tokens: meaningfulTokens([entry.id, entry.question, ...entry.triggers].join(" ")),
}));

/** A phrase match is worth more than the same number of loose words. */
const PHRASE_WEIGHT = 4;
const TOKEN_WEIGHT = 2;
/** One shared word is not enough; a phrase match always is. */
const MINIMUM_TOKENS = 2;

interface ScoredEntry {
  indexed: IndexedEntry;
  phraseScore: number;
  tokenScore: number;
  total: number;
}

function score(
  indexed: IndexedEntry,
  normalisedQuestion: string,
  tokens: ReadonlySet<string>
): ScoredEntry {
  let phraseScore = 0;
  /* Padded so "now" cannot match "know": a trigger is a whole phrase. */
  const paddedQuestion = ` ${normalisedQuestion} `;

  for (const trigger of indexed.triggers) {
    if (trigger && paddedQuestion.includes(` ${trigger} `)) {
      phraseScore += trigger.split(" ").length * PHRASE_WEIGHT;
    }
  }

  let tokenScore = 0;

  for (const token of tokens) {
    if (indexed.tokens.has(token)) {
      tokenScore += 1;
    }
  }

  return {
    indexed,
    phraseScore,
    tokenScore,
    total: phraseScore + tokenScore * TOKEN_WEIGHT,
  };
}

const REFUSAL_PARAGRAPHS: readonly string[] = [
  "I don't have a verified answer for that in this portfolio's records, so I won't guess.",
  "I can answer questions about the projects, the stack, the experience and education record, availability, or how to get in touch. The suggestions above are the questions I am guaranteed to answer.",
];

/**
 * Resolve a question against the allowlisted knowledge base.
 *
 * Exported for the QA pass as well as the hook: the eight required prompts and
 * a set of unknown questions can be run against it without a browser.
 */
export function retrieveAnswer(question: string): AssistantAnswer {
  const normalisedQuestion = normalizeQuestion(question);

  if (!normalisedQuestion) {
    return {
      entryId: null,
      paragraphs: REFUSAL_PARAGRAPHS,
      citations: [],
      sources: [],
      refused: true,
    };
  }

  const tokens = meaningfulTokens(question);
  let best: ScoredEntry | null = null;

  for (const indexed of INDEX) {
    const scored = score(indexed, normalisedQuestion, tokens);

    if (!best || scored.total > best.total) {
      best = scored;
    }
  }

  const clearsThreshold =
    best !== null && (best.phraseScore > 0 || best.tokenScore >= MINIMUM_TOKENS);

  if (!best || !clearsThreshold) {
    return {
      entryId: null,
      paragraphs: REFUSAL_PARAGRAPHS,
      citations: [],
      sources: [],
      refused: true,
    };
  }

  return {
    entryId: best.indexed.entry.id,
    paragraphs: best.indexed.entry.answer,
    citations: best.indexed.entry.citations,
    sources: best.indexed.entry.sources,
    refused: false,
  };
}
