import type { ContactPayload } from "@/features/conversion/contact-form/contactSchema";

/*
  ─────────────────────────────────────────────────────────────────────────────
  THE DELIVERY SEAM
  ─────────────────────────────────────────────────────────────────────────────
  One interface, and today exactly one implementation: `none`. It does not
  pretend to send — it throws a typed error, and the route turns that error into
  a handoff response rather than into a failure, because "validated, but no
  provider is configured" is a real outcome that the visitor can act on.

  Adding Resend or SMTP later means adding one object here and setting
  `CONTACT_DELIVERY_PROVIDER`. The route, the validation, the limiter and the
  form do not change. No provider is selected, installed, or called in Phase 9.
*/

export interface ContactMessage extends ContactPayload {
  /** Correlates a log line with a response without carrying personal data. */
  requestId: string;
}

export interface DeliveryAdapter {
  readonly id: "none" | "resend" | "smtp";
  send(input: ContactMessage, signal: AbortSignal): Promise<{ id: string }>;
}

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super("No contact delivery provider is configured.");
    this.name = "DeliveryNotConfiguredError";
  }
}

const noneAdapter: DeliveryAdapter = {
  id: "none",
  async send() {
    throw new DeliveryNotConfiguredError();
  },
};

/**
 * The adapter for the configured provider.
 *
 * `resend` and `smtp` are deliberately not implemented: selecting them before a
 * provider is approved and a domain verified would produce a form that accepts
 * messages and then fails. Until then they resolve to `none`, which hands off.
 */
export function getDeliveryAdapter(provider: "none" | "resend" | "smtp"): DeliveryAdapter {
  switch (provider) {
    case "resend":
    case "smtp":
    case "none":
    default:
      return noneAdapter;
  }
}
