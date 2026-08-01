"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { RULE_COLOR } from "@/styles/material";

import { ResumeDocumentCard } from "./components/ResumeDocumentCard";
import { RESUME_DOCUMENTS } from "./resumeDocuments";
import { buildResumeMotion } from "./resumeMotion";

import type { MouseEvent as ReactMouseEvent } from "react";

const TITLE_ID = "resume-dialog-title";

/**
 * The sheet's own shadow, thrown down and to the right like every other cast
 * shadow on the site. It is what separates the sheet from the dimmed page
 * behind it — without it an overlaid panel reads as a hole cut in the backdrop
 * rather than as an object resting over the page.
 */
const SHEET_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.08)",
  "12px 18px 40px -20px rgba(0,0,0,0.7)",
  "40px 60px 120px -50px rgba(0,0,0,0.9)",
].join(", ");

interface ResumeDialogProps {
  onClose: () => void;
}

/**
 * Choose your resume.
 *
 * WHY A NATIVE <dialog>. Framer draws the motion; the element underneath is
 * doing four jobs that would otherwise be four hand-written ones, each done
 * worse — and this is the same choice, for the same reasons, as the case-study
 * viewer:
 *
 *   THE TOP LAYER. A modal dialog is promoted out of the page's stacking
 *     contexts entirely, so it is above the fixed background, the navigation
 *     dock and the Hero's own transformed layers without competing with any of
 *     them for a z-index — and without being clipped by the ancestor that
 *     happens to be mid-entrance when it opens.
 *
 *   THE FOCUS TRAP. Everything outside becomes unfocusable, unclickable and
 *     skipped by screen readers. A hand-rolled trap cycles the tab key and
 *     leaves a screen reader free to walk out of the modal into the page behind
 *     it, which is the half of "trapped" that nobody implements.
 *
 *   ESCAPE, AND THE RETURN OF FOCUS. Both native. The trigger that opened the
 *     dialog is focused again on close — the step hand-written modals forget
 *     most often, and the one a keyboard reader notices immediately.
 *
 * WHAT IS OURS: the page's scroll lock, the click-outside, and the exit.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO THINGS A <dialog> AND AN EXIT ANIMATION HAVE TO AGREE ON
 *
 * 1. THE DIALOG MUST BE OPEN BEFORE ITS CONTENTS MOUNT. A closed <dialog> is
 *    `display: none`, and an element that mounts into one measures a zero box.
 *    The `useLayoutEffect` below opens it and flips `staged` in the same pass;
 *    state set inside a layout effect re-renders synchronously before the
 *    browser paints, so there is no frame in between and nothing can flash.
 *
 * 2. ESCAPE MUST NOT CLOSE IT — not directly. The native behaviour removes the
 *    element from the top layer immediately, which is the one thing an exit
 *    animation cannot survive. `onCancel` is prevented and routed through the
 *    same path as the close control and the backdrop, so there is exactly one
 *    way out: play the exit, then `close()`, then unmount.
 */
