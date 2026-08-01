"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import {
  ACTION_GLASS,
  ACTION_SPECULAR,
  PRIMARY_ACTION_SHADOW,
  SECONDARY_ACTION_BORDER,
  SECONDARY_ACTION_BORDER_HOVER,
  SECONDARY_ACTION_SHADOW,
} from "@/styles/material";

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Renders an <a> when provided, otherwise a native <button>. */
  href?: string;
  /** Opens href in a new tab with rel="noreferrer". Ignored without href. */
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  type?: "button" | "submit";
  disabled?: boolean;
}

/**
 * The site's action, built from the same material as the Hero's.
 *
 * THE TWO ARE NOT PEERS. The primary is the only saturated object in its
 * composition: a lit top bevel, a fixed glass sheen that gives the face its
 * curvature, a specular highlight that tracks the cursor, and a shadow thrown
 * down-and-right. The secondary brightens one hairline and does nothing else.
 * If both responded richly the page would be offering two primary actions,
 * which is the same as offering none.
 *
 * WHAT WENT. `shadow-glow` and `shadow-glow-sm` — a cyan halo around the
 * button. A glow is light *emitted* by an object, and this page has exactly one
 * light source, in the upper left, which every bevel on every surface is
 * derived from. The halo also happened to be the only place on the page where
 * the accent behaved like a lamp rather than like ink. The full pill radius went
 * with it: the page is drawn on a rectilinear grid with square crop marks, and
 * a 9999px radius belongs to a different drawing.
 */

const BASE_CLASSES =
  "group/action relative inline-flex items-center justify-center gap-8 overflow-hidden rounded-sm font-semibold tracking-tight transition-[color,border-color] duration-medium ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-40";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-48 px-32 text-paragraph-sm",
  sm: "h-40 px-24 text-paragraph-sm",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink focus-visible:outline-accent",
  secondary:
    "border bg-transparent text-text-primary hover:[border-color:var(--action-border-hover)] focus-visible:outline-border-strong",
};

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: { boxShadow: PRIMARY_ACTION_SHADOW },
  secondary: {
    borderColor: SECONDARY_ACTION_BORDER,
    boxShadow: SECONDARY_ACTION_SHADOW,
    "--action-border-hover": SECONDARY_ACTION_BORDER_HOVER,
  } as CSSProperties,
};

/** Max pull toward the cursor, in px — restrained so it reads as weight, not as a toy. */
const MAGNETIC_PULL = 10;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  external = false,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.4 });

  const classes = `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;
  const hoverAnimation = prefersReducedMotion ? {} : { scale: 1.02 };
  const tapAnimation = prefersReducedMotion ? {} : { scale: 0.97 };

  function handlePointerMove(event: ReactMouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(relX * MAGNETIC_PULL);
    y.set(relY * MAGNETIC_PULL);

    /* The specular is written straight to the element as custom properties
       rather than held in React state: this runs on every pointer move, and a
       re-render per frame to move a highlight is the classic way to make a
       60fps effect cost 16ms. */
    event.currentTarget.style.setProperty("--action-px", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--action-py", `${event.clientY - rect.top}px`);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  /* The face of the object: glass always on (curvature, not a state) and a
     specular that fades in under the pointer. Reflected, never emitted. */
  const face =
    variant === "primary" ? (
      <>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: ACTION_GLASS }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-medium ease-premium group-hover/action:opacity-100"
          style={{ backgroundImage: ACTION_SPECULAR }}
        />
      </>
    ) : null;

  const content = (
    <>
      {face}
      <span className="relative inline-flex items-center gap-8">
        {children}
        {external ? (
          /* Hairline stroke, matching the frame rules and the crop marks. An
             icon set's default 2px stroke would be the heaviest line in the
             composition, which is precisely backwards for a glyph this small. */
          <ArrowUpRight
            className="size-16 transition-transform duration-medium ease-premium group-hover/action:translate-x-[2px] group-hover/action:translate-y-[-2px]"
            strokeWidth={1.25}
            aria-hidden
          />
        ) : null}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={onClick}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        style={{ ...VARIANT_STYLES[variant], x: springX, y: springY }}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        className={classes}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={{ ...VARIANT_STYLES[variant], x: springX, y: springY }}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
