"use client";

import { motion, useReducedMotion } from "framer-motion";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { TiltCard } from "@/components/shared/TiltCard";
import { PROFILE, SOCIAL_LINKS } from "@/constants/profile";
import { PANEL_BORDER, PANEL_EDGES, PANEL_FILL, RULE_COLOR } from "@/styles/material";

import { LocalTimeBadge } from "./LocalTimeBadge";
import { ReachPlate } from "./ReachPlate";

import type { CSSProperties } from "react";

/**
 * Read as a spec sheet rather than prose — three facts, no adjectives. This is
 * the "engineering dashboard" half of the brief, and it earns its place by
 * being scannable in about a second.
 */
const SPEC_ROWS = [
  { label: "Base", value: PROFILE.location },
  { label: "Reach", value: "Available worldwide" },
  { label: "Mode", value: "Remote-friendly" },
] as const;

/**
 * The read-out over the plate. Rendered on the plate on large screens and in
 * flow beneath it on small ones — overlaying a 240px-tall plate on a phone
 * would bury the thing it annotates.
 *
 * A drawing-office annotation panel, not a glass chip: the page's own panel
 * material, lit from the upper left like every other surface, with the location
 * set in sans (it is a place a person is) between two mono fields (they are
 * catalogue entries).
 */
function LocationCallout() {
  return (
    <div
      className="rounded-sm border p-20"
      style={{ background: PANEL_FILL, borderColor: PANEL_BORDER, boxShadow: PANEL_EDGES }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
        Currently based in
      </p>
      <p className="mt-8 text-h6 font-medium tracking-tight text-text-primary">
        {PROFILE.location}
      </p>
      <div aria-hidden className="my-16 h-px" style={{ backgroundColor: RULE_COLOR }} />
      <p className="font-mono text-[11px] tracking-[0.14em] text-text-secondary">
        Available worldwide &middot; Remote-friendly
      </p>
    </div>
  );
}

/**
 * Location.
 *
 * Sits ahead of the contact CTA because it answers the question that gates it —
 * "where is this person, and can they work with us?" — before asking for the
 * conversation.
 *
 * The panel is tilted at rest and levels out under the pointer, so it reads as
 * an object set down on the page rather than a rectangle painted onto it. All
 * of it is CSS, SVG and Framer Motion: no map library, no tiles, no WebGL.
 */
export function LocationPanel() {
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  // ReachPlate reads its ink from this. The plate is drawn in the site's one
  // accent rather than in a second cyan of its own.
  const accentVars = { "--project-accent-rgb": "46 230 255" } as CSSProperties;

  return (
    <SectionShell id="location" labelledBy="location-title" air="tall">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
        style={accentVars}
        className="grid grid-cols-1 items-center gap-48 lg:grid-cols-12 lg:gap-64"
      >
        <div className="lg:col-span-5">
          <motion.div variants={item}>
            <SectionHeading
              index="04"
              kicker="Current Location"
              titleId="location-title"
              title="Based in Morocco."
              statement="Building production-grade software from Casablanca for companies around the world."
            />
          </motion.div>

          {/* A spec sheet, so it takes a spec sheet's rules: the hairline is
              the frame's own value rather than the token border, which is what
              stops this table reading as a different drawing from the frame
              enclosing it. */}
          <motion.dl variants={item} className="mt-48">
            {SPEC_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-24 border-t py-16"
                style={{ borderColor: RULE_COLOR }}
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                  {row.label}
                </dt>
                <dd className="font-mono text-[11px] tracking-[0.14em] text-text-primary">
                  {row.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div variants={item} className="lg:col-span-7">
          <TiltCard
            className="p-12 md:p-16"
            maxTilt={4}
            magnetism={5}
            restingTilt={{ x: 5, y: -7 }}
          >
            {/*
              The plate answers the pointer with one hairline and nothing else.

              0.055 → 0.14 white on the border, over 400ms. No scale, because a
              map that grows under the cursor stops being a map and starts being
              a card; no glow, because the page has one light source and it is
              not behind this plate; no tint, because the site has one saturated
              colour and it is not spent on a hover state. What is left is the
              edge coming up a little, which is precisely enough to say the
              object is live.

              BOTH VALUES ARE CUSTOM PROPERTIES, and that is not a style choice.
              The resting colour used to be an inline `borderColor`, and an
              inline declaration outranks every class in the cascade — a
              `group-hover:` border rule would have been dead on arrival, with
              nothing to show for it and no error to explain why. Handing the
              cascade two variables and letting classes pick between them is the
              only form of this that actually runs. Same pattern as the Hero's
              registration marks.
            */}
            <div
              className="relative cursor-pointer overflow-hidden rounded-sm border transition-colors duration-medium ease-premium [border-color:var(--plate-edge)] group-hover:[border-color:var(--plate-edge-hover)]"
              style={
                {
                  "--plate-edge": PANEL_BORDER,
                  "--plate-edge-hover": "rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.22)",
                } as CSSProperties
              }
            >
              <div className="aspect-[640/440]">
                <ReachPlate />
              </div>

              {/*
                The plate is a map, so it opens a map.

                A drawn map that cannot be opened is the one element on the page
                that looks interactive and is not — every reader tries it. The
                trigger is an overlay rather than a wrapper for the same reason
                the case-study cards use one: <a> takes phrasing content, and
                this box holds an SVG figure, a live clock and an annotation
                panel.

                It sits *under* the badge and the callout in paint order (they
                come after it in the DOM), so the clock stays readable and the
                callout's own text is still selectable — but everything else on
                the plate, which is all of it, is the link.
              */}
              <a
                href={SOCIAL_LINKS.maps}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong"
              >
                <span className="sr-only">
                  Open {PROFILE.location} in Google Maps, opens in a new tab
                </span>
              </a>

              <div className="pointer-events-none absolute right-12 top-12 md:right-16 md:top-16">
                <LocalTimeBadge />
              </div>

              {/*
                The affordance, and it is printed rather than hovered.

                A clickable plate with no mark on it is a control only a mouse
                user can discover, and only by accident — the pointer changes
                shape and nothing else does. A hover-revealed label is worse: it
                does not exist at all on a touch screen, which is where the
                plate is most obviously a map. So the label is always there, set
                as a drawing-office annotation at the same 11px mono as every
                other field, and it brightens with the rest of the group under
                the pointer.
              */}
              <p
                aria-hidden
                /* Top left, not bottom right. Bottom right is where the plate
                   prints AFRICA, and two 11px mono strings in the same corner
                   read as one broken string. This corner is empty at every
                   width, and it balances the live clock opposite it. */
                className="pointer-events-none absolute left-12 top-12 inline-flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary transition-colors duration-medium ease-premium group-hover:text-text-secondary md:left-16 md:top-16"
              >
                Open in Google Maps
                <svg
                  viewBox="0 0 16 16"
                  className="size-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5.5 10.5 10.5 5.5M6.25 5.5h4.25v4.25" />
                </svg>
              </p>

              {/* Overlaid only from xl up. Between lg and xl the plate is
                  ~490px wide, and the callout there sits directly on top of
                  the pin and its CASABLANCA label — burying the one thing the
                  plate exists to show. Below xl it drops into flow instead. */}
              {/* `pointer-events-none` so the annotation does not punch a dead
                  rectangle in the middle of the link underneath it. It is a
                  label on the map, not a control beside it. */}
              <div className="pointer-events-none absolute bottom-16 left-16 hidden max-w-[17rem] xl:block">
                <LocationCallout />
              </div>
            </div>

            <div className="mt-12 xl:hidden">
              <LocationCallout />
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
