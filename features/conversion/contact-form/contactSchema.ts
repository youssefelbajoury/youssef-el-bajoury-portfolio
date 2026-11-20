import { z } from "zod";

/*
  ─────────────────────────────────────────────────────────────────────────────
  THE CONTACT CONTRACT
  ─────────────────────────────────────────────────────────────────────────────
  One schema, imported by the form and by the route. The client copy is a
  convenience; the server always re-parses, and the server's parse is the only
  one that decides whether a message is accepted.

  The email-or-phone field is one input with a discriminated parse: an `@`
  means it must be an email address, anything else must be a dialable number.
  That is the field's actual job — the visitor chooses the channel, not the
  shape of the string.

  CRLF IS REJECTED IN EVERY SINGLE-LINE FIELD. Those values are the ones that
  can end up in a mail header; a newline in a name is not a formatting choice,
  it is an injection attempt. The message body is the exception: it is a
  paragraph and is allowed to contain line breaks.
*/

export const PREFERRED_CHANNELS = ["email", "whatsapp", "either"] as const;
export type PreferredChannel = (typeof PREFERRED_CHANNELS)[number];

export const CONTACT_FIELDS = [
  "firstName",
  "lastName",
  "company",
  "contact",
  "preferredChannel",
  "message",
  "website",
  "renderedAt",
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

/** What the form holds while it is being filled. */
export interface ContactDraft {
  firstName: string;
  lastName: string;
  company: string;
  contact: string;
  preferredChannel: PreferredChannel;
  message: string;
  website: string;
}

export const EMPTY_CONTACT_DRAFT: ContactDraft = {
  firstName: "",
  lastName: "",
  company: "",
  contact: "",
  preferredChannel: "either",
  message: "",
  website: "",
};

/** The order a keyboard reader should be sent through when submission fails. */
export const CONTACT_FIELD_ORDER: readonly ContactField[] = [
  "firstName",
  "lastName",
  "company",
  "contact",
  "preferredChannel",
  "message",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]{5,19}$/;
const LINK_PATTERN = /(https?:\/\/|www\.)\S+/gi;

/** An `@` selects the email branch; otherwise the value must be a phone number. */
export function isEmailOrPhone(value: string): boolean {
  if (value.includes("@")) return EMAIL_PATTERN.test(value);

  const digits = value.replace(/\D/g, "");

  return PHONE_PATTERN.test(value) && digits.length >= 6 && digits.length <= 15;
}

export function countLinks(value: string): number {
  return (value.match(LINK_PATTERN) ?? []).length;
}

export const contactSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Enter your first name (at least 2 characters).")
      .max(60, "First name is too long (60 characters maximum)."),
    lastName: z
      .string()
      .trim()
      .min(2, "Enter your last name (at least 2 characters).")
      .max(60, "Last name is too long (60 characters maximum)."),
    company: z
      .string()
      .trim()
      .max(80, "Company is too long (80 characters maximum).")
      .optional()
      .default(""),
    contact: z
      .string()
      .trim()
      .min(5, "Enter an email address or a phone number.")
      .max(120, "This field is too long (120 characters maximum)."),
    preferredChannel: z.enum(PREFERRED_CHANNELS).default("either"),
    message: z
      .string()
      .trim()
      .min(40, "Write at least 40 characters so there is enough to reply to.")
      .max(2000, "Message is too long (2000 characters maximum)."),
    /** The honeypot. A human never sees it, so a value is a bot. */
    website: z.string().max(0, "This field must stay empty."),
    /** Milliseconds since the epoch, set when the form mounts. */
    renderedAt: z.coerce
      .number()
      .int("Refresh the page and try again.")
      .positive("Refresh the page and try again."),
  })
  .superRefine((value, ctx) => {
    const singleLineFields: readonly [ContactField, string][] = [
      ["firstName", value.firstName],
      ["lastName", value.lastName],
      ["company", value.company],
      ["contact", value.contact],
    ];

    for (const [field, text] of singleLineFields) {
      if (/[\r\n]/.test(text)) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "Remove line breaks from this field.",
        });
      }
    }

    if (!isEmailOrPhone(value.contact)) {
      ctx.addIssue({
        code: "custom",
        path: ["contact"],
        message: "Enter an email address or a phone number with country code.",
      });
    }

    if (countLinks(value.message) > 2) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Include at most two links in the message.",
      });
    }
  });

export type ContactPayload = z.output<typeof contactSchema>;

export type ContactValidation =
  { success: true; data: ContactPayload } | { success: false; fields: ContactFieldErrors };

