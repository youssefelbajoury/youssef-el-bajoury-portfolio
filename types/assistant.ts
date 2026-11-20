/**
 * The assistant's contract.
 *
 * The knowledge base, the retrieval engine, the chat interface, and a future
 * server-side model all speak these types. Keeping the contract here — rather
 * than beside the component that happens to render it first — is what lets an
 * LLM layer be added later without changing the UI: it would return the same
 * `AssistantAnswer`, with the same citations, resolved from the same records.
 */

/** Where a citation points, and therefore how the UI opens it. */
export type KnowledgeCitationKind = "section" | "project" | "document" | "external";

export interface KnowledgeCitation {
  /** The visible chip text. Short: a label, not a sentence. */
  label: string;
  /** An in-page anchor, a project route, a public document, or an allowlisted URL. */
  href: string;
  kind: KnowledgeCitationKind;
}

/**
 * One allowlisted answer.
 *
 * `triggers` are phrases, never sentences: the retrieval engine normalises both
 * sides and matches phrases, so "autoflow" is a trigger and "tell me about
 * AutoFlow" is the question. `answer` is plain text and is rendered as text
 * nodes only — there is no HTML and no markdown renderer anywhere in the path.
 */
export interface KnowledgeEntry {
  id: string;
  /** The visitor question this entry answers, in one line. */
  question: string;
  /** Normalised trigger phrases. Never sentences. */
  triggers: readonly string[];
  /** Plain-text paragraphs. Rendered as text nodes, never as HTML. */
  answer: readonly string[];
  /** At least one. An answer without a source is not rendered. */
  citations: readonly KnowledgeCitation[];
  /** Human-readable provenance, e.g. "data/projects/projects.ts". */
  sources: readonly string[];
}

/**
 * What the retrieval engine returns.
 *
 * A refusal is a first-class answer: `entryId` is null, `refused` is true, and
 * there are no citations because there is no source. The UI renders it exactly
 * as it renders any other answer, which is why the assistant cannot "guess" —
 * there is no branch that invents prose.
 */
export interface AssistantAnswer {
  entryId: string | null;
  paragraphs: readonly string[];
  citations: readonly KnowledgeCitation[];
  sources: readonly string[];
  refused: boolean;
}

export type AssistantAuthor = "assistant" | "visitor";

/**
 * One line in the transcript.
 *
 * `at` is null for the server-rendered greeting; the timestamp is computed
 * after mount so the server and the client cannot disagree about the clock.
 */
export interface AssistantMessage {
  id: string;
  author: AssistantAuthor;
  paragraphs: readonly string[];
  citations: readonly KnowledgeCitation[];
  at: number | null;
}

/** "searching" is the only transient phase: retrieval is synchronous. */
export type AssistantPhase = "idle" | "searching";
