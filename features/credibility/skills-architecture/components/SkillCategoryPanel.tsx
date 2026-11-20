"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type { TechnicalSkillCategory } from "@/data/skills/skills-data";
import { TECHNICAL_SKILL_CATEGORIES } from "@/data/skills/skills-data";
import { getTechnologyAsset } from "@/data/technology-assets";
import { PANEL_EDGES, PANEL_FILL, RULE_COLOR } from "@/styles/material";

import { buildSkillPanelMotion } from "../skillsMotion";

import { TechnologyCard } from "./TechnologyCard";

import type { MouseEvent as ReactMouseEvent } from "react";

const TITLE_ID = "skill-category-title";
const DESCRIPTION_ID = "skill-category-description";

interface SkillCategoryPanelProps {
  category: TechnicalSkillCategory;
  onClose: () => void;
  onCategoryChange?: (category: TechnicalSkillCategory) => void;
}

/**
 * A category's technology gallery.
 *
 * This is the same native-dialog contract as the resume chooser: the top layer
 * sits above the fixed background and navigation, everything behind it becomes
 * inert, Escape and focus return are native, and the only custom parts are the
 * page scroll lock, the click-outside surface and the exit animation.
 *
 * `onCancel` is intercepted so the element stays in the top layer until the
 * exit has played. Every dismissal goes through `requestClose`, so there is
 * exactly one way out. Category changes happen inside the already-open dialog
 * and cross-fade; they never unmount the top layer.
 */
export function SkillCategoryPanel({
  category,
  onClose,
  onCategoryChange,
}: SkillCategoryPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const motionSpec = buildSkillPanelMotion(prefersReducedMotion);

  /** False for the single render before the dialog reaches the top layer. */
  const [staged, setStaged] = useState(false);
  /** Flipped by every route out; AnimatePresence plays the exit, then unmounts. */
  const [open, setOpen] = useState(true);

  const categoryIndex = TECHNICAL_SKILL_CATEGORIES.findIndex((item) => item.id === category.id);
  const total = TECHNICAL_SKILL_CATEGORIES.length;

  const stepCategory = useCallback(
    (direction: -1 | 1) => {
      if (!onCategoryChange || categoryIndex < 0) return;
      const nextIndex = (categoryIndex + direction + total) % total;
      const next = TECHNICAL_SKILL_CATEGORIES[nextIndex];
      if (next) onCategoryChange(next);
    },
    [categoryIndex, onCategoryChange, total]
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    setStaged(true);

    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;

    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      if (dialog.open) dialog.close();
    };
  }, []);

  const requestClose = useCallback(() => setOpen(false), []);

  const handleExitComplete = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  /* The full-viewport container is the click-outside surface. The dim beneath
     it is decorative and pointer-transparent, so a click outside the sheet
     lands here; a click inside bubbles up with a different target. */
  const handleSurfaceClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) requestClose();
    },
    [requestClose]
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-text-primary [&::backdrop]:bg-transparent"
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {staged && open ? (
          <div
            key="skill-panel"
            onClick={handleSurfaceClick}
            className="relative flex h-full w-full items-end justify-center overflow-hidden p-0 sm:items-center sm:p-24"
          >
            <motion.div
              aria-hidden
              {...motionSpec.backdrop}
              className="pointer-events-none absolute inset-0 bg-[rgba(6,7,8,0.78)] backdrop-blur-[8px]"
            />

            <motion.div
              {...motionSpec.panel}
              style={{ background: PANEL_FILL, boxShadow: PANEL_EDGES }}
              className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-sm border border-[rgba(46,230,255,0.22)] backdrop-blur-glass sm:max-h-[min(86svh,44rem)] sm:max-w-[68rem] sm:rounded-sm"
            >
              <CloseControl onClose={requestClose} title={category.title} />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={category.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={motionSpec.list}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="shrink-0 pl-24 pr-64 pt-24 sm:pl-32 sm:pt-32">
                    <div className="flex items-center justify-between gap-16">
                      <motion.p
                        variants={motionSpec.listItem}
                        className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary"
                      >
                        Technical Skills
                      </motion.p>

                      {onCategoryChange ? (
                        <motion.div
                          variants={motionSpec.listItem}
                          className="flex items-center gap-8"
                        >
                          <span className="font-mono text-[11px] tabular-nums tracking-[0.12em] text-text-tertiary">
                            {String(categoryIndex + 1).padStart(2, "0")} /{" "}
                            {String(total).padStart(2, "0")}
                          </span>
                          <StepControl
                            label="Previous technology category"
                            direction="left"
                            onClick={() => stepCategory(-1)}
                          />
                          <StepControl
                            label="Next technology category"
                            direction="right"
                            onClick={() => stepCategory(1)}
                          />
                        </motion.div>
                      ) : null}
                    </div>

                    <motion.h2
                      id={TITLE_ID}
                      variants={motionSpec.listItem}
                      className="mt-12 max-w-[46rem] text-h4 font-medium tracking-tight text-text-primary"
                    >
                      {category.title}
                    </motion.h2>

                    <motion.p
                      id={DESCRIPTION_ID}
                      variants={motionSpec.listItem}
                      className="mt-8 max-w-readable text-paragraph-sm text-text-secondary"
                    >
                      {category.description}
                    </motion.p>
                  </div>

                  <motion.div
                    variants={motionSpec.listItem}
                    aria-hidden
                    className="mx-24 mt-24 h-px shrink-0 sm:mx-32"
                    style={{ backgroundColor: RULE_COLOR }}
                  />

                  {/* One scroller for the gallery, inside a sheet capped to the
                      viewport. On a phone the sheet is full width and bottom
                      anchored; from `sm` it centres as a compact panel. Cards
                      stay near 125–145px even as the column count grows. */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={motionSpec.listGrid}
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-24 pb-32 pt-24 sm:px-32"
                  >
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {category.technologies.map((technology) => (
                        <motion.div
                          key={technology}
                          variants={motionSpec.listItem}
                          className="flex justify-center"
                        >
                          <TechnologyCard
                            name={technology}
                            asset={getTechnologyAsset(technology)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}

function CloseControl({ onClose, title }: { onClose: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-16 top-16 z-10 inline-flex size-[44px] items-center justify-center rounded-sm border border-[rgba(255,255,255,0.12)] bg-[rgba(8,9,10,0.72)] text-text-secondary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.055),4px_6px_16px_-12px_rgba(0,0,0,0.5)] backdrop-blur-glass transition-colors duration-medium ease-premium hover:border-[rgba(46,230,255,0.3)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <path d="m4 4 8 8M12 4l-8 8" />
      </svg>
      <span className="sr-only">Close the {title} technology gallery</span>
    </button>
  );
}

function StepControl({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-[44px] items-center justify-center rounded-sm border border-[rgba(255,255,255,0.1)] bg-[rgba(8,9,10,0.6)] text-text-tertiary transition-colors duration-medium ease-premium hover:border-[rgba(46,230,255,0.3)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? <path d="M10 3 5 8l5 5" /> : <path d="m6 3 5 5-5 5" />}
      </svg>
    </button>
  );
}
