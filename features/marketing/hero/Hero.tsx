import { CropMarks, FrameRule } from "@/components/shared/PageFrame";

import { CapabilityIndex } from "./components/CapabilityIndex";
import { EngineeringScene } from "./components/EngineeringScene";
import { HeroActions } from "./components/HeroActions";
import { HeroStage } from "./components/HeroStage";
import { SpecimenPlate } from "./components/SpecimenPlate";
import { TraceField } from "./components/TraceField";
import {
  HERO_AVAILABILITY,
  HERO_COORDINATES,
  HERO_HEADLINE,
  HERO_HEADLINE_OPTICAL,
  HERO_STATEMENT,
} from "./heroContent";
import {
  BACKGROUND_SCRIM,
  GRAIN_TEXTURE,
  KEY_LIGHT,
  LEDE_RULE,
  RULE_COLOR,
  STATUS_LENS,
  STATUS_LENS_SHADOW,
} from "./heroMaterial";
import { ENTRANCE, PARALLAX, SCROLL_DEPTH } from "./heroMotion";

import type { CSSProperties } from "react";

/**
 * The Hero.
 *
 * Two rules generate the whole composition, and neither is ever broken:
 *
 *   TWO VOICES.  Sans is the person — the headline, the position, the
 *     invitation. Mono is the machine — coordinates, status, domains,
 *     captions, traces. Nothing is set in the wrong voice. Applied without
 *     exception, that one rule is the identity; it is also why a template
 *     never feels like this, because a template mixes the two arbitrarily.
 *
 *   ONE LIGHT.  Upper left, about 135°. Every bevel, every border, every
 *     shadow and every gradient in heroMaterial.ts is derived from it.
 *
 * MOTION (Phase 2) is layered on without moving a single element of the above.
 * Every piece of the composition is still server-rendered: HeroStage takes
 * `children` from here, so the client boundary wraps the section and nothing
 * inside it. The entrance is pure CSS with `backwards` fill, so it needs no
 * JavaScript at all and cannot flash. Only three behaviours actually listen —
 * the pointer field (HeroStage), the plate (PlateStage) and the primary action
 * (MagneticAction) — and all three stand down under prefers-reduced-motion.
 *
 * Nothing in the Hero animates a property that can cause layout. Transform,
 * opacity and filter only, everywhere, without exception.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THREE COMPOSITIONS, ONE DOCUMENT (Phase 3)
 *
 * The section is not one layout that reflows. It is three compositions that
 * share markup, because a phone held in one hand and a 1440 display are not
 * the same page at two sizes. Each is drawn on the same 12-column grid, and
 * the grid is what makes them relatives rather than three unrelated designs.
 *
 *   MOBILE  (< 768)   One column, and the plate leads. The portrait is the
 *     first object on the page and the anchor the type hangs off; the domain
 *     index sits between the sentence and the call to action, so the CTA lands
 *     last, nearest the thumb and just clear of the dock. Read top to bottom:
 *     availability, portrait, identity, headline, sentence, domains, actions.
 *
 *   TABLET  (768 – 1023)   Its own composition, and the one that was most
 *     wrong before this pass: a phone layout stretched to 704px, with the
 *     portrait dumped below the fold and the entire right half of the page
 *     empty. It is now a masthead — the headline runs the full twelve columns
 *     at the size the viewport can actually carry, and the body splits 7 / 1 / 4
 *     beneath it with the portrait in the right-hand columns. Asymmetric, and
 *     the empty column 8 is still the gutter.
 *
 *   DESKTOP (≥ 1024)   Unchanged, to the pixel. Type on 1–7, column 8 empty as
 *     a real gutter, the plate on 9–12, the index along the foot of the frame.
 *
 * The frozen desktop is the constraint every class below is written against:
 * mobile values are unprefixed, tablet values carry `md:`, and anything the
 * desktop owns is restated at `lg:`. Two consequences are load-bearing and
 * both are marked where they occur — the row template at `lg`, and the two
 * blocks of the type column sharing one depth transform.
 */

