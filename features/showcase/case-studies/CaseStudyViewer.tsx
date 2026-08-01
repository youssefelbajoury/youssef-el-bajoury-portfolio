"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { RULE_COLOR } from "@/styles/material";
import type { ShowcaseProject } from "@/types/project";

import { BACKDROP, caseStudyLayoutId, CONTENT, MORPH_SPRING, STILL } from "./caseStudyMotion";
import { CaseStudyGallery } from "./components/CaseStudyGallery";
import { CaseStudyPanel } from "./components/CaseStudyPanel";

import type { CSSProperties } from "react";

const TITLE_ID = "case-study-title";

/**
 * The sheet's own shadow, thrown down and to the right like every other cast
 * shadow on the site. It is what separates the sheet from the dimmed page
 * around it once the viewer is inset — without it an inset panel reads as a
 * hole cut in the backdrop rather than as an object resting over it.
 */
const SHEET_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.08)",
  "12px 18px 40px -20px rgba(0,0,0,0.7)",
  "40px 60px 120px -50px rgba(0,0,0,0.9)",
].join(", ");

interface CaseStudyViewerProps {
  project: ShowcaseProject;
  onClose: () => void;
}

/**
 * The case study, full screen: the work on the left, the account of it on the
 * right.
 *
 * WHY A NATIVE <dialog>, STILL. Framer draws the motion; the element underneath
 * it is doing four jobs that would otherwise be four hand-written ones, each
 * done worse:
 *
 *   THE TOP LAYER. A modal dialog is promoted out of the page's stacking
 *     contexts entirely, so it is above the fixed background layer and the
 *     navigation dock without competing with either for a z-index.
 *
 *   INERTNESS. Everything outside becomes unfocusable, unclickable and skipped
 *     by screen readers. A hand-rolled focus trap cycles the tab key and leaves
 *     a screen reader free to walk out of the modal into the page behind it.
 *
 *   ESCAPE, AND THE RETURN OF FOCUS. Both native. The card that opened the
 *     viewer is focused again on close — the step hand-written modals forget
 *     most often.
 *
 * WHAT IS OURS: the page's scroll lock, and the exit.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE TWO THINGS THAT MAKE A <dialog> AND A LAYOUT ANIMATION CO-OPERATE
 *
 * 1. THE DIALOG MUST BE OPEN BEFORE THE MORPHING CHILD MEASURES ITSELF.
 *    A closed <dialog> is `display: none`, and Framer measures a layout element
 *    when it mounts. React attaches refs and runs layout effects bottom-up, so
 *    `showModal()` from this component's own ref callback would fire *after* the
 *    child had already measured — and the child would measure a zero box, then
 *    morph the card into a 0×0 rectangle. The `useLayoutEffect` below opens the
 *    dialog and flips `staged` in the same pass; setting state inside a layout
 *    effect re-renders synchronously before the browser paints, so the child
 *    mounts into an already-displayed dialog and there is no frame in between.
 *
 * 2. ESCAPE MUST NOT CLOSE IT. The native behaviour removes the element from
 *    the top layer immediately, which is the one thing an exit animation cannot
 *    survive. `onCancel` is prevented and routed through the same close path as
 *    the button and the backdrop, so there is exactly one way out: play the exit,
 *    then `close()`, then unmount.
 */
