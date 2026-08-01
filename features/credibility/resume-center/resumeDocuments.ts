/**
 * The two documents, and the single place either of them is named.
 *
 * The file paths are written once here rather than at each call site: an "Open"
 * that points at one path and a "Download" that points at another is the class
 * of bug nobody notices until a recruiter downloads the wrong language, and it
 * is only possible if the string exists twice.
 *
 * `downloadName` is the filename the browser saves under. It is deliberately the
 * same as the served file — the reader ends up with a document named after the
 * person it describes rather than `resume(3).pdf`.
 */

export interface ResumeDocument {
  /** Stable key, and the value the mono meta line prints. */
  code: "EN" | "FR";
  /** The card's heading. */
  language: string;
  /** One line under the heading. Never a claim about the contents. */
  description: string;
  /** Served from /public, so both actions are same-origin and `download` works. */
  file: string;
  downloadName: string;
}

export const RESUME_DOCUMENTS: readonly ResumeDocument[] = [
  {
    code: "EN",
    language: "English Resume",
    description: "The complete engineering résumé, written in English.",
    file: "/resume/Youssef-El-Bajoury-EN.pdf",
    downloadName: "Youssef-El-Bajoury-EN.pdf",
  },
  {
    code: "FR",
    language: "French Resume",
    description: "The same résumé, written in French.",
    file: "/resume/Youssef-El-Bajoury-FR.pdf",
    downloadName: "Youssef-El-Bajoury-FR.pdf",
  },
] as const;
