"use client";

import type { SuggestedQuestion } from "@/data/assistant/suggestions";

interface SuggestionChipsProps {
  questions: readonly SuggestedQuestion[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

/**
 * The opening menu.
 *
 * Eight prompts, each one a question the knowledge base is guaranteed to
 * answer. They are buttons rather than links because they do not navigate —
 * they put a question to the assistant in place, which is the whole point of
 * the section being here.
 *
 * The chips are deliberately plain: a hairline, mono type, a 44px target. They
 * sit under a transcript that is the composition, and a row of eight decorated
 * objects would compete with it.
 */
export function SuggestionChips({ questions, onSelect, disabled = false }: SuggestionChipsProps) {
  return (
    <ul aria-label="Suggested questions" className="flex flex-wrap gap-8">
      {questions.map((question) => (
        <li key={question}>
          <button
            type="button"
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="inline-flex min-h-[44px] items-center rounded-sm border border-[rgba(255,255,255,0.09)] px-12 text-left font-mono text-[11px] tracking-[0.04em] text-text-tertiary transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40"
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  );
}
