/**
 * The eight prompts the assistant is guaranteed to answer.
 *
 * They are the same eight the interface offers as chips, and they are written
 * from the visitor's side. Keeping them in one module means the chips, the
 * verification pass, and the retrieval triggers can be checked against a single
 * list rather than three copies that drift.
 *
 * Each one must resolve to a knowledge entry with at least one citation. The
 * validator checks the entry count and the citation rule; the retrieval pass in
 * the QA checklist checks that these eight land on the right entries.
 */
export const SUGGESTED_QUESTIONS = [
  "Show me your resume",
  "What is your tech stack?",
  "Tell me about AutoFlow",
  "Explain the Morocco Retail project",
  "What did you build at IZIRY?",
  "Tell me about your academic background",
  "How can I contact you?",
  "What are you working on now?",
] as const;

export type SuggestedQuestion = (typeof SUGGESTED_QUESTIONS)[number];
