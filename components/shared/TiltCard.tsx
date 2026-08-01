"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { PANEL_BORDER, PANEL_EDGES, PANEL_EDGES_HOVER, PANEL_FILL } from "@/styles/material";

import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /**
   * Maximum rotation in degrees. Kept low by default — past ~7deg the effect
   * stops reading as material and starts reading as a gimmick.
   */
  maxTilt?: number;
  /** Maximum magnetic pull toward the cursor, in px. */
  magnetism?: number;
  /** Disables the moving specular for tiles that should stay perfectly matte. */
  glow?: boolean;
  /**
   * Rotation the card sits at when the pointer is away, in degrees. Defaults
   * to flat. A non-zero resting angle makes the surface read as an object
   * placed on the page rather than a panel painted onto it — the pointer then
   * eases it back toward level, which feels like picking something up.
   */
  restingTilt?: { x: number; y: number };
}

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 } as const;

/**
 * The one interactive surface every showcase tile is built on: 3D tilt, cursor
 * magnetism, and a highlight that tracks the pointer across the face.
 *
 * It is the same panel material as <Card>, with the pointer wired up — same
 * lit top edge, same shaded underside, same shadow thrown down-and-right, so a
 * showcase tile and a skills card are visibly the same object at two sizes.
 *
 * THE HIGHLIGHT IS WHITE, and that is the substantive change this surface went
 * through. It used to be a 38rem wash of the owning project's accent, faded in
 * on hover — which is a coloured lamp switching on inside the card. A surface
 * reflects the light in the room, and the room's light is the white key light
 * at the page's upper left. So the accent stopped being light and stayed ink:
 * it survives on labels, hairlines and one pill per tile, where a project's
 * identity belongs.
 *
 * Every motion channel collapses to zero under `prefers-reduced-motion`; the
 * card then renders as a plain lit surface with no pointer handlers doing work.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 5,
  magnetism = 6,
  glow = true,
  restingTilt = { x: 0, y: 0 },
}: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(restingTilt.x), SPRING);
  const rotateY = useSpring(useMotionValue(restingTilt.y), SPRING);
  const translateX = useSpring(useMotionValue(0), SPRING);
  const translateY = useSpring(useMotionValue(0), SPRING);

  /*
    Parked above the top-left corner, which is where the key light is. That
    resting position is why the specular can be present at rest rather than
    fading in on hover: at 20% / -18% the falloff grazes the card's lit corner
    and nothing else, so what the pointer does is *move* a highlight that was
    already there. A highlight that only exists on hover is a hover state; one
    that exists always and moves is a surface.
  */
  const pointerX = useMotionValue(20);
  const pointerY = useMotionValue(-18);

  const specular = useMotionTemplate`radial-gradient(32rem circle at ${pointerX}% ${pointerY}%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.016) 36%, transparent 64%)`;

  function handlePointerMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    pointerX.set(relX * 100);
    pointerY.set(relY * 100);

    rotateY.set((relX - 0.5) * 2 * maxTilt);
    rotateX.set((relY - 0.5) * -2 * maxTilt);
    translateX.set((relX - 0.5) * 2 * magnetism);
    translateY.set((relY - 0.5) * 2 * magnetism);
  }

  function handlePointerLeave() {
    pointerX.set(20);
    pointerY.set(-18);
    // Back to the resting angle, not to flat — for the default this is the
    // same thing, and for a tilted card it settles rather than snaps level.
    rotateX.set(restingTilt.x);
    rotateY.set(restingTilt.y);
    translateX.set(0);
    translateY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={
        {
          background: PANEL_FILL,
          borderColor: PANEL_BORDER,
          "--panel-shadow": PANEL_EDGES,
          "--panel-shadow-hover": PANEL_EDGES_HOVER,
          ...(prefersReducedMotion
            ? {}
            : { rotateX, rotateY, x: translateX, y: translateY, transformPerspective: 1400 }),
        } as CSSProperties
      }
      /* The `shadow:` type hint inside the arbitrary value is load-bearing:
         without it Tailwind reads the variable as a *colour* and the element
         ends up with no box-shadow at all. See components/ui/Card.tsx. */
      className={`group relative isolate overflow-hidden rounded-sm border shadow-[shadow:var(--panel-shadow)] transition-shadow duration-medium ease-apple hover:shadow-[shadow:var(--panel-shadow-hover)] ${className}`}
    >
      {glow ? (
        <motion.div
          aria-hidden
          style={prefersReducedMotion ? undefined : { backgroundImage: specular }}
          className="pointer-events-none absolute inset-0 z-content"
        />
      ) : null}

      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
