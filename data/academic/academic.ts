import bibliothequeShot from "@/public/academic/xml-xslt/bibliotheque.png";
import meteoGraphShot from "@/public/academic/xml-xslt/meteo-graph.png";
import rcbDashboardShot from "@/public/academic/xml-xslt/rcb-dashboard.png";
import telecomDashboardShot from "@/public/academic/xml-xslt/telecom-dashboard.png";
import type { AcademicModule, AcademicProject } from "@/types/academic";

/*
  ─────────────────────────────────────────────────────────────────────────────
  ACADEMIC WORK — the XML / DTD / XSLT exercises
  ─────────────────────────────────────────────────────────────────────────────
  Everything below is read off the exercises themselves: the element hierarchy
  from each DTD, the interaction from each stylesheet, and the screenshots from
  the rendered XSLT output committed beside them. Nothing is inferred from a
  screenshot alone, and no exercise is described as graded, marked, or complete.

  These are coursework, not products. They are here because the same discipline
  the projects above demonstrate at scale — a declared structure, a validating
  schema, a transform — is visible in them in a form a reader can open in four
  files.
  ─────────────────────────────────────────────────────────────────────────────
*/

const REPOSITORY = "https://github.com/youssefelbajoury/TP-DTD-XML-XSL";

export const ACADEMIC_MODULE: AcademicModule = {
  name: "Data, XML et Web Services",
  programme: "Cycle d'Ingénieur — II-BDCC",
  repoUrl: REPOSITORY,
};

export const ACADEMIC_PROJECTS: readonly AcademicProject[] = [
  {
    id: "bibliotheque",
    code: "S2 · Bibliothèque",
    title: "Library Loan Register",
    summary:
      "Student and book-loan records held in XML, constrained by a DTD, and transformed by XSLT into a single responsive loan table.",
    highlights: [
      "The DTD fixes the hierarchy at biblio → etudiant+ → livre+, with required attributes on both nodes and a loan status enumerated as oui | non.",
      "XPath parent traversal (../@) flattens the nested records into one table row per loan.",
      "xsl:choose renders the return status as a conditional badge — returned or not returned.",
    ],
    techniques: ["XML", "DTD", "XSLT 1.0", "XPath", "CSS3"],
    screenshot: bibliothequeShot,
    screenshotAlt:
      "Rendered XSLT output for the Bibliothèque exercise — the loan register table with student and book rows.",
    repoUrl: `${REPOSITORY}/tree/master/S2_Bibliotheque`,
  },
  {
    id: "meteo",
    code: "S2 · Météo",
    title: "MétéoLive Dashboard",
    summary:
      "Weather measurements stored in XML and transformed in the browser into a filterable, sortable dashboard with a chart.",
    highlights: [
      "City search matches accented and unaccented spellings; city and date filters narrow the same dataset together.",
      "A Chart.js bar chart redraws from the filtered records, and cold, mild, and hot readings are styled conditionally.",
      "A second stylesheet emits SVG, kept separate from the HTML dashboard transform.",
    ],
    techniques: ["XML", "DTD", "XSLT 1.0", "XPath", "Chart.js", "Vanilla JS", "CSS3"],
    screenshot: meteoGraphShot,
    screenshotAlt:
      "Rendered MétéoLive dashboard — the graphical view of the weather measurements with its city and date filters.",
    repoUrl: `${REPOSITORY}/tree/master/S2_Meteo`,
  },
  {
    id: "rcb",
    code: "S2 · RCB",
    title: "Bank Statement Dashboard",
    summary:
      "A bank statement in XML, validated by a DTD, and transformed into an interactive statement view that totals its own records.",
    highlights: [
      "Credits and debits are totalled automatically, with percentage shares and a distribution bar computed from the statement.",
      "Instant search, credit/debit filtering, and ascending or descending sort across every column.",
      "Dark and light themes, a responsive layout, and formatted amounts and dates.",
    ],
    techniques: ["XML", "DTD", "XSLT 1.0", "Vanilla JS", "CSS3"],
    screenshot: rcbDashboardShot,
    screenshotAlt:
      "Rendered RCB dashboard — the bank statement table with its totals, search field, and credit/debit filters.",
    repoUrl: `${REPOSITORY}/tree/master/S2_RCB`,
  },
  {
    id: "telecom",
    code: "S2 · Télécom",
    title: "Telecom Billing Register",
    summary:
      "An operator's clients, subscriptions, and invoices modelled as a four-level XML hierarchy and rendered as a management dashboard.",
    highlights: [
      "The DTD constrains operateur → client+ → abonnement+ → facture+, with subscription type enumerated as GSM | FIXE and payment status as oui | non.",
      "XSLT turns the hierarchy into one client / subscription / invoice view with status badges.",
      "The presentation layer is driven by CSS variables, with status badges and hover animations.",
    ],
    techniques: ["XML", "DTD", "XSLT 1.0", "XPath", "CSS3"],
    screenshot: telecomDashboardShot,
    screenshotAlt:
      "Rendered Télécom dashboard — clients, their subscriptions, and invoice records in a single management table.",
    repoUrl: `${REPOSITORY}/tree/master/S2_Telecom`,
  },
];