export function CaseStudyViewer({ project, onClose }: CaseStudyViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /** False for the single render before the dialog is in the top layer. */
  const [staged, setStaged] = useState(false);
  /** Flipped by every route out; AnimatePresence plays the exit, then unmounts. */
  const [open, setOpen] = useState(true);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    setStaged(true);

    /*
      Lock the page behind, and pay for the scrollbar we just removed.

      On <html>, which is `document.scrollingElement` here. `body` would also
      work — measured, both hold the page — because a viewport whose root
      element is `overflow: visible` takes its overflow from the body instead.
      That propagation is the reason the body version is the one everybody
      writes, and it is also the reason not to write it: it holds only while
      nothing else has set an overflow on <html>, and it locks the viewport
      through an element that is not the one scrolling.

      The scrollbar is measured before the lock, so it is the width the bar was
      actually occupying rather than an assumption about it. On an engine that
      already froze the page for us, or on any overlay scrollbar, the reading is
      zero and nothing is added — the compensation cannot over-correct.
    */
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;

    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      if (dialog.open) dialog.close();
    };
  }, []);

  /* Every dismissal — Escape, the control, the backdrop — comes through here. */
  const requestClose = useCallback(() => setOpen(false), []);

  /*
    Ordered, and the order is the whole trick: `close()` first, which drops the
    dialog out of the top layer and hands focus back to the card, and only then
    the unmount. Doing it the other way round removes the element React is
    holding the focus-return contract through.
  */
  const handleExitComplete = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  const accentVars = {
    "--project-accent": project.accent.base,
    "--project-accent-bright": project.accent.bright,
    "--project-accent-rgb": project.accent.rgb,
  } as CSSProperties;

  const morph = prefersReducedMotion ? STILL : MORPH_SPRING;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      style={accentVars}
      onCancel={(event) => {
        /* Escape. Prevented so the element stays in the top layer long enough
           to play its exit; the state flip below takes it from here. */
        event.preventDefault();
        requestClose();
      }}
      /*
        The UA stylesheet centres a dialog in a small bordered white box with a
        1em pad; the first six utilities undo that. The backdrop is transparent
        here because it is drawn as a motion layer below — a `::backdrop` cannot
        be animated by Framer, and two backdrops would double the dimming.
      */
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-text-primary [&::backdrop]:bg-transparent"
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {staged && open ? (
          <div key="viewer" className="relative h-full w-full">
            {/* The backdrop. A click on it is a click outside the sheet — and it
                is a real element rather than a bare listener on the dialog, so
                "outside" means outside the surface and not merely outside the
                text that happens to be under the pointer. */}
            <motion.div
              aria-hidden
              {...BACKDROP}
              onClick={requestClose}
              className="absolute inset-0 bg-[rgba(6,7,8,0.88)] backdrop-blur-[6px]"
            />

            {/*
              The sheet, and the element that morphs.

              It carries only the surface — the page's own background colour and
              one hairline — because during the morph Framer corrects this box's
              scale and nothing else's. Whatever is inside is stretched by the
              projection for the length of the animation, which is why the
              contents below are held at zero opacity until it lands (see
              CONTENT in caseStudyMotion.ts). An empty plate has nothing to
              distort.
            */}
            <motion.div
              layoutId={caseStudyLayoutId(project.slug)}
              transition={morph}
              style={{ borderColor: RULE_COLOR, boxShadow: SHEET_SHADOW }}
              /*
                Full bleed on a phone, an inset sheet from `md` up — and the
                inset is not decoration, it is what makes "click outside to
                close" mean anything. A sheet at `inset-0` covers its own
                backdrop completely: there is no outside left to click, and the
                gesture every reader tries first silently does nothing.

                24px at `md`, 40px at `lg`. Enough dimmed page around the sheet
                to read as a surface laid over the site rather than a second
                site, and enough target that the gesture does not require aim.
              */
              className="absolute inset-0 overflow-hidden border bg-background md:inset-24 md:rounded-sm lg:inset-40"
            >
              <motion.div {...CONTENT} className="h-full w-full">
                <CloseControl onClose={requestClose} title={project.title} />

                {/*
                  One scroller for the whole viewer, at every width.

                  The obvious build is two — this element scrolls the stacked
                  column on mobile, the right panel scrolls itself on desktop —
                  and it produces the right picture and a broken keyboard. A
                  scroll container is not a tab stop in Chromium unless it is
                  given one, so the desktop write-up could be read with a mouse
                  and not with a keyboard; adding a stop to each of them instead
                  leaves a dead one at every breakpoint, because only one of the
                  two is ever scrolling.

                  So there is one scroller, and the desktop split is made by
                  pinning the gallery to the top of it (see CaseStudyGallery).
                */}
                <div
                  tabIndex={0}
                  className="h-full overflow-y-auto overscroll-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-strong focus-visible:[outline-offset:-2px] lg:grid lg:grid-cols-12"
                >
                  <CaseStudyGallery
                    shots={project.gallery}
                    title={project.title}
                    reducedMotion={Boolean(prefersReducedMotion)}
                  />
                  <CaseStudyPanel project={project} titleId={TITLE_ID} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}

/**
 * Absolutely positioned against the sheet rather than placed in either half:
 * the panel scrolls and the gallery stacks, and this must outlive both.
 */
function CloseControl({ onClose, title }: { onClose: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      /* Square-cornered and lit from the top, like every other control on the
         site. 44px is the touch-target floor, not a coincidence — and it is
         written as an arbitrary value on purpose: this project redefines
         Tailwind's numeric spacing keys as pixels (`px-24` is 24px), and 44 is
         not one of them, so `size-44` falls through to Tailwind's own scale and
         resolves to 11rem. That is a 176px close button, and it renders as a
         large empty rectangle over the panel. */
      className="absolute right-16 top-16 z-10 inline-flex size-[44px] items-center justify-center rounded-sm border border-[rgba(255,255,255,0.12)] bg-[rgba(8,9,10,0.72)] text-text-secondary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.055),4px_6px_16px_-12px_rgba(0,0,0,0.5)] backdrop-blur-glass transition-colors duration-medium ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong lg:right-24 lg:top-24"
    >
      {/* Drawn inline rather than pulled from the icon set so its stroke can be
          set to 1.25 — the same hairline weight as the frame rules and the crop
          marks. An icon library's default 2px stroke would be the heaviest line
          in the viewer. */}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <path d="m4 4 8 8M12 4l-8 8" />
      </svg>
      <span className="sr-only">Close the {title} case study</span>
    </button>
  );
}
