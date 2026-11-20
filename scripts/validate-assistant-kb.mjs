/**
 * validate-assistant-kb.mjs
 *
 * Fails the build script if the assistant's knowledge base can escape its
 * allowlist. This is a static check on purpose: importing the TypeScript module
 * would drag the page's PNG imports and the `@/` alias resolver into a plain
 * Node process, and the whole point is to inspect the source as text.
 *
 * Checked:
 *   1. No environment access, filesystem access, HTML injection, or eval.
 *   2. No reference to the private one-page letter.
 *   3. Imports only from data/, constants/, types/, the public resume registry,
 *      or relative siblings.
 *   4. Exactly the twelve approved entries, each with at least one citation and
 *      a source line.
 *   5. Every literal citation href resolves to a known anchor, project route,
 *      public document, mailto, or allowlisted external host.
 *   6. Every entry references a citation key that exists.
 *   7. No digit survives outside a `${...}` interpolation in an answer. Every
 *      number in an answer therefore comes from a data file, not from prose.
 *
 * Run: npm run validate:kb
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const KB_DIR = join(ROOT, "data", "assistant");
const KB_FILE = join(KB_DIR, "knowledge.ts");
const PROFILE_FILE = join(ROOT, "constants", "profile.ts");
const RESUME_FILE = join(ROOT, "features", "credibility", "resume-center", "resumeDocuments.ts");

const errors = [];

function fail(message) {
  errors.push(message);
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/* -------------------------------------------------------------------------- */
/* 1. Forbidden constructs                                                     */
/* -------------------------------------------------------------------------- */

