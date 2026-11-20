"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  EMPTY_CONTACT_DRAFT,
  firstInvalidField,
  parseContactResponse,
  validateContact,
} from "./contactSchema";

import type {
  ContactDraft,
  ContactErrorCode,
  ContactField,
  ContactFieldErrors,
  ContactHandoffResponse,
  ContactPayload,
} from "./contactSchema";

/*
  ─────────────────────────────────────────────────────────────────────────────
  THE FORM'S STATE MACHINE
  ─────────────────────────────────────────────────────────────────────────────
  IDLE ──keystroke──▶ TYPING ──submit──▶ SENDING ──▶ SUCCESS | ERROR | HANDOFF

  Two rules are structural, not cosmetic:

  1. SUCCESS IS UNREACHABLE FROM A BUTTON PRESS. Only a parsed body carrying
     `{ ok: true, status: "accepted", id }` can enter it. Every other outcome —
     including an HTTP 200 whose body does not match the contract — falls to
     ERROR, because a body the form cannot read is a body it cannot trust.

  2. NOTHING IS CLAIMED THAT DID NOT HAPPEN. HANDOFF means the server validated
     the message and has no provider to deliver it; the copy says so and offers
     the visitor's own mail client. It never says "sent".

  Validation runs on blur and on submit only. `setField` clears the error on the
  field being edited — dismissal, not validation — so a corrected value stops
  being contradicted while it is still being typed.
*/

export type ContactFormStatus = "IDLE" | "TYPING" | "SENDING" | "SUCCESS" | "ERROR" | "HANDOFF";

/** The drafting indicator's window, per the interaction spec. */
const DRAFTING_WINDOW_MS = 1500;

/**
 * Client patience, not the provider's timeout. The route aborts the provider at
 * 8s; the extra four seconds let a slow 504 arrive as a 504 instead of as a
 * client-side abort, so the visitor sees the server's own reason.
 */
const CLIENT_TIMEOUT_MS = 12_000;

interface ErrorCopy {
  message: string;
  /** True when re-submitting the same draft is a sensible offer. */
  retryable: boolean;
}

const ERROR_COPY: Record<ContactErrorCode, ErrorCopy> = {
  VALIDATION: {
    message: "Some fields still need attention. They are marked below.",
    retryable: false,
  },
  ORIGIN: {
    message: "This form only accepts submissions from this site. Reload the page and try again.",
    retryable: true,
  },
  UNSUPPORTED_MEDIA_TYPE: {
    message:
      "The request was sent in a format the server does not accept. Reload the page and try again.",
    retryable: true,
  },
  PAYLOAD_TOO_LARGE: {
    message: "That message is too large to send. Shorten it and try again.",
    retryable: false,
  },
  RATE_LIMIT: {
    message:
      "Too many messages have been sent from this connection. Wait a moment, then try again.",
    retryable: true,
  },
  DELIVERY_NOT_CONFIGURED: {
    message: "Sending is not configured on this server yet. Use the direct email link instead.",
    retryable: false,
  },
  TIMEOUT: {
    message: "The server took too long to answer. Nothing was sent — try again.",
    retryable: true,
  },
  INTERNAL: {
    message: "The server could not process the message. Nothing was sent — try again.",
    retryable: true,
  },
};

const NETWORK_COPY: ErrorCopy = {
  message: "The message could not reach the server. Check your connection and try again.",
  retryable: true,
};

interface UseContactFormResult {
  draft: ContactDraft;
  errors: ContactFieldErrors;
  status: ContactFormStatus;
  /** The human-readable reason, for ERROR only. */
  errorMessage: string | null;
  errorCode: ContactErrorCode | null;
  /** Seconds the server asked the visitor to wait, when it said so. */
  retryAfter: number | null;
  /** True when re-submitting the same draft is worth offering. */
  canRetry: boolean;
  /** The accepted request's reference, for SUCCESS only. */
  reference: string | null;
  /** Where to finish the message, for HANDOFF only. */
  handoff: ContactHandoffResponse["handoff"] | null;
  /** The message field is focused and was edited within the last 1.5s. */
  drafting: boolean;
  /** False while sending and after a terminal state. */
  editable: boolean;
  setField: (field: ContactField, value: string) => void;
  blurField: (field: ContactField) => void;
  /** Call on each edit of the message field; starts the 1.5s drafting window. */
  noteDrafting: () => void;
  /** Call when the message field loses focus. */
  stopDrafting: () => void;
  /**
   * Validate and send. Resolves to the field that needs focus, or null when the
   * submission was attempted (whatever the server then answered).
   */
  submit: () => Promise<ContactField | null>;
  clear: () => void;
}

