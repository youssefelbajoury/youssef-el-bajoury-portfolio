"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { ShowcaseProject } from "@/types/project";

import { CaseStudyViewer } from "./CaseStudyViewer";

import type { ReactNode } from "react";

/**
 * Owns which case study is open, and nothing else.
 *
 * The provider exists so the gallery cards stay server-rendered. A card that
 * opened the viewer by holding the state itself would have to be a client
 * component, and it would drag its screenshot, its copy and its badges into the
 * client bundle with it. Instead the section's server output is passed straight
 * through as `children`, and each card gets a small client trigger laid over it
 * that does nothing but name a slug.
 *
 * Only the slug crosses the boundary. The viewer looks the project back up from
 * the same array the cards were built from, so there is one source of truth and
 * no chance of the two surfaces disagreeing.
 *
 * The viewer is mounted only while a study is open. That is what resets the
 * image gallery to the first shot on every open — no effect required — and it
 * keeps a closed viewer out of the accessibility tree entirely rather than
 * relying on it being hidden.
 */
const CaseStudyContext = createContext<((slug: string) => void) | null>(null);

export function useCaseStudyOpener() {
  const open = useContext(CaseStudyContext);

  if (!open) {
    throw new Error("useCaseStudyOpener must be used inside <CaseStudyProvider>.");
  }

  return open;
}

interface CaseStudyProviderProps {
  projects: readonly ShowcaseProject[];
  children: ReactNode;
}

export function CaseStudyProvider({ projects, children }: CaseStudyProviderProps) {
  /*
    A request, not a slug — and the counter is not decoration.

    The viewer takes about four tenths of a second to leave, and for that whole
    window the DOM and this state disagree: the dialog is closed and fading, and
    `request` still holds the project it is fading out. Storing only the slug
    made that window a dead zone. Closing a study and immediately reopening the
    *same* one set the identical value, React bailed out of the render, no effect
    re-ran, and the card simply did nothing — a bug that only exists between 0
    and 420ms after a close, which is exactly when an impatient reader clicks.

    A counter makes every open a distinct request, and the viewer is keyed on it,
    so any open during the exit remounts the viewer and reopens it. Same project
    or different, the path is one path.
  */
  const [request, setRequest] = useState<{ slug: string; id: number } | null>(null);

  /* Stable, so the triggers below never re-render because the viewer opened. */
  const open = useCallback(
    (slug: string) => setRequest((previous) => ({ slug, id: (previous?.id ?? 0) + 1 })),
    []
  );
  const close = useCallback(() => setRequest(null), []);

  const active = useMemo(
    () => (request ? (projects.find((project) => project.slug === request.slug) ?? null) : null),
    [request, projects]
  );

  return (
    <CaseStudyContext.Provider value={open}>
      {children}
      {active && request ? (
        <CaseStudyViewer key={request.id} project={active} onClose={close} />
      ) : null}
    </CaseStudyContext.Provider>
  );
}
