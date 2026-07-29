"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { HERO_ROLES } from "@/constants/profile";

const ROTATION_INTERVAL_MS = 2400;

export function RotatingRole() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % HERO_ROLES.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const role = HERO_ROLES[index] ?? HERO_ROLES[0];

  return (
    <span className="relative inline-block h-[1.6em] min-w-[17ch] align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={role}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 whitespace-nowrap"
        >
          {role}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
