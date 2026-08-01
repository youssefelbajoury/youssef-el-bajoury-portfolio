"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ActiveCapsule } from "./ActiveCapsule";
import {
  LABEL_SPRING,
  MAGNET_PULL,
  MAGNIFY_GAIN,
  MAGNIFY_LIFT,
  MAGNIFY_RADIUS,
  PRESS_SPRING,
} from "./dockMaterial";

import type { DockDestination } from "./navigationItems";
import type { MotionValue } from "framer-motion";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

/** Opacity the bold icon reaches under the cursor, and when active. */
const WEIGHT_ON_HOVER = 0.5;
const WEIGHT_ON_ACTIVE = 0.8;

interface DockItemProps {
  destination: DockDestination;
  href: string;
  /** Position in the row, used only to offset the idle breath. */
  index: number;
  isActive: boolean;
  /** Label is revealed on hover and on keyboard focus, not only on hover. */
  isRevealed: boolean;
  /** The glass surface — the element the cursor's coordinates are measured in. */
  surfaceRef: RefObject<HTMLDivElement | null>;
  /** Spring-smoothed cursor x, in the dock surface's coordinate space. */
  pointerX: MotionValue<number>;
  /** 0 when the cursor is off the glass, 1 when it is on it. */
  engagement: MotionValue<number>;
  onReveal: (id: string | null) => void;
  onNavigate: (id: string, event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

/**
 * One station on the dock.
 *
 * Magnification is computed from the item's own measured centre rather than
 * its index, so it stays correct while neighbouring labels are mid-animation
 * and the row's geometry is still moving.
 */
export function DockItem({
  destination,
  href,
  index,
  isActive,
  isRevealed,
  surfaceRef,
  pointerX,
  engagement,
  onReveal,
  onNavigate,
}: DockItemProps) {
  const { id, label, Icon, badge, status } = destination;
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  // Centre lives in a MotionValue so the magnification transform recomputes
  // when the row reflows, without a React render.
  const center = useMotionValue(0);

  useEffect(() => {
    const element = iconRef.current;
    const surface = surfaceRef.current;
    if (!element || !surface) {
      return;
    }

    /*
      Two decisions here.

      Measured against the surface's own rect, not via offsetLeft: offsetLeft
      is relative to the nearest *positioned* ancestor, which here is the list
      item — that collapses all five centres onto the same value and silently
      kills the magnification field. Rects put this in exactly the coordinate
      space the pointer is reported in, whatever the positioning context.

      Measured from the icon, not the anchor: an item with its label open is
      more than twice as wide as one without, so its box centre sits out in the
      middle of the text. It is the icon that magnifies, so it is the icon that
      the field has to be centred on.
    */
    const measure = () => {
      const surfaceBounds = surface.getBoundingClientRect();
      const iconBounds = element.getBoundingClientRect();
      center.set(iconBounds.left - surfaceBounds.left + iconBounds.width / 2);
    };
    measure();

    // The surface resizes both when a label opens and when the dock expands
    // under the cursor, so one observer on it catches everything that can move
    // this item.
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    return () => observer.disconnect();
  }, [center, surfaceRef]);

  /*
    Spring targets are held in motion values and pushed from an effect.

    `useSpring(0.5)` — a spring seeded with a plain number — takes that number
    as its *initial* value only; handing it a different number on a later
    render does not re-target it. Both of these read as ordinary React state
    and would silently never animate.
  */
  const revealTarget = useMotionValue(0);
  const pressTarget = useMotionValue(1);

  useEffect(() => {
    revealTarget.set(isRevealed ? 1 : 0);
  }, [isRevealed, revealTarget]);

  useEffect(() => {
    pressTarget.set(isPressed ? 0.88 : 1);
  }, [isPressed, pressTarget]);

  /**
   * Pointing at an item always wins outright.
   *
   * The distance field alone is not enough: opening this item's label puts the
   * cursor over the *label*, several tens of pixels from its own icon, which
   * hands the field to the neighbour — you point at one icon and a different
   * one swells. Springing the boost keeps the arrival continuous instead of a
   * step, and it covers keyboard focus for free.
   */
  const hoverBoost = useSpring(revealTarget, { stiffness: 320, damping: 34, mass: 0.6 });

  /**
   * Smoothstep falloff. A linear ramp gives the mechanical, evenly-spaced
   * bulge that reads as a CSS demo; easing both ends is what makes the field
   * feel like the macOS Dock. This is what makes the *neighbours* respond.
   */
  const proximity = useTransform([pointerX, center, engagement, hoverBoost], (latest) => {
    const [x = 0, itemCenter = 0, gate = 0, boost = 0] = latest as number[];
    const falloff = Math.max(0, 1 - Math.abs(x - itemCenter) / MAGNIFY_RADIUS);
    return Math.max(falloff * falloff * (3 - 2 * falloff) * gate, boost);
  });

  const press = useSpring(pressTarget, PRESS_SPRING);
  const iconScale = useTransform([proximity, press], (latest) => {
    const [nearness = 0, pressed = 1] = latest as number[];
    return (1 + nearness * MAGNIFY_GAIN) * pressed;
  });
  const iconLift = useTransform(proximity, (value) => -value * MAGNIFY_LIFT);

  /**
   * Magnetism, over a wider field than magnification so an icon starts leaning
   * before it starts growing. Signed by which side the cursor is on and zero
   * directly beneath it, so icons lean *toward* the cursor instead of being
   * shoved by it.
   */
  const magnetX = useTransform([pointerX, center, engagement], (latest) => {
    const [x = 0, itemCenter = 0, gate = 0] = latest as number[];
    const delta = x - itemCenter;
    const reach = MAGNIFY_RADIUS * 1.7;
    const falloff = Math.max(0, 1 - Math.abs(delta) / reach);
    return (delta / reach) * falloff * MAGNET_PULL * gate * 2;
  });

  // Stroke weight, cross-faded rather than swapped: two stacked renders of the
  // same glyph, so the stroke appears to thicken continuously as the cursor
  // arrives. Swapping the `weight` prop would pop between two path sets.
  const activeWeight = isActive ? WEIGHT_ON_ACTIVE : 0;
  const boldOpacity = useTransform(proximity, (value) =>
    Math.max(activeWeight, value * WEIGHT_ON_HOVER)
  );
  const bloomOpacity = useTransform(proximity, (value) => value * 0.5);
  const bloomScale = useTransform(proximity, (value) => 0.7 + value * 0.3);

  const handleEnter = useCallback(() => onReveal(id), [id, onReveal]);
  const handleLeave = useCallback(() => {
    setIsPressed(false);
    onReveal(null);
  }, [onReveal]);

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => onNavigate(id, event),
    [id, onNavigate]
  );

  const showLabel = isActive || isRevealed;
  const iconTone = isActive
    ? "text-white drop-shadow-[0_0_6px_rgba(190,240,255,0.32)]"
    : "text-text-tertiary transition-colors duration-fast ease-standard group-hover:text-text-primary group-focus-visible:text-text-primary";

  return (
    <li className="relative">
      <Link
        ref={anchorRef}
        href={href}
        aria-label={label}
        /* "location", not "page": these are positions within the page, and
           the visual label is aria-hidden so the name comes from aria-label
           alone rather than being announced twice. */
        aria-current={isActive ? "location" : undefined}
        onClick={handleClick}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            handleEnter();
          }
        }}
        onPointerLeave={handleLeave}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerCancel={() => setIsPressed(false)}
        onFocus={handleEnter}
        onBlur={handleLeave}
        /* 44x44 hit area — the WCAG 2.5.5 / HIG target minimum — around a
           40px capsule. Width relaxes to 40px only below 360px, where a full
           44px row plus the longest label would overflow the viewport; that
           still clears the 24px WCAG 2.5.8 AA floor by a wide margin. */
        className="group relative flex h-[44px] items-center rounded-full px-8 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-[360px]:px-12"
      >
        {isActive && <ActiveCapsule />}

        {/* Static measuring box. The animated span inside carries the magnet
            offset, so measuring *it* would feed its own output back into the
            field's input; this wrapper keeps the layout position clean. */}
        <span ref={iconRef} className="relative flex items-center justify-center">
          <motion.span
            className="relative flex items-center justify-center"
            style={{ scale: iconScale, y: iconLift, x: magnetX }}
          >
            {/* Bloom — light gathering on the glass around the icon the cursor
              is over, rather than a highlight drawn on the icon itself. */}
            <motion.span
              aria-hidden
              style={{ opacity: bloomOpacity, scale: bloomScale }}
              className="pointer-events-none absolute size-32 rounded-full bg-[radial-gradient(circle,rgba(198,243,255,0.22),transparent_66%)]"
            />

            {/* Idle: an almost-subliminal float, offset per item so the row
              never pulses in unison. The active icon holds still — it is
              seated in the capsule. */}
            <motion.span
              className="relative flex"
              animate={isActive ? { y: 0 } : { y: [0, -1.2, 0] }}
              transition={{
                duration: 9 + index * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 1.3,
              }}
            >
              <Icon size={20} weight="regular" className={iconTone} aria-hidden />
              <motion.span
                aria-hidden
                className="absolute inset-0 flex"
                style={{ opacity: boldOpacity }}
              >
                <Icon size={20} weight="bold" className={iconTone} aria-hidden />
              </motion.span>
            </motion.span>

            {status && (
              <span
                aria-hidden
                className={`absolute -right-px -top-px size-[6px] rounded-full ring-2 ring-[rgba(10,12,14,0.9)] ${
                  status === "online"
                    ? "bg-success"
                    : status === "busy"
                      ? "bg-danger"
                      : "bg-warning"
                }`}
              />
            )}

            {badge !== undefined && (
              <span
                aria-hidden
                className={
                  badge === "dot"
                    ? /* No halo. The page's accent is ink, never a lamp — the
                         one 6px object allowed to look lit is the availability
                         status lens, and it is lit rather than emitting. */
                      "absolute -right-4 -top-4 size-[5px] rounded-full bg-accent shadow-[inset_0_-1px_1px_-0.5px_rgba(0,0,0,0.45),1px_1.5px_2px_-1px_rgba(0,0,0,0.7)]"
                    : "absolute -right-8 -top-8 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-accent px-4 font-mono text-[10px] font-semibold leading-none text-accent-ink"
                }
              >
                {badge === "dot" ? null : badge}
              </span>
            )}
          </motion.span>
        </span>

        {/* Width animates from 0 to the measured intrinsic width, so the dock
            re-shapes around the label instead of reserving dead space for it
            or snapping between two sizes. */}
        <AnimatePresence initial={false}>
          {showLabel && (
            <motion.span
              key="label"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={LABEL_SPRING}
              className="relative overflow-hidden"
            >
              <span
                aria-hidden
                className={`block whitespace-nowrap pl-8 pr-[3px] text-caption font-medium tracking-tight ${
                  isActive ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {label}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </li>
  );
}
