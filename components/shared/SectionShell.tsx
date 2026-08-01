import { GRAIN_OPACITY, GRAIN_TEXTURE, KEY_LIGHT, RULE_COLOR } from "@/styles/material";

import { CropMarks, FrameRule } from "./PageFrame";

import type { ReactNode } from "react";

/**
 * A section, drawn the way the Hero is drawn.
 *
 * Every section on the page is mounted in one of these, and that is what makes
 * the site read as one document rather than as a designed hero above a stack of
 * blocks. Four layers, in the order light actually reaches a sheet of paper:
 *
 *   1. THE KEY LIGHT, at the section's own top-left corner. Every bevel inside
 *      the section — panel edges, button faces, the status lamp — is derived
 *      from a lamp in that position, so each section has to actually have one
 *      or the material system is describing a light that is not there.
 *   2. THE GRAIN, which dithers the near-black gradient. Banding is the single
 *      most common tell of a dark theme that was not finished.
 *   3. THE DRAFTED FRAME: a ruled top edge carrying the twelve-column ticks,
 *      crop marks at the corners, a ruled bottom edge. The frame is inset to
 *      the content column rather than bled to the viewport, because inset reads
 *      as a printed page and full-bleed reads as a divider.
 *   4. THE SEAM at the very bottom of the section — the hairline the next
 *      section rises out of. It replaces the `border-t` every section used to
 *      carry: same idea, but at the frame's own value (6% white) rather than at
 *      the token border, so all the horizontals on the page agree.
 *
 * The whole thing is a server component. Sections that need motion or pointer
 * behaviour wrap their own contents; nothing here crosses into the client.
 */

interface SectionShellProps {
  /** DOM id, and the hash the dock navigates to. */
  id: string;
  children: ReactNode;
  /** Points at the id of the section's own heading. */
  labelledBy?: string;
  /** Extra classes on the <section> element itself. */
  className?: string;
  /**
   * Vertical air inside the frame. `tall` is for the two sections that carry
   * composed objects rather than type — Projects and Location — where the
   * default rhythm crowds them.
   */
  air?: "default" | "tall";
}

/**
 * The air inside the frame, and the reason it is two values rather than one.
 *
 * A section's total vertical rhythm is this plus the shell's own padding
 * outside the frame, so the seam between two sections is four of these numbers
 * stacked. At the previous settings that came to 304px between two default
 * sections at desktop, which reads as generous on a 27-inch display and as a
 * gap on a laptop.
 *
 * Everything here came down by about a fifth in one pass — 152 → 120 per side
 * at desktop, 120 → 96 at mobile — which tightens the page without touching a
 * single value inside a section. The proportions between the two tiers are
 * unchanged, so the rhythm is the same rhythm, played closer together. The Hero
 * is not a SectionShell and is untouched.
 */
const AIR: Record<NonNullable<SectionShellProps["air"]>, string> = {
  default: "py-48 md:py-56",
  tall: "py-56 md:py-80",
};

export function SectionShell({
  id,
  children,
  labelledBy,
  className = "",
  air = "default",
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      /*
        `relative` is load-bearing, and it is why controls inside a section are
        clickable at all. GlobalBackground is a `position: fixed` layer at
        z-index 0 with pointer events left on; a positioned element at z-index 0
        paints above every non-positioned block on the page, so an unpositioned
        section sits *underneath* it for hit-testing while still being perfectly
        visible through it — the schematic is only a few percent opaque.
      */
      className={`relative overflow-hidden ${className}`}
    >
      {/* The key light. The two radii are percentages of a box whose aspect
          ratio changes completely between a phone and a display: wide and
          shallow on mobile, where the desktop pair would smear the light down
          the left edge as a vertical band. Same lamp, three framings. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [--key-light-h:30%] [--key-light-w:130%] md:[--key-light-h:44%] md:[--key-light-w:96%] lg:[--key-light-h:58%] lg:[--key-light-w:74%]"
        style={{ backgroundImage: KEY_LIGHT }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: GRAIN_TEXTURE, opacity: GRAIN_OPACITY }}
      />

      <div className="relative mx-auto w-full max-w-content px-24 py-48 md:px-32 md:py-64">
        {/* The drafted page. Crop marks hang outside this box, which is why it
            owns the positioning context rather than the padded parent. */}
        <div className="relative">
          <CropMarks />
          <FrameRule withTicks />
          <div className={AIR[air]}>{children}</div>
          <FrameRule />
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ backgroundColor: RULE_COLOR }}
      />
    </section>
  );
}
