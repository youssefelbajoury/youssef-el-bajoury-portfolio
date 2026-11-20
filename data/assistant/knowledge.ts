import { PROFILE, SOCIAL_LINKS } from "@/constants/profile";
import { ACADEMIC_MODULE, ACADEMIC_PROJECTS } from "@/data/academic/academic";
import { EDUCATION, EXPERIENCE, LANGUAGES, OPPORTUNITIES } from "@/data/experience/experience";
import {
  AUTOFLOW,
  MOROCCO_RETAIL,
  ROLEX_EXPERIENCE,
  SMART_HEALTH_ROOM,
} from "@/data/projects/projects";
import { SKILLS } from "@/data/skills/skills";
import { RESUME_DOCUMENTS } from "@/features/credibility/resume-center/resumeDocuments";
import type { KnowledgeCitation, KnowledgeEntry } from "@/types/assistant";
import type { SkillCategory } from "@/types/skill";

/*
  ─────────────────────────────────────────────────────────────────────────────
  THE ASSISTANT'S ONLY SOURCE OF ANSWERS
  ─────────────────────────────────────────────────────────────────────────────
  This module is the allowlist. If an answer is not composed here, the assistant
  does not give it: retrieval has exactly one branch that produces prose (this
  file) and one branch that refuses.

  EVERY FACT IS READ FROM THE PAGE'S OWN RECORDS. No metric, date, technology or
  company name is typed into an answer string. They are interpolated from
  data/projects, data/skills, data/experience, data/academic, constants/profile
  and the public resume entries, which is why the assistant cannot drift from
  what the page renders. scripts/validate-assistant-kb.mjs fails if a digit
  survives outside an interpolation in an answer, and if any import escapes the
  allowlist.

  WHAT IS DELIBERATELY ABSENT:
  · The private one-page letter, which is not published or linked.
  · Anything from IZIRY beyond the CV's public role and dates.
  · Any client name, internal dataset, internal tooling name, or metric that is
    not already published on the page.
  · Any environment variable, filesystem access, network call, or HTML string.
    The validator enforces the first three mechanically; the last is enforced by
    the renderer, which only ever writes text nodes.
  ─────────────────────────────────────────────────────────────────────────────
*/

function resumeByCode(code: "EN" | "FR") {
  const document = RESUME_DOCUMENTS.find((entry) => entry.code === code);

  if (!document) {
    throw new Error(`Missing public resume document: ${code}`);
  }

  return document;
}

const ENGLISH_RESUME = resumeByCode("EN");
const FRENCH_RESUME = resumeByCode("FR");

function formatList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";

  const head = items.slice(0, -1).join(", ");
  const tail = items[items.length - 1] ?? "";

  return `${head} and ${tail}`;
}

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function metricSummary(metrics: readonly { value: string; label: string }[]): string {
  return metrics.map((metric) => `${metric.value} ${lowerFirst(metric.label)}`).join(", ");
}

function architectureSummary(layers: readonly { name: string; detail: string }[]): string {
  return layers.map((layer) => `${layer.name}: ${layer.detail}`).join(" ");
}

function findExperience(id: string) {
  const entry = EXPERIENCE.find((candidate) => candidate.id === id);

  if (!entry) {
    throw new Error(`Missing experience entry: ${id}`);
  }

  return entry;
}

function findEducation(id: string) {
  const entry = EDUCATION.find((candidate) => candidate.id === id);

  if (!entry) {
    throw new Error(`Missing education entry: ${id}`);
  }

  return entry;
}

const SKILL_CATEGORIES: SkillCategory[] = Array.from(
  new Set(SKILLS.map((skill) => skill.category))
);

function skillsFor(category: SkillCategory): string {
  return formatList(
    SKILLS.filter((skill) => skill.category === category).map((skill) => skill.name)
  );
}

/*
  These summaries live outside the answer strings on purpose.

  A template literal inside another template literal makes the answers hard to
  read and makes the validator's digit check ambiguous. Each of these composes
  the same records the page renders, and the answer interpolates the finished
  sentence.
*/
function educationSummary(): string {
  return EDUCATION.map(
    (entry) => `${entry.programme} at ${entry.institution} (${entry.period})`
  ).join("; ");
}

function academicProjectSummary(): string {
  return formatList(ACADEMIC_PROJECTS.map((project) => project.title));
}

function languageSummary(): string {
  return LANGUAGES.map((entry) => `${entry.language} (${entry.level})`).join(", ");
}

function opportunitySummary(): string {
  return OPPORTUNITIES.map((entry) => `${entry.label} — ${entry.detail}`).join(" ");
}

