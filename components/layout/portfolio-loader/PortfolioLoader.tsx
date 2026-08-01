"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import { PROFILE } from "@/constants/profile";
import {
  GRAIN_OPACITY,
  GRAIN_TEXTURE,
  KEY_LIGHT,
  PLATE_BORDER,
  PLATE_EDGES,
  PLATE_FILL,
  PLATE_GUIDE,
  PLATE_SWEEP,
  RULE_COLOR,
} from "@/styles/material";

import {
  BREATHE,
  buildLoaderVariants,
  EXIT,
  MAX_VISIBLE_MS,
  MIN_VISIBLE_MS,
  PROGRESS,
  SCAN,
} from "./loaderMotion";

import type { CSSProperties } from "react";

/**
 * The loading experience.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS CANNOT FLASH
 *
 * The overlay is server-rendered opaque. It is in the HTML the browser receives,
 * at `opacity: 1`, covering the viewport before a single byte of JavaScript has
 * run — so there is no frame in which the portfolio is visible, no frame in
 * which the overlay is half transparent, and nothing to "hide on mount". A
 * loader that mounts in an effect has already lost: whatever it is covering was
 * painted first, which is precisely the flash it exists to prevent.
 *
 * The page underneath is rendered normally and completely. It is never
 * conditional, never delayed and never re-mounted, so the overlay leaving is a
 * change of opacity on one fixed element and nothing else — the portfolio does
 * not appear, it is uncovered.
 *
 * NO LAYOUT SHIFT, BY CONSTRUCTION. `fixed inset-0` is out of flow: the
 * document beneath is laid out identically with the overlay present and absent,
 * so this component's contribution to CLS is exactly zero. Everything inside it
 * animates transform and opacity only.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NO STATE PER FRAME
 *
 * Two state transitions exist for the entire lifetime of this component: one
 * when loading finishes, one never (the unmount is AnimatePresence's). The
 * progress line, the scan, the breathing and the cascade are all declarative
 * Framer animations running off the main thread — nothing here re-renders React
 * to move a pixel, which is the classic way to make a 60fps effect cost 16ms a
 * frame on the one screen where the main thread is already the bottleneck.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NO KEYBOARD TRAP, AND NOTHING TO TRAP
 *
 * The overlay holds no focusable element, installs no key handler and never
 * calls focus(). A reader who tabs during the 1.8 seconds is moving through the
 * page underneath exactly as they would without it, and the loader cannot swallow
 * a keystroke because it is not listening for any. Everything drawn is
 * `aria-hidden`; the two lines of copy are the one thing left in the
 * accessibility tree, inside a polite status region.
 */