/**
 * Parse and flatten the first issue per field.
 *
 * The first issue is the one shown, because a field with three complaints is a
 * field whose reader stops reading after the first. The server re-parses the
 * same way; the client is never the authority.
 */
export function validateContact(input: unknown): ContactValidation {
  const parsed = contactSchema.safeParse(input);

  if (parsed.success) return { success: true, data: parsed.data };

  const fields: ContactFieldErrors = {};

  for (const issue of parsed.error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      CONTACT_FIELDS.includes(field as ContactField) &&
      fields[field as ContactField] === undefined
    ) {
      fields[field as ContactField] = issue.message;
    }
  }

  return { success: false, fields };
}

export function firstInvalidField(errors: ContactFieldErrors): ContactField | null {
  return CONTACT_FIELD_ORDER.find((field) => errors[field] !== undefined) ?? null;
}

/* -------------------------------------------------------------------------- */
/* The route's response contract                                               */
/* -------------------------------------------------------------------------- */

export interface ContactAcceptedResponse {
  ok: true;
  status: "accepted";
  id: string;
}

export interface ContactHandoffResponse {
  ok: true;
  status: "handoff";
  handoff: {
    channel: "email" | "whatsapp";
    href: string;
  };
}

export type ContactErrorCode =
  | "VALIDATION"
  | "ORIGIN"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMIT"
  | "DELIVERY_NOT_CONFIGURED"
  | "TIMEOUT"
  | "INTERNAL";

export const CONTACT_ERROR_CODES: readonly ContactErrorCode[] = [
  "VALIDATION",
  "ORIGIN",
  "UNSUPPORTED_MEDIA_TYPE",
  "PAYLOAD_TOO_LARGE",
  "RATE_LIMIT",
  "DELIVERY_NOT_CONFIGURED",
  "TIMEOUT",
  "INTERNAL",
];

export interface ContactErrorResponse {
  ok: false;
  code: ContactErrorCode;
  fields?: ContactFieldErrors;
  retryAfter?: number;
}

export type ContactResponse =
  ContactAcceptedResponse | ContactHandoffResponse | ContactErrorResponse;

export function isAcceptedResponse(
  response: ContactResponse | null
): response is ContactAcceptedResponse {
  return (
    response !== null &&
    response.ok === true &&
    response.status === "accepted" &&
    typeof response.id === "string" &&
    response.id.length > 0
  );
}

export function isHandoffResponse(
  response: ContactResponse | null
): response is ContactHandoffResponse {
  return (
    response !== null &&
    response.ok === true &&
    response.status === "handoff" &&
    (response.handoff.channel === "email" || response.handoff.channel === "whatsapp") &&
    typeof response.handoff.href === "string" &&
    response.handoff.href.length > 0
  );
}

export function isContactFieldErrors(value: unknown): value is ContactFieldErrors {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;

  for (const [key, message] of Object.entries(value)) {
    if (!CONTACT_FIELDS.includes(key as ContactField)) return false;
    if (typeof message !== "string" || message.length === 0) return false;
  }

  return true;
}

/**
 * Read a response body without trusting its shape.
 *
 * The form's state machine keys off `ok` and `status`, and `SUCCESS` must be
 * reachable only from a body that actually says `{status:"accepted"}`. Parsing
 * here means every branch is decided by a validated object rather than by
 * `response.ok` — an HTTP 200 carrying an error, or a proxy's HTML error page,
 * lands in the error branch where it belongs.
 */
export function parseContactResponse(body: unknown): ContactResponse | null {
  if (body === null || typeof body !== "object" || Array.isArray(body)) return null;

  const record = body as Record<string, unknown>;

  if (record.ok === true) {
    if (record.status === "accepted") {
      return isAcceptedResponse(body as ContactResponse) ? (body as ContactAcceptedResponse) : null;
    }

    if (record.status === "handoff") {
      return isHandoffResponse(body as ContactResponse) ? (body as ContactHandoffResponse) : null;
    }

    return null;
  }

  if (record.ok === false) {
    const code = record.code;

    if (typeof code !== "string" || !CONTACT_ERROR_CODES.includes(code as ContactErrorCode)) {
      return null;
    }

    const response: ContactErrorResponse = { ok: false, code: code as ContactErrorCode };

    if (isContactFieldErrors(record.fields)) response.fields = record.fields;
    if (typeof record.retryAfter === "number" && Number.isFinite(record.retryAfter)) {
      response.retryAfter = record.retryAfter;
    }

    return response;
  }

  return null;
}
