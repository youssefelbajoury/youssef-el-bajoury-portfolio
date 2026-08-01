"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

/**
 * The primary action's magnetic field.
 *
 * The wrapper carries 12px of padding and cancels it with an equal negative
 * margin, which buys a proximity ring around the button without moving it by a
 * pixel. The pull therefore begins slightly *before* the pointer arrives — the
 * button leans toward the cursor and meets it. That anticipation is the whole
 * effect; magnetism that only starts once you are already on the target is just
 * a hover state with extra steps.
 *
 * Travel is capped at 5px. The cap is doing real work: a button that follows
 * the cursor far enough to be noticed is a button you can miss, and a control
 * that dodges the pointer is a usability defect dressed as delight. 5px is
 * under the width of the label's stem — felt, never chased.
 *
 * Published to the surfaces inside, in percent of the button box:
 *
 *   --action-px, --action-py   pointer position, 0 … 100
 *
 * The button never emits light. What tracks the pointer is a specular
 * highlight — light from the composition's one upper-left source, reflected
 * off a curved surface. Same rule the plate obeys, same rule heroMaterial.ts
 * derives every bevel from.
 */
const SPRING = { stiffness: 180, damping: 20, mass: 0.5 } as const;

/** Maximum travel toward the pointer, in pixels. */
const MAX_PULL = 5;

interface MagneticActionProps {
  href: string;
  children: ReactNode;
  /** Classes for the anchor itself. */
  className?: string;
  /** Classes for the field around it — layout lives here, not on the anchor. */
  fieldClassName?: string;
  style?: React.CSSProperties;
}

export function MagneticAction({
  href,
  children,
  className = "",
  fieldClassName = "",
  style,
}: MagneticActionProps) {
  const fieldRef = useRef<HTMLSpanElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const pullX = useSpring(useMotionValue(0), SPRING);
  const pullY = useSpring(useMotionValue(0), SPRING);

  function handlePointerMove(event: ReactPointerEvent<HTMLSpanElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;

    const field = fieldRef.current;
    const anchor = anchorRef.current;
    if (!field || !anchor) return;

    const rect = field.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    pullX.set((relX - 0.5) * 2 * MAX_PULL);
    pullY.set((relY - 0.5) * 2 * MAX_PULL);

    /* Measured against the anchor, not the padded field: the highlight belongs
       to the button's own surface, so 0–100% has to mean the button's edges. */
    const inner = anchor.getBoundingClientRect();
    anchor.style.setProperty(
      "--action-px",
      `${(((event.clientX - inner.left) / inner.width) * 100).toFixed(2)}%`
    );
    anchor.style.setProperty(
      "--action-py",
      `${(((event.clientY - inner.top) / inner.height) * 100).toFixed(2)}%`
    );
  }

  function handlePointerLeave() {
    pullX.set(0);
    pullY.set(0);
  }

  return (
    <span
      ref={fieldRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      /* The proximity ring exists only from `sm` up, and that is a layout fix
         as much as a behavioural one. `w-full` resolves against the border
         box, so 12px of padding on a full-width mobile button takes 24px out
         of the anchor inside it and leaves the primary action visibly short of
         the secondary stacked beneath it. Above `sm` the buttons are auto-width
         and the padding costs nothing. Below it there is no cursor to be
         magnetic toward in the first place — the effect is mouse-only. */
      className={`inline-flex sm:-m-12 sm:p-12 ${fieldClassName}`}
    >
      <motion.a
        ref={anchorRef}
        href={href}
        className={className}
        style={
          prefersReducedMotion
            ? style
            : ({ ...style, x: pullX, y: pullY, "--action-px": "50%", "--action-py": "0%" } as never)
        }
      >
        {children}
      </motion.a>
    </span>
  );
}