export function PortfolioLoader() {
  const [done, setDone] = useState(false);
  const dismiss = useCallback(() => setDone(true), []);

  useLoaderClock(dismiss);

  return (
    <>
      {/*
        The escape hatch, and it is not optional.

        With scripting off, nothing below ever runs: no effect fires, no timer
        resolves, and a server-rendered opaque overlay would sit over the
        portfolio permanently. One rule in a <noscript> removes it, so a reader
        without JavaScript — or with a bundle that failed to arrive — gets the
        site immediately rather than an elegant blank screen.
      */}
      <noscript>
        <style>{`#portfolio-loader{display:none!important}`}</style>
      </noscript>

      <AnimatePresence>
        {done ? null : (
          <motion.div
            id="portfolio-loader"
            key="portfolio-loader"
            /* Initial and animate are the same value on purpose: the overlay is
               already opaque in the server HTML and must never animate *in*.
               Only the exit is a transition. */
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: EXIT.overlay }}
            /*
              `loader-safety-exit` is the parser-armed ceiling, and it is never
              taken off again — it does not need to be. See styles/globals.css
              for why it exists; what makes it free is that it is a *delayed*
              animation, so in every normal load the overlay has already
              unmounted before its three seconds are up and it simply never
              runs. It matters only in the two cases where it should: React
              arriving after three seconds, in which case the reader gets the
              page while the bundle is still in flight, and React dismissing at
              the very edge of the ceiling, in which case one fade replaces the
              other and both are a fade.
            */
            className="loader-safety-exit fixed inset-0 z-loader flex items-center justify-center overflow-hidden bg-background"
          >
            <ScrollLock />
            <LoaderBackdrop />
            <LoaderComposition />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------------------------------------------------------------------
   The clock.
--------------------------------------------------------------------------- */

/**
 * Holds the loader for a real minimum, dismisses it on a real signal, and gives
 * up at a hard ceiling.
 *
 * `performance.now()` is milliseconds since navigation start, so both bounds are
 * measured from the moment the reader asked for the page rather than from
 * whenever this component happened to hydrate. See loaderMotion.ts.
 *
 * The signal is the window `load` event — everything the document referenced has
 * arrived — read defensively, because on a warm cache the page can be complete
 * before React ever runs and an event that has already fired will never fire
 * again.
 *
 * Nothing here can enforce the ceiling on a connection slow enough that the
 * bundle itself is what the reader is waiting for: every line below is inside
 * that bundle. When hydration lands after three seconds both timers resolve to
 * zero and this dismisses on the next tick, but the overlay was already taken
 * off the page by the CSS net armed at parse time — see the class on the
 * overlay, and the note in styles/globals.css.
 */
function useLoaderClock(onDismiss: () => void) {
  useEffect(() => {
    let settled = false;
    const timers: number[] = [];

    const fire = () => {
      if (settled) return;
      settled = true;
      onDismiss();
    };

    /** Schedule `fire` for an absolute time on the navigation clock. */
    const fireAt = (time: number) =>
      timers.push(window.setTimeout(fire, Math.max(0, time - performance.now())));

    /* The ceiling, armed unconditionally: whatever happens to the load event,
       the overlay leaves at three seconds. */
    fireAt(MAX_VISIBLE_MS);

    /* The floor. If the page is already complete this resolves to "now, but not
       before 1.8s"; if it completes later, it resolves to "now". */
    const handleReady = () => fireAt(Math.max(MIN_VISIBLE_MS, performance.now()));

    if (document.readyState === "complete") handleReady();
    else window.addEventListener("load", handleReady, { once: true });

    return () => {
      settled = true;
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", handleReady);
    };
  }, [onDismiss]);
}

/**
 * The page behind, held still — and released only once the overlay has finished
 * leaving, because this component unmounts with it.
 *
 * The order matters. Releasing the lock while the overlay is still fading would
 * restore the scrollbar mid-transition, and the page underneath would step
 * sideways by its width in full view of the reader. Unmounting at exit-complete
 * means the reflow happens under an overlay that is already gone, and the
 * compensation below means there is no reflow to see either way: the scrollbar
 * is measured before it is removed, so the padding that replaces it is exactly
 * the width it was occupying. Hidden and released, the content box is the same
 * width to the pixel.
 */
function ScrollLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;

    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
    };
  }, []);

  return null;
}

/* ---------------------------------------------------------------------------
   The surface.
--------------------------------------------------------------------------- */

/**
 * The blueprint, the lamp and the grain — the page's own atmosphere, at the
 * page's own values.
 *
 * THE GRID IS IN REGISTER WITH THE ONE BEHIND IT, and that is the entire reason
 * the hand-off is invisible. GlobalBackground draws a 72px grid on a fixed,
 * viewport-anchored layer and drifts it on `animate-drift-slow`; this draws the
 * same grid, at the same size, on a layer anchored the same way, on the same
 * 40-second cycle. Both animations begin at page load, so they are not merely
 * similar — they are in phase and pixel-aligned. What the reader sees as the
 * overlay fades is one drawing gaining a little value, never two drawings
 * crossing.
 *
 * That phase lock is also why this one layer is a CSS animation while every
 * other movement in the loader is Framer's: a Framer timeline starts when this
 * component hydrates, which is a different moment from when the page's own grid
 * started, and being a few hundred milliseconds out of phase would put two grids
 * visibly beside each other for the length of the fade.
 *
 * It is held at 3% against the page's 5%. A backdrop that matches the page it is
 * covering has nothing left to hand over.
 */
function LoaderBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-drift-slow motion-reduce:animate-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.03] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_72%)]" />
      </div>

      {/* The key light, upper left at roughly 135° — the one lamp every bevel on
          the site is derived from, including the monogram's below. Placed at the
          corner so what shows is the falloff, never the source. */}
      <div
        className="absolute inset-0 [--key-light-h:52%] [--key-light-w:110%] md:[--key-light-h:62%] md:[--key-light-w:74%]"
        style={{ backgroundImage: KEY_LIGHT }}
      />

      {/* Grain, to dither the gradient. Near-black banding is the single most
          common tell of a dark theme that was not finished. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: GRAIN_TEXTURE, opacity: GRAIN_OPACITY }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The composition.
--------------------------------------------------------------------------- */

/**
 * The monogram, derived rather than typed.
 *
 * First initial and last initial, taken from the one place the name is written
 * down. A monogram hard-coded next to a name in a constants file is two sources
 * of truth for the same fact, and the second one is always the one that goes
 * stale.
 */
const NAME_PARTS = PROFILE.name.split(" ").filter(Boolean);
const MONOGRAM = [NAME_PARTS.at(0), NAME_PARTS.at(-1)]
  .map((part) => part?.charAt(0) ?? "")
  .join("");

/**
 * The engineering rule under the mark.
 *
 * LEDE_RULE's own value, made symmetric. The site's lede rule tapers along its
 * length because it is drawn from one end beside left-aligned type; this one
 * sits under a centred mark and draws from its middle outward, so a taper that
 * favoured either end would be a rule disagreeing with the axis it belongs to.
 * Same white, same weight, same intent — mirrored.
 */
const DATUM_RULE =
  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.21) 50%, transparent 100%)";

/**
 * The progress line's ink — LEDE_RULE's three stops, in the other order.
 *
 * The site's lede rule gives up value as it runs, because it is drawn from its
 * bright end. Used unchanged here it put the taper's dimmest stop (4.5% white)
 * at the advancing tip, over a track at 6% — so the *filled* part of the line
 * was fainter than the empty part, and the leading edge, the one thing the eye
 * is actually tracking, was the least visible point on it.
 *
 * Reversed, the ink builds toward the head: faint where the line has been,
 * brightest where it is going. Same three values, same weight, same material —
 * read in the direction the line is travelling.
 */
const PROGRESS_INK =
  "linear-gradient(90deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.115) 42%, rgba(255,255,255,0.21) 100%)";

function LoaderComposition() {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const variants = buildLoaderVariants(prefersReducedMotion);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants.group}
      exit={{ opacity: 0, y: reduced ? 0 : -6, transition: EXIT.composition }}
      className="relative flex flex-col items-center px-24"
    >
      {/* The mark. Two elements, because one cannot hold two transforms: the
          outer carries the entrance, the inner breathes. */}
      <motion.div variants={variants.item}>
        <motion.div
          animate={reduced ? { scale: 1 } : { scale: [...BREATHE.scale] }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: BREATHE.duration,
                  delay: BREATHE.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Monogram />
        </motion.div>
      </motion.div>

      {/* The engineering line. `origin-center` is what makes it draw outward
          from the mark's own axis rather than sweep in from one side. */}
      <motion.div
        aria-hidden
        variants={variants.rule}
        className="mt-32 h-px w-[72px] origin-center"
        style={{ backgroundImage: DATUM_RULE }}
      />

      {/*
        The one thing in here a screen reader is meant to reach.

        `role="status"` rather than `aria-live="assertive"`: this is a progress
        note, not an alert, and it should never interrupt something the reader is
        already being read. Everything else in the composition — the mark, the
        rule, the track — is `aria-hidden`, because a monogram and a hairline
        announced as text are noise.
      */}
      <div role="status" className="mt-32 flex flex-col items-center">
        {/* The machine's voice: mono, uppercase, tracked — the same treatment
            every section kicker on the site is set in. The ellipsis is a real
            one (U+2026), not three periods. */}
        <motion.p
          variants={variants.item}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary"
        >
          Initializing Portfolio…
        </motion.p>

        {/* One step quieter, and untracked-uppercase — the site's second mono
            treatment, the one the plate labels and the colophon use. Two
            registers of one voice is what makes this read as a readout rather
            than as two sentences. */}
        <motion.p
          variants={variants.item}
          className="mt-8 font-mono text-[11px] tracking-[0.14em] text-text-tertiary"
        >
          Preparing experience…
        </motion.p>
      </div>

      <motion.div variants={variants.item} className="mt-40">
        <ProgressRail reduced={reduced} />
      </motion.div>
    </motion.div>
  );
}

