"use client";

import type { ChangeEvent, ReactNode } from "react";

/*
  ─────────────────────────────────────────────────────────────────────────────
  ONE FIELD, DRAWN ONCE
  ─────────────────────────────────────────────────────────────────────────────
  The floating label is the browser's own: `placeholder=" "` plus
  `peer-placeholder-shown` and `peer-focus`. No JavaScript measures anything, so
  the label cannot desynchronise from the input, and it is correct before
  hydration.

  The label is floated by default and drops to its resting position only while
  the placeholder is showing. That inversion is deliberate: a filled field keeps
  its label up whether or not focus has ever arrived, and `peer-focus` — which
  Tailwind emits after `peer-placeholder-shown` — lifts it back when the field
  is focused empty.

  The focus response is two movements at 180ms — the hairline brightens and a
  1px accent rule grows from the left along the bottom edge. The rule is
  `scaleX`, not width, so it is a transform and never triggers layout.

  The bottom rule is not the border. The border is the resting hairline the
  whole page uses; the rule is the accent, and it is the only place in the form
  where the accent appears before submission.
*/

const FIELD_CLASSES =
  "peer w-full rounded-sm border bg-transparent px-12 text-paragraph-sm text-text-primary caret-accent outline-none transition-[border-color] duration-[180ms] ease-premium placeholder:text-transparent disabled:opacity-50";

const LABEL_CLASSES =
  "pointer-events-none absolute left-12 font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary transition-all duration-[180ms] ease-premium peer-focus:text-text-secondary peer-disabled:opacity-50";

/** One-line: label centred at rest, lifted to the top edge on focus or fill. */
const SINGLE_LINE_LABEL =
  "top-8 translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[11px] peer-placeholder-shown:tracking-[0.08em] peer-focus:top-8 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:tracking-[0.16em]";

/** Multiline: label rests on the first line rather than mid-box. */
const MULTILINE_LABEL = "top-8 peer-placeholder-shown:top-24 peer-focus:top-8";

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  hint?: ReactNode;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function FloatingField({
  id,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  hint,
  type = "text",
  autoComplete,
  multiline = false,
  rows = 5,
  maxLength,
  disabled = false,
  required = false,
  className = "",
}: FloatingFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name: id,
    value,
    placeholder: " ",
    disabled,
    required,
    maxLength,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    onBlur,
    onFocus,
    className: `${FIELD_CLASSES} ${multiline ? "min-h-[9rem] py-24" : "h-56 pt-24 pb-8"} ${
      error
        ? "border-[rgba(240,85,90,0.55)]"
        : "border-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.26)]"
    }`,
  };

  return (
    <div className={className}>
      <div className="relative">
        {multiline ? <textarea rows={rows} {...shared} /> : <input type={type} {...shared} />}

        <label
          htmlFor={id}
          className={`${LABEL_CLASSES} ${multiline ? MULTILINE_LABEL : SINGLE_LINE_LABEL}`}
        >
          {label}
          {required ? <span className="sr-only"> (required)</span> : null}
        </label>

        {/* The accent rule: 1px, grows from the left, transform only. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-[180ms] ease-premium peer-focus:scale-x-100"
          style={{ backgroundColor: error ? "var(--color-danger)" : "var(--color-accent)" }}
        />
      </div>

      <div className="mt-8 flex min-h-[18px] items-start justify-between gap-12">
        <p
          id={error ? errorId : hintId}
          className={`font-mono text-[11px] leading-[1.5] tracking-[0.04em] ${
            error ? "text-[var(--color-danger)]" : "text-text-tertiary"
          }`}
        >
          {error ?? hint}
        </p>

        {maxLength !== undefined && multiline ? (
          <p className="shrink-0 font-mono text-[11px] tabular-nums tracking-[0.08em] text-text-tertiary">
            {value.length} / {maxLength}
          </p>
        ) : null}
      </div>
    </div>
  );
}
