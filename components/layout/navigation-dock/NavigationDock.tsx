"use client";

import { MotionConfig, motion, useReducedMotion, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { DockItem } from "./DockItem";
import {
  BEVEL_HIGHLIGHT,
  BEZEL_GRADIENT,
  CURSOR_REFLECTION,
  DOCK_SHADOW,
  ENTRANCE_SPRING,
  GLASS_FILL,
  GLASS_FRESNEL,
  GLASS_GRAIN,
  GLASS_INNER_LIGHT,
  GLASS_MENISCUS,
  GLASS_VOLUME,
  SHELL_PADDING,
} from "./dockMaterial";
import { DOCK_DESTINATIONS, DOCK_SECTION_IDS } from "./navigationItems";
import { useDockPointer } from "./useDockPointer";
import { useSectionSpy } from "./useSectionSpy";

import type { MouseEvent as ReactMouseEvent } from "react";

/** Width of the specular blob that tracks the cursor across the glass. */
const REFLECTION_SIZE = 220;
/** Width of the lit segment of the top bevel. */
const BEVEL_HIGHLIGHT_SIZE = 170;

/** One sweep every ~15s: long enough that finding it feels like a discovery. */
const SWEEP_DURATION = 3.6;
const SWEEP_INTERVAL = 15;

/**
 * Motes suspended in the glass. Long, prime-ish durations so the three never
 * fall into a visible rhythm with each other or with the sweep.
 */
const MOTES = [
  { left: "18%", top: "34%", drift: 26, duration: 19, delay: 0 },
  { left: "54%", top: "62%", drift: -21, duration: 23, delay: 6.5 },
  { left: "81%", top: "28%", drift: 17, duration: 27, delay: 12 },
] as const;

const HOME_ID = DOCK_SECTION_IDS[0] ?? "home";

/**
 * The portfolio's global navigation: a floating glass dock.
 *
 * Composition, outside in:
 *   fixed rail (no pointer events) → entrance transform → idle float →
 *   cursor tilt + magnetic drift → machined bezel → glass body → items.
 *
 * Each layer owns exactly one transform. Stacking them is what lets the
 * entrance spring, the idle breathing and the live cursor physics all run at
 * once without fighting over a single element's transform matrix — and keeps
 * every one of them on the compositor.
 */
export function NavigationDock() {
  const reduced = useReducedMotion() ?? false;
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrolledSection = useSectionSpy(DOCK_SECTION_IDS, isHome);
  // Off the home page there are no sections to spy on, but a case study is
  // still "in" Projects — the dock should reflect where you are, not go blank.
  const activeId = isHome ? scrolledSection : pathname.startsWith("/projects") ? "projects" : null;

  const [revealedId, setRevealedId] = useState<string | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const pointer = useDockPointer(surfaceRef, !reduced);

  const reflectionX = useTransform(pointer.x, (value) => value - REFLECTION_SIZE / 2);
  const reflectionOpacity = useTransform(pointer.engagement, [0, 1], [0, 1]);
  const bevelX = useTransform(pointer.x, (value) => value - BEVEL_HIGHLIGHT_SIZE / 2);
  const underglowOpacity = useTransform(pointer.engagement, [0, 1], [0.45, 1]);

  /**
   * The Dynamic Island move: engaging the dock grows its own padding, so the
   * shell genuinely gets larger around unchanged contents rather than being
   * scaled up. Scaling would blur the glyphs and stretch the bezel; this keeps
   * every edge at its designed weight.
   *
   * Engagement only changes on enter and leave, so this costs one short burst
   * of layout per hover, not one per frame of cursor movement.
   */
  const shellPadding = useTransform(pointer.engagement, [0, 1], [...SHELL_PADDING]);

  const handleNavigate = useCallback(
    (id: string, event: ReactMouseEvent<HTMLAnchorElement>) => {
      // Away from the home page the link is a real navigation — let the router
      // handle it and land on the hash.
      if (!isHome) {
        return;
      }

      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      // replaceState, not a hash assignment: the URL should stay shareable
      // without stacking a history entry per glance at the dock.
      window.history.replaceState(null, "", id === HOME_ID ? pathname : `#${id}`);
    },
    [isHome, pathname, reduced]
  );

  return (
    /*
      reducedMotion="user" hands the whole subtree to the OS preference:
      Framer drops every transform and layout animation and keeps only opacity.
      It has to be declared here rather than branched on in each component —
      `useReducedMotion` resolves differently on the server than on the client,
      so rendering different markup from it breaks hydration.
    */
    <MotionConfig reducedMotion="user">
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-navigation flex justify-center px-8 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-24"
        style={{ perspective: 900 }}
      >
        <motion.nav
          aria-label="Section navigation"
          className="pointer-events-auto"
          initial={{ opacity: 0, y: 26, scaleX: 0.6, scaleY: 0.74, rotateX: 24 }}
          animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotateX: 0 }}
          transition={ENTRANCE_SPRING}
          style={{ transformOrigin: "50% 100%" }}
        >
          {/* Idle: a breath of vertical drift, slow enough to register as
              presence rather than as animation. */}
          <motion.div
            animate={{ y: [0, -2.5, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Cursor physics: the glass leans and drifts toward the pointer. */}
            <motion.div
              className="relative"
              style={{
                x: pointer.magneticX,
                rotateX: pointer.rotateX,
                rotateY: pointer.rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* The light the dock casts onto the page beneath it — white,
                  not cyan. The dock is glass held above the sheet, so what
                  spills under it is the room's own light; a coloured pool would
                  make the dock a second light source on a page lit by one lamp
                  in the upper left. */}
              <motion.span
                aria-hidden
                style={{ opacity: underglowOpacity }}
                className="pointer-events-none absolute inset-x-24 -bottom-4 h-8 rounded-full bg-[rgba(255,255,255,0.14)] blur-[14px]"
              />

              {/* Machined bezel: a 1px conic ring the glass sits inside. */}
              <div
                className="relative rounded-full p-px"
                style={{ background: BEZEL_GRADIENT, boxShadow: DOCK_SHADOW }}
              >
                <motion.div
                  ref={surfaceRef}
                  onPointerMove={pointer.onPointerMove}
                  onPointerLeave={pointer.onPointerLeave}
                  className="relative rounded-full backdrop-blur-[32px] backdrop-brightness-[0.72] backdrop-saturate-[160%] backdrop-contrast-[1.06]"
                  style={{
                    padding: shellPadding,
                    background: GLASS_FILL,
                    boxShadow: GLASS_INNER_LIGHT,
                  }}
                >
                  {/* Everything decorative is clipped here rather than on the
                      parent, so focus rings are free to sit outside the glass. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                  >
                    {/* Volumetric interior — light hanging inside the glass. */}
                    <span className="absolute inset-0" style={{ background: GLASS_VOLUME }} />

                    {/* Fresnel: the curved ends stay brighter than the middle,
                        which also gives the corners their bloom. */}
                    <span className="absolute inset-0" style={{ background: GLASS_FRESNEL }} />

                    {/* Thickness: the curve where the top face meets the body,
                        and the shadow gathering along the bottom one. */}
                    <span className="absolute inset-0" style={{ background: GLASS_MENISCUS }} />

                    {/* Micro-texture — a few percent, and the glass stops
                        looking like a painted rectangle. */}
                    <span
                      className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
                      style={{ backgroundImage: GLASS_GRAIN }}
                    />

                    {/* Motes suspended in the material. Barely above the noise
                        floor — they are meant to be noticed on the second or
                        third look, not the first. */}
                    {MOTES.map((mote) => (
                      <motion.span
                        key={mote.left}
                        className="absolute size-px rounded-full bg-[rgba(206,244,255,0.85)] motion-reduce:hidden"
                        style={{ left: mote.left, top: mote.top }}
                        animate={{
                          x: [0, mote.drift, 0],
                          y: [0, mote.drift > 0 ? -6 : 5, 0],
                          opacity: [0, 0.22, 0.1, 0],
                        }}
                        transition={{
                          duration: mote.duration,
                          repeat: Infinity,
                          delay: mote.delay,
                          ease: "easeInOut",
                        }}
                      />
                    ))}

                    {/* A single slow sweep every ~15s — the dock catching a
                        passing light source. This is the only ambient motion
                        on the glass; the capsule owns the other one. */}
                    <motion.span
                      className="absolute inset-y-0 w-[38%] bg-[linear-gradient(102deg,transparent,rgba(255,255,255,0.10)_46%,rgba(190,238,255,0.05)_58%,transparent)] motion-reduce:hidden"
                      animate={{ x: ["-140%", "420%"] }}
                      transition={{
                        duration: SWEEP_DURATION,
                        repeat: Infinity,
                        repeatDelay: SWEEP_INTERVAL - SWEEP_DURATION,
                        ease: [0.4, 0, 0.6, 1],
                      }}
                    />

                    {/* Specular reflection riding the cursor. */}
                    <motion.span
                      className="absolute inset-y-0 mix-blend-plus-lighter motion-reduce:hidden"
                      style={{
                        x: reflectionX,
                        opacity: reflectionOpacity,
                        width: REFLECTION_SIZE,
                        background: CURSOR_REFLECTION,
                      }}
                    />

                    {/* The bevel catches light where the cursor is — the detail
                        that sells the edge as a physical edge. */}
                    <motion.span
                      className="absolute top-0 h-px motion-reduce:hidden"
                      style={{
                        x: bevelX,
                        opacity: reflectionOpacity,
                        width: BEVEL_HIGHLIGHT_SIZE,
                        background: BEVEL_HIGHLIGHT,
                      }}
                    />
                  </span>

                  <ul className="relative flex items-center gap-4">
                    {DOCK_DESTINATIONS.map((destination, index) => (
                      <DockItem
                        key={destination.id}
                        destination={destination}
                        index={index}
                        href={isHome ? `#${destination.id}` : `/#${destination.id}`}
                        isActive={activeId === destination.id}
                        isRevealed={revealedId === destination.id}
                        surfaceRef={surfaceRef}
                        pointerX={pointer.x}
                        engagement={pointer.engagement}
                        onReveal={setRevealedId}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.nav>
      </div>
    </MotionConfig>
  );
}