const FORBIDDEN = [
  { pattern: /\bprocess\s*\./, label: "process.*" },
  { pattern: /\brequire\s*\(/, label: "require()" },
  { pattern: /from\s+["'](node:)?fs["']/, label: "fs import" },
  { pattern: /\breadFile(Sync)?\b/, label: "readFile" },
  { pattern: /NEXT_PUBLIC_/, label: "NEXT_PUBLIC_" },
  { pattern: /\bAPI_KEY\b/, label: "API_KEY" },
  { pattern: /\.env\b/, label: ".env" },
  { pattern: /Lettre|motivation/i, label: "motivation letter reference" },
  { pattern: /\bcode:\s*["']LM["']/, label: "LM resume entry" },
  { pattern: /dangerouslySetInnerHTML/, label: "dangerouslySetInnerHTML" },
  { pattern: /\beval\s*\(/, label: "eval()" },
];

const kbFiles = walk(KB_DIR).filter((path) => path.endsWith(".ts"));

if (kbFiles.length === 0) {
  fail("data/assistant contains no TypeScript files.");
}

for (const file of kbFiles) {
  const source = readFileSync(file, "utf8");
  const name = relative(ROOT, file);

  for (const { pattern, label } of FORBIDDEN) {
    if (pattern.test(source)) {
      fail(`${name}: contains forbidden construct "${label}".`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Import allowlist                                                         */
/* -------------------------------------------------------------------------- */

const ALLOWED_IMPORT_PREFIXES = ["@/data/", "@/constants/", "@/types/"];
const ALLOWED_IMPORT_EXACT = new Set(["@/features/credibility/resume-center/resumeDocuments"]);

for (const file of kbFiles) {
  const source = readFileSync(file, "utf8");
  const name = relative(ROOT, file);

  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    const specifier = match[1];

    if (specifier.startsWith("./")) continue;

    const allowed =
      ALLOWED_IMPORT_PREFIXES.some((prefix) => specifier.startsWith(prefix)) ||
      ALLOWED_IMPORT_EXACT.has(specifier);

    if (!allowed) {
      fail(`${name}: import "${specifier}" is outside the allowlist.`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Knowledge base structure                                                 */
/* -------------------------------------------------------------------------- */

const source = readFileSync(KB_FILE, "utf8");

const REQUIRED_IDS = [
  "resume",
  "technologies",
  "autoflow",
  "morocco-retail",
  "iziry",
  "academic",
  "contact",
  "current-work",
  "smart-health-room",
  "rolex",
  "location-availability",
  "stack-by-layer",
];

const entryStarts = [...source.matchAll(/^ {2}\{\n {4}id: "([^"]+)",$/gm)];

if (entryStarts.length !== REQUIRED_IDS.length) {
  fail(`Expected ${REQUIRED_IDS.length} knowledge entries, found ${entryStarts.length}.`);
}

const foundIds = entryStarts.map((match) => match[1]);

for (const id of REQUIRED_IDS) {
  if (!foundIds.includes(id)) {
    fail(`Missing knowledge entry: "${id}".`);
  }
}

for (const id of foundIds) {
  if (!REQUIRED_IDS.includes(id)) {
    fail(`Unexpected knowledge entry: "${id}".`);
  }
}

/* -------------------------------------------------------------------------- */
/* 4. Citation keys and literal hrefs                                          */
/* -------------------------------------------------------------------------- */

const citationStart = source.indexOf("const CITATIONS = {");
const citationEnd = source.indexOf("} as const satisfies", citationStart);

if (citationStart === -1 || citationEnd === -1) {
  fail("Could not locate the CITATIONS map in knowledge.ts.");
}

const citationSource =
  citationStart === -1 || citationEnd === -1 ? "" : source.slice(citationStart, citationEnd);

const citationKeys = new Set(
  [...citationSource.matchAll(/^ {2}(\w+):\s*\{/gm)].map((match) => match[1])
);

if (citationKeys.size === 0) {
  fail("The CITATIONS map defines no citations.");
}

for (const match of citationSource.matchAll(/kind:\s*"([^"]+)"/g)) {
  if (!["section", "project", "document", "external"].includes(match[1])) {
    fail(`Unknown citation kind: "${match[1]}".`);
  }
}

const ANCHORS = new Set([
  "#projects",
  "#experience",
  "#academic",
  "#skills",
  "#location",
  "#contact",
]);

const PROJECT_ROUTES = new Set([
  "/projects/autoflow",
  "/projects/morocco-retail-intelligence",
  "/projects/smart-health-room",
  "/projects/rolex-experience",
]);

const PUBLIC_DOCUMENTS = new Set([
  "/resume/Youssef-El-Bajoury-EN.pdf",
  "/resume/Youssef-El-Bajoury-CV-FR-2026.pdf",
]);

const EXTERNAL_HOSTS = new Set(["github.com", "www.linkedin.com", "wa.me", "maps.app.goo.gl"]);

for (const match of source.matchAll(/href:\s*"([^"]+)"/g)) {
  const href = match[1];

  if (href.startsWith("#")) {
    if (!ANCHORS.has(href)) fail(`Unknown anchor citation: "${href}".`);
    continue;
  }

  if (href.startsWith("/projects/")) {
    if (!PROJECT_ROUTES.has(href)) fail(`Unknown project citation: "${href}".`);
    continue;
  }

  if (href.startsWith("/resume/")) {
    if (!PUBLIC_DOCUMENTS.has(href)) fail(`Unknown document citation: "${href}".`);
    continue;
  }

  if (href.startsWith("mailto:")) {
    if (!href.includes("@")) fail(`Malformed mailto citation: "${href}".`);
    continue;
  }

  if (href.startsWith("https://")) {
    let host;
    try {
      host = new URL(href).host;
    } catch {
      fail(`Malformed external citation: "${href}".`);
      continue;
    }

    if (!EXTERNAL_HOSTS.has(host)) {
      fail(`External citation host is not allowlisted: "${host}".`);
    }
    continue;
  }

  fail(`Citation href is not a known form: "${href}".`);
}

/* -------------------------------------------------------------------------- */
/* 5. Per-entry structure, citation references, and hard-coded numbers         */
/* -------------------------------------------------------------------------- */

entryStarts.forEach((match, index) => {
  const start = match.index ?? 0;
  const end = entryStarts[index + 1]?.index ?? source.length;
  const block = source.slice(start, end);
  const id = match[1];

  for (const required of ["answer: [", "citations: [", "sources: ["]) {
    if (!block.includes(required)) {
      fail(`Entry "${id}" is missing "${required}".`);
    }
  }

  const references = [...block.matchAll(/CITATIONS\.(\w+)/g)].map((ref) => ref[1]);

  if (references.length === 0) {
    fail(`Entry "${id}" has no citation.`);
  }

  for (const key of references) {
    if (!citationKeys.has(key)) {
      fail(`Entry "${id}" references unknown citation key "${key}".`);
    }
  }

  const answerStart = block.indexOf("answer: [");
  const answerEnd = block.indexOf("],", answerStart);
  const answerSource =
    answerStart === -1 || answerEnd === -1 ? "" : block.slice(answerStart, answerEnd);

  if (answerSource.trim().length === 0) {
    fail(`Entry "${id}" has an empty answer.`);
  }

  for (const template of answerSource.matchAll(/`([^`]*)`/g)) {
    const prose = template[1].replace(/\$\{[^}]*\}/g, "");
    const digits = prose.match(/\d/g);

    if (digits) {
      fail(`Entry "${id}" hard-codes a digit outside an interpolation: "${template[1]}".`);
    }
  }
});

/* -------------------------------------------------------------------------- */
/* 6. The two imported registries must still be the public ones                */
/* -------------------------------------------------------------------------- */

if (!/from\s+["']@\/constants\/profile["']/.test(source)) {
  fail("knowledge.ts must read contact facts from constants/profile.ts.");
}

if (!source.includes("@/features/credibility/resume-center/resumeDocuments")) {
  fail(
    "knowledge.ts must read resume paths from the public resume registry rather than typing them."
  );
}

const resumeSource = readFileSync(RESUME_FILE, "utf8");
const profileSource = readFileSync(PROFILE_FILE, "utf8");

for (const code of ['code: "EN"', 'code: "FR"']) {
  if (!resumeSource.includes(code)) {
    fail(`resumeDocuments.ts no longer contains ${code}.`);
  }
}

if (resumeSource.includes('code: "LM"')) {
  fail("resumeDocuments.ts still publishes the private one-page letter; remove the LM entry.");
}

if (!profileSource.includes("contactEmail") || !profileSource.includes("whatsapp")) {
  fail("constants/profile.ts no longer exposes the contact facts the KB cites.");
}

/* -------------------------------------------------------------------------- */
/* Report                                                                      */
/* -------------------------------------------------------------------------- */

if (errors.length > 0) {
  console.error(`\nvalidate:kb failed with ${errors.length} issue(s):\n`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error("");
  process.exit(1);
}

console.log(
  `validate:kb passed — ${entryStarts.length} entries, ${citationKeys.size} citation keys, ${kbFiles.length} files checked.`
);
