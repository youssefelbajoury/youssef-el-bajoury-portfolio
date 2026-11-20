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
  | "responsive"
  | "api"
  | "data"
  | "pipeline"
  | "quality"
  | "orchestration"
  | "bi"
  | "observability"
  | "storage"
  | "access"
  | "alerts"
  | "realtime"
  | "database"
  | "testing"
  | "container"
  | "sensor"
  | "climate"
  | "presence"
  | "light"
  | "gas"
  | "history";

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
  /** Short visible label for a gallery image, such as a dashboard category or build status. */
  caption?: string;
}

/**
 * One evidenced number about a project, as it should be read: a value and what
 * the value counts.
 *
 * These are structural rather than prose because the showcase renders them as a
 * ruled instrument panel. Nothing lands here that cannot be counted from the
 * project itself — a schema, a contract, a test run.
 */
export interface ProjectMetric {
  value: string;
  label: string;
}

/**
 * One tier of a project's system, top-down: what the reader would draw on a
 * whiteboard if asked how the thing is put together.
 *
 * Two fields rather than a paragraph because the case study renders them as a
 * numbered stack — `name` is the tier ("Sensing", "API", "Interface"), `detail`
 * is the sentence that says what actually runs there. A layer whose detail
 * cannot be written without guessing is a layer that should not be listed.
 */
export interface ArchitectureLayer {
  name: string;
  detail: string;
}

/**
 * The written half of a case study — the part that cannot be derived from a
 * screenshot.
 *
 * Every field is a list, and an empty one is a valid, meaningful state: the
 * viewer renders a section only when it has entries, and says plainly which
 * ones are still being written. That is deliberate. These are first-person
 * claims about how a project was built and what it taught its author, so an
 * empty array is the honest default and placeholder prose is not — nobody
 * downstream can tell invented reflection from the real thing.
 */
export interface ProjectCaseStudy {
  architecture: ArchitectureLayer[];
  challenges: string[];
  solutions: string[];
  /**
   * What the build actually produced — shipped surfaces, measured outcomes, a
   * grade, a demo that ran. One claim per entry, and every one of them has to be
   * evidenced. This is the field a portfolio is most tempted to invent, which is
   * exactly why it ships empty like the rest.
   */
  results: string[];
  lessons: string[];
}

/**
 * Everything a project has regardless of how its tile is drawn.
 *
 * Split from the two variants below because the showcase has two honest shapes:
 * a project with screenshots, and a system whose evidence is a schema, a
 * contract and a test run rather than a picture. Neither is a lesser project, so
 * the shared half carries no hint of which one it is.
 */
interface ShowcaseProjectBase {
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
  /**
   * The case-study viewer's image set, in reading order.
   *
   * Separate from `shots` because the two have different jobs: `shots` are the
   * three compositions the showcase tile is built around — a laptop render, a
   * browser strip, a product plate — while this is the walk through the product
   * itself, screen by screen. A card shows the work; a case study shows the
   * build.
   *
   * Static imports only (never a string path), because that is what gives
   * next/image the intrinsic dimensions and the generated blur placeholder. A
   * runtime string would cost both.
   */
  gallery: ProjectShot[];
  logo?: ProjectShot;
  /**
   * Counted evidence rendered by the system tile and the case study. Optional
   * because a screenshot-led project may have no such numbers to publish.
   */
  metrics?: ProjectMetric[];
  /** One line stating where the metrics came from, so they are not free-floating. */
  metricNote?: string;
  /**
   * Absent until a real public repository exists. The GitHub action renders in
   * a disabled, honestly-labelled state while this is undefined — never a dead
   * link.
   */
  repoUrl?: string;
  /** Absent until something is actually deployed. Same disabled treatment as `repoUrl`. */
  liveUrl?: string;
  /**
   * Required, not optional — a new project cannot ship without the author at
   * least deciding what its case study says, in the same way `features` cannot
   * ship without a registered icon. An all-empty study is a legitimate answer;
   * forgetting the field is not.
   */
  caseStudy: ProjectCaseStudy;
}

/**
 * A project the showcase can present as a machine: a laptop render, a browser
 * strip, a product plate. The bespoke tiles narrow to this so their access to
 * `shots` is checked by the compiler rather than asserted.
 */
export interface ScreenshotProject extends ShowcaseProjectBase {
  shots: {
    hero: ProjectShot;
    secondary: ProjectShot;
    tertiary?: ProjectShot;
  };
}

/**
 * A project with no screenshots to show, presented through its measured shape
 * instead. `shots` is explicitly `undefined` so it cannot be half-populated and
 * silently rendered as a broken mockup.
 */
export interface SystemShowcaseProject extends ShowcaseProjectBase {
  shots?: undefined;
  metrics: ProjectMetric[];
}

export type ShowcaseProject = ScreenshotProject | SystemShowcaseProject;
