"use client";

import { useCallback, useState } from "react";

import { ResumeDialog } from "./ResumeDialog";

import type { ReactNode } from "react";

/**
 * The resume dialog, as a hook — because the three places that open it are three
 * different controls.
 *
 * The Hero and the contact card both use the secondary trigger, so they share
 * <ResumeTrigger>. About opens the same dialog from the site's own primary
 * <Button>, which cannot carry a dialog of its own without becoming a different
 * component. A hook is what lets all three own the state without any of them
 * owning the markup.
 *
 * There is no provider and no context, and that is deliberate: the dialog is
 * mounted only while it is open, so a closed one is not merely hidden — it is
 * absent from the DOM and from the accessibility tree entirely. Three call sites
 * therefore cost three booleans and nothing else, and the dialog is remounted on
 * every open, which resets it without an effect.
 *
 * `close` is called by the dialog after its exit has finished playing, not when
 * the reader asks to leave — see ResumeDialog for why the order matters to the
 * return of focus.
 */
export function useResumeDialog(): { open: () => void; dialog: ReactNode } {
  const [isOpen, setIsOpen] = useState(false);

  /* Stable, so a trigger never re-renders because something else on the page
     did. */
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    open,
    dialog: isOpen ? <ResumeDialog onClose={close} /> : null,
  };
}
