import {
  SECONDARY_ACTION_BORDER,
  SECONDARY_ACTION_BORDER_HOVER,
  SECONDARY_ACTION_SHADOW,
} from "@/styles/material";

import type { CSSProperties } from "react";

/**
 * The secondary action, as one recipe.
 *
 * It is the Hero's GitHub control and the shared <Button variant="secondary">
 * expressed in the one place both of them already agree on: the same height,
 * the same horizontal pad, the same 8px radius, the same 14px semibold type,
 * the same hairline border, the same lit top bevel from styles/material.ts, and
 * the same rule for what hover is allowed to do — brighten one line, and
 * nothing else. Nothing here is a new value; every colour and every shadow comes
 * from the material file the rest of the site is drawn from.
 *
 * It exists as a recipe rather than as a fourth button component because the
 * resume triggers must be *the same object* as the control beside them in the
 * Hero, and the two things that separate them from <Button> — the magnetic
 * cursor pull and the 2% hover scale — are precisely what this brief rules out.
 * A trigger that scaled on hover next to one that did not would read as two
 * different controls doing the same job.
 *
 * WHAT IS ABSENT, and should stay absent: any glow. The page has one light
 * source in the upper left; a halo is light emitted by a button, and a button is
 * not a lamp.
 */

export const RESUME_ACTION_BASE =
  "group/action relative inline-flex items-center justify-center gap-8 rounded-sm border bg-transparent font-semibold tracking-tight text-text-primary transition-[color,border-color] duration-medium ease-premium hover:[border-color:var(--action-border-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-strong";

export const RESUME_ACTION_SIZE = {
  /** The triggers. SIZE_CLASSES.md in components/ui/Button.tsx, value for value. */
  md: "h-48 px-32 text-paragraph-sm",
  /**
   * The pair inside a resume card. Same height and same type as Button's `sm`,
   * with the horizontal pad taken down a step: two of these share a 272px card
   * interior, and at `px-24` the wider of the two labels does not fit. Height is
   * what carries the visual weight of a control, not side padding, so the pair
   * still reads as the same object as the trigger that opened the dialog.
   */
  compact: "h-40 px-16 text-paragraph-sm",
} as const;

export type ResumeActionSize = keyof typeof RESUME_ACTION_SIZE;

/**
 * The border is handed over twice — once as the resting value and once as a
 * custom property the `hover:` variant above reads. An inline `borderColor`
 * alone would outrank every class in the cascade and make the hover a no-op,
 * which is the same trap components/ui/Card.tsx documents for its shadows.
 */
export const RESUME_ACTION_STYLE: CSSProperties = {
  borderColor: SECONDARY_ACTION_BORDER,
  boxShadow: SECONDARY_ACTION_SHADOW,
  "--action-border-hover": SECONDARY_ACTION_BORDER_HOVER,
} as CSSProperties;

export function resumeActionClasses(size: ResumeActionSize, className = "") {
  return `${RESUME_ACTION_BASE} ${RESUME_ACTION_SIZE[size]} ${className}`;
}