/**
 * The type column's scroll depth, applied to the headline and the body block.
 *
 * These are two grid items rather than one wrapper, because tablet needs the
 * headline to span all twelve columns while the body stays on seven — which one
 * element cannot do. They therefore have to carry the same transform and the
 * same fade to keep reading as a single column of type: it fades and lags very
 * slightly as the section leaves, where type that drifts far out of alignment
 * with its own grid reads as broken rather than as distant. The headline gives
 * up opacity; the plate below gives up position.
 */
const TYPE_DEPTH: CSSProperties = {
  transform: `translate3d(calc(var(--hero-px) * ${PARALLAX.headline}px), calc(var(--hero-scroll) * ${SCROLL_DEPTH.headlineLag}px), 0)`,
  opacity: `calc(1 - var(--hero-scroll) * ${SCROLL_DEPTH.headlineFade})`,
};

export function Hero() {
  return (
    <HeroStage className="relative flex min-h-[92svh] flex-col overflow-hidden">
      {/* Scrim over the page-wide schematic. See BACKGROUND_SCRIM: the Hero is
          the one section whose colour argument depends on there being exactly
          one saturated object, and the global node graph puts six more in
          frame. Hero-only — GlobalBackground itself is untouched. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: BACKGROUND_SCRIM }}
      />

      {/* The key light. Placed at the top-left corner so what shows is the
          falloff, never the source — and so every bevel below has a physical
          reason to point the way it does.

          It is the one layer that drifts *with* the pointer at close to the
          full 4px budget. Moving the light rather than the objects is what
          makes the parallax read as a room rather than as a slideshow: the
          composition holds still and the illumination across it shifts.

          The two radii are set here rather than in heroMaterial.ts because they
          are percentages of a box whose aspect ratio changes completely between
          a phone and a display. Wide and shallow on mobile, where the section is
          portrait and the desktop pair would smear the light down the left edge
          as a vertical band; the `lg` pair is the original. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [--key-light-h:34%] [--key-light-w:130%] will-change-transform md:[--key-light-h:48%] md:[--key-light-w:96%] lg:[--key-light-h:62%] lg:[--key-light-w:74%]"
        style={{
          backgroundImage: KEY_LIGHT,
          transform: `translate3d(calc(var(--hero-px) * ${PARALLAX.keyLight}px), calc(var(--hero-py) * ${PARALLAX.keyLight}px), 0)`,
        }}
      />

      {/* Grain, to dither the gradient. Near-black banding is the single most
          common tell of a dark theme that was not finished. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: GRAIN_TEXTURE }}
      />

      <TraceField />

      {/* Gutters and the top margin tighten on a phone, where 24px of side
          padding is already a sixth of the screen and the page has no navbar
          above it to clear. */}
      <div className="relative mx-auto flex w-full max-w-content flex-1 flex-col px-24 pb-[calc(4.25rem+env(safe-area-inset-bottom))] pt-40 md:px-32 md:pt-56">
        {/* The drafted page. Crop marks hang outside this box, which is why it
            owns the positioning context rather than the padded parent. */}
        <div className="relative flex flex-1 flex-col">
          <CropMarks />
          <FrameRule withTicks />

          {/* Whitespace is generous by default and tightens only on a short
              viewport, where the alternative is the capability index sliding
              under the floating dock. Type and the grid never compress — the
              air does, and only when there is not enough of it.

              The short-viewport override is scoped to `md` and up. It exists for
              laptops, and unscoped it also catches every phone in portrait
              (844–932px tall), which is the one place the air is already at its
              floor. */}
          <div className="relative flex flex-1 flex-col justify-center py-32 md:py-48 md:[@media(max-height:860px)]:py-32 lg:py-56 lg:[@media(max-height:860px)]:py-32">
            {/* The drawn system, beneath the person.

                Mounted here rather than at section level, and that is the whole
                reason it lands correctly: this box's bottom edge *is* the bottom
                frame rule, so anchoring the drawing to it tracks the real
                layout at every viewport instead of assuming a section-relative
                percentage. The first cut did assume one, and at 1280 it put the
                microcontroller under the plate's label and its annotations
                across the capability index.

                It renders first so the traces and all the type paint over it —
                two strata of one document rather than two layers competing for
                the same plane. */}
            <EngineeringScene />

            {/* Status row. The coordinates are flush to the frame's right
                edge, which is where the plate below them ends too — so the
                readout and the object it describes share a vertical line all
                the way down the page. Anchoring both to the right rather than
                to column 9 is what keeps that line intact when the plate
                shrinks on a short viewport.

                Tablet takes the same one-line arrangement, on 7 / 5 rather than
                7 / 4: at 704px the two mono strings occupy 211 and 165 pixels,
                so the row has room to be a row. Only on mobile do they stack,
                where they read as a two-line status block above the frame. */}
            <div className="grid grid-cols-12 gap-y-12">
              <p
                className="col-span-12 flex animate-hero-rise items-center gap-12 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary md:col-span-7 lg:col-span-7"
                style={{ animationDelay: `${ENTRANCE.availability}ms` }}
              >
                <span
                  aria-hidden
                  className="size-[6px] shrink-0 rounded-full"
                  style={{ background: STATUS_LENS, boxShadow: STATUS_LENS_SHADOW }}
                />
                {HERO_AVAILABILITY}
              </p>
              {/* Named with a visually-hidden span rather than aria-label: ARIA
                  prohibits author naming on `paragraph`, so an aria-label here
                  is free to be dropped entirely. The hidden text also spells
                  out what the divider means, which a literal reading of the
                  glyphs ("slash") would not. */}
              {/* `-mr-[0.16em]` is the tracking, given back.
                  Letter-spacing is applied *after* every glyph including the
                  last, so a right-aligned tracked string ends with 0.16em of
                  empty space hard against the margin — 1.76px at 11px. The
                  readout's whole job is to share a vertical line with the plate
                  below it, and it was missing that line by exactly one letter
                  space: ink ended at 1326.0 against the plate's edge at 1328.0.
                  Only applied where the text is right-aligned; on mobile it
                  reads left and there is nothing to give back. */}
              <p
                className="col-span-12 animate-hero-rise font-mono text-[11px] tabular-nums tracking-[0.16em] text-text-tertiary md:col-span-5 md:col-start-8 md:-mr-[0.16em] md:text-right lg:col-span-4 lg:col-start-9 lg:text-right"
                style={{ animationDelay: `${ENTRANCE.coordinates}ms` }}
              >
                <span className="sr-only">
                  Located at {HERO_COORDINATES.latitude}, {HERO_COORDINATES.longitude}
                </span>
                <span aria-hidden>
                  {HERO_COORDINATES.latitude}
                  <span className="px-12 text-[rgba(255,255,255,0.14)]">/</span>
                  {HERO_COORDINATES.longitude}
                </span>
              </p>
            </div>

            {/*
              The composition proper — three arrangements of the same three
              blocks, which appear here in reading order and are placed by grid
              area, never by source order.

                            headline        body           plate
                mobile      2nd (flow)      3rd (flow)     1st (order-first)
                tablet      cols 1–12 r1    cols 1–7  r2   cols 9–12 r2
                desktop     cols 1–7  r1    cols 1–7  r2   cols 9–12 r1–r2

              `lg:grid-rows-[auto_1fr]` is load-bearing and is the reason the
              desktop survives being split into two rows. The plate spans both
              of them and is a good 130px taller than the headline and body
              together; against two `auto` rows the grid algorithm would
              distribute that surplus across both and silently push the sentence
              down by half of it. A spanning item that crosses a *flexible*
              track contributes only to the flexible track, so the surplus lands
              entirely in row 2 — which is below the headline, where it is
              invisible, because every item is start-aligned. Tablet needs no
              template: nothing spans there.

              Mobile stays flex rather than grid so `order-first` can lift the
              plate above the type without a media query per block, and so the
              blocks keep `stretch` as their default width.
            */}
            <div className="mt-32 flex flex-col md:mt-48 md:grid md:grid-cols-12 md:items-start md:[@media(max-height:860px)]:mt-40 lg:mt-64 lg:grid-rows-[auto_1fr] lg:[@media(max-height:860px)]:mt-40">
              {/* The headline. Twelve columns on tablet, seven on desktop.
                  Full width is not a fallback there — it is the composition: at
                  768 the type wants 58px, "From the sensor" is 438px wide at
                  that size, and seven columns of 704 is 411. Something had to
                  give, and shrinking a masthead to fit a column it does not need
                  to sit in is the wrong thing to give. */}
              <div
                className="order-2 will-change-[transform,opacity] md:order-none md:col-span-12 md:row-start-1 lg:col-span-7 lg:row-start-1"
                style={TYPE_DEPTH}
              >
                {/* Set at weight 500, not 600. Display type wants less weight
                    as it gets larger — at 100px a semibold grotesque clots,
                    and the counters close up. */}
                <h1 className="text-hero font-medium text-text-primary">
                  {HERO_HEADLINE.map((line, index) => (
                    /* Two elements per line, and both are necessary. The outer
                       one clips; the inner one moves. A transform applied to a
                       clipped element carries its own clip along with it, so
                       the mask has to belong to a parent that does not move.

                       The clip is inset only at the *bottom* edge (0), and
                       given negative insets on the other three. Those negatives
                       matter: `line-height: 0.93` makes the line box shorter
                       than the glyphs it contains, so a plain `overflow-hidden`
                       would shave the caps, and the 11px entry blur would be
                       sliced off at the sides. The line rises out from behind
                       its own baseline and nothing else is touched. */
                    <span
                      key={line}
                      className="block"
                      /* The optical correction rides on the clipping element
                         rather than the moving one, so the mask travels with the
                         line and the entry animation is left holding a single
                         transform. The clip's horizontal insets are negative
                         (-12%), so pulling the box left by 0.087em cannot bring
                         an edge in far enough to shave a glyph. */
                      style={{
                        clipPath: "inset(-35% -12% 0 -12%)",
                        marginLeft: HERO_HEADLINE_OPTICAL[index],
                      }}
                    >
                      <span
                        className="block animate-hero-line will-change-[transform,opacity,filter]"
                        style={{
                          animationDelay: `${
                            index === 0 ? ENTRANCE.headlineFirstLine : ENTRANCE.headlineSecondLine
                          }ms`,
                        }}
                      >
                        {line}
                      </span>
                    </span>
                  ))}
                </h1>
              </div>

              {/* The body: the sentence, the domains and the actions. */}
              <div
                className="order-3 will-change-[transform,opacity] md:order-none md:col-span-7 md:row-start-2 lg:col-span-7 lg:row-start-2"
                style={TYPE_DEPTH}
              >
                {/* The lede rule — an editorial convention, and the thing that
                    stops the statement reading as a second headline. It draws
                    from its left end, ahead of the sentence it introduces,
                    which is the order a ruled line is actually made in.

                    Its top margin is the gap between the headline and its own
                    sentence, so it widens as the type does: 32 on a phone, 56
                    under a tablet masthead, and the desktop's original 40. */}
                <div
                  aria-hidden
                  className="mt-32 h-px w-48 origin-left animate-hero-rule md:mt-56 lg:mt-40"
                  style={{
                    backgroundImage: LEDE_RULE,
                    animationDelay: `${ENTRANCE.ledeRule}ms`,
                  }}
                />

                <p
                  className="mt-24 max-w-readable animate-hero-rise text-paragraph-lg text-text-secondary"
                  style={{ animationDelay: `${ENTRANCE.statement}ms` }}
                >
                  {HERO_STATEMENT}
                </p>

                {/* The domain index, in the flow — below `lg` only.
                    On desktop the index is a manifest along the foot of the
                    frame, under the closing rule. There is no foot to speak of
                    on a phone: the same block placed down there would be the
                    last thing on a 1100px page, past the call to action, where
                    nobody would ever see it. So below `lg` it moves into the
                    column between the sentence and the actions, which is also
                    what puts the CTA last on mobile.

                    Rendered twice, and never visible twice — the copy that is
                    out of play is `display: none`, so it is not in the
                    accessibility tree and screen readers announce the six
                    domains exactly once. */}
                <div className="mt-40 lg:hidden">
                  <CapabilityIndex />
                </div>

                <div className="mt-48">
                  <HeroActions />
                </div>
              </div>

              {/* The plate.

                  On mobile it is lifted above the type with `order-first`: the
                  portrait is the anchor of the composition there, and a
                  photograph 500px down a phone page is not an anchor. Source
                  order still runs headline → body → plate, which is both the
                  right reading order and free of consequence for the keyboard —
                  the plate holds no focusable element.

                  Width is capped against viewport *height*, because the plate
                  is the one element that should yield when the page is short.
                  Whitespace and type never compress; the object does. 58% of the
                  column on a phone, four full columns on a tablet, and on
                  desktop all four columns capped at 34svh — anchored to the
                  frame's right edge so that when it shrinks it stays on a grid
                  line rather than drifting.

                  The 10.5rem floor is the label, not the picture. The museum
                  label is justified to the plate's own edges, and the widest
                  line in it — "Casablanca, Morocco" at 11px mono on 0.14em
                  tracking — measures 146px. On a 320×568 screen both caps land
                  under that and the location wrapped onto two lines, which
                  turns a label into a paragraph. The floor is where the caption
                  stops wrapping, and it is never reached above 360px. */}
              {/* Both delays are handed over as custom properties and chosen by
                  media query, so heroMotion.ts stays the one place the timeline
                  is written down — an inline `animationDelay` cannot carry a
                  breakpoint, and hard-coding 850ms into a class would fork the
                  score across two files. See ENTRANCE.plateCompact. */}
              <div
                className="order-first mb-40 w-[max(10.5rem,min(58%,26svh))] animate-hero-plate [animation-delay:var(--plate-enter)] will-change-[transform,opacity] md:order-none md:col-start-9 md:col-span-4 md:row-start-2 md:mb-0 md:w-full md:[animation-delay:var(--plate-enter-wide)] lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:ml-auto lg:w-[min(100%,34svh)]"
                style={
                  {
                    "--plate-enter": `${ENTRANCE.plateCompact}ms`,
                    "--plate-enter-wide": `${ENTRANCE.plate}ms`,
                  } as CSSProperties
                }
              >
                {/* A second wrapper, because the entrance above and the depth
                    here both animate `transform` and one element cannot hold
                    two. This is the layer that lags hardest on scroll: the
                    plate is the only thing in the composition pretending to be
                    a physical object, so it is the only thing that should
                    visibly fall behind the page. */}
                <div
                  className="will-change-transform"
                  style={{
                    transform: `translate3d(calc(var(--hero-px) * ${PARALLAX.plate}px), calc(var(--hero-scroll) * ${SCROLL_DEPTH.plateLag}px), 0)`,
                  }}
                >
                  <SpecimenPlate />
                </div>
              </div>
            </div>
          </div>

          <FrameRule />

          {/* The desktop manifest. Below `lg` the index has moved up into the
              type column, so the frame simply closes on its rule. */}
          <div className="mt-24 hidden lg:block">
            <CapabilityIndex />
          </div>
        </div>
      </div>

      {/* Closing hairline at the true bottom of the section, under the frame:
          the seam the next section rises out of. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ backgroundColor: RULE_COLOR }}
      />
    </HeroStage>
  );
}
