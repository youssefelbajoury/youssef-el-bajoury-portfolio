import { PROFILE } from "@/constants/profile";
import type { ContactPayload } from "@/features/conversion/contact-form/contactSchema";
import { buildHandoffText } from "@/features/conversion/contact-form/handoffText";

/*
  The handoff destination.
  
  Built on the server so the client never needs to know the destination address
  or the WhatsApp number. `either` resolves to email, because email is the
  channel that keeps a written record for both sides.
*/

export interface Handoff {
  channel: "email" | "whatsapp";
  href: string;
}

export function buildHandoff(payload: ContactPayload): Handoff {
  const text = buildHandoffText(payload);
  const name = `${payload.firstName} ${payload.lastName}`.trim();
  const subject = payload.company
    ? `Portfolio message from ${name} (${payload.company})`
    : `Portfolio message from ${name}`;

  if (payload.preferredChannel === "whatsapp") {
    const digits = PROFILE.phone.replace(/\D/g, "");

    return {
      channel: "whatsapp",
      href: `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
    };
  }

  return {
    channel: "email",
    href: `mailto:${PROFILE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
  };
}
