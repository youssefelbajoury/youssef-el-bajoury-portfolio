/**
 * Static validation for the supplied technology image set.
 *
 * Deliberately dependency-free and static-text based, like validate:kb: it does
 * not import the TypeScript manifest (which contains image imports), but reads
 * it as text and checks that the manifest, the Skills dataset, the source
 * folder and the public destination all agree.
 */

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "Technical stack icons");
const DEST_DIR = path.join(ROOT, "public", "images", "technology-stack");
const MANIFEST = path.join(ROOT, "data", "technology-assets.ts");
const SKILLS_DATA = path.join(ROOT, "data", "skills", "skills-data.ts");

const EXPECTED_TITLES = [
  "Frontend Development",
  "Backend Development",
  "Databases and Storage",
  "Mobile Development",
  "AI and Machine Learning",
  "Big Data and Data Engineering",
  "Cloud and DevOps",
  "API and Software Architecture",
  "Business Intelligence and Observability",
  "IoT and Embedded Systems",
  "Development Environments and Tools",
];

const EXPECTED_COUNTS = [8, 11, 10, 4, 16, 8, 10, 11, 7, 7, 16];
const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  try {
    return readFileSync(file, "utf8");
  } catch (error) {
    fail(`Cannot read ${path.relative(ROOT, file)}: ${error.message}`);
    return "";
  }
}

function parseManifest(text) {
  const imports = new Map();
  const importPattern = /import\s+(\w+)\s+from\s+"@\/public\/images\/technology-stack\/([^"]+)";/g;
  for (const match of text.matchAll(importPattern)) {
    imports.set(match[1], match[2]);
  }

  const entries = [];
  const assetPattern =
    /asset\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*(\w+)\s*\)/g;
  for (const match of text.matchAll(assetPattern)) {
    const [, id, name, category, source, imageVar] = match;
    const image = imports.get(imageVar);
    if (!image) {
      fail(`Manifest entry "${name}" references unknown import "${imageVar}".`);
      continue;
    }
    entries.push({ id, name, category, source, image });
  }

  return entries;
}

function parseSkillsData(text) {
  const titles = [...text.matchAll(/\btitle:\s*"([^"]+)"/g)].map((match) => match[1]);
  const ids = [...text.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
  const technologies = [];
  for (const block of text.matchAll(/technologies:\s*\[([\s\S]*?)\]/g)) {
    technologies.push(...[...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]));
  }
  return { titles, ids, technologies };
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function detectFormat(buffer) {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer.toString("ascii", 1, 4) === "PNG" &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "PNG";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "JPEG";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "WEBP";
  }
  return "UNKNOWN";
}

