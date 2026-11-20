"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

import { buildHandoffText } from "../handoffText";

import type { ContactDraft, ContactHandoffResponse } from "../contactSchema";

const COPIED_RESET_MS = 2000;

interface HandoffPanelProps {
  handoff: ContactHandoffResponse["handoff"];
  draft: ContactDraft;
  onClear: () => void;
}

/**
 * The honest ending.
 *
 * The server validated the message but has no delivery provider configured, so
 * this panel says exactly that and hands the visitor their own mail client. It
 * does not say "sent", it does not say "we'll be in touch", and the copy button
 * copies the draft rather than a claim that anything was delivered.
 *
 * The heading changes with the channel because "finish in your email app" is
 * wrong when the link opens WhatsApp.
 */
export function HandoffPanel({ handoff, draft, onClear }: HandoffPanelProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const text = buildHandoffText(draft);

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /*
        Clipboard access can be denied by the browser or the page's context.
        Falling back to a hidden textarea keeps the control working without
        pretending it succeeded when it did not.
      */
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();

      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(area);
      }
    }

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, COPIED_RESET_MS);
  }, [draft]);

  const isEmail = handoff.channel === "email";

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-sm border px-16 py-16"
      style={{ borderColor: "rgba(46,230,255,0.28)" }}
    >
      <p className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        <Mail className="size-12" strokeWidth={1.5} aria-hidden />
        {isEmail
          ? "Ready to send — finish in your email app"
          : "Ready to send — finish in WhatsApp"}
      </p>

      <p className="mt-8 text-paragraph-sm text-text-secondary">
        Your message passed validation on this server, but no sending service is configured here, so{" "}
        <strong className="font-semibold text-text-primary">nothing has been sent yet</strong>. The
        button below opens your own {isEmail ? "email app" : "WhatsApp"} with the message ready for
        you to review and send.
      </p>

      <div className="mt-16 flex flex-col gap-12 sm:flex-row">
        <Button href={handoff.href} variant="primary" className="w-full sm:w-auto">
          {isEmail ? "Open email app" : "Open WhatsApp"}
        </Button>

        <Button variant="secondary" onClick={copy} className="w-full sm:w-auto">
          {copied ? (
            <Check className="size-16" strokeWidth={1.5} aria-hidden />
          ) : (
            <Copy className="size-16" strokeWidth={1.25} aria-hidden />
          )}
          {copied ? "Copied" : "Copy message"}
        </Button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Message copied to the clipboard." : ""}
      </p>

      <div className="mt-16 border-t pt-12" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-[44px] items-center rounded-sm px-8 font-mono text-[11px] tracking-[0.08em] text-text-tertiary transition-colors duration-fast ease-premium hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Start another message
        </button>
      </div>
    </div>
  );
}