const IZIRY = findExperience("iziry");
const MASTER_BDCC = findEducation("master-bdcc");

/*
  Citation hrefs.

  Anchors, project routes and public documents are literals so the validator can
  resolve every one of them against a known set. Contact links come from
  constants/profile.ts, the page's single source for those addresses, so the
  assistant cannot quote an address the contact section does not show.
*/
const CITATIONS = {
  projects: { label: "Projects", href: "#projects", kind: "section" },
  experience: { label: "Experience", href: "#experience", kind: "section" },
  academic: { label: "Academic work", href: "#academic", kind: "section" },
  skills: { label: "Skills", href: "#skills", kind: "section" },
  location: { label: "Location", href: "#location", kind: "section" },
  contact: { label: "Contact", href: "#contact", kind: "section" },
  autoflow: { label: "AutoFlow", href: "/projects/autoflow", kind: "project" },
  moroccoRetail: {
    label: "Morocco Retail",
    href: "/projects/morocco-retail-intelligence",
    kind: "project",
  },
  smartHealthRoom: {
    label: "Smart Health Room",
    href: "/projects/smart-health-room",
    kind: "project",
  },
  rolex: { label: "Rolex Experience", href: "/projects/rolex-experience", kind: "project" },
  resumeEn: { label: "English resume", href: ENGLISH_RESUME.file, kind: "document" },
  resumeFr: { label: "French resume", href: FRENCH_RESUME.file, kind: "document" },
  github: { label: "GitHub", href: SOCIAL_LINKS.github, kind: "external" },
  linkedin: { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, kind: "external" },
  email: { label: "Email", href: SOCIAL_LINKS.email, kind: "external" },
  whatsapp: { label: "WhatsApp", href: SOCIAL_LINKS.whatsapp, kind: "external" },
  maps: { label: "Casablanca on Maps", href: SOCIAL_LINKS.maps, kind: "external" },
  academicRepo: {
    label: "XML / XSLT repository",
    href: ACADEMIC_MODULE.repoUrl,
    kind: "external",
  },
} as const satisfies Record<string, KnowledgeCitation>;

const MOROCCO_REPO_CITATION: KnowledgeCitation | null = MOROCCO_RETAIL.repoUrl
  ? { label: "Repository", href: MOROCCO_RETAIL.repoUrl, kind: "external" }
  : null;

