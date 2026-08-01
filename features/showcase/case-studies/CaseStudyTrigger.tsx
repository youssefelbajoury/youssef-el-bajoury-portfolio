"use client";

import Link from "next/link";
import { useRef } from "react";

import { useCaseStudyOpener } from "./CaseStudyProvider";

import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";

interface CaseStudyTriggerProps {
  slug: string;
  title: string;
}

/**
 * The clickable surface of a gallery card.
 *
 * A link rather than a button, pointed at the real /projects/<slug> route, with
 * the plain left click intercepted to open the viewer instead. That costs three
 * lines and buys back everything a modal normally throws away: the target has a
 * URL, so it can be middle-clicked into a new tab, copied, opened in a new
 * window, and read by anything that follows links rather than running effects.
 * Modifier clicks are handed straight to the browser.
 *
 * Laid over the card rather than wrapped around it. <button> and <a> take
 * phrasing content, and the card is an <article> holding a heading, a paragraph
 * and a list — wrapping it would be invalid markup that browsers repair in ways
 * that break the layout. An overlay at `inset-0` gives the whole card the hit
 * area without touching its structure, which is also why GalleryCard needed no
 * change to become clickable.
 *
 * It also publishes where the pointer is, which is the other thing being over
 * the whole card makes it the right element for:
 *
 *   --card-px, --card-py   pointer position within the card, 0 … 100%
 *
 * GalleryCard's specular reads both. Same contract PlateStage publishes for the
 * Hero's plate, and written the same way — straight onto the node, never
 * through React state. A specular that re-rendered a tree on pointermove would
 * be a specular that cost more than every other animation in the section
 * combined.
 */
export function CaseStudyTrigger({ slug, title }: CaseStudyTriggerProps) {
  const open = useCaseStudyOpener();

  /* One pending frame at most. pointermove fires faster than the display
     refreshes, and writing a custom property per event means a style
     invalidation per event; coalescing to a frame makes it one. */
  const frameRef = useRef(0);

  function handleClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    /* Anything the reader meant as "open this somewhere else" is not ours. */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    open(slug);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    /* Mouse only. A touch device fires this once on tap and has no leave event
       to answer it, so the highlight would light up under the finger and stay
       there — which is the one state a reflection must never be in. */
    if (event.pointerType !== "mouse") return;

    const card = event.currentTarget.parentElement;
    if (!card || frameRef.current) return;

    const { clientX, clientY } = event;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty(
        "--card-px",
        `${(((clientX - rect.left) / rect.width) * 100).toFixed(2)}%`
      );
      card.style.setProperty(
        "--card-py",
        `${(((clientY - rect.top) / rect.height) * 100).toFixed(2)}%`
      );
    });
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }

    /* Back to the resting position rather than to nothing: the card is lit from
       the upper left whether or not anyone is pointing at it, and the specular
       fades out on its own opacity transition from wherever it was left. */
    const card = event.currentTarget.parentElement;
    card?.style.removeProperty("--card-px");
    card?.style.removeProperty("--card-py");
  }

  return (
    <Link
      href={`/projects/${slug}`}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong"
    >
      {/* The card's own heading is not the link's text, so the link needs one.
          Visible copy would duplicate the title an inch below it. */}
      <span className="sr-only">Open case study — {title}</span>
    </Link>
  );
}
