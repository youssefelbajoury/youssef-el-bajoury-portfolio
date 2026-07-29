"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { MouseEvent as ReactMouseEvent, MouseEventHandler, ReactNode } from "react";

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

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-glow-sm hover:shadow-glow focus-visible:outline-accent",
  secondary:
    "border border-border bg-transparent text-text-primary hover:border-border-strong hover:bg-surface-raised focus-visible:outline-border-strong",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-32 py-16 text-paragraph-sm",
  sm: "px-24 py-12 text-paragraph-sm",
};

const BASE_CLASSES =
  "inline-flex items-center gap-8 rounded-full font-semibold tracking-tight transition-[color,background-color,border-color,box-shadow] duration-medium ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-40";

/** Max pull toward the cursor, in px — restrained so it reads as premium weight, not a toy. */
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
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={onClick}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        style={{ x: springX, y: springY }}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        className={classes}
      >
        {children}
        {external ? <ArrowUpRight className="size-16" aria-hidden /> : null}
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
      style={{ x: springX, y: springY }}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