function dimensions(buffer, format) {
  try {
    if (format === "PNG") {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }

    if (format === "JPEG") {
      let offset = 2;
      const sof = new Set([
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
      ]);
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) {
          offset += 1;
          continue;
        }
        let marker = buffer[offset + 1];
        while (marker === 0xff) {
          offset += 1;
          marker = buffer[offset + 1];
        }
        if (
          marker === 0xd8 ||
          marker === 0xd9 ||
          marker === 0x01 ||
          (marker >= 0xd0 && marker <= 0xd7)
        ) {
          offset += 2;
          continue;
        }
        const length = buffer.readUInt16BE(offset + 2);
        if (sof.has(marker)) {
          return {
            width: buffer.readUInt16BE(offset + 7),
            height: buffer.readUInt16BE(offset + 5),
          };
        }
        offset += 2 + length;
      }
      return null;
    }

    if (format === "WEBP") {
      const chunk = buffer.toString("ascii", 12, 16);
      if (chunk === "VP8X") {
        return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
      }
      if (chunk === "VP8L") {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
      }
      if (chunk === "VP8 ") {
        const marker = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
        if (marker >= 0) {
          return {
            width: buffer.readUInt16LE(marker + 3) & 0x3fff,
            height: buffer.readUInt16LE(marker + 5) & 0x3fff,
          };
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

function scanWindowsPaths() {
  const dirs = ["app", "components", "data", "features", "styles", "types"];
  const pattern = /[A-Za-z]:\\/;
  for (const dir of dirs) {
    const base = path.join(ROOT, dir);
    let names;
    try {
      names = readdirSync(base, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of names) {
      if (!entry.isFile() || !/\.(ts|tsx)$/.test(entry.name)) continue;
      const file = path.join(base, entry.name);
      const text = readFileSync(file, "utf8");
      if (pattern.test(text)) {
        fail(`Windows absolute path found in ${path.relative(ROOT, file)}.`);
      }
    }
  }
}

const manifestText = readText(MANIFEST);
const skillsText = readText(SKILLS_DATA);
const entries = parseManifest(manifestText);
const skills = parseSkillsData(skillsText);

if (entries.length !== 108) {
  fail(`Manifest has ${entries.length} technology entries; expected 108.`);
}

if (JSON.stringify(skills.titles) !== JSON.stringify(EXPECTED_TITLES)) {
  fail("Skills dataset category titles do not match the approved category structure.");
}

const manifestCategoryOrder = [...new Set(entries.map((entry) => entry.category))];
if (JSON.stringify(skills.ids) !== JSON.stringify(manifestCategoryOrder)) {
  fail("Manifest category order does not match the Skills dataset.");
}

if (skills.technologies.length !== 108) {
  fail(`Skills dataset has ${skills.technologies.length} technologies; expected 108.`);
}

const manifestNames = new Set(entries.map((entry) => entry.name));
for (const name of skills.technologies) {
  if (!manifestNames.has(name)) fail(`No image manifest entry for technology "${name}".`);
}
for (const name of manifestNames) {
  if (!skills.technologies.includes(name))
    fail(`Manifest entry "${name}" is absent from the Skills dataset.`);
}

const expectedIds = new Set(skills.ids);
for (const entry of entries) {
  if (!expectedIds.has(entry.category)) {
    fail(`Technology "${entry.name}" uses unknown category id "${entry.category}".`);
  }
}

let countIndex = 0;
for (const block of skillsText.matchAll(/technologies:\s*\[([\s\S]*?)\]/g)) {
  const actual = [...block[1].matchAll(/"([^"]+)"/g)].length;
  if (actual !== EXPECTED_COUNTS[countIndex]) {
    fail(
      `Category ${countIndex + 1} has ${actual} technologies; expected ${EXPECTED_COUNTS[countIndex]}.`
    );
  }
  countIndex += 1;
}

const uniqueImages = new Map();
for (const entry of entries) {
  if (uniqueImages.has(entry.source) && uniqueImages.get(entry.source) !== entry.image) {
    fail(`Source "${entry.source}" maps to more than one public image.`);
  }
  uniqueImages.set(entry.source, entry.image);
}

let sourceFiles;
let destFiles;
try {
  sourceFiles = new Set(
    readdirSync(SOURCE_DIR, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => e.name)
  );
} catch (error) {
  fail(`Cannot read source directory: ${error.message}`);
  sourceFiles = new Set();
}
try {
  destFiles = new Set(
    readdirSync(DEST_DIR, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => e.name)
  );
} catch (error) {
  fail(`Cannot read destination directory: ${error.message}`);
  destFiles = new Set();
}

for (const source of uniqueImages.keys()) {
  if (!sourceFiles.has(source)) fail(`Missing source image: [${source}].`);
}
for (const source of sourceFiles) {
  if (!uniqueImages.has(source)) fail(`Unmapped source image: [${source}].`);
}

const hashes = new Map();
let decoded = 0;
for (const [source, image] of uniqueImages) {
  const sourcePath = path.join(SOURCE_DIR, source);
  const destPath = path.join(DEST_DIR, image);
  if (!sourceFiles.has(source)) continue;

  if (!destFiles.has(image)) {
    fail(`Missing public image: ${image}.`);
    continue;
  }

  if (statSync(sourcePath).size === 0) fail(`Source image is empty: [${source}].`);
  if (statSync(destPath).size === 0) fail(`Public image is empty: ${image}.`);

  if (sha256(sourcePath) !== sha256(destPath)) {
    fail(`Public image ${image} does not match source [${source}].`);
  }

  const buffer = readFileSync(destPath);
  const format = detectFormat(buffer);
  const extension = path.extname(image).slice(1).toUpperCase();
  const expectedFormat = { PNG: "PNG", JPG: "JPEG", JPEG: "JPEG", WEBP: "WEBP" }[extension];
  if (format !== expectedFormat) {
    fail(`${image}: extension says ${expectedFormat}, content is ${format}.`);
  }

  const size = dimensions(buffer, format);
  if (!size || size.width <= 0 || size.height <= 0) {
    fail(`${image}: could not read nonzero dimensions.`);
  } else {
    decoded += 1;
  }

  const hash = sha256(destPath);
  if (hashes.has(hash)) {
    fail(`Duplicate physical image: ${image} and ${hashes.get(hash)} share content.`);
  } else {
    hashes.set(hash, image);
  }
}

for (const image of destFiles) {
  if (![...uniqueImages.values()].includes(image)) fail(`Orphaned public image: ${image}.`);
}

scanWindowsPaths();

console.log("Technology image asset validation");
console.log(`  Mappings:            ${entries.length} / 108`);
console.log(`  Unique images:       ${uniqueImages.size} / 104`);
console.log(`  Source files:        ${sourceFiles.size}`);
console.log(`  Public files:        ${destFiles.size}`);
console.log(`  Decoded with size:   ${decoded}`);
console.log(`  Shared references:   ${entries.length - uniqueImages.size}`);

if (failures.length) {
  console.error(`\nFAILED with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("\nvalidate:images passed — all technology assets are present, matched and decodable.");
