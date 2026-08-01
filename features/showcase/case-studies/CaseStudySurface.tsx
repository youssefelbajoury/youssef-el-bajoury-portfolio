"use client";

import { motion, useReducedMotion } from "framer-motion";

import { caseStudyLayoutId, MORPH_SPRING, STILL } from "./caseStudyMotion";

import type { ReactNode } from "react";

interface CaseStudySurfaceProps {
  slug: string;
  className?: string;
  children: ReactNode;
}

/**
 * The card half of the shared-element transition — the surface the viewer is
 * lifted out of.
 *
 * It carries the same `layoutId` the viewer's sheet does, and that string is
 * the entire connection between them: Framer keeps one register of layout ids
 * for the whole app, so the two never have to know about each other, be
 * siblings, or even be in the same part of the tree. One of them is in the
 * document and the other is in the browser's top layer, and the morph still
 * resolves because both are measured in viewport coordinates.
 *
 * WHAT HAPPENS TO THIS ELEMENT WHILE THE VIEWER IS OPEN. Framer allows exactly
 * one lead per layout id; the viewer mounts second, becomes the lead, and this
 * one is hidden for as long as it stays open. That is not a side effect to work
 * around — it is the effect. The card is not *behind* the case study, it *is*
 * the case study, opened. It comes back when the viewer animates home.
 *
 * It is a wrapper rather than a prop on the tile itself because the tile is a
 * TiltCard: a motion component already writing rotateX, rotateY and two
 * translations from pointer springs. A layout projection and a pointer
 * transform on one element fight over the same matrix, and the tell is a card
 * that skews as it opens.
 */
export function CaseStudySurface({ slug, className = "", children }: CaseStudySurfaceProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={caseStudyLayoutId(slug)}
      transition={prefersReducedMotion ? STILL : MORPH_SPRING}
      /* `relative` is the positioning context for the trigger laid over the
         card — the overlay is what makes the whole tile clickable without
         wrapping an <article> in an <a>, which is invalid markup that browsers
         repair in layout-breaking ways. */
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
