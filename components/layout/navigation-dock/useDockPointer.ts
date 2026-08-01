"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import type { MotionValue } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

/** Peak magnetic drift of the whole dock toward the cursor, in px. */
const MAGNETIC_PULL = 4.5;
/** Peak tilt of the glass away from the cursor, in degrees. */
const TILT_Y = 2.6;
const TILT_X = 1.1;

export interface DockPointer {
  /** Cursor x within the surface, spring-smoothed. */
  x: MotionValue<number>;
  /** Cursor y within the surface, spring-smoothed. */
  y: MotionValue<number>;
  /** Current surface width, so consumers can work in normalised space. */
  width: MotionValue<number>;
  /** 0 when the cursor is elsewhere, 1 when it is on the glass. */
  engagement: MotionValue<number>;
  magneticX: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Cursor physics for the glass: one spring-smoothed pointer position that the
 * reflection, the bevel highlight, the tilt and every icon's magnification all
 * read from.
 *
 * Only mouse pointers engage it. A finger has no hover state, and driving
 * magnification off a touch would make the dock lurch under the thumb.
 *
 * The surface ref is owned by the caller — the element it points at is the
 * dock's coordinate space, and handing it back out of a hook would make every
 * read of it look like a ref access during render.
 */
export function useDockPointer(
  surfaceRef: RefObject<HTMLDivElement | null>,
  enabled: boolean
): DockPointer {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawEngagement = useMotionValue(0);
  const width = useMotionValue(1);
  /** Last cursor position in viewport space, so it survives a reflow. */
  const lastClientX = useRef<number | null>(null);

  const x = useSpring(rawX, { stiffness: 520, damping: 44, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 380, damping: 40, mass: 0.5 });
  const engagement = useSpring(rawEngagement, { stiffness: 190, damping: 30, mass: 0.7 });

  /*
    The dock changes width under a stationary cursor — a label opens, the
    padding grows. Two things have to be re-derived when that happens, and
    neither can wait for the next pointermove, because there may not be one:

      · the surface width, which normalises the tilt and magnetic maths;
      · the cursor's position *within* the surface, which is measured from an
        edge that just moved. Left stale, the magnification field sits several
        pixels away from the actual cursor and lights up the wrong icon.
  */
  useEffect(() => {
    const element = surfaceRef.current;
    if (!element) {
      return;
    }

    const sync = () => {
      width.set(element.offsetWidth || 1);

      if (lastClientX.current !== null) {
        rawX.set(lastClientX.current - element.getBoundingClientRect().left);
      }
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    return () => observer.disconnect();
  }, [surfaceRef, width, rawX]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      lastClientX.current = event.clientX;

      // First contact teleports the light instead of sweeping it across the
      // whole dock, which would fire every icon's magnification on the way in.
      if (rawEngagement.get() === 0) {
        rawX.set(localX);
        rawY.set(localY);
        x.jump(localX);
        y.jump(localY);
        rawEngagement.set(1);
        return;
      }

      rawX.set(localX);
      rawY.set(localY);
    },
    [enabled, rawEngagement, rawX, rawY, x, y]
  );

  const onPointerLeave = useCallback(() => {
    rawEngagement.set(0);
    lastClientX.current = null;
  }, [rawEngagement]);

  const magneticX = useTransform([x, width, engagement], (latest) => {
    const [pointerX = 0, surfaceWidth = 1, gate = 0] = latest as number[];
    return (pointerX / surfaceWidth - 0.5) * 2 * MAGNETIC_PULL * gate;
  });

  const rotateY = useTransform([x, width, engagement], (latest) => {
    const [pointerX = 0, surfaceWidth = 1, gate = 0] = latest as number[];
    return (pointerX / surfaceWidth - 0.5) * 2 * TILT_Y * gate;
  });

  const rotateX = useTransform([y, engagement], (latest) => {
    const [pointerY = 0, gate = 0] = latest as number[];
    // Surface height is a fixed 56px; normalising against it keeps the tilt
    // from needing a second observer.
    return (0.5 - pointerY / 56) * 2 * TILT_X * gate;
  });

  return {
    x,
    y,
    width,
    engagement,
    magneticX,
    rotateX,
    rotateY,
    onPointerMove,
    onPointerLeave,
  };
}
