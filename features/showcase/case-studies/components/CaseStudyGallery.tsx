"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

import { PANEL_BORDER, RULE_COLOR } from "@/styles/material";
import type { ProjectShot } from "@/types/project";

import { CROSSFADE, STILL } from "../caseStudyMotion";

import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

/**
 * How far a finger has to travel across the stage, in px, to count as a swipe.
 *
 * Low enough that a deliberate flick always lands, high enough that the small
 * horizontal wobble in a vertical scroll never does — and the gesture is
 * additionally required to be more horizontal than vertical, so the test is not
 * carried by this number alone.
 */
const SWIPE_THRESHOLD = 48;

interface CaseStudyGalleryProps {
  shots: ProjectShot[];
  title: string;
  reducedMotion: boolean;
}

/**
 * The left half: one screenshot at full size, and every way of changing it.
 *
 * FOUR WAYS TO MOVE, ONE INDEX. Thumbnails, arrow keys, Home/End and a swipe
 * all set the same number, and the stage answers all four the same way — the
 * outgoing screenshot fades out while the incoming one fades in, over the top
 * of it, on the same plate. Nothing slides. A screenshot that slides is a
 * carousel; this is a plate being changed under a fixed lamp.
 *
 * WHY THE STAGE HAS A FIXED ASPECT. `object-cover` needs a box with a shape of
 * its own to cover, and a stage that resized to each screenshot would move the
 * thumbnails and the whole right-hand column every time the reader pressed an
 * arrow key. One box, held; the images are cropped into it, centred.
 */
