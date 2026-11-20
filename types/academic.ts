import type { StaticImageData } from "next/image";

/**
 * One exercise from the Data, XML et Web Services module.
 *
 * Every field is read off the exercise's own files — the DTD, the XSLT, and the
 * README that ships beside them. There is deliberately no grade, no difficulty
 * score, and no completion percentage: the work is the schema and the transform,
 * and a reader can open either from the repository link.
 */
export interface AcademicProject {
  id: string;
  /** The exercise's own label, e.g. "S2 · Bibliothèque". */
  code: string;
  title: string;
  /** What the exercise models, in one or two sentences. */
  summary: string;
  /** Facts read off the DTD and the stylesheet, one per line. */
  highlights: string[];
  /** The formats and tools the exercise actually uses. */
  techniques: string[];
  screenshot: StaticImageData;
  /** Describes the screen and nothing more. */
  screenshotAlt: string;
  /** Deep link to the exercise's folder in the public repository. */
  repoUrl: string;
}

/**
 * The module the exercises belong to. Its repository is linked once at the head
 * of the section; each exercise links to its own folder inside it.
 */
export interface AcademicModule {
  name: string;
  programme: string;
  repoUrl: string;
}
