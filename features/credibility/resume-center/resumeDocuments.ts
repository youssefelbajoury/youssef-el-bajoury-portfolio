/**
 * The documents, and the single place any of them is named.
 *
 * The file paths and the visible action labels are written once here rather than
 * at each call site: an action that points at one path and a download that points
 * at another is the class of bug nobody notices until a recruiter downloads the
 * wrong language, and it is only possible if the string exists twice.
 *
 * `downloadName` is the filename the browser saves under. It is deliberately the
 * same as the served file — the reader ends up with a document named after the
 * person it describes rather than `resume(3).pdf`.
 *
 * BOTH CARDS POINT AT THE 2026 EDITIONS. Older PDFs remain served at
 * /resume/Youssef-El-Bajoury-EN.pdf and /resume/Youssef-El-Bajoury-FR.pdf, so
 * links already in circulation keep working; the cards offer the newer files.
 */

export interface ResumeDocument {
  /** Stable key, and the value the mono meta line prints. */
  code: "EN" | "FR";
  /** The card's heading. */
  language: string;
  /** One line under the heading. Never a claim about the contents. */
  description: string;
  /** Exact label on the primary action. */
  actionLabel: string;
  /** Served from /public, so both actions are same-origin and `download` works. */
  file: string;
  downloadName: string;
}

export const RESUME_DOCUMENTS: readonly ResumeDocument[] = [
  {
    code: "EN",
    language: "English Resume",
    description: "The complete engineering résumé, written in English.",
    actionLabel: "View Resume (English version)",
    file: "/resume/Youssef-El-Bajoury-CV-EN-2026.pdf",
    downloadName: "Youssef-El-Bajoury-CV-EN-2026.pdf",
  },
  {
    code: "FR",
    language: "French Resume",
    description: "The same résumé, written in French.",
    actionLabel: "View Resume (French version)",
    file: "/resume/Youssef-El-Bajoury-CV-FR-2026.pdf",
    downloadName: "Youssef-El-Bajoury-CV-FR-2026.pdf",
  },
] as const;
