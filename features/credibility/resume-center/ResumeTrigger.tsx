"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import { resumeActionClasses, RESUME_ACTION_STYLE } from "./resumeAction";
import { GLYPH_HOVER, HOVER_TRANSITION } from "./resumeMotion";
import { useResumeDialog } from "./useResumeDialog";

interface ResumeTriggerProps {
  /** Layout only — width and flow. The control's own recipe is never overridden. */
  className?: string;
}

/**
 * View Resume — the secondary trigger, in the Hero and in the contact card.
 *
 * It is the same object as the GitHub control beside it in the Hero: same
 * height, same pad, same radius, same 14px semibold type, same hairline, same
 * lit top bevel. See resumeAction.ts, which is where that agreement is written
 * down once rather than copied. What changes is the glyph — a document rather
 * than an outbound arrow, because this one does not leave the site.
 *
 * WHAT HOVER DOES, AND WHAT IT REFUSES TO DO. The hairline brightens by one
 * step and the document lifts two pixels. Nothing scales, nothing glows,
 * nothing translates far enough to be described afterwards. Two responses on
 * one curve, both under the threshold of noticing — which is the difference
 * between a control that feels considered and one that performs.
 *
 * The lift is Framer's, driven by a variant label rather than by state: a
 * `whileHover` label propagates to the glyph through context, so the button
 * re-renders exactly never and the glyph is the only thing with a transform on
 * it. The button itself defines no transform in either variant, which is what
 * leaves the Hero's CSS entrance animation — applied to the wrapper around this
 * — free to own the element's transform without the two fighting.
 */
export function ResumeTrigger({ className = "" }: ResumeTriggerProps) {
  const { open, dialog } = useResumeDialog();

  return (
    <>
      <motion.button
        type="button"
        onClick={open}
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
        style={RESUME_ACTION_STYLE}
        className={resumeActionClasses("md", className)}
      >
        {/* Hairline stroke, matching the frame rules and the crop marks. An icon
            set's default 2px stroke would be the heaviest line in the row — the
            GitHub control's arrow beside it is drawn at the same 1.25. */}
        <motion.span
          aria-hidden
          variants={GLYPH_HOVER}
          transition={HOVER_TRANSITION}
          className="inline-flex"
        >
          <FileText className="size-16" strokeWidth={1.25} />
        </motion.span>
        View Resume
      </motion.button>

      {dialog}
    </>
  );
}
