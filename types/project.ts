import type { StaticImageData } from "next/image";

/**
 * Icon keys for a project's capability highlights. Kept as a closed union so a
 * new highlight cannot ship without a matching icon being registered in the
 * showcase's icon map — the compiler enforces the pairing.
 */
export type ProjectFeatureIcon =
  | "iot"
  | "ai"
  | "web"
  | "mobile"
  | "backend"
  | "dashboard"
  | "catalogue"
  | "filters"
  | "favourites"
  | "product"
  | "search"
  | "responsive";

export interface ProjectFeature {
  label: string;
  icon: ProjectFeatureIcon;
}

/**
 * Per-project accent, bound to CSS custom properties at the section root so a
 * single project can retint its glow, pills, rules, and focus rings without
 * every child needing to know which project it belongs to.
 *
 * `rgb` is a bare "R G B" triplet so it composes with modern alpha syntax:
 * `rgb(var(--project-accent-rgb) / 40%)`.
 */
export interface ProjectAccent {
  base: string;
  bright: string;
  rgb: string;
}

export interface ProjectShot {
  src: StaticImageData;
  alt: string;
}

export interface ShowcaseProject {
  id: string;
  /** Drives the case-study route: /projects/<slug>. */
  slug: string;
  title: string;
  /** Short positioning line rendered above the title. */
  discipline: string;
  /** One paragraph. No metrics that cannot be evidenced. */
  description: string;
  year: string;
  /** Rendered as the "Academic Project" style badge. */
  context: string;
  accent: ProjectAccent;
  features: ProjectFeature[];
  /**
   * Capability- and discipline-level pills, deliberately not framework names
   * that have not been confirmed. See the TODO in data/projects/projects.ts.
   */
  technologies: string[];
  shots: {
    hero: ProjectShot;
    secondary: ProjectShot;
    tertiary?: ProjectShot;
  };
  logo?: ProjectShot;
  /**
   * Absent until a real public repository exists. The GitHub action renders in
   * a disabled, honestly-labelled state while this is undefined — never a dead
   * link.
   */
  repoUrl?: string;
}
