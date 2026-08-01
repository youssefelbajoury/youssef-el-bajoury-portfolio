"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { WhatsAppGlyph } from "@/components/shared/BrandGlyphs";
import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PROFILE, SOCIAL_LINKS } from "@/constants/profile";
import { ResumeTrigger } from "@/features/credibility/resume-center";
import { RULE_COLOR } from "@/styles/material";

import type { ReactNode } from "react";

/**
 * The closing invitation.
 *
 * The one centred composition on the page, and the only place the document
 * stops being a document. Everything else — the material, the mono voice, the
 * rules — is unchanged, so the centre reads as an ending rather than as a
 * different site: same panel, same lamp, same hairlines, one saturated action.
 */
export function ContactPreview() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  return (
    <SectionShell id="contact" labelledBy="contact-title">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="05"
            kicker="Get In Touch"
            titleId="contact-title"
            align="center"
            title="Let’s talk about what’s next."
            statement="I’m currently open to full-time opportunities where I can contribute as a full stack, IoT, or AI-focused engineer. If that sounds like a fit, I’d love to hear from you."
          />
        </motion.div>

        <motion.div variants={item} className="mx-auto mt-48 max-w-[28rem]">
          <Card hover={false} className="flex flex-col items-center gap-24 p-32">
            <AvailabilityBadge />

            <div aria-hidden className="h-px w-full" style={{ backgroundColor: RULE_COLOR }} />

            {/* Three rows, all links now, all set the same way — the address,
                the place, and the number. A row that looks like the two beside
                it and is not clickable is the one a reader taps twice before
                deciding the page is broken. */}
            <div className="flex flex-col items-center gap-12">
              <ContactRow href={SOCIAL_LINKS.email} label={PROFILE.contactEmail}>
                {/* Hairline stroke, matching the frame rules and the crop marks. */}
                <Mail className="size-16" strokeWidth={1.25} aria-hidden />
              </ContactRow>

              <ContactRow
                href={SOCIAL_LINKS.maps}
                label={PROFILE.location}
                external
                describedAs="Open Casablanca, Morocco in Google Maps"
              >
                <MapPin className="size-16" strokeWidth={1.25} aria-hidden />
              </ContactRow>

              <ContactRow
                href={SOCIAL_LINKS.whatsapp}
                label={PROFILE.phone}
                external
                describedAs="Message Youssef on WhatsApp"
              >
                <WhatsAppGlyph className="size-16" aria-hidden />
              </ContactRow>
            </div>

            {/* Two ways out of the page, stacked in the order they are likely
                to be wanted: read the record first, then write. The resume is
                the secondary — the same control as the Hero's, at the same
                amplitude — so the card still closes on exactly one saturated
                object, which is the rule the whole composition is built on.

                `w-full` on both, because a bordered control at its natural
                width above a full-bleed one would leave a step in the card's
                right edge; the card is a column and its controls are the
                bottom of it. */}
            <div className="flex w-full flex-col gap-12">
              <ResumeTrigger className="w-full" />

              <Button href={SOCIAL_LINKS.email} variant="primary" className="w-full">
                Let’s Build Something Great
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

interface ContactRowProps {
  href: string;
  label: string;
  /** Opens in a new tab, and says so to a screen reader. */
  external?: boolean;
  /** The accessible name, when the visible label alone would not say enough. */
  describedAs?: string;
  children: ReactNode;
}

/**
 * One line of the contact card: a hairline glyph and a mono string.
 *
 * All three rows go through here so they cannot drift apart — the row that
 * opens a map and the row that opens a mail client have to be the same object,
 * or the page is quietly telling the reader that one of them is not a control.
 *
 * The hit area is the whole row rather than the text, and it clears 44px with
 * the 12px of vertical padding: these sit under a thumb on a phone, and a 20px
 * tap target for the one thing the page is asking a reader to do is the most
 * expensive small mistake on the site.
 */
function ContactRow({ href, label, external = false, describedAs, children }: ContactRowProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex min-h-[44px] items-center gap-8 rounded-sm px-8 font-mono text-paragraph-sm text-text-secondary transition-colors duration-fast ease-premium hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {children}
      {label}
      {describedAs ? <span className="sr-only">— {describedAs}, opens in a new tab</span> : null}
    </a>
  );
}
