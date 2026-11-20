/**
 * The record: work, study, languages, and the roles currently open.
 *
 * Every field is a fact supplied by the profile, not a derived score. There is
 * deliberately no proficiency field on a language and no "level" on a skill —
 * the site states what was done and where, and lets a reader judge the rest.
 */

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  /** Display period, e.g. "Sep 2026 – Present". */
  period: string;
  /** The engagement type: internship, pre-employment internship, CDI. */
  type: string;
  summary: string;
  /**
   * One evidenced outcome per entry. Empty is a valid state: a current role
   * whose specifics are confidential has nothing public to list yet.
   */
  highlights: string[];
  technologies: string[];
}

export interface EducationEntry {
  id: string;
  programme: string;
  institution: string;
  location?: string;
  period: string;
  /** Named areas of study, when the programme itself names them. */
  focus?: string[];
}

export interface LanguageEntry {
  language: string;
  /** The stated level — "Native", "B2" — never a percentage. */
  level: string;
}

export interface OpportunityEntry {
  id: string;
  label: string;
  detail: string;
}
