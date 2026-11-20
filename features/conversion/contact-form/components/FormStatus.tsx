"use client";

import { AlertTriangle, Check, RotateCcw } from "lucide-react";

import { RULE_COLOR } from "@/styles/material";

import type { ContactErrorCode } from "../contactSchema";
import type { ContactFormStatus } from "../useContactForm";

interface FormStatusProps {
  status: ContactFormStatus;
  errorMessage: string | null;
  errorCode: ContactErrorCode | null;
  retryAfter: number | null;
  canRetry: boolean;
  reference: string | null;
  onRetry: () => void;
}

/**
 * The form's status line.
 *
 * It sits in a fixed-height slot so the submit button never jumps when a status
 * appears — a moving target under the cursor is how a second click lands on the
 * wrong control. IDLE and TYPING render nothing but the quiet mono draft line,
 * which is a state, not an announcement.
 *
 * SUCCESS and ERROR are live regions. SUCCESS is only ever reached with a
 * server-issued reference, so the reference is shown rather than a generic
 * "thank you": it is the one thing a recruiter can quote back.
 */
export function FormStatus({
  status,
  errorMessage,
  errorCode,
  retryAfter,
  canRetry,
  reference,
  onRetry,
}: FormStatusProps) {
  if (status === "IDLE") return null;

  if (status === "TYPING") {
    return (
      <p
        aria-live="polite"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-tertiary"
      >
        Draft in progress
      </p>
    );
  }

  if (status === "SENDING") {
    return (
      <p
        role="status"
        aria-live="polite"
        aria-busy
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-secondary"
      >
        Sending…
      </p>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-sm border px-16 py-12"
        style={{ borderColor: "rgba(34,197,94,0.32)" }}
      >
        <p className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-success)]">
          <Check className="size-12" strokeWidth={1.5} aria-hidden />
          Message accepted
        </p>
        <p className="mt-8 text-paragraph-sm text-text-secondary">
          The server accepted the message and returned a reference. Keep it if you need to follow
          up.
        </p>
        {reference ? (
          <p className="mt-8 font-mono text-[11px] tracking-[0.08em] text-text-tertiary">
            Reference <span className="text-text-primary">{reference}</span>
          </p>
        ) : null}
      </div>
    );
  }

  if (status === "ERROR") {
    return (
      <div
        role="alert"
        className="rounded-sm border px-16 py-12"
        style={{ borderColor: "rgba(240,85,90,0.28)" }}
      >
        <p className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-danger)]">
          <AlertTriangle className="size-12" strokeWidth={1.5} aria-hidden />
          Could not send
        </p>

        <p className="mt-8 text-paragraph-sm text-text-secondary">{errorMessage}</p>

        {errorCode === "RATE_LIMIT" && retryAfter !== null ? (
          <p className="mt-8 font-mono text-[11px] tracking-[0.08em] text-text-tertiary">
            The server asked for {formatWait(retryAfter)} before the next attempt.
          </p>
        ) : null}

        {canRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-12 inline-flex min-h-[44px] items-center gap-8 rounded-sm border border-[rgba(255,255,255,0.12)] px-12 font-mono text-[11px] tracking-[0.08em] text-text-secondary transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <RotateCcw className="size-12" strokeWidth={1.25} aria-hidden />
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  /* HANDOFF is rendered by HandoffPanel, which owns the link and the copy. */
  return <div aria-hidden className="h-px w-full" style={{ backgroundColor: RULE_COLOR }} />;
}

/** A wait, in the unit a person would use. Never more precision than that. */
function formatWait(seconds: number): string {
  const rounded = Math.max(1, Math.ceil(seconds));

  if (rounded < 60) return `${rounded} second${rounded === 1 ? "" : "s"}`;

  const minutes = Math.ceil(rounded / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
