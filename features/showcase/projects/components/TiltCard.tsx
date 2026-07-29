"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

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
  /** Disables the accent border glow for tiles that should stay quiet. */
  glow?: boolean;
}

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 } as const;

/**
 * The one interactive surface every showcase tile is built on: 3D tilt,
 * cursor magnetism, a cursor-tracked light reflection, and a soft accent
 * border glow.
 *
 * Tint comes from the `--project-accent-rgb` custom property set by the owning
 * project section, so this component stays project-agnostic.
 *
 * Every motion channel collapses to zero under `prefers-reduced-motion`; the
 * card then renders as a plain elevated surface with no pointer handlers doing
 * work.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 5,
  magnetism = 6,
  glow = true,
}: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const translateX = useSpring(useMotionValue(0), SPRING);
  const translateY = useSpring(useMotionValue(0), SPRING);

  // Parked off-surface so the reflection is invisible until the pointer arrives.
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(-30);

  const reflection = useMotionTemplate`radial-gradient(38rem circle at ${pointerX}% ${pointerY}%, rgb(var(--project-accent-rgb) / 12%), transparent 62%)`;

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
    pointerY.set(-30);
    rotateX.set(0);
    rotateY.set(0);
    translateX.set(0);
    translateY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={
        prefersReducedMotion
          ? undefined
          : { rotateX, rotateY, x: translateX, y: translateY, transformPerspective: 1400 }
      }
      className={`group relative isolate overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-[border-color,box-shadow] duration-medium ease-premium hover:border-[rgb(var(--project-accent-rgb)/28%)] ${className}`}
    >
      {glow ? (
        <motion.div
          aria-hidden
          style={prefersReducedMotion ? undefined : { backgroundImage: reflection }}
          className="pointer-events-none absolute inset-0 z-content opacity-0 transition-opacity duration-slow ease-premium group-hover:opacity-100"
        />
      ) : null}

      {/* Inner top highlight — the hairline that makes the surface read as a
          physical panel rather than a filled rectangle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />

      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
