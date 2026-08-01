"use client";

import { useMotionValue, useReducedMotion, useSpring, motion } from "framer-motion";
import { useRef } from "react";

import type { MotionStyle } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

/**
 * The plate's pointer response — a museum object, not a trading card.
 *
 * Three things separate this from the site's TiltCard (which is deliberately
 * not reused here):
 *
 *   TWO DEGREES, not five. Past about 3° a rectangle stops reading as an
 *     object being examined and starts reading as an interface element doing
 *     a trick. The plate is meant to acknowledge the pointer, not follow it.
 *
 *   NO GLOW. TiltCard throws an accent-tinted bloom on hover. A glow is light
 *     emitted by the object, which would make the plate a second light source
 *     in a composition whose entire material system is derived from one. What
 *     this does instead is *reflect* — a specular highlight that moves across
 *     the face as the angle changes, which is what a real surface under a
 *     fixed lamp actually does.
 *
 *   THE MARKS DO NOT TILT. Only the plate is wrapped here. The registration
 *     marks stay flat on the page outside it, so what tips is the object and
 *     what stays put is the drawing it sits on. That one separation is most of
 *     why the effect reads as physical.
 *
 * Published for the surfaces above to consume, in percent of the plate box:
 *
 *   --plate-px, --plate-py   pointer position, 0 … 100
 *
 * Spring rather than a raw transition: a damped spring settles asymmetrically
 * — quick to respond, slow to level off — which is how something with mass
 * behaves. A cubic ease is the same speed in both directions and reads as a
 * hinge.
 */
const SPRING = { stiffness: 120, damping: 22, mass: 0.7 } as const;

/** Maximum rotation at full deflection, in degrees. */
const MAX_TILT = 2;
/** Maximum positional drift toward the pointer, in pixels. */
const MAX_DRIFT = 3;

interface PlateStageProps {
  children: ReactNode;
  className?: string;
}

export function PlateStage({ children, className = "" }: PlateStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const driftX = useSpring(useMotionValue(0), SPRING);
  const driftY = useSpring(useMotionValue(0), SPRING);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    /* Coarse pointers get the resting plate. A touch device firing this on tap
       would tip the plate and leave it tipped, since there is no leave event
       to bring it back. */
    if (prefersReducedMotion || event.pointerType !== "mouse") return;

    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    host.style.setProperty("--plate-px", `${(relX * 100).toFixed(2)}%`);
    host.style.setProperty("--plate-py", `${(relY * 100).toFixed(2)}%`);

    /* Y-rotation follows horizontal position; X-rotation is inverted, because
       pushing the pointer toward the top of an object tips its top away. */
    rotateY.set((relX - 0.5) * 2 * MAX_TILT);
    rotateX.set((relY - 0.5) * -2 * MAX_TILT);
    driftX.set((relX - 0.5) * 2 * MAX_DRIFT);
    driftY.set((relY - 0.5) * 2 * MAX_DRIFT);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    driftX.set(0);
    driftY.set(0);
  }

  return (
    <motion.div
      ref={hostRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
      style={
        prefersReducedMotion
          ? undefined
          : /* MotionStyle has no index signature for custom properties, so the
               two seed values below have to be asserted in. They are seeds
               only — PlateStage writes the live values straight to the node in
               handlePointerMove, which bypasses React and the type entirely. */
            ({
              rotateX,
              rotateY,
              x: driftX,
              y: driftY,
              transformPerspective: 1600,
              /* Parked at the top-left corner, where the key light already is,
                 so the resting highlight agrees with the rest of the material
                 system before the pointer has ever arrived. */
              "--plate-px": "14%",
              "--plate-py": "8%",
            } as MotionStyle)
      }
    >
      {children}
    </motion.div>
  );
}
