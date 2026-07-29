"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="pointer-events-none absolute inset-x-0 bottom-40 flex flex-col items-center gap-8"
      aria-hidden
    >
      <span className="font-mono text-caption uppercase tracking-widest text-text-tertiary">
        Scroll
      </span>
      <span className="relative h-40 w-px overflow-hidden bg-divider">
        <motion.span
          className="absolute inset-x-0 top-0 h-16 w-px bg-accent motion-reduce:hidden"
          animate={prefersReducedMotion ? undefined : { y: [0, 24, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </span>
    </motion.div>
  );
}
