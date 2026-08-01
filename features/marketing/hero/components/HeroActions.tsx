import { SOCIAL_LINKS } from "@/constants/profile";
import { ResumeTrigger } from "@/features/credibility/resume-center";

import {
  ACTION_GLASS,
  ACTION_SPECULAR,
  PRIMARY_ACTION_SHADOW,
  SECONDARY_ACTION_BORDER,
  SECONDARY_ACTION_BORDER_HOVER,
  SECONDARY_ACTION_SHADOW,
} from "../heroMaterial";
import { ENTRANCE } from "../heroMotion";

import { MagneticAction } from "./MagneticAction";

/**
 * Two actions, and a third on its own line.
 *
 * Local to the Hero rather than the shared <Button>, for three reasons that
 * all trace back to this brief: the shared button carries a cyan glow (a glow
 * is emitted light, which would be a second light source in a composition
 * built on one), a magnetic cursor pull tuned for a different context, and a
 * full pill radius that fights the rectilinear grid the rest of the Hero is
 * drawn on. Every other section keeps using the shared button unchanged.
 *
 * Depth here is lighting, not decoration: a lit top bevel, a shaded bottom
 * edge, and a shadow cast down-and-right — the same physics as the plate.
 *
 * THE TWO ARE NOT PEERS, and the motion is where that gets said. The primary
 * has a magnetic field, a fixed glass sheen and a highlight that tracks the
 * cursor. The secondary brightens one hairline and nudges its arrow 2px. If
 * both responded richly the page would be offering two primary actions, which
 * is the same as offering none.
 *
 * THE THIRD SITS BELOW THE OTHER TWO, on its own line, and is the reason the
 * row is now wrapped. It is a peer of the GitHub control, not of the primary —
 * same recipe, same amplitude, one glyph different (see resumeAction.ts). Put
 * on the same line it would have made a row of three, which reads as a toolbar;
 * on its own line it reads as what it is, a second way in for a reader who has
 * decided to look further but is not ready to write.
 */

const ACTION_BASE =
  "inline-flex h-48 items-center justify-center gap-8 rounded-sm px-32 text-paragraph-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

export function HeroActions() {
  return (
    <div className="flex flex-col items-stretch gap-16">
      <div className="flex flex-col items-stretch gap-16 sm:flex-row sm:items-center">
        {/* The only saturated object above the fold. Everything else in the
          Hero is white, grey or hairline — which is what lets one cyan
          rectangle carry the weight of a call to action without shouting. */}
        <MagneticAction
          href="#contact"
          fieldClassName="w-full animate-hero-rise sm:w-auto"
          className={`${ACTION_BASE} group/action relative w-full overflow-hidden bg-accent text-accent-ink will-change-transform focus-visible:outline-accent sm:w-auto`}
          style={{
            boxShadow: PRIMARY_ACTION_SHADOW,
            animationDelay: `${ENTRANCE.primaryAction}ms`,
          }}
        >
          {/* Glass, always on. This is the curvature of the surface, not a
            state — the button has a face at rest or it never reads as an
            object at all. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: ACTION_GLASS }}
          />

          {/* The specular highlight, tracking the cursor via --action-px/py.
            Reflected, not emitted: the Hero has exactly one light source and
            a button is not allowed to be a second one. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-medium ease-premium group-hover/action:opacity-100"
            style={{ backgroundImage: ACTION_SPECULAR }}
          />

          {/* A typographic apostrophe (U+2019), not the straight one.
            `&apos;` is the typewriter mark — a vertical tick, at 14px semibold on
            the single most looked-at word in the section. Nobody reads it as an
            error and everybody reads it as unset type; it is the smallest and
            most reliable tell that a page was typed rather than typeset. Same
            word, correct glyph. */}
          <span className="relative">Let’s Work Together</span>
        </MagneticAction>

        {/* `group/action` is named rather than bare: the secondary sits inside
          the same subtree as other groups on the page, and an unnamed group
          would let the plate's hover drive this arrow. */}
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noreferrer"
          className={`${ACTION_BASE} group/action animate-hero-rise border bg-transparent text-text-primary transition-colors duration-medium ease-premium hover:[border-color:var(--action-border-hover)] focus-visible:outline-border-strong`}
          style={
            {
              "--action-border-hover": SECONDARY_ACTION_BORDER_HOVER,
              borderColor: SECONDARY_ACTION_BORDER,
              boxShadow: SECONDARY_ACTION_SHADOW,
              animationDelay: `${ENTRANCE.secondaryAction}ms`,
            } as React.CSSProperties
          }
        >
          GitHub
          <ExternalArrow />
        </a>
      </div>

      {/* The entrance rides on a wrapper rather than on the control itself.
          `animate-hero-rise` animates transform, opacity and filter, and the
          trigger inside is a Framer component: two owners of one element's
          transform is the reliable way to get an entrance that never finishes.
          The wrapper carries the CSS; the button carries the gesture. */}
      <div className="animate-hero-rise" style={{ animationDelay: `${ENTRANCE.resumeAction}ms` }}>
        <ResumeTrigger className="w-full sm:w-auto" />
      </div>
    </div>
  );
}

/**
 * Drawn inline rather than pulled from the icon set so its stroke can be set
 * to 1.25 — the same hairline weight as the frame rules, the crop marks and
 * the registration marks. An icon library's default 2px stroke would be the
 * heaviest line in the composition, which is precisely backwards for a glyph
 * this small.
 *
 * On hover it travels 2px along its own diagonal — up and to the right, the
 * direction it points. Two pixels, because the arrow is 16px: any further and
 * a glyph that is meant to indicate "this leaves the site" starts performing.
 */
function ExternalArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-16 transition-transform duration-medium ease-premium group-hover/action:translate-x-[2px] group-hover/action:translate-y-[-2px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 10.5 10.5 5.5" />
      <path d="M6.25 5.5h4.25v4.25" />
    </svg>
  );
}