/**
 * The mark: a specimen plate at 72px.
 *
 * The site's one object — the Hero's plate, the About portrait — reduced to the
 * size of a stamp and lit by the same lamp: a bright top edge, a lit left edge,
 * a dark right edge, a darker bottom edge, two shadows thrown down-and-right,
 * and the print-bleed guide a real plate carries inside its trim. Nothing here
 * is new material; it is PLATE_FILL, PLATE_EDGES, PLATE_BORDER and PLATE_GUIDE
 * at a smaller size, which is why the mark reads as belonging to the page it is
 * about to uncover.
 *
 * Set at weight 500, not 600 — display type wants less weight as it gets larger,
 * and two letters at 22px on a 72px field are display type.
 */
function Monogram() {
  return (
    <div
      aria-hidden
      className="relative flex size-[72px] items-center justify-center rounded-sm border"
      style={{ background: PLATE_FILL, borderColor: PLATE_BORDER, boxShadow: PLATE_EDGES }}
    >
      <span className="text-h5 font-medium tracking-tight text-text-primary">{MONOGRAM}</span>

      {/* Bleed guide — the trim boundary inside the plate. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[7px] rounded-[2px] border"
        style={{ borderColor: PLATE_GUIDE }}
      />
    </div>
  );
}

/**
 * The progress line.
 *
 * Three layers, each doing one thing: a hairline rail at the frame's own value,
 * a fill that advances along it, and a scan that surveys the whole length. The
 * fill is `origin-left scaleX` — a width animation here would be a layout
 * animation on every frame, on the one screen where the main thread is busiest.
 *
 * THE COMPLETION IS THE EXIT, and that is not a shortcut — it is the only way
 * this can be expressed without a second piece of state. When loading finishes,
 * the overlay is removed from the tree and AnimatePresence plays every `exit` in
 * the subtree before unmounting it; the fill's exit is "reach the end". So the
 * line spends its last eight percent at exactly the moment loading genuinely
 * completed, under a backdrop that has begun to fade, and the component that
 * owns the clock never has to know a progress bar exists.
 *
 * The fill otherwise stops at 92% and waits there (see PROGRESS in
 * loaderMotion.ts). That is the difference between a progress line and a timer
 * with a progress line's manners.
 *
 * Under reduced motion the rail is drawn complete and still: a reader who asked
 * for less motion is told the same thing by a finished line as by a moving one.
 */
function ProgressRail({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden
      className="relative h-px w-[176px] overflow-hidden sm:w-[220px]"
      style={{ backgroundColor: RULE_COLOR }}
    >
      <motion.div
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={{ scaleX: reduced ? 1 : PROGRESS.waitingScale }}
        exit={{
          scaleX: 1,
          transition: reduced
            ? { duration: 0 }
            : { duration: PROGRESS.completeDuration, ease: [...PROGRESS.ease] },
        }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: PROGRESS.waitingDuration,
                delay: PROGRESS.delay,
                ease: [...PROGRESS.ease],
              }
        }
        className="absolute inset-0 origin-left"
        style={{ backgroundImage: PROGRESS_INK }}
      />

      {/* The scan. PLATE_SWEEP is the site's existing light-sweep material — the
          single pass of the key light across a face, reused here on a rail.
          Suppressed entirely under reduced motion rather than shortened: a
          looping highlight is exactly the kind of thing the preference is for. */}
      {reduced ? null : (
        <motion.div
          initial={{ x: "-140%" }}
          animate={{ x: "340%" }}
          transition={{
            duration: SCAN.duration,
            delay: SCAN.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-y-0 w-1/3"
          style={{ backgroundImage: PLATE_SWEEP } as CSSProperties}
        />
      )}
    </div>
  );
}