export function CaseStudyGallery({ shots, title, reducedMotion }: CaseStudyGalleryProps) {
  const [index, setIndex] = useState(0);

  /*
    The outgoing screenshot, held for exactly as long as it takes to fade.

    TWO LAYERS, NOT <AnimatePresence>, and the reason is the ceiling rather than
    the API. AnimatePresence hands the unmount to Framer, which is the right
    trade for a list whose length nobody can predict; here the list is a
    reader stepping through eight full-width PNGs, and each layer that outlives
    its fade holds a decoded bitmap. Owning the unmount explicitly puts a hard
    cap of two on what can be in the stage at once — the one leaving and the one
    arriving — which is the property that matters when the images are this big.

    `onAnimationComplete` is the only thing that clears the outgoing layer, so
    the cap is enforced by the animation itself rather than by a timeout that
    has to agree with a duration written somewhere else.
  */
  const [previous, setPrevious] = useState<number | null>(null);

  const multiple = shots.length > 1;

  /* The index read has to be proved safe rather than asserted: a project with
     no screenshots should render nothing rather than a broken box. */
  const shot = shots[index] ?? shots[0];
  const outgoing = previous !== null && previous !== index ? shots[previous] : null;

  function show(next: number) {
    setIndex((current) => {
      if (next === current) return current;
      setPrevious(current);
      return next;
    });
  }

  /* Pointer origin for the swipe. `null` means no gesture is in flight, which
     is also how a pointer that started outside the stage is ignored. */
  const originX = useRef<number | null>(null);
  const originY = useRef(0);

  function go(direction: 1 | -1) {
    /* Clamped, not wrapped. The thumbnails already show the reader exactly
       where the ends are, and a set that silently loops back to the first shot
       reads as a glitch rather than as a loop. */
    show(Math.min(shots.length - 1, Math.max(0, index + direction)));
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!multiple) return;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        go(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        go(-1);
        break;
      case "Home":
        event.preventDefault();
        show(0);
        break;
      case "End":
        event.preventDefault();
        show(shots.length - 1);
        break;
      default:
        break;
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    /* Touch and pen only. A mouse drag across an image is a native image-drag
       gesture and a text selection; hijacking it would break both to duplicate
       what the thumbnails and the arrow keys already do. */
    if (event.pointerType === "mouse") return;

    originX.current = event.clientX;
    originY.current = event.clientY;
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const from = originX.current;
    originX.current = null;
    if (from === null || !multiple) return;

    const travelX = event.clientX - from;
    const travelY = event.clientY - originY.current;

    /* A gesture that moved further down than across was a scroll that happened
       to start on the stage — on mobile this whole viewer is one column, and
       stealing that would strand the reader on the screenshots. */
    if (Math.abs(travelX) < SWIPE_THRESHOLD || Math.abs(travelX) <= Math.abs(travelY)) return;

    go(travelX < 0 ? 1 : -1);
  }

  if (!shot) return null;

  return (
    <section
      aria-label={`${title} screenshots`}
      /*
        Below `lg` this is simply the first block of a scrolling column. From
        `lg` it is pinned: `sticky` inside the viewer's one scroller, sized to
        the viewport and aligned to the start of its grid row so it does not
        stretch to the height of the write-up beside it. That pairing is what
        makes the split screen — the panel scrolls past a gallery that does not
        move — without a second scroll container to keep in step.
      */
      style={{ borderColor: RULE_COLOR }}
      /* `justify-center` on desktop is what stops the stage stretching to the
         height of the column. See the note on the stage's aspect ratio below:
         a screenshot cropped to fill a near-square box loses a third of the
         interface it is a screenshot of. */
      className="flex flex-col gap-16 border-b px-24 pb-24 pt-64 lg:sticky lg:top-0 lg:col-span-7 lg:h-[100dvh] lg:justify-center lg:self-start lg:border-b-0 lg:border-r lg:p-48"
    >
      {/*
        `tabIndex` because a div is not focusable and the arrow keys above are
        unreachable without it. `role="group"` gives that focus stop a name when
        it lands here.

        `touch-action: pan-y` is what makes the swipe and the page co-operate:
        the browser keeps vertical panning and hands us the horizontal axis, so
        the gesture below never has to call preventDefault and never has to
        guess which one the reader meant.
      */}
      <div
        role="group"
        aria-roledescription="image carousel"
        aria-label={multiple ? `Screenshot ${index + 1} of ${shots.length}` : undefined}
        tabIndex={multiple ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          originX.current = null;
        }}
        style={{ borderColor: PANEL_BORDER }}
        /*
          16:10 AT EVERY WIDTH, and the aspect ratio is doing real work.

          `object-cover` crops whatever the box's shape does not match, so the
          stage's shape decides how much of each screenshot survives. Letting it
          stretch to the full height of the sticky column made it 744 × 740 on a
          1440 display — very nearly square — against captures that are roughly
          16:9. Covering a square with a 16:9 image throws away about a third of
          its width, and what it throws away is the left and right edges of an
          interface: the sidebar, the navigation, the first column of the table.

          At 16:10 the crop is a few percent off the top and bottom of a 16:9
          shot, which is the difference between a frame and a wound. The column
          centres it (see `justify-center` above) so the freed height becomes
          air around the screenshot rather than more crop.
        */
        className="relative aspect-[16/10] w-full shrink-0 touch-pan-y overflow-hidden rounded-sm border bg-[rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong"
      >
        {/*
          The outgoing layer, underneath. It is rendered first so the incoming
          one paints over it: the frame is covered by a screenshot at every
          moment of the swap, which is what stops the stage flashing its own
          background between two images.
        */}
        {outgoing ? (
          <motion.div
            key={`out-${previous}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={reducedMotion ? STILL : CROSSFADE.out}
            onAnimationComplete={() => setPrevious(null)}
            className="absolute inset-0"
          >
            <Image
              src={outgoing.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              placeholder="blur"
              className="object-cover object-center"
            />
          </motion.div>
        ) : null}

        <motion.div
          /* Keyed on the source, so React swaps the element rather than mutating
             one <img> through several `src` values — which is what leaves the
             previous screenshot on screen while the next one decodes, and what
             stops the entrance from re-running per shot. */
          key={shot.src.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reducedMotion ? STILL : CROSSFADE.in}
          className="absolute inset-0"
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            /* The stage is 58% of the viewport on desktop and the full width
               below it. Get this wrong and Next serves a 2000px source into a
               700px box on every phone that opens the viewer. */
            sizes="(min-width: 1024px) 58vw, 100vw"
            /* Generated at build time from the static import — the blur is the
               image's own colours, so the frame is never empty and never
               flashes a grey box between shots. */
            placeholder="blur"
            /*
              NO `priority`, ANYWHERE IN HERE. The page's only priority image is
              the Hero portrait, which is its LCP candidate; everything else on
              the site loads lazily, this stage included.

              It costs nothing to give up. The stage only exists once a reader
              has clicked into a case study, so the request starts at that click
              either way — `priority` would not have fetched it any sooner, it
              would only have added a preload hint for an image that may never be
              opened. The blur placeholder covers the decode, and it is the
              image's own colours rather than a grey box.
            */
            className="object-cover object-center"
          />
        </motion.div>
      </div>

      {multiple ? (
        <div className="flex items-center gap-16">
          {/*
            A horizontal rail of thumbnails, scrollable when the set outruns the
            column. `snap-x` so a flick on a phone lands on a thumbnail rather
            than halfway between two.
          */}
          <ul className="flex min-w-0 flex-1 snap-x snap-mandatory gap-8 overflow-x-auto pb-4">
            {shots.map((thumbnail, thumbnailIndex) => {
              const current = thumbnailIndex === index;

              return (
                <li key={thumbnail.src.src} className="snap-start">
                  <button
                    type="button"
                    onClick={() => show(thumbnailIndex)}
                    aria-current={current}
                    /* Opacity and border only. A thumbnail that scaled on hover
                       would move the row it sits in, and a row of screenshots
                       that reflows under the cursor is the opposite of
                       expensive. */
                    className={`relative block h-48 w-80 shrink-0 overflow-hidden rounded-sm border transition-[opacity,border-color] duration-medium ease-apple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong ${
                      current
                        ? "border-[rgb(var(--project-accent-rgb)/60%)] opacity-100"
                        : "border-[rgba(255,255,255,0.09)] opacity-55 hover:border-[rgba(255,255,255,0.2)] hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={thumbnail.src}
                      alt=""
                      fill
                      sizes="80px"
                      placeholder="blur"
                      loading="lazy"
                      className="object-cover object-center"
                    />
                    <span className="sr-only">
                      Show screenshot {thumbnailIndex + 1} of {shots.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/*
            Announced, because for a reader who cannot see the stage this counter
            is the only evidence a swipe or an arrow key did anything. `polite`
            so it waits for a gap rather than interrupting.
          */}
          <p
            aria-live="polite"
            className="shrink-0 font-mono text-[11px] tabular-nums tracking-[0.14em] text-text-tertiary"
          >
            {String(index + 1).padStart(2, "0")}
            <span className="text-[rgba(255,255,255,0.16)]"> / </span>
            {String(shots.length).padStart(2, "0")}
          </p>
        </div>
      ) : null}
    </section>
  );
}
