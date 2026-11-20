import type {
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  OpportunityEntry,
} from "@/types/experience";

/**
 * Professional experience.
 *
 * Deliberately short. A current employer's project details are confidential, so
 * the entry states the role, the discipline, and the engagement — and nothing
 * about outcomes that cannot be published. The component renders highlights and
 * technologies only when they exist.
 */
export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "iziry",
    role: "Full Stack Developer / AI Engineering Intern",
    company: "IZIRY",
    location: "Casablanca, Morocco",
    period: "Sep 2026 – Present",
    type: "Pre-employment internship",
    summary:
      "Working across full stack development and AI engineering in a pre-employment internship. Project specifics remain confidential.",
    highlights: [],
    technologies: [],
  },
  {
    id: "cfit",
    role: "Full Stack Developer Intern",
    company: "CFIT",
    location: "Casablanca, Morocco",
    period: "2025",
    type: "Internship",
    summary:
      "A full stack development internship focused on building and shipping web application features.",
    highlights: [],
    technologies: [],
  },
];

/**
 * Education, newest first.
 *
 * The programme names are used as given. Where a programme's own title names
 * its areas of study, they are listed; nothing is inferred from an acronym.
 */
export const EDUCATION: EducationEntry[] = [
  {
    id: "master-bdcc",
    programme: "Master II — Big Data & Cloud Computing (BDCC)",
    institution: "ENSET Mohammedia",
    location: "Mohammedia, Morocco",
    period: "2026 – Present",
    focus: ["Big Data", "Cloud Computing"],
  },
  {
    id: "licence-daisi",
    programme: "Licence DAISI",
    institution: "Faculté des Sciences Aïn Chock",
    location: "Casablanca, Morocco",
    period: "2025 – 2026",
  },
  {
    id: "ofppt",
    programme: "Technicien Spécialisé",
    institution: "OFPPT — ISFO",
    location: "Morocco",
    period: "2023 – 2025",
  },
  {
    id: "bac",
    programme: "Baccalauréat — Sciences Physiques",
    institution: "Morocco",
    period: "2022 – 2023",
  },
];

/** Stated levels only. No self-assigned percentages. */
export const LANGUAGES: LanguageEntry[] = [
  { language: "Arabic", level: "Native" },
  { language: "French", level: "B2" },
  { language: "English", level: "B2" },
];

/** The two engagement types the profile is open to. */
export const OPPORTUNITIES: OpportunityEntry[] = [
  {
    id: "cdi",
    label: "CDI / Full-time",
    detail: "Available for a permanent full-time software engineering role.",
  },
  {
    id: "internship",
    label: "Pre-employment internship",
    detail: "Open to a pre-employment internship that leads into a full-time position.",
  },
];
