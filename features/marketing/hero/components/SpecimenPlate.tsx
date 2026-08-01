import Image from "next/image";

import { HERO_PLATE_LABEL, HERO_PORTRAIT } from "../heroContent";
import {
  GRAIN_TEXTURE,
  PLATE_BORDER,
  PLATE_EDGES,
  PLATE_FILL,
  PLATE_GRAIN_OPACITY,
  PLATE_GUIDE,
  PLATE_REFLECTION,
  PLATE_SWEEP,
  PLATE_TARGET,
  REGISTRATION_MARKS,
  REGISTRATION_MARKS_HOVER,
  RULE_COLOR,
} from "../heroMaterial";

import { PlateStage } from "./PlateStage";

/**
 * The portrait, as an industrial specimen plate.
 *
 * Not an avatar, not a glass card, not a glowing frame. A 4:5 plate with
 * registration marks at its corners, a print-bleed guide inside it, a centre
 * target, a figure number above and a museum label below. Every one of those
 * is a real convention from technical drawing or print production, which is
 * why it reads as intentional rather than as an image that failed to load.
 *
 * The plate holds a portrait when HERO_PORTRAIT names one and draws itself
 * registered-but-empty when it does not. Both states are finished states: the
 * box is a fixed 4:5 either way, the label is printed either way, and mounting
 * the photo is a one-line edit in heroContent.ts that moves nothing.
 */