export const KNOWLEDGE_ENTRIES: readonly KnowledgeEntry[] = [
  {
    id: "resume",
    question: "Can I see your resume?",
    triggers: [
      "resume",
      "cv",
      "curriculum vitae",
      "show me your resume",
      "download your resume",
      "english resume",
      "french resume",
    ],
    answer: [
      `Two editions are published: ${ENGLISH_RESUME.language} and ${FRENCH_RESUME.language}. Both describe the same record; the French one is the newer edition.`,
      `The Resume control in the Contact section opens both. The citations below link each PDF directly.`,
    ],
    citations: [CITATIONS.resumeEn, CITATIONS.resumeFr, CITATIONS.contact],
    sources: [
      "features/credibility/resume-center/resumeDocuments.ts — EN and FR entries only",
      "public/resume/",
    ],
  },
  {
    id: "technologies",
    question: "What technologies do you work with?",
    triggers: [
      "technologies",
      "technology",
      "tech stack",
      "stack",
      "tools",
      "skills",
      "react",
      "typescript",
      "python",
      "node",
    ],
    answer: [
      `The page groups the stack into ${SKILL_CATEGORIES.length} areas: ${formatList(SKILL_CATEGORIES)}.`,
      `Interface: ${skillsFor("Frontend")}.`,
      `Services and storage: ${skillsFor("Backend")}; ${skillsFor("Databases")}.`,
      `Data and machine learning: ${skillsFor("Big Data")}; ${skillsFor("AI & Machine Learning")}.`,
      `Connected systems and delivery: ${skillsFor("IoT & Embedded")}; ${skillsFor("Mobile")}; ${skillsFor("Cloud & DevOps")}; ${skillsFor("Tools & Practices")}.`,
    ],
    citations: [CITATIONS.skills],
    sources: ["data/skills/skills.ts"],
  },
  {
    id: "autoflow",
    question: "Tell me about AutoFlow.",
    triggers: ["autoflow", "auto flow", "the full stack platform", "typescript monorepo"],
    answer: [
      `${AUTOFLOW.title} is a ${AUTOFLOW.discipline} from ${AUTOFLOW.year}: ${AUTOFLOW.description}`,
      `Measured from the repository: ${metricSummary(AUTOFLOW.metrics)}.`,
      `How it is put together — ${architectureSummary(AUTOFLOW.caseStudy.architecture)}`,
      ...(AUTOFLOW.metricNote ? [AUTOFLOW.metricNote] : []),
    ],
    citations: [CITATIONS.autoflow, CITATIONS.projects],
    sources: [
      "data/projects/projects.ts — AUTOFLOW",
      "data/projects/case-studies.ts — AUTOFLOW_CASE_STUDY",
    ],
  },
  {
    id: "morocco-retail",
    question: "Explain the Morocco Retail project.",
    triggers: [
      "morocco retail",
      "mridp",
      "retail intelligence",
      "morocco retail intelligence",
      "explain the morocco retail project",
    ],
    answer: [
      `${MOROCCO_RETAIL.title} is a ${MOROCCO_RETAIL.discipline} from ${MOROCCO_RETAIL.year}: ${MOROCCO_RETAIL.description}`,
      `Context: ${MOROCCO_RETAIL.context}. Measured on the development machine: ${metricSummary(MOROCCO_RETAIL.metrics)}.`,
      `Pipeline — ${architectureSummary(MOROCCO_RETAIL.caseStudy.architecture)}`,
      `${MOROCCO_RETAIL.metricNote}`,
    ],
    citations: [
      CITATIONS.moroccoRetail,
      CITATIONS.projects,
      ...(MOROCCO_REPO_CITATION ? [MOROCCO_REPO_CITATION] : []),
    ],
    sources: [
      "data/projects/projects.ts — MOROCCO_RETAIL",
      "data/projects/case-studies.ts — MOROCCO_RETAIL_CASE_STUDY",
    ],
  },
  {
    id: "iziry",
    question: "What do you do at IZIRY?",
    triggers: [
      "iziry",
      "what did you build at iziry",
      "current role",
      "current job",
      "experience",
      "work experience",
    ],
    answer: [
      `I am currently a ${IZIRY.role} at ${IZIRY.company} in ${IZIRY.location}. The engagement is a ${IZIRY.type.toLowerCase()}, running ${IZIRY.period}.`,
      `The public record is the role and the discipline. Project specifics are confidential, so the site does not describe the internal work, the client, or any dataset.`,
      `The Experience section carries the same entry, and the resume states the same dates.`,
    ],
    citations: [CITATIONS.experience, CITATIONS.resumeEn],
    sources: ["data/experience/experience.ts — IZIRY entry", "resumeDocuments.ts — EN entry"],
  },
  {
    id: "academic",
    question: "Tell me about your academic background.",
    triggers: [
      "academic",
      "academic background",
      "education",
      "studies",
      "university",
      "school",
      "degree",
    ],
    answer: [
      `The academic record, newest first: ${educationSummary()}.`,
      `The ${ACADEMIC_MODULE.name} module (${ACADEMIC_MODULE.programme}) is published as ${ACADEMIC_PROJECTS.length} exercises: ${academicProjectSummary()}. Each is an XML document constrained by a DTD and transformed with XSLT.`,
      `Languages on the record: ${languageSummary()}.`,
    ],
    citations: [CITATIONS.academic, CITATIONS.experience, CITATIONS.academicRepo],
    sources: ["data/experience/experience.ts — EDUCATION, LANGUAGES", "data/academic/academic.ts"],
  },
  {
    id: "contact",
    question: "How can I contact you?",
    triggers: ["contact", "email", "whatsapp", "phone", "get in touch", "reach you", "contact you"],
    answer: [
      `Email ${PROFILE.contactEmail}, WhatsApp ${PROFILE.phone}, based in ${PROFILE.location}.`,
      `There is also a recruiter form in the Contact section. It validates the message and, until a delivery provider is configured, hands it to your own email or WhatsApp client rather than claiming it was delivered.`,
      `GitHub and LinkedIn are linked from the same section and from the footer.`,
    ],
    citations: [
      CITATIONS.contact,
      CITATIONS.email,
      CITATIONS.whatsapp,
      CITATIONS.linkedin,
      CITATIONS.github,
      CITATIONS.maps,
    ],
    sources: ["constants/profile.ts — PROFILE, SOCIAL_LINKS"],
  },
  {
    id: "current-work",
    question: "What are you working on now?",
    triggers: [
      "working on now",
      "current work",
      "what are you working on",
      "what are you developing now",
      "right now",
      "currently",
      "now",
    ],
    answer: [
      `Right now: ${IZIRY.role} at ${IZIRY.company} (${IZIRY.period}); ${MASTER_BDCC.programme} at ${MASTER_BDCC.institution} (${MASTER_BDCC.period}); and ${AUTOFLOW.title}, a ${AUTOFLOW.discipline} from ${AUTOFLOW.year}.`,
      `${AUTOFLOW.title} — ${AUTOFLOW.description}`,
      `The current employer's project specifics are confidential; the public record is the role and the discipline.`,
    ],
    citations: [CITATIONS.experience, CITATIONS.academic, CITATIONS.autoflow, CITATIONS.resumeEn],
    sources: [
      "data/experience/experience.ts — IZIRY, master-bdcc",
      "data/projects/projects.ts — AUTOFLOW",
    ],
  },
  {
    id: "smart-health-room",
    question: "Tell me about the Smart Health Room.",
    triggers: [
      "smart health room",
      "health room",
      "connected room",
      "iot project",
      "connected healthcare",
    ],
    answer: [
      `${SMART_HEALTH_ROOM.title} is a ${SMART_HEALTH_ROOM.discipline} (${SMART_HEALTH_ROOM.year}, ${SMART_HEALTH_ROOM.context}): ${SMART_HEALTH_ROOM.description}`,
      `How it is put together — ${architectureSummary(SMART_HEALTH_ROOM.caseStudy.architecture)}`,
      `What it does — ${SMART_HEALTH_ROOM.caseStudy.results.join(" ")}`,
    ],
    citations: [CITATIONS.smartHealthRoom, CITATIONS.projects],
    sources: [
      "data/projects/projects.ts — SMART_HEALTH_ROOM",
      "data/projects/case-studies.ts — SMART_HEALTH_ROOM_CASE_STUDY",
    ],
  },
  {
    id: "rolex",
    question: "Tell me about the Rolex Experience.",
    triggers: ["rolex", "rolex experience", "luxury", "watch", "catalogue journey"],
    answer: [
      `${ROLEX_EXPERIENCE.title} is a ${ROLEX_EXPERIENCE.discipline} from ${ROLEX_EXPERIENCE.year}, built as an ${ROLEX_EXPERIENCE.context}: ${ROLEX_EXPERIENCE.description}`,
      `The journey covers ${formatList(ROLEX_EXPERIENCE.features.map((feature) => feature.label))}.`,
      `The build is about ${formatList(ROLEX_EXPERIENCE.technologies)}. It is a front-end study: no backend, no live deployment, and no metrics claimed.`,
    ],
    citations: [CITATIONS.rolex, CITATIONS.projects],
    sources: ["data/projects/projects.ts — ROLEX_EXPERIENCE"],
  },
  {
    id: "location-availability",
    question: "Where are you based, and are you available?",
    triggers: [
      "where are you based",
      "location",
      "available",
      "availability",
      "relocate",
      "remote",
      "languages",
      "where do you live",
    ],
    answer: [
      `Based in ${PROFILE.location}. ${PROFILE.availability.label}. ${PROFILE.availability.supportingText}.`,
      `The two engagement types on the record: ${opportunitySummary()}`,
      `Languages: ${languageSummary()}.`,
    ],
    citations: [CITATIONS.location, CITATIONS.contact, CITATIONS.maps],
    sources: [
      "constants/profile.ts — PROFILE",
      "data/experience/experience.ts — OPPORTUNITIES, LANGUAGES",
    ],
  },
  {
    id: "stack-by-layer",
    question: "What do you use for each layer?",
    triggers: [
      "stack by layer",
      "frontend stack",
      "backend stack",
      "data stack",
      "iot stack",
      "what do you use for data",
      "what do you use for frontend",
      "what do you use for iot",
      "which technologies for",
    ],
    answer: [
      `Frontend: ${skillsFor("Frontend")}.`,
      `Backend: ${skillsFor("Backend")}. Databases: ${skillsFor("Databases")}.`,
      `Data: ${skillsFor("Big Data")}. AI and machine learning: ${skillsFor("AI & Machine Learning")}.`,
      `Mobile: ${skillsFor("Mobile")}. IoT and embedded: ${skillsFor("IoT & Embedded")}.`,
      `Cloud and DevOps: ${skillsFor("Cloud & DevOps")}. Practices: ${skillsFor("Tools & Practices")}.`,
    ],
    citations: [
      CITATIONS.skills,
      CITATIONS.autoflow,
      CITATIONS.moroccoRetail,
      CITATIONS.smartHealthRoom,
    ],
    sources: ["data/skills/skills.ts — grouped by SkillCategory"],
  },
];
