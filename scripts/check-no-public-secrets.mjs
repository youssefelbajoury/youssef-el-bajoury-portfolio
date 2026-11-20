#!/usr/bin/env node

/*
  ─────────────────────────────────────────────────────────────────────────────
  NO SECRET IS PUBLIC
  ─────────────────────────────────────────────────────────────────────────────
  The one rule that cannot be enforced by types: a credential must never carry
  the `NEXT_PUBLIC_` prefix. That prefix inlines the value into the client
  bundle at build time, which turns an environment variable into a published
  string.

  This script checks the source tree and, when a build exists, the client
  bundles. It looks for the *names* of forbidden public variables, not for
  values, because a value cannot be recognised without already knowing it.

  Exit 0 = clean. Exit 1 = at least one finding, printed with file and line.
*/

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** Directories that are source, plus the config files that could set a var. */
const SOURCE_DIRS = [
  "app",
  "components",
  "constants",
  "data",
  "features",
  "lib",
  "scripts",
  "styles",
  "types",
];

const SOURCE_FILES = [
  "next.config.mjs",
  "next.config.ts",
  "next.config.js",
  "middleware.ts",
  "middleware.js",
  "tailwind.config.ts",
  "eslint.config.mjs",
  "package.json",
];

/** Built client output, when present. */
const BUNDLE_DIR = ".next/static";

const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "out"]);

/**
 * `NEXT_PUBLIC_` followed by anything credential-shaped. The site URL and
 * NODE_ENV are the only public variables this project allows.
 */
const FORBIDDEN =
  /NEXT_PUBLIC_(?:[A-Z0-9_]*(?:AI|CONTACT|RESEND|SMTP|MAIL|EMAIL|KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]*)/g;

const ALLOWED = new Set(["NEXT_PUBLIC_SITE_URL"]);

async function* walk(dir) {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
      continue;
    }

    if (!/\.(?:ts|tsx|js|jsx|mjs|cjs|json|md|css|html)$/.test(entry.name)) continue;

    yield full;
  }
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

async function scanFile(path) {
  const text = await readFile(path, "utf8");
  const findings = [];

  for (const match of text.matchAll(FORBIDDEN)) {
    if (ALLOWED.has(match[0])) continue;
    findings.push({ path, line: lineOf(text, match.index ?? 0), name: match[0] });
  }

  return findings;
}

async function main() {
  const targets = [];

  for (const dir of SOURCE_DIRS) {
    const full = join(ROOT, dir);
    if ((await stat(full).catch(() => null))?.isDirectory()) {
      for await (const file of walk(full)) targets.push(file);
    }
  }

  for (const file of SOURCE_FILES) {
    const full = join(ROOT, file);
    if ((await stat(full).catch(() => null))?.isFile()) targets.push(full);
  }

  /* The root README is checked too: a document that suggests a public key is a
     leak waiting for someone to follow it. The phase reports under `docs/` are
     deliberately excluded — they quote the forbidden names while defining the
     rule, which is not the same as using them. */
  const readme = join(ROOT, "README.md");
  if ((await stat(readme).catch(() => null))?.isFile()) targets.push(readme);

  const bundleDir = join(ROOT, BUNDLE_DIR);
  if ((await stat(bundleDir).catch(() => null))?.isDirectory()) {
    for await (const file of walk(bundleDir)) targets.push(file);
  }

  const findings = [];

  for (const target of targets) {
    findings.push(...(await scanFile(target)));
  }

  if (findings.length > 0) {
    console.error("check:secrets failed — a public credential prefix was found:\n");

    for (const finding of findings) {
      console.error(`  ${relative(ROOT, finding.path)}:${finding.line}  ${finding.name}`);
    }

    console.error(
      "\nA credential must never be public. Remove the NEXT_PUBLIC_ prefix and read it from lib/env.server.ts."
    );

    process.exit(1);
  }

  console.log(
    `check:secrets passed — ${targets.length} files checked, no public credential prefixes.`
  );
}

main().catch((error) => {
  console.error("check:secrets could not complete:", error);
  process.exit(1);
});