export function useContactForm(): UseContactFormResult {
  const [draft, setDraft] = useState<ContactDraft>(EMPTY_CONTACT_DRAFT);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>("IDLE");
  const [errorCode, setErrorCode] = useState<ContactErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [handoff, setHandoff] = useState<ContactHandoffResponse["handoff"] | null>(null);
  const [drafting, setDrafting] = useState(false);

  /**
   * The form's age. It is a ref, not state: it is never rendered, and it must
   * survive re-renders without causing one. The effect writes the mount time
   * after hydration, so a server-rendered pass never contributes a clock value.
   */
  const renderedAtRef = useRef(0);
  const draftingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  /**
   * The draft's authoritative copy for handlers that must read the latest value
   * without re-creating themselves on every keystroke — and, critically, without
   * running validation inside a state updater, which StrictMode would call twice.
   */
  const draftRef = useRef<ContactDraft>(EMPTY_CONTACT_DRAFT);

  useEffect(() => {
    renderedAtRef.current = Date.now();

    return () => {
      mountedRef.current = false;
      if (draftingTimerRef.current) clearTimeout(draftingTimerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const stopDrafting = useCallback(() => {
    if (draftingTimerRef.current) {
      clearTimeout(draftingTimerRef.current);
      draftingTimerRef.current = null;
    }
    setDrafting(false);
  }, []);

  const noteDrafting = useCallback(() => {
    if (draftingTimerRef.current) clearTimeout(draftingTimerRef.current);
    setDrafting(true);

    draftingTimerRef.current = setTimeout(() => {
      draftingTimerRef.current = null;
      setDrafting(false);
    }, DRAFTING_WINDOW_MS);
  }, []);

  const setField = useCallback((field: ContactField, value: string) => {
    draftRef.current = { ...draftRef.current, [field]: value };
    setDraft(draftRef.current);

    /* Dismiss this field's complaint; the next verdict is on blur. */
    setErrors((current) => {
      if (current[field] === undefined) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });

    setStatus((current) => {
      if (current === "SUCCESS" || current === "HANDOFF" || current === "SENDING") return current;
      return "TYPING";
    });
  }, []);

  const blurField = useCallback((field: ContactField) => {
    const parsed = validateContact(toPayload(draftRef.current, renderedAtRef.current));

    setErrors((existing) => {
      const next = { ...existing };
      const message = parsed.success ? undefined : parsed.fields[field];

      if (message === undefined) delete next[field];
      else next[field] = message;

      return next;
    });
  }, []);

  const submit = useCallback(async (): Promise<ContactField | null> => {
    if (inFlightRef.current) return null;

    const snapshot = draftRef.current;
    const renderedAt = renderedAtRef.current || Date.now();
    const parsed = validateContact(toPayload(snapshot, renderedAt));

    if (!parsed.success) {
      setErrors(parsed.fields);
      setStatus((current) => (current === "IDLE" ? "IDLE" : "TYPING"));
      return firstInvalidField(parsed.fields);
    }

    setErrors({});
    setErrorCode(null);
    setErrorMessage(null);
    setRetryAfter(null);
    setStatus("SENDING");
    stopDrafting();

    inFlightRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(() => controller.abort("timeout"), CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        /*
          The timing signal must travel with the draft. Without `renderedAt`
          the route cannot tell a person from a script and every submission
          takes the silent handoff branch, which is why the body is the
          payload — not the bare draft.
        */
        body: JSON.stringify(toPayload(snapshot, renderedAt)),
        signal: controller.signal,
        cache: "no-store",
      });

      /*
        The body is read before the status code is judged. A proxy's HTML error
        page, an empty body, or a 200 carrying the wrong shape all become
        `null`, and `null` is an error — never a success.
      */
      const body: unknown = await response.json().catch(() => null);
      const result = parseContactResponse(body);

      if (!mountedRef.current) return null;

      if (result === null) {
        setErrorCode(response.ok ? "INTERNAL" : codeForStatus(response.status));
        setErrorMessage(
          response.ok
            ? "The server answered in a form this page could not read. Nothing was sent — try again."
            : ERROR_COPY[codeForStatus(response.status)].message
        );
        setStatus("ERROR");
        return null;
      }

      if (result.ok && result.status === "accepted") {
        setReference(result.id);
        setStatus("SUCCESS");
        return null;
      }

      if (result.ok && result.status === "handoff") {
        setHandoff(result.handoff);
        setStatus("HANDOFF");
        return null;
      }

      /* An error body. */
      setErrorCode(result.code);
      setErrorMessage(ERROR_COPY[result.code].message);
      if (result.code === "RATE_LIMIT" && typeof result.retryAfter === "number") {
        setRetryAfter(result.retryAfter);
      }

      if (result.code === "VALIDATION" && result.fields) {
        setErrors(result.fields);
        setStatus("TYPING");
        return firstInvalidField(result.fields);
      }

      setStatus("ERROR");
      return null;
    } catch (error) {
      if (!mountedRef.current) return null;

      const timedOut = controller.signal.aborted && controller.signal.reason === "timeout";

      /*
        A real network failure and a deliberate abort are different things, and
        only one of them is worth retrying. An abort that was not ours means the
        component went away, and the effect's cleanup already handled it.
      */
      if (!timedOut && controller.signal.aborted) return null;

      setErrorCode(timedOut ? "TIMEOUT" : "INTERNAL");
      setErrorMessage(timedOut ? ERROR_COPY.TIMEOUT.message : describeNetworkFailure(error));
      setStatus("ERROR");
      return null;
    } finally {
      clearTimeout(timeout);
      inFlightRef.current = false;
      abortRef.current = null;
    }
  }, [stopDrafting]);

  const clear = useCallback(() => {
    if (inFlightRef.current) return;

    stopDrafting();

    draftRef.current = EMPTY_CONTACT_DRAFT;
    setDraft(EMPTY_CONTACT_DRAFT);
    setErrors({});
    setStatus("IDLE");
    setErrorCode(null);
    setErrorMessage(null);
    setRetryAfter(null);
    setReference(null);
    setHandoff(null);

    /* A fresh draft is a fresh timing signal for the server. */
    renderedAtRef.current = Date.now();
  }, [stopDrafting]);

  const editable = status !== "SENDING" && status !== "SUCCESS" && status !== "HANDOFF";
  const canRetry = status === "ERROR" && (errorCode === null || ERROR_COPY[errorCode].retryable);

  return {
    draft,
    errors,
    status,
    errorMessage,
    errorCode,
    retryAfter,
    canRetry,
    reference,
    handoff,
    drafting,
    editable,
    setField,
    blurField,
    noteDrafting,
    stopDrafting,
    submit,
    clear,
  };
}

/* -------------------------------------------------------------------------- */

/** The draft plus the two values the schema also validates. */
function toPayload(draft: ContactDraft, renderedAt: number): ContactPayload {
  return { ...draft, renderedAt };
}

/** The HTTP status → contract code, for bodies that could not be read. */
function codeForStatus(status: number): ContactErrorCode {
  switch (status) {
    case 400:
      return "VALIDATION";
    case 403:
      return "ORIGIN";
    case 413:
      return "PAYLOAD_TOO_LARGE";
    case 415:
      return "UNSUPPORTED_MEDIA_TYPE";
    case 429:
      return "RATE_LIMIT";
    case 503:
      return "DELIVERY_NOT_CONFIGURED";
    case 504:
      return "TIMEOUT";
    default:
      return "INTERNAL";
  }
}

/**
 * `fetch` rejects with a TypeError for a connection failure and an AbortError
 * for a cancellation. Everything that is not one of those is still a failure to
 * reach the server as far as the visitor is concerned, so the copy does not
 * attempt to diagnose the network stack.
 */
function describeNetworkFailure(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return ERROR_COPY.TIMEOUT.message;
  }

  return NETWORK_COPY.message;
}