export function ResumeDialog({ onClose }: ResumeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const motionSpec = buildResumeMotion(prefersReducedMotion);

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

      On <html>, which is `document.scrollingElement` here. The scrollbar is
      measured before the lock, so it is the width the bar was actually
      occupying rather than an assumption about it — on an overlay scrollbar, or
      on an engine that already froze the page for us, the reading is zero and
      nothing is added. The compensation cannot over-correct.
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
    dialog out of the top layer and hands focus back to the trigger, and only
    then the unmount. The other way round removes the element the browser is
    holding the focus-return contract through.
  */
  const handleExitComplete = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  /*
    Click outside.

    The listener is on the scroll container rather than on the dimming layer
    beneath it, because the container is what the pointer actually lands on: it
    covers the viewport so it can centre and scroll the sheet, which puts it
    over the backdrop everywhere. The identity check is what makes "outside"
    mean outside — a click anywhere within the sheet bubbles up to here with a
    different target and is ignored.
  */
  const handleSurfaceClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) requestClose();
    },
    [requestClose]
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      onCancel={(event) => {
        /* Escape. Prevented so the element stays in the top layer long enough
           to play its exit; the state flip below takes it from here. */
        event.preventDefault();
        requestClose();
      }}
      /* The UA stylesheet centres a dialog in a small bordered white box with a
         1em pad; the first six utilities undo that. The `::backdrop` is left
         transparent because the dim is drawn as a motion layer below — a
         `::backdrop` cannot be animated by Framer, and two of them would double
         the darkening. */
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-text-primary [&::backdrop]:bg-transparent"
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {staged && open ? (
          <div key="resume" className="relative h-full w-full">
            {/* The dim. Ink, not a new colour: the same near-black the case
                study viewer lays over the page, held a step lighter here
                because this sheet is small and the page around it is still part
                of the composition. Purely visual — the click is handled by the
                container above it. */}
            <motion.div
              aria-hidden
              {...motionSpec.backdrop}
              className="pointer-events-none absolute inset-0 bg-[rgba(6,7,8,0.72)] backdrop-blur-[8px]"
            />

            {/*
              The scroll container, and the click-outside surface.

              `m-auto` on the sheet rather than `items-center` on this box: a
              flex container that centres its child and also scrolls will clip
              the child's top edge once the content is taller than the viewport,
              because there is no scrollable area above the start line. Auto
              margins centre without that failure mode, which is the whole
              reason the sheet is centred this way and not the obvious way.
            */}
            <div
              onClick={handleSurfaceClick}
              className="relative flex h-full w-full overflow-y-auto overscroll-contain p-24"
            >
              <motion.div
                {...motionSpec.panel}
                style={{ borderColor: RULE_COLOR, boxShadow: SHEET_SHADOW }}
                className="relative m-auto w-full max-w-[44rem] rounded-sm border bg-background p-24 sm:p-32"
              >
                <CloseControl onClose={requestClose} />

                <motion.div initial="hidden" animate="visible" variants={motionSpec.list}>
                  {/* `pr-56` is the close control's berth. It is out of flow and
                      anchored to the sheet's top-right corner, so without it the
                      heading runs under a 44px button on a narrow screen. Only
                      the type is inset — the rule and the cards below run the
                      full width of the sheet. */}
                  <div className="pr-56">
                    {/* The kicker, in the mono voice — the machine's label for
                        the section, exactly as every other section on the site
                        opens. */}
                    <motion.p
                      variants={motionSpec.listItem}
                      className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary"
                    >
                      Resume
                    </motion.p>

                    <motion.h2
                      id={TITLE_ID}
                      variants={motionSpec.listItem}
                      className="mt-12 text-h4 font-medium tracking-tight text-text-primary"
                    >
                      Choose your resume
                    </motion.h2>

                    <motion.p
                      variants={motionSpec.listItem}
                      className="mt-8 max-w-readable text-paragraph-sm text-text-secondary"
                    >
                      The same document in two languages. Open it in a new tab, or keep a copy.
                    </motion.p>
                  </div>

                  <motion.div
                    variants={motionSpec.listItem}
                    aria-hidden
                    className="mt-24 h-px w-full"
                    style={{ backgroundColor: RULE_COLOR }}
                  />

                  {/* Two columns from `md`, not from `sm`. At 640px the sheet is
                      viewport-bound, and two cards side by side inside it leave
                      each pair of actions about 108px — under what the wider
                      label needs. The break is where the arrangement actually
                      fits, not where the breakpoint scale would put it. */}
                  <ul className="mt-24 grid grid-cols-1 gap-16 md:grid-cols-2">
                    {RESUME_DOCUMENTS.map((resume) => (
                      <motion.li key={resume.code} variants={motionSpec.listItem}>
                        <ResumeDocumentCard resume={resume} />
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}

/**
 * Absolutely positioned against the sheet, and the first thing in the tab
 * order — which is also what the browser focuses when the dialog opens, so a
 * keyboard reader's first move is always "escape is right here".
 */
function CloseControl({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      /* 44px is the touch-target floor, and it is written as an arbitrary value
         on purpose: this project redefines Tailwind's numeric spacing keys as
         pixels (`px-24` is 24px), and 44 is not one of them, so `size-44` would
         fall through to Tailwind's own scale and resolve to 11rem — a 176px
         button laid over the heading. */
      className="absolute right-12 top-12 inline-flex size-[44px] items-center justify-center rounded-sm border border-[rgba(255,255,255,0.12)] bg-transparent text-text-tertiary transition-colors duration-medium ease-premium hover:border-[rgba(255,255,255,0.26)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong sm:right-16 sm:top-16"
    >
      {/* Drawn inline rather than pulled from the icon set so its stroke can be
          set to 1.25 — the same hairline weight as the frame rules and the crop
          marks. */}
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
      <span className="sr-only">Close</span>
    </button>
  );
}