export function SpecimenPlate() {
  return (
    <figure className="w-full">
      {/* Figure caption, drawing-office style: what this is, and its ratio.
          Justified to the plate's own edges so the label spans exactly the
          object it describes. */}
      {/* 11px is the floor for every piece of type in the Hero. Uppercase mono
          on 0.22em tracking reads a good deal larger than its nominal size, but
          below 11px it stops being small-by-design and starts being small. */}
      <div className="mb-12 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
        <span>Fig. 01</span>
        {/* The ratio is flush right to the plate's edge, and tracked type is not
            flush right by default: 0.22em of letter space trails the final glyph
            (2.42px at 11px), which left the "5" ending 3px inside the plate it
            measures. The negative margin is that trailing space, returned. The
            left-hand label needs no such correction — tracking follows a glyph,
            it never precedes one. */}
        <span aria-hidden className="-mr-[0.22em]">
          4 : 5
        </span>
      </div>

      {/* `group` on the page, not on the plate: the registration marks live
          out here and have to respond to the plate being hovered, and only a
          shared ancestor can carry that. */}
      <div className="group relative">
        <RegistrationMarks />

        {/* The idle breath, on its own element.
            A CSS animation outranks an inline style in the cascade, so if this
            shared a node with PlateStage the 0.3% scale would silently discard
            every transform framer-motion writes and the plate would not tilt
            at all. Two nodes, one transform each, composed by the browser. */}
        <div className="animate-plate-breathe will-change-transform">
          {/* The plate tips; the marks around it do not. What tilts is the
              object, what stays flat is the drawing it rests on — which is
              most of the reason the response reads as physical rather than as
              a card effect. See PlateStage. */}
          <PlateStage className="relative will-change-transform">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border"
              style={{
                background: PLATE_FILL,
                borderColor: PLATE_BORDER,
                boxShadow: PLATE_EDGES,
              }}
            >
              {HERO_PORTRAIT && (
                /* `fill` rather than intrinsic dimensions: the plate's size is set
               by the grid and by viewport height, so the image has to take its
               box from the plate rather than the other way round. `priority`
               because this is the section's LCP candidate — a portrait that
               fades in late is the one asset on the page you cannot lazy-load.

               `sizes` mirrors the wrapper in Hero.tsx exactly: 34svh at lg and
               up, capped at 21rem below it. Get this wrong and Next serves the
               full-width source to a 300px box. */
                <Image
                  src={HERO_PORTRAIT}
                  alt={`Portrait of ${HERO_PLATE_LABEL.identity}`}
                  fill
                  priority
                  /* Generated at build time from the static import, so the
                     plate is filled with the portrait's own colours from the
                     first frame rather than sitting empty until it decodes. */
                  placeholder="blur"
                  sizes="(min-width: 1024px) 34vh, 21rem"
                  /* `object-center` is the CSS default, so this changes nothing
                     — it is written out because every other image on the site
                     now states its crop, and the one that stays silent is the
                     one somebody later assumes was overlooked. */
                  className="object-cover object-center"
                />
              )}

              {/* Print grain on the face — see PLATE_GRAIN_OPACITY.

              Above the portrait rather than below it, because grain belongs to
              the print and not to the subject: a photograph mounted on this
              plate is grained by the same stock as the empty plate beside it.
              Below the guide, the target and the reflection, all of which are
              marks *on* the sheet or light *off* it. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: GRAIN_TEXTURE, opacity: PLATE_GRAIN_OPACITY }}
              />

              {/* Bleed guide — the trim boundary inside the plate. Kept in both
              states, because a trim line belongs to the sheet rather than to
              what is mounted on it. Over a photograph it will read as barely
              more than an edge; PLATE_GUIDE is the value to raise once there
              is a real image to judge it against. */}
              <span
                aria-hidden
                className="absolute inset-[11px] rounded-[2px] border"
                style={{ borderColor: PLATE_GUIDE }}
              />

              {/* Centre target — the empty state only. An unmounted plate is
              registered, not blank; a mounted one has its subject at the
              centre already, and a crosshair on a face is a defect. */}
              {!HERO_PORTRAIT && (
                <>
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-[22px] w-px -translate-x-1/2 -translate-y-1/2"
                    style={{ backgroundColor: PLATE_TARGET }}
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-px w-[22px] -translate-x-1/2 -translate-y-1/2"
                    style={{ backgroundColor: PLATE_TARGET }}
                  />
                </>
              )}

              {/* The specular highlight, tracking --plate-px/py from PlateStage.
              It is present at rest — parked at the top-left, where the key
              light is — and strengthens under the pointer. A highlight that
              only exists on hover is a hover state; one that exists always
              and moves is a surface. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-slow ease-premium group-hover:opacity-100"
                style={{ backgroundImage: PLATE_REFLECTION }}
              />

              {/* The sweep. Runs once per hover, not on a loop: it is the object
              being turned under the light, and an object that keeps turning by
              itself is a carousel. `group-hover` restarts the animation on
              each entry because the element is only in the tree while hovered,
              which is also what stops it firing on load.

              The animation carries `forwards` (tailwind.config.ts), and that
              word is load-bearing. Without it the animation released the element
              back to its own styles the moment it finished — which are `opacity:
              1` and no transform — so 1.15 seconds into every hover the
              highlight stopped sweeping and *parked*: a hard-edged band of 9%
              white sitting across the plate's left quarter for as long as the
              pointer stayed on it. Holding the last frame ends it at opacity 0,
              off the right edge, where a light that has passed belongs. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/4 hidden w-1/2 group-hover:block group-hover:animate-plate-sweep"
                style={{ backgroundImage: PLATE_SWEEP }}
              />
            </div>
          </PlateStage>
        </div>
      </div>

      {/* The label sits outside the plate. A museum label is never printed on
          the artwork. */}
      <figcaption className="mt-16">
        <div aria-hidden className="h-px w-full" style={{ backgroundColor: RULE_COLOR }} />
        {/* The identity line is the one piece of the label that is a person
            rather than a catalogue field, so it is the one piece set in sans —
            the same voice as the headline, three steps quieter. The two mono
            lines beneath it are the machine's description of the specimen.
            That is the whole two-voices rule, applied at the smallest scale on
            the page, and it is what makes this read as a label instead of as
            three lines of metadata. */}
        <p className="mt-12 text-paragraph-sm font-medium tracking-tight text-text-primary">
          {HERO_PLATE_LABEL.identity}
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
          {HERO_PLATE_LABEL.role}
        </p>
        <p className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
          {HERO_PLATE_LABEL.location}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * Four corner marks, offset outside the plate.
 *
 * Each corner takes a different alpha, brightest at the top-left and dimmest
 * at the bottom-right, because the light comes from the upper left and metal
 * marks catch it accordingly. Nobody will notice; everybody will read it.
 *
 * On hover all four lift by roughly 60% and hold their relative order — the
 * top-left stays the brightest. Flattening them to a single value on hover
 * would destroy the falloff that makes them read as metal in the first place,
 * which is the sort of thing that only shows up as "the hover looks cheap".
 *
 * The transition is on `color` and the arms are `bg-current`, so one property
 * on one element animates two children. Colour is not a compositor property,
 * but four 13px marks changing tint is a paint of a few hundred pixels and
 * costs nothing measurable.
 */
function RegistrationMarks() {
  const corners = [
    /* Offsets are arbitrary px, not spacing tokens: this project's `spacing`
       extension redefines the numeric keys (`-left-8` is 8px here, not 2rem),
       and 10 is not one of them — `-left-10` would silently fall through to
       Tailwind's default 2.5rem and fling the marks off the plate. */
    {
      key: "tl",
      box: "-left-[10px] -top-[10px]",
      h: "left-0 top-0",
      v: "left-0 top-0",
      color: REGISTRATION_MARKS.topLeft,
      hover: REGISTRATION_MARKS_HOVER.topLeft,
    },
    {
      key: "tr",
      box: "-right-[10px] -top-[10px]",
      h: "right-0 top-0",
      v: "right-0 top-0",
      color: REGISTRATION_MARKS.topRight,
      hover: REGISTRATION_MARKS_HOVER.topRight,
    },
    {
      key: "bl",
      box: "-bottom-[10px] -left-[10px]",
      h: "bottom-0 left-0",
      v: "bottom-0 left-0",
      color: REGISTRATION_MARKS.bottomLeft,
      hover: REGISTRATION_MARKS_HOVER.bottomLeft,
    },
    {
      key: "br",
      box: "-bottom-[10px] -right-[10px]",
      h: "bottom-0 right-0",
      v: "bottom-0 right-0",
      color: REGISTRATION_MARKS.bottomRight,
      hover: REGISTRATION_MARKS_HOVER.bottomRight,
    },
  ] as const;

  return (
    <div aria-hidden>
      {corners.map((corner) => (
        /* Both colours are handed over as custom properties and applied by
           class, never as an inline `color`. An inline declaration outranks
           every class in the cascade, so setting the resting colour inline
           would make the `group-hover` rule below a no-op — the marks would
           simply never respond. */
        <span
          key={corner.key}
          className={`absolute size-[13px] transition-colors duration-medium ease-premium [color:var(--mark)] group-hover:[color:var(--mark-hover)] ${corner.box}`}
          style={{ "--mark": corner.color, "--mark-hover": corner.hover } as React.CSSProperties}
        >
          <span className={`absolute h-px w-[13px] bg-current ${corner.h}`} />
          <span className={`absolute h-[13px] w-px bg-current ${corner.v}`} />
        </span>
      ))}
    </div>
  );
}
