import type { ContactDraft } from "./contactSchema";

const CHANNEL_LABEL = {
  email: "Email",
  whatsapp: "WhatsApp",
  either: "Either",
} as const;

/**
 * The draft as plain text, for the visitor to paste into their own mail client.
 *
 * This is the only place the form turns a draft into something a person could
 * send, and it deliberately does not include the honeypot or the render time —
 * those are anti-bot signals, not parts of a message.
 */
export function buildHandoffText(draft: ContactDraft): string {
  const name = `${draft.firstName} ${draft.lastName}`.trim();

  return [
    `From: ${name}`,
    draft.company ? `Company: ${draft.company}` : null,
    `Reply to: ${draft.contact}`,
    `Preferred channel: ${CHANNEL_LABEL[draft.preferredChannel]}`,
    "",
    draft.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
