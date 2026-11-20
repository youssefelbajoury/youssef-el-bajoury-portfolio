"use client";

import { useCallback } from "react";

import { Button } from "@/components/ui/Button";
import { RULE_COLOR } from "@/styles/material";

import { FloatingField } from "./components/FloatingField";
import { FormStatus } from "./components/FormStatus";
import { HandoffPanel } from "./components/HandoffPanel";
import { PREFERRED_CHANNELS } from "./contactSchema";
import { useContactForm } from "./useContactForm";

import type { ContactField, PreferredChannel } from "./contactSchema";
import type { FormEvent } from "react";

const CHANNEL_LABEL: Record<PreferredChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  either: "Either",
};

/**
 * The control that owns focus for each field, for the invalid-submit jump.
 *
 * The contact field's element id is `contactDetails`, not `contact`: the
 * section already owns `id="contact"` for the dock anchor, and two elements
 * sharing an id would make `getElementById` return the section — a non-focusable
 * landmark with no label association. The payload key stays `contact`.
 */
const FOCUS_ID: Record<ContactField, string> = {
  firstName: "firstName",
  lastName: "lastName",
  company: "company",
  contact: "contactDetails",
  preferredChannel: "preferredChannel-email",
  message: "message",
  website: "website",
  renderedAt: "",
};

/**
 * The recruiter form, mounted inside the contact card.
 *
 * It is not a second contact section: the invitation, the address, the number
 * and the form are one block, because a page that asks a reader to choose
 * between "email me" and "fill this in" has made its own job harder.
 *
 * VALIDATION IS ON BLUR AND SUBMIT ONLY. Nothing here validates while a key is
 * down; `noValidate` suppresses the browser's own bubbles so the page's copy is
 * the only copy, and the first invalid field takes focus on submit.
 */
export function RecruiterContactForm() {
  const {
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
  } = useContactForm();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const invalid = await submit();
      if (!invalid) return;

      const id = FOCUS_ID[invalid];
      if (!id) return;

      document.getElementById(id)?.focus();
    },
    [submit]
  );

  const sending = status === "SENDING";

  return (
    <form
      noValidate
      aria-busy={sending}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-20 text-left"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
          Direct message
        </p>
        <p className="mt-8 text-paragraph-sm text-text-secondary">
          Write here and the server will validate it. Nothing is delivered until you send it.
        </p>
      </div>

      <div className="grid gap-16 sm:grid-cols-2">
        <FloatingField
          id="firstName"
          label="First name"
          value={draft.firstName}
          onChange={(value) => setField("firstName", value)}
          onBlur={() => blurField("firstName")}
          error={errors.firstName}
          autoComplete="given-name"
          required
          disabled={!editable}
        />

        <FloatingField
          id="lastName"
          label="Last name"
          value={draft.lastName}
          onChange={(value) => setField("lastName", value)}
          onBlur={() => blurField("lastName")}
          error={errors.lastName}
          autoComplete="family-name"
          required
          disabled={!editable}
        />
      </div>

      <FloatingField
        id="company"
        label="Company (optional)"
        value={draft.company}
        onChange={(value) => setField("company", value)}
        onBlur={() => blurField("company")}
        error={errors.company}
        autoComplete="organization"
        disabled={!editable}
      />

      <FloatingField
        id="contactDetails"
        label="Email or WhatsApp number"
        value={draft.contact}
        onChange={(value) => setField("contact", value)}
        onBlur={() => blurField("contact")}
        error={errors.contact}
        hint="sara@example.com or +212 6 12 34 56 78"
        type="text"
        autoComplete="email"
        required
        disabled={!editable}
      />

      <fieldset disabled={!editable}>
        <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
          Preferred response channel
        </legend>

        <div className="mt-8 grid grid-cols-3 gap-8">
          {PREFERRED_CHANNELS.map((channel) => (
            <label
              key={channel}
              className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-sm border border-[rgba(255,255,255,0.09)] font-mono text-[11px] tracking-[0.04em] text-text-tertiary transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] has-[:checked]:border-[rgba(46,230,255,0.5)] has-[:checked]:text-text-primary has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent"
            >
              <input
                id={`preferredChannel-${channel}`}
                type="radio"
                name="preferredChannel"
                value={channel}
                checked={draft.preferredChannel === channel}
                onChange={() => setField("preferredChannel", channel)}
                className="sr-only"
              />
              {CHANNEL_LABEL[channel]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <FloatingField
          id="message"
          label="Message"
          value={draft.message}
          onChange={(value) => {
            setField("message", value);
            noteDrafting();
          }}
          onBlur={() => {
            blurField("message");
            stopDrafting();
          }}
          error={errors.message}
          hint="At least 40 characters. Include the role, the team, and the timeline if you can."
          multiline
          rows={5}
          maxLength={2000}
          required
          disabled={!editable}
        />

        {/* The drafting indicator. It is a state, not a claim, and it never
            inserts anything into the field. `aria-hidden` because a screen
            reader gains nothing from being told that someone is typing. */}
        <div aria-hidden className="mt-4 flex min-h-[18px] items-center gap-8">
          {drafting ? (
            <>
              <span className="h-[2px] w-24 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-tertiary">
                Drafting…
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* The honeypot. Off-screen rather than `display:none`, because some bots
          skip hidden inputs, and out of the tab order because no human should
          ever land in it. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={draft.website}
          onChange={(event) => setField("website", event.target.value)}
        />
      </div>

      {status === "HANDOFF" && handoff ? (
        <HandoffPanel handoff={handoff} draft={draft} onClear={clear} />
      ) : (
        <FormStatus
          status={status}
          errorMessage={errorMessage}
          errorCode={errorCode}
          retryAfter={retryAfter}
          canRetry={canRetry}
          reference={reference}
          onRetry={() => void submit()}
        />
      )}

      {status === "SUCCESS" ? (
        <button
          type="button"
          onClick={clear}
          className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[rgba(255,255,255,0.12)] px-16 font-mono text-[11px] tracking-[0.08em] text-text-secondary transition-colors duration-fast ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Start another message
        </button>
      ) : null}

      {editable || sending ? (
        <>
          <div aria-hidden className="h-px w-full" style={{ backgroundColor: RULE_COLOR }} />

          <Button type="submit" variant="primary" disabled={sending} className="w-full">
            {sending ? (
              <>
                <span
                  aria-hidden
                  className="inline-block size-12 animate-spin rounded-full border border-[rgba(255,255,255,0.28)] border-t-[var(--color-background)] motion-reduce:animate-none"
                />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </Button>

          <p className="text-center font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-text-tertiary">
            Your details are used only to reply to this message. They are not stored on this site.
          </p>
        </>
      ) : null}
    </form>
  );
}
