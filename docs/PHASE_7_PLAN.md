# Phase 7 — Portfolio 2.0 Architecture & Content Strategy

**Status:** proposal only. No code has been changed for Phase 7.
**Branch context:** `update/portfolio-profile-2026`, 43 uncommitted files from Phases 2 and 6, nothing pushed.
**Non-negotiables:** no invented data, no private material, no proficiency percentages, no academic exercise presented as a product, no concept art presented as a screenshot, no deploy and no push to `main`.

---

## 0. How to read this document

Sections 1–2 establish what exists and what is true. Sections 3–4 define the sitemap and the homepage. Sections 5–10 define the data layer, which is the real work of Phase 7. Sections 11–15 define the new surfaces. Sections 16–20 define dependencies, security, sequence, and the exact file list. Section 21 lists the decisions that need your approval before anything is written.

Nothing in this plan depends on a backend, a secret, or a paid service. Every number on the finished page must trace back to a file in this repository, to the CV in `public/resume/`, or to the GitHub snapshot taken on 2026-11-16.

---

## 1. Ground truth

### 1.1 What the site is today

| Area             | Current state                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind 3.4, Framer Motion 12                                                                |
| Home sections    | Hero → Projects → About → Experience → Academic → Skills → Location → Contact                                                                  |
| Routes           | `/` and `/projects/[slug]` (4 case studies)                                                                                                    |
| Navigation       | 5-station dock: Home, Projects, About, Experience, Contact                                                                                     |
| Data             | `data/projects`, `data/experience`, `data/academic`, `data/skills`, `content/about`, `constants/profile`                                       |
| Visual system    | Near-black canvas, one cyan accent, Geist Sans/Mono, `SectionShell`, `SectionHeading`, `Card`, `Badge`, `Button`, drafted frame and crop marks |
| Backend          | None. No API routes, no auth, no database, no secrets                                                                                          |
| Quality gates    | `lint`, `typecheck`, `build`                                                                                                                   |
| Reserved folders | `data/github/.gitkeep`, `data/timeline/.gitkeep`, `data/certifications/.gitkeep`, `features/credibility/github-analytics/.gitkeep`             |

The reserved folders matter: the architecture already expects a GitHub data layer and a timeline data layer. Phase 7 fills them rather than inventing new locations.

### 1.2 Verified facts available

**GitHub account `youssefelbajoury`, fetched 2026-11-16 via the REST API:**

| Repository                                  | Language   | Commits | Stars | Forks | Created    | Last push  | Branch   |
| ------------------------------------------- | ---------- | ------: | ----: | ----: | ---------- | ---------- | -------- |
| `TP-DTD-XML-XSL`                            | XSLT       |       6 |     0 |     0 | 2026-11-01 | 2026-11-15 | `master` |
| `morocco-retail-intelligence-data-platform` | Python     |       4 |     0 |     0 | 2026-10-16 | 2026-10-17 | `main`   |
| `youssef-el-bajoury-portfolio`              | TypeScript |       3 |     0 |     0 | 2026-08-01 | 2026-08-01 | `main`   |

- Totals: **3 public repositories, 13 commits, 0 stars, 0 forks, 0 open issues, 0 releases, 0 gists.**
- Language bytes per repo (GitHub `/languages`): Morocco Retail — Python 1,025,248 / Makefile 9,153 / PLpgSQL 6,724 / PowerShell 3,473. TP-DTD-XML-XSL — XSLT 267,989. Portfolio — TypeScript 484,547 / CSS 10,476 / JavaScript 1,637.
- Account created 2024-05-11. No contribution calendar is available unauthenticated, so **no contribution heatmap will be built** — it cannot be produced from real data.

**CV `public/resume/Youssef-El-Bajoury-CV-FR-2026.pdf` (authoritative for dates):**

| Date                  | Event                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2022 – 2023           | Baccalauréat, Sciences Physiques (option française), Lycée Qualifiant Al Farabi, Casablanca — Mention Assez Bien |
| 2023 – 2025           | Technicien Spécialisé, Développement Digital (Web Full Stack), OFPPT / ISFO, Casablanca — diploma obtained 2025  |
| 2025                  | CFIT — Full Stack Developer intern, Casablanca                                                                   |
| 2025 – 2026           | Licence Professionnelle DAISI, FSAC Casablanca; Smart Health Room final-year project                             |
| 2026 – Present        | Master II-BDCC, ENSET Mohammedia, Université Hassan II de Casablanca                                             |
| 24 Sep 2026 – Present | IZIRY — Full Stack Developer / AI Engineering intern (pre-employment), Casablanca                                |
| 2026 – Present        | AutoFlow, personal project                                                                                       |
| 2026                  | Morocco Retail Intelligence Data Platform, personal project                                                      |

Languages stated: Arabic native, French B2, English B2.

**AutoFlow evidence** (measured in the source repo, not estimated): 32 tables, 28 enums, 66 indexes, 20 unique constraints, 70 foreign keys; OpenAPI 49 paths and 107 schemas; **475 passing unit tests across 20 files** (the 14-file integration suite needs PostgreSQL and was not run).

### 1.3 Hard constraints carried into Phase 7

- Do not modify `styles/` or `components/ui/`. New surfaces compose the existing primitives.
- Do not deploy, do not merge or push to `main`, no unrelated changes, no repo-wide reformatting.
- Preserve the Rolex Experience section and every existing screenshot.
- Academic work stays labelled as coursework. No exercise becomes "a product".
- `AutoFlow_Images/` concept art is never shown as an application screenshot.
- No technology is claimed as used in a project unless the project's own record shows it.

### 1.4 The actual problem Phase 7 solves

The current homepage is honest but flat: eight sections of roughly equal weight, one skills list of nine categories with no detail, and a project section that carries the full weight of every project at once. A recruiter learns _what_ Youssef does but cannot drill into _how_ without opening a case-study dialog, and cannot see the shape of the career at all — education sits inside Experience, and the two internships sit above it as two lines of text.

Phase 7 fixes three things and only three things:

1. **Density.** Fifteen sections cannot each be a hero. Nine of them become compact, expandable, or reference-grade; six carry the narrative.
2. **Depth.** Skills, GitHub, timeline, and gallery move from prose into structured data with drill-down, so the homepage stays readable while the evidence becomes inspectable.
3. **Navigation.** A reader must be able to move from "who is this" to "prove it" to "contact" without scrolling 12,000 pixels.

---

## 2. Sitemap

### 2.1 Routes

| Route              | Type             | Purpose                                                                                                        | Phase  |
| ------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------- | ------ |
| `/`                | Static           | The 15-section document                                                                                        | 7      |
| `/projects/[slug]` | Static, 4 params | Existing deep case studies: `autoflow`, `smart-health-room`, `morocco-retail-intelligence`, `rolex-experience` | exists |
| `/sitemap.xml`     | Generated        | Every indexable route plus the four project pages                                                              | 7      |
| `/robots.txt`      | Generated        | Allow all, point at the sitemap                                                                                | 7      |
| `not-found`        | Static           | On-brand 404 with a route back to `/` and `/projects`                                                          | 7      |

**Deliberately not added:**

- `/academic` — academic work is absorbed into the gallery and the timeline (section 3.4). A separate route would give coursework the same status as the four featured projects, which is exactly the hierarchy the brief forbids.
- `/resume` — the Resume Center is a section plus a dialog. A route would duplicate three PDFs that are already directly downloadable.
- `/blog`, `/uses`, `/now` — no content exists. An empty route is a claim that there is more to read.
- `/projects` index — the Project Gallery (section 10) _is_ the index, with filters and search. A separate index page would render the same ten records twice.
- Any API route — nothing in Phase 7 needs a server. See section 12 (Assistant) and 13 (Contact).

### 2.2 Anchor contract

Every homepage section gets a stable DOM id. The dock, the footer, the assistant citations, and the hero's `href="#contact"` all reference these ids, and nothing else may invent one.

|   # | Section                          | DOM id                      |
| --: | -------------------------------- | --------------------------- |
|   1 | Premium Hero                     | `home`                      |
|   2 | Technology Marquee               | `stack`                     |
|   3 | Professional Introduction        | `about`                     |
|   4 | Professional Experience          | `experience`                |
|   5 | Featured Projects                | `projects`                  |
|   6 | Technical Skills Explorer        | `skills`                    |
|   7 | GitHub Activity                  | `github`                    |
|   8 | Professional & Academic Timeline | `timeline`                  |
|   9 | Learning Roadmap                 | `roadmap`                   |
|  10 | Project Gallery                  | `gallery`                   |
|  11 | AI Portfolio Assistant           | `assistant`                 |
|  12 | Recruiter Contact Form           | `contact`                   |
|  13 | Resume Center                    | `resume`                    |
|  14 | WhatsApp QR                      | `whatsapp`                  |
|  15 | Premium Footer                   | `footer` (not a spy target) |

`contact` keeps its current id, so existing links, the hero anchor, and the dock entry continue to work unchanged. `projects` keeps its id for the same reason.

---

## 3. Homepage composition

### 3.1 The fifteen sections

Height is a _target_, not a measurement: it is the budget that keeps the page from becoming a wall. "Full" means roughly one viewport on desktop; "band" means under 240px.

|   # | Section                          | Owner (feature folder)                  | Height           | Density strategy                                                    |
| --: | -------------------------------- | --------------------------------------- | ---------------- | ------------------------------------------------------------------- |
|   1 | Premium Hero                     | `features/marketing/hero`               | Full             | Unchanged composition; copy and actions audited                     |
|   2 | Technology Marquee               | `features/marketing/tech-marquee`       | Band             | One infinite row, CSS only, pauses on hover/focus                   |
|   3 | Professional Introduction        | `features/marketing/about`              | Medium           | Rewritten to 3 short paragraphs + 6 discipline chips                |
|   4 | Professional Experience          | `features/experience`                   | Tall             | Two roles, CV-derived highlights, education _removed_ (moves to 08) |
|   5 | Featured Projects                | `features/showcase/projects`            | Tall             | Unchanged: four hand-composed tiles                                 |
|   6 | Technical Skills Explorer        | `features/credibility/skills-explorer`  | Medium collapsed | 15 category rows closed; one opens at a time                        |
|   7 | GitHub Activity                  | `features/credibility/github-activity`  | Medium           | Static snapshot: 3 repos, real language bytes, real commit counts   |
|   8 | Professional & Academic Timeline | `features/credibility/timeline`         | Tall             | One spine, two tracks, 8 dated entries                              |
|   9 | Learning Roadmap                 | `features/credibility/learning-roadmap` | Medium           | Gated on approved content (section 9)                               |
|  10 | Project Gallery                  | `features/showcase/project-gallery`     | Tall             | 10 cards, 4 filters, search; deep links out, not duplicated prose   |
|  11 | AI Portfolio Assistant           | `features/conversion/assistant`         | Medium           | Deterministic retrieval over the site's own data, no model          |
|  12 | Recruiter Contact Form           | `features/conversion/contact-form`      | Medium           | Validated form → `mailto:`; nothing leaves the browser              |
|  13 | Resume Center                    | `features/credibility/resume-center`    | Medium           | Three documents inline; dialog retained for other triggers          |
|  14 | WhatsApp QR                      | `features/conversion/whatsapp`          | Short            | One plate: QR, number, tap-to-open                                  |
|  15 | Premium Footer                   | `components/layout/Footer`              | Short            | Four columns, sitemap, credits, back to top                         |

### 3.2 What moves, and what that costs

The brief's order differs from the current page in four places. Each move has a consequence that must be handled explicitly, not silently:

**Projects moves below Experience (5 after 4).** Narrative order becomes _who → where he worked → what he built → what he knows_. This is the right order for a recruiter: the roles establish context, the projects are the proof. Cost: the hero's "View Projects" action now travels further; the dock keeps Projects as a direct jump, so the cost is one click.

**Academic leaves the homepage as a standalone section.** The 15-item list has no slot for it, and inventing a 16th would break the brief. Its content is _not_ deleted — see 3.4.

**Skills becomes an explorer, not a list.** Nine flat categories become fifteen collapsible ones. At rest the section is _shorter_ than today's grid because only the category rows are visible.

**Contact splits into three sections (12, 13, 14).** Today one `ContactPreview` carries the invitation, the email, the location, and the resume trigger. Phase 7 separates three different intents — _write a message_, _take a document_, _send a WhatsApp_ — and closes with the footer. `ContactPreview`'s visual language (the centred plate, the one saturated action) moves to section 12; `LocationPanel` content folds into the footer and the hero's coordinate line, so no verified fact is lost.

### 3.3 The dock after Phase 7

Fifteen sections, five stations. Unchanged count, changed middle:

```
Home · Projects · Experience · Timeline · Contact
```

- `Timeline` replaces `About`. About is section 3, four hundred pixels below the hero — a reader reaches it by scrolling once. The timeline is 8,000 pixels down and genuinely needs a shortcut.
- `Skills`, `Gallery`, `Roadmap`, `GitHub`, `Assistant`, `Resume`, and `WhatsApp` are **not** dock destinations. Precedent already exists in `navigationItems.ts` for excluding `skills` and `academic`; a seventh station overflows the dock on a 360px phone, which is a real defect and not a stylistic preference.
- The dock registry stays the single source of truth for both navigation and the scroll spy. Adding `timeline` is a one-line change plus its icon import.

### 3.4 Where the academic work goes (preservation guarantee)

Nothing is discarded. The `AcademicSection` component retires as a _section_, and its four exercises become first-class gallery records:

| Academic asset                                        | New home                                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ACADEMIC_MODULE` (module name, programme, repo root) | Timeline entry for the 2025–2026 Licence DAISI year, as the module-level repo link                                                   |
| Four `ACADEMIC_PROJECTS` records                      | Gallery cards under the **Academic** filter, with their existing summaries, highlights, techniques, and per-exercise repo deep links |
| Four rendered-XSLT screenshots                        | Gallery card media, captions unchanged (they already state the images are rendered XSLT output)                                      |
| The "these are coursework, not products" framing      | A persistent mono caption on the Academic filter, plus a `coursework` badge on every academic card                                   |

This is a promotion in _reach_ and a demotion in _prominence_, which is the correct trade: the work stays openable, but it no longer occupies a homepage slot above the featured projects.

---

## 4. Component architecture

### 4.1 Rules

1. **One feature folder per section.** A section is never assembled inside `app/page.tsx` from loose components; the page imports one exported section per feature.
2. **Server by default.** `"use client"` is added only where state, motion, or an event handler exists. The data files stay server-safe and importable from either side.
3. **Compose, don't extend.** No new files in `components/ui/` and no edits in `styles/`. New surfaces use `SectionShell`, `SectionHeading`, `Card`, `Badge`, `Button`, `TiltCard`, `revealMotion`, and `styles/material` constants exactly as the existing sections do.
4. **No new chart library.** Bars, spines, and lanes are CSS/SVG. A charting dependency would add 60–200 kB to draw six rectangles.
5. **No duplicated content.** A fact lives in one file. The gallery reads `projects.ts` and `academic.ts`; it does not restate them. The marquee reads the technology catalogue; it does not carry its own list.

### 4.2 New feature folders

```
features/marketing/tech-marquee/
  index.ts
  TechnologyMarquee.tsx
  marqueeMotion.ts

features/credibility/skills-explorer/
  index.ts
  SkillsExplorer.tsx
  components/CategoryRow.tsx
  components/TechnologyDetail.tsx
  components/StatusFilter.tsx
  useSkillExplorer.ts

features/credibility/github-activity/
  index.ts
  GitHubActivity.tsx
  components/RepoCard.tsx
  components/LanguageBar.tsx
  components/CommitBars.tsx

features/credibility/timeline/
  index.ts
  TimelineSection.tsx
  components/TimelineTrack.tsx
  components/TimelineEntry.tsx
  timelineMotion.ts

features/credibility/learning-roadmap/
  index.ts
  LearningRoadmap.tsx
  components/RoadmapLane.tsx
  components/RoadmapItem.tsx

features/showcase/project-gallery/
  index.ts
  ProjectGallery.tsx
  components/GalleryCard.tsx
  components/GalleryFilters.tsx
  components/CourseworkNote.tsx
  useGalleryFilter.ts

features/conversion/assistant/
  index.ts
  PortfolioAssistant.tsx
  components/Transcript.tsx
  components/SuggestionChips.tsx
  useAssistant.ts

features/conversion/contact-form/
  index.ts
  RecruiterContactForm.tsx
  components/FormField.tsx
  components/SendFallback.tsx
  contactSchema.ts
  buildMailto.ts

features/conversion/whatsapp/
  index.ts
  WhatsAppPanel.tsx

features/credibility/resume-center/
  ResumeCenterSection.tsx        (new, alongside the existing dialog)
```

### 4.3 Retired files

| File                                                                    | Action  | Reason                                              |
| ----------------------------------------------------------------------- | ------- | --------------------------------------------------- |
| `features/academic/AcademicSection.tsx`                                 | delete  | Content absorbed into gallery + timeline (3.4)      |
| `features/academic/index.ts`                                            | delete  | Same                                                |
| `features/credibility/skills-architecture/components/SkillsPreview.tsx` | delete  | Replaced by the explorer; keeping both is dead code |
| `features/credibility/skills-architecture/index.ts`                     | delete  | Same                                                |
| `data/skills/skills.ts`                                                 | replace | Superseded by `data/technologies/catalogue.ts`      |
| `types/skill.ts`                                                        | replace | Superseded by `types/technology.ts`                 |

`features/conversion/contact-hub/components/ContactPreview.tsx` is **not** deleted blindly: its layout is the basis of section 12. It is rewritten in place or moved to `features/conversion/contact-form`, and `LocationPanel` is folded into the footer. `LocalTimeBadge` is retained if the footer keeps a local-time line.

---

## 5. Data model

The data layer is the deliverable. Components are cheap once the model is right.

### 5.1 `types/technology.ts`

```ts
export type TechnologyCategory =
  | "Programming Languages"
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "AI & Machine Learning"
  | "Big Data & Data Engineering"
  | "Databases & Storage"
  | "Business Intelligence"
  | "Cloud"
  | "DevOps & Infrastructure"
  | "APIs & Distributed Systems"
  | "IoT & Embedded"
  | "Development Environments"
  | "Testing & Quality"
  | "Architecture & Methodologies";

export type TechnologyStatus =
  | "used-in-project" // label: "Used in a documented project"
  | "academic" // label: "Academic experience"
  | "familiar" // label: "Familiar"
  | "exploring" // label: "Exploring"
  | "planned"; // label: "Planned future learning"

export interface Technology {
  /** Stable kebab-case key. Referenced by projects, roadmap, and the marquee. */
  id: string;
  name: string;
  category: TechnologyCategory;
  /**
   * Rendered only when a verified local asset exists. Absent for most entries
   * in Phase 7 — see 8.4 for why the marquee uses monograms, not brand logos.
   */
  icon?: { kind: "monogram"; text: string };
  /** Official documentation root. Only set when verified; see 5.5. */
  docsUrl?: string;
  /** ISO date the docsUrl was opened and confirmed. Required with docsUrl. */
  docsVerified?: string;
  /** Ids from data/projects and data/academic. Empty is a valid, honest value. */
  projectIds: readonly string[];
  status: TechnologyStatus;
  /** One short factual line. Optional; never a proficiency claim. */
  note?: string;
}
```

**Why `status` is a union and not a number:** a union can only be one of five honest sentences. A number invites a bar, a bar invites a comparison, and the comparison is unmeasured. The existing `Skill` type made the same argument; Phase 7 keeps the argument and widens the vocabulary.

**Why `projectIds` is required and may be empty:** an empty array is the _correct_ value for "Familiar" and "Exploring". Making the field optional would let a future entry omit it and be indistinguishable from "no evidence".

### 5.2 `types/timeline.ts`

```ts
export type TimelineKind = "education" | "professional" | "project" | "achievement";

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  title: string;
  organisation: string;
  location?: string;
  /** Display label exactly as the CV states it: "2025 – 2026", "Sep 2026 – Present". */
  period: string;
  /** Sort key. End of range; "present" sorts first. */
  endYear: number;
  /** Sort key. Start of range. */
  startYear: number;
  summary: string;
  /** 0–4 bullets. Each must be true of the CV or of a file in this repo. */
  highlights: readonly string[];
  /** Cross-links. Ids must exist in projects.ts or academic.ts. */
  projectIds?: readonly string[];
  /** External evidence: a repo root or a deep link. */
  evidenceUrl?: string;
  evidenceLabel?: string;
}
```

**Why both `period` and the numeric keys:** the label must be the CV's own wording ("24 sept. 2026 – Présent" is not a sortable string, and re-formatting it would invent precision). The numeric keys sort and place the year markers.

### 5.3 `types/roadmap.ts`

```ts
export type RoadmapStatus = "approved" | "proposed" | "deferred";

export interface RoadmapLane {
  id: string;
  title: string;
  /** Why this lane exists, in one line. */
  intent: string;
}

export interface RoadmapItem {
  id: string;
  laneId: string;
  title: string;
  /** The gap this closes. Must not restate an existing project. */
  rationale: string;
  status: RoadmapStatus;
  /** "2027", "Q1 2027", or omitted when unknown. */
  target?: string;
  /** Technologies this item would add. Must not already be "used-in-project". */
  technologyIds?: readonly string[];
}
```

Only `status: "approved"` items render. `proposed` items exist so the content can be reviewed in the file without leaking onto the page. See section 9.

### 5.4 `types/github.ts`

```ts
export interface GitHubRepoSnapshot {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  /** Byte counts from GET /repos/{owner}/{repo}/languages. */
  languages: Readonly<Record<string, number>>;
  stars: number;
  forks: number;
  openIssues: number;
  /** Commit count read from the Link: rel="last" header. */
  commits: number;
  createdAt: string;
  pushedAt: string;
  defaultBranch: string;
  homepage: string | null;
}

export interface GitHubSnapshot {
  /** ISO date the numbers were fetched. Rendered on the page. */
  asOf: string;
  login: string;
  publicRepos: number;
  /** True when the snapshot predates today by more than 90 days. */
  stale: boolean;
  repos: readonly GitHubRepoSnapshot[];
}
```

### 5.5 Documentation URL policy

`docsUrl` is set only when the official documentation root has been opened and confirmed, and `docsVerified` records the date. A guessed URL (`docs.something.io/latest`) is worse than no link: it teaches the reader that the site's links cannot be trusted. Most of the catalogue will legitimately have no link in Phase 7, and the detail panel says "No verified documentation link" rather than hiding the row.

### 5.6 Cross-reference validation

A content script, not a test framework:

```
scripts/validate-content.mjs
```

It asserts:

- every `Technology.projectIds` entry exists in `projects.ts` or `academic.ts`;
- every `TimelineEntry.projectIds` entry exists;
- every `RoadmapItem.technologyIds` entry exists;
- no technology has `status: "used-in-project"` with an empty `projectIds`;
- no `docsUrl` exists without `docsVerified`;
- no duplicate technology ids, timeline ids, or gallery ids;
- `data/github/snapshot.ts` totals match the sum of its repos.

Wired as `npm run validate:content`. Not part of `next build` — a content typo should fail a command a human runs, not break a deploy at 2 a.m.

---

## 6. The technology catalogue

### 6.1 Where the entries come from

The seed list is exactly the union of:

1. the "Compétences techniques" block of the 2026 French CV (the authoritative competence claim), and
2. the technologies recorded in `data/projects/projects.ts` and `data/academic/academic.ts` (the authoritative usage claim).

Nothing else is added. No technology appears because it is fashionable, because a job posting asked for it, or because it would round out a category.

### 6.2 Status assignment rule (mechanical, not editorial)

| Status            | Assigned when                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `used-in-project` | The technology appears in a project record in this repository. `projectIds` is non-empty.                                              |
| `academic`        | The technology is evidenced by the committed coursework repo (`TP-DTD-XML-XSL`) — currently XML, DTD, XSLT, XPath, Chart.js.           |
| `familiar`        | The CV lists it as a competence and neither of the above applies. This is the CV's claim, not the site's evidence, and the UI says so. |
| `exploring`       | The owner has confirmed active study. **Zero entries at launch** (see 9.4).                                                            |
| `planned`         | Derived at render time from an _approved_ roadmap item. Never hand-written.                                                            |

The distinction the UI must make visible: `used-in-project` and `academic` are **evidence**; `familiar` is **self-report**; `planned` is **intent**. Three different kinds of statement, three different treatments — not one grey chip for all of them.

### 6.3 The fifteen categories

Counts are indicative of the seed pass; the implementation may merge two near-duplicates rather than ship a category with one entry.

| Category                     | ~Entries | Representative entries                                                                                                  | Evidence mix         |
| ---------------------------- | -------: | ----------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Programming Languages        |        9 | TypeScript, JavaScript, Python, Java, PHP, SQL, HTML5, CSS3, Dart                                                       | 4 used, 5 familiar   |
| Frontend                     |        4 | React, Next.js, Tailwind CSS, Angular                                                                                   | 3 used, 1 familiar   |
| Backend                      |        9 | Node.js, Express, Spring Boot, Spring MVC, Spring Security, Spring Cloud, JPA/Hibernate, Laravel                        | 2 used, 7 familiar   |
| Mobile                       |        3 | Flutter, React Native, Android (native & cross-platform)                                                                | 1 used, 2 familiar   |
| AI & Machine Learning        |      ~17 | scikit-learn, TensorFlow, Keras, PyTorch, Pandas, NumPy, NLP, Computer Vision, Forecasting, RAG, Ollama, AI agents, MCP | 0 used, ~17 familiar |
| Big Data & Data Engineering  |        7 | Apache Spark, Spark Structured Streaming, Kafka Streams, dbt Core, HDFS, Parquet                                        | 1 used, 6 familiar   |
| Databases & Storage          |       10 | PostgreSQL, MongoDB, Redis, MySQL, Oracle 19c, Cassandra, Neo4j, Elasticsearch, MinIO, S3                               | 4 used, 6 familiar   |
| Business Intelligence        |        6 | Superset, Power BI, Metabase, Grafana, Kibana, ELK                                                                      | 2 used, 4 familiar   |
| Cloud                        |        2 | AWS, GCP                                                                                                                | 0 used, 2 familiar   |
| DevOps & Infrastructure      |      ~12 | Docker, Docker Compose, Kubernetes, Ansible, Terraform, Jenkins, Linux, Vault, SonarQube                                | 2 used, 10 familiar  |
| APIs & Distributed Systems   |      ~11 | REST, OpenAPI, WebSocket, Socket.IO, JWT, OAuth2, OIDC, Keycloak, gRPC, JMS, microservices                              | 1 used, 10 familiar  |
| IoT & Embedded               |        7 | ESP32, Arduino Uno/Mega, Raspberry Pi, RFID, sensors, MQTT, serial communication                                        | 4 used, 3 familiar   |
| Development Environments     |        5 | VS Code, IntelliJ IDEA, PyCharm, Android Studio, Eclipse                                                                | 0 used, 5 familiar   |
| Testing & Quality            |       ~7 | Vitest, pytest, Postman, ESLint, Prettier, Great Expectations, SonarQube                                                | 4 used, 3 familiar   |
| Architecture & Methodologies |       ~6 | UML, MERISE, Scrum, Agile, JIRA, domain events                                                                          | 1 used, 5 familiar   |

**Ambiguity resolution (one technology, one category):**

| Technology                     | Category                    | Why not the other                                                                                   |
| ------------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------- |
| Apache Kafka                   | Big Data & Data Engineering | Used for streaming ingestion, not as message plumbing in a service mesh                             |
| RabbitMQ                       | DevOps & Infrastructure     | Listed by the CV under Cloud/DevOps tooling; no project uses it                                     |
| pytest                         | Testing & Quality           | It is a test runner, not a backend framework                                                        |
| Git / GitHub / GitLab          | Development Environments    | Version control is a working environment, not an API or a pipeline                                  |
| Docker / Docker Compose        | DevOps & Infrastructure     | Used in all three system projects; the _compose files_ are evidence, the category is infrastructure |
| MinIO / AWS S3                 | Databases & Storage         | Object storage; the CV groups them under storage                                                    |
| Grafana / Kibana / ELK         | Business Intelligence       | Observability dashboards; the CV groups them with BI and visualisation                              |
| Superset                       | Business Intelligence       | Five dashboards are the deliverable, not the warehouse                                              |
| Prometheus                     | DevOps & Infrastructure     | It is scrape/metrics infrastructure; Grafana reads it                                               |
| JWT / OAuth2 / OIDC / Keycloak | APIs & Distributed Systems  | Identity is part of the API contract here, not a separate security category                         |

### 6.4 What each catalogue record renders

A technology is displayed in exactly three places, each with a different amount of truth:

1. **Marquee (section 2)** — name only. Only `used-in-project` and `academic` entries appear, because the marquee reads as a claim. `familiar` technologies do not scroll past a recruiter as if they were shipped.
2. **Explorer row (section 6)** — name, category, and a status dot. Counts per category are real counts of the records below them.
3. **Detail panel** — name, category, status sentence, related project links, and the documentation link _if verified_. When `projectIds` is empty the panel says "No project in this portfolio uses it" rather than showing an empty section.

### 6.5 Category descriptions

Each of the fifteen categories carries one sentence explaining what it groups, shown when the category is expanded. This is what stops "Backend" from silently meaning "everything that is not a button".

---

## 7. Project mapping

### 7.1 The three groups

**A — Featured Engineering (4).** Unchanged records, unchanged case studies, unchanged visuals. These keep the full hand-composed tiles in section 5 and the `/projects/[slug]` routes.

| Project                     | Year           | Public evidence                                                          | Homepage treatment                      |
| --------------------------- | -------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| AutoFlow                    | 2026 – Present | No remote configured → `repoUrl` stays undefined, control stays disabled | Full system tile                        |
| Morocco Retail Intelligence | 2026           | GitHub repo, 4 commits, Python                                           | Full system tile                        |
| Smart Health Room           | 2025 – 2026    | Screenshots only (final-year project)                                    | Full screenshot tile                    |
| Rolex Experience            | —              | Screenshots only (front-end build)                                       | Full screenshot tile, preserved exactly |

**B — Academic Work (4 + module).**

| Record                                    | Source            | Gallery treatment                           |
| ----------------------------------------- | ----------------- | ------------------------------------------- |
| Library Loan Register (`S2_Bibliotheque`) | `academic.ts`     | Card + screenshot + deep link               |
| MétéoLive Dashboard (`S2_Meteo`)          | `academic.ts`     | Card + screenshot + deep link               |
| Bank Statement Dashboard (`S2_RCB`)       | `academic.ts`     | Card + screenshot + deep link               |
| Telecom Billing Register (`S2_Telecom`)   | `academic.ts`     | Card + screenshot + deep link               |
| Module root (`TP-DTD-XML-XSL`)            | `ACADEMIC_MODULE` | One line above the filter, not a fifth card |

**No additional academic repositories are added.** The brief anticipated "plus additional verified GitHub academic projects"; the account has exactly three public repositories and only one of them is academic. Adding more would mean inventing them. If a repository is published later, it enters through `data/academic/academic.ts` and the gallery picks it up with no component change.

**C — Professional Experience (2).**

| Record                                               | Evidence                          | Gallery treatment                                                                 |
| ---------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| IZIRY — Full Stack Developer / AI Engineering intern | CV only; client work confidential | "Engagement" card: role, period, discipline, no screenshots, no metrics, no links |
| CFIT — Full Stack Developer intern                   | CV only                           | Same                                                                              |

Category C cards are visually distinct from A and B: no media, a mono `ENGAGEMENT` label, and a single line stating that project details are not publishable. They are **not** given fake architecture diagrams. This is the honest way to show professional experience in a gallery whose other two groups are openable.

### 7.2 Gallery behaviour

- **Filters:** All (10) · Featured Engineering (4) · Academic (4) · Professional (2).
- **Search:** matches title, discipline, and technology names from the project record.
- **Sort:** newest first by `year`, with undated records last.
- **Cards:** featured → internal link to `/projects/[slug]`; academic → external deep link (`rel="noopener noreferrer"`, new tab, labelled "Open on GitHub"); professional → expands inline, no navigation.
- **Persistence:** the active filter is reflected in the URL hash (`#gallery=academic`) so a shared link opens the right view. No router state, no query-string machinery.
- **Density:** at most 6 cards render before a "Show all" control on mobile; the grid is 3 columns desktop, 2 tablet, 1 phone.

---

## 8. Professional & Academic Timeline

### 8.1 Structure

One vertical spine, two tracks, one sort order.

```
2022 ─── Baccalauréat
2023 ─── Technicien Spécialisé (OFPPT)
2025 ─── CFIT internship
2025 ─── Licence DAISI
2025 ─── Smart Health Room (final-year project)
2026 ─── Master II-BDCC
2026 ─── IZIRY internship
2026 ─── AutoFlow
2026 ─── Morocco Retail Intelligence
```

A mono toggle above the spine filters to **All / Professional / Academic**. "Professional" includes the two internships and the three project milestones; "Academic" includes the four qualifications and the final-year project. The toggle is a filter over the same records, not two separate lists — a single `kind` field drives it, so nothing can drift.

### 8.2 The entries, with their real dates

| Entry                                                         | Kind         | Period (as the CV states it) | Highlights (all CV-derived)                                                                                                                       |
| ------------------------------------------------------------- | ------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baccalauréat — Sciences Physiques                             | education    | 2022 – 2023                  | Lycée Qualifiant Al Farabi, Casablanca · Mention Assez Bien                                                                                       |
| Technicien Spécialisé — Développement Digital, Web Full Stack | education    | 2023 – 2025                  | OFPPT / ISFO, Casablanca · Diploma obtained 2025                                                                                                  |
| CFIT — Full Stack Developer Intern                            | professional | 2025                         | React, Node.js, Express, MongoDB · catalogue, orders, auth, admin                                                                                 |
| Licence Professionnelle DAISI                                 | education    | 2025 – 2026                  | FSAC, Casablanca · IoT, embedded systems, ML/DL, databases, cloud, Flutter, UML, Scrum · link to the XML/XSLT module repo                         |
| Smart Health Room                                             | project      | 2025 – 2026                  | Final-year project · web dashboard, mobile app, API, six sensor types, RFID access control                                                        |
| Master II-BDCC                                                | education    | 2026 – Present               | ENSET Mohammedia, Université Hassan II · software engineering, distributed systems, cloud, DevOps, big data, BI, AI                               |
| IZIRY — Full Stack Developer / AI Engineering Intern          | professional | 24 Sep 2026 – Present        | Pre-employment internship, Casablanca · pricing and forecasting engine, R3 validation pipeline, Simulation Center, Ollama-based explanation layer |
| AutoFlow                                                      | project      | 2026 – Present               | ERP and fleet management · 32 tables, 70 FKs, 49 OpenAPI paths, 475 passing unit tests                                                            |
| Morocco Retail Intelligence                                   | project      | 2026                         | Personal project · Python ingestion, MinIO, Great Expectations, PostgreSQL, dbt, Airflow, five Superset dashboards · GitHub                       |

**Decisions embedded in that table:**

- **IZIRY detail.** The CV already publishes the four bullets. Repeating them on the site discloses nothing new and answers the recruiter's real question. The site will use the CV's wording, not the current "project specifics remain confidential" line — but it will **not** name the client, the data, or any metric. _This is an approval item (21.3)._
- **Morocco Retail date.** The CV gives no month; the GitHub repository was created 2026-10-16. The timeline says **2026** and nothing finer. It is not given a month to make the spine look tidy.
- **Achievements are highlights, not separate cards.** "Mention Assez Bien", "diploma obtained 2025", and "475 passing tests" are true and belong to their parent entry. A standalone achievement card would read as an award, and there are no awards.
- **`kind: "achievement"` is modelled but unused.** No certifications exist (`data/certifications/` is empty), so no certification is shown. An empty kind is cheaper than a fabricated credential.

### 8.3 Rendering

- Left rail on desktop (year column, sticky within the section), single column on mobile with the year inline above each title.
- The spine is a 1px rule with a 6px node per entry; the current entry (IZIRY, "Present") gets the status lens treatment already used by `AvailabilityBadge`.
- Entries expand in place for highlights — collapsed by default on mobile, open on desktop.
- Cross-links are real links: project entries → `/projects/[slug]`; the DAISI entry → the TP repo root; IZIRY/CFIT → no link (nothing publishable).
- Reveal uses `buildRevealVariants` with a per-entry stagger of 40ms, capped at 8 entries so the last one is not delayed by half a second.

---

## 9. Learning Roadmap

### 9.1 Why this section is separate and gated

A roadmap is the easiest place on a portfolio to lie. "Currently learning Kubernetes, Rust, and LLM fine-tuning" costs nothing to type. So the roadmap is:

- a **separate data file** (`data/roadmap/roadmap.ts`) with its own type, never derived from the technology catalogue;
- **opt-in per item** (`status: "approved"`), with everything else invisible;
- **never** populated by reclassifying a technology that already appears in the CV. An existing competence is not a future goal.

### 9.2 Lanes

| Lane                     | Intent                                                 |
| ------------------------ | ------------------------------------------------------ |
| Production ML systems    | Move from models that run to models that are monitored |
| Data platform depth      | Turn listed streaming tools into a documented pipeline |
| Cloud & infrastructure   | Deploy something real, reproducibly                    |
| Distributed systems      | Build a service boundary that is not HTTP              |
| Mobile & IoT integration | Close the loop between device and API                  |
| Engineering practice     | Make decisions and trade-offs legible                  |

### 9.3 Candidate items — **proposals, not content**

Each item below is a gap I can defend from the repository, and each references only technologies currently marked `familiar` (never `used-in-project`). **None of them renders until you approve it.**

| Lane                     | Candidate                                                         | Rationale (the gap)                                                                        |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Production ML systems    | Model monitoring and drift detection on a deployed model          | IZIRY's validation pipeline is confidential; no public project shows a model in production |
| Production ML systems    | A reproducible evaluation harness with baselines                  | AutoFlow has 475 unit tests but no ML evaluation surface                                   |
| Data platform depth      | Kafka → Spark Structured Streaming into the existing bronze layer | Both are CV-listed; Morocco Retail is batch-only                                           |
| Data platform depth      | Data contracts + schema evolution in the dbt project              | Great Expectations covers quality, not contracts                                           |
| Cloud & infrastructure   | Terraform-provisioned deployment of the Morocco Retail stack      | Docker Compose is local-only; Terraform and cloud are CV-listed but unused                 |
| Cloud & infrastructure   | CI pipeline with image scanning                                   | AutoFlow builds locally; no public CI runs                                                 |
| Distributed systems      | A gRPC service with OpenTelemetry traces                          | Both CV-listed; every public API here is REST                                              |
| Distributed systems      | An outbox/event-bus pattern with RabbitMQ                         | Domain events are in AutoFlow; the broker is not                                           |
| Mobile & IoT integration | MQTT broker between ESP32 and the Smart Health Room API           | Sensors are documented; the transport is not                                               |
| Engineering practice     | ADRs and C4 diagrams for AutoFlow                                 | The architecture exists in code; the decisions are not written down                        |

### 9.4 If nothing is approved

The section ships with an honest empty state — one line: _"Roadmap under review. Items are published only once they are actually in progress."_ — and the page still has fifteen sections. This is better than publishing six aspirational bullets on approval day. `status: "exploring"` in the catalogue likewise stays empty until something is genuinely being explored.

---

## 10. GitHub Activity

### 10.1 What is shown (all real)

| Element         | Data                                                                                                               | Source                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Account summary | 3 public repositories · 13 commits · member since 2024                                                             | `/users/{login}`, `/repos`               |
| Repo cards (3)  | name, description, primary language, commits, stars, forks, last push                                              | `/repos` + `/commits` `Link: rel="last"` |
| Language bar    | Byte-weighted mix across the three repos: Python, TypeScript, XSLT, Makefile, PLpgSQL, CSS, JavaScript, PowerShell | `/languages` per repo                    |
| Commit bars     | 6 / 4 / 3                                                                                                          | `/commits` count                         |
| Push timeline   | 2026-08-01, 2026-10-17, 2026-11-15                                                                                 | `pushed_at`                              |

### 10.2 What is deliberately absent

- **No contribution heatmap.** GitHub does not expose the contribution calendar unauthenticated, and a generated one would be fabricated. The section says so in one mono line rather than leaving a mysterious hole.
- **No stars or follower counts as a headline.** They are 0. Showing them as a trophy would be absurd; showing them as a shortfall would be self-pitying. They appear in the repo card meta, where they are simply facts.
- **No "years of experience" counter.** The first commit is 2026; the CV's first role is 2025. Any "X years" figure would be arithmetic on the wrong data.
- **No live fetch at runtime.** No token, no rate limit, no empty state caused by a network blip. The snapshot is a committed file with an `asOf` date rendered on the page. Refreshing it is a one-command script, run deliberately.

### 10.3 Framing

The honest read of this data is _"a small public footprint; the substantial work is in private repositories and in the four case studies above."_ That sentence goes in the section lede. It is more credible than three zero-star repos presented as open-source activity, and it points the reader back to the projects, which is where the evidence actually is.

### 10.4 Snapshot script

```
scripts/snapshot-github.mjs
```

Reads `GITHUB_TOKEN` from the environment if present (optional; unauthenticated works for three public repos), writes `data/github/snapshot.ts` with a generated header. Never runs during `build`. The token is never written to disk and never reaches the client.

---

## 11. Data visualisations

Six visualisations, five of which the brief names. Every one is CSS/SVG with no charting dependency.

| #   | Visual                         | Where                        | Data                                                                                    | Honesty rule                                                                                         |
| --- | ------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | Repository activity bars       | GitHub section               | 6/4/3 commits                                                                           | Axis starts at zero; no trend line through three points                                              |
| 2   | Language composition bar       | GitHub section               | Byte counts                                                                             | Percentages computed from bytes, labelled "by bytes of code"                                         |
| 3   | Technology category bars       | Skills explorer              | Count per category, stacked by evidence kind                                            | Bar length = number of entries, **not** proficiency; the caption says so                             |
| 4   | Professional + education spine | Timeline                     | 9 dated entries                                                                         | Only CV dates; no interpolated milestones                                                            |
| 5   | Architecture diagrams          | Project pages                | Documented components                                                                   | Caption: "Diagram of the documented architecture, drawn for this page — not a deployment screenshot" |
| 6   | Verified metric plates         | Project tiles + case studies | 475 tests · 32 tables · 70 FKs · 49 paths · 107 schemas · 5 dashboards · 6 sensor types | Each plate carries a `how measured` footnote                                                         |

**Architecture diagram status:**

- Smart Health Room — already has a real `system-architecture.png`; unchanged.
- Morocco Retail — needs one SVG drawn from the documented pipeline (Python → MinIO bronze/silver → Great Expectations → PostgreSQL → dbt → Airflow → Superset, with Prometheus/Grafana alongside). The five Superset screenshots stay as dashboards, not as architecture.
- AutoFlow — needs one SVG drawn from the documented stack (Next.js client → Express API → Prisma → PostgreSQL, Redis, Docker, OpenAPI contract). **`AutoFlow_Images/` concept art is not used for this and is never presented as a screenshot.**
- Rolex Experience — no architecture diagram; it is a front-end build and the gallery is the evidence.

---

## 12. Technology Marquee

A single horizontal band directly under the hero. It exists to answer "what is this person's surface area" in four seconds, before the reader has decided to scroll.

- **Content:** only `used-in-project` and `academic` technologies — roughly 30 names. A `familiar` technology does not scroll past as if it were shipped.
- **Motion:** one CSS `@keyframes` translate on a duplicated track. The duplicate is `aria-hidden`, so a screen reader hears each name once. Animation pauses on `:hover` and `:focus-within`; under `prefers-reduced-motion: reduce` the track is static and horizontally scrollable.
- **Performance:** `transform` only, `will-change: transform`, no JS, no layout thrash. Two copies of ~30 text nodes is a few kilobytes of DOM.
- **Edge fade:** CSS mask, so names do not collide with the frame rule.
- **Why no logos:** brand SVGs mean either a new icon dependency (Simple Icons, ~3,000 icons, tree-shaking required) or thirty hand-placed files with thirty licence notes. The catalogue's `icon` field is typed for monograms now and can hold verified local SVGs later without a schema change. Monograms also match the drafted-plate aesthetic better than a rainbow of brand marks.

---

## 13. AI Portfolio Assistant

### 13.1 The constraint that decides the design

There is no backend, no API key, and no deploy in Phase 7. A "real" assistant would need all three, plus rate limiting, cost control, and a privacy statement. Shipping a fake chat box that returns canned strings without saying so would be the single most dishonest element on the page.

### 13.2 The Phase 7 design: deterministic retrieval, labelled as such

- **Name:** "Portfolio Assistant" with a mono subtitle: _"Answers come from this page's own data. No language model is called."_
- **Mechanism:** `data/assistant/knowledge.ts` holds ~12 intents. Each has trigger terms, a composed answer built from the same records the page renders, and citation chips that scroll to a section or open a project.
- **Suggested questions** (always visible, so the reader never faces a blank prompt):
  - "What does Youssef work on?"
  - "Show me the data engineering work."
  - "What is his current role?"
  - "Which technologies has he actually shipped?"
  - "Is he available, and how do I reach him?"
  - "Give me the one-paragraph summary."
- **Matching:** normalised token overlap with a small stop-word list, highest score wins; below threshold, the assistant says it does not have an answer and offers the six suggestions. No invented fallback paragraph.
- **Citations are mandatory.** An answer without at least one link is not rendered — that is the guard against drift when the data changes.
- **No persistence.** The transcript lives in component state; nothing is stored, sent, or logged.

### 13.3 What it will not do

- It will not answer questions about salary, notice period, or anything not in `constants/profile.ts`.
- It will not paraphrase a metric. Metrics are printed from the data files.
- It will not claim to be an LLM, and the UI does not use a chat-bubble metaphor that implies one.

### 13.4 The upgrade path (Phase 8, not now)

If a real assistant is wanted later: a single server route with a provider key in the environment, per-IP rate limiting, a strict system prompt containing only the site's data, streaming disabled, and a visible "AI-generated" label. That is a separate project with its own security review; it is not smuggled into Phase 7.

---

## 14. Recruiter Contact Form

### 14.1 Design

Fields: **Name · Email · Company (optional) · Role or intent (select: CDI, pre-employment internship, other) · Message · Consent checkbox.**

- Validation with `zod` (already a dependency) in `contactSchema.ts`. Same schema drives inline errors and the mailto body.
- Errors are announced with `aria-describedby` and `aria-invalid`; the first invalid field receives focus on submit.
- Message capped at 2,000 characters with a live counter; no HTML is accepted or rendered.

### 14.2 Submission

`buildMailto.ts` composes a `mailto:` with the fields encoded into a structured body:

```
Subject: Portfolio enquiry — <role> — <name>
Body: name / email / company / intent / message
```

`window.location.href = mailto` opens the reader's mail client. The UI then shows a **fallback panel** with the composed text, a "Copy message" button, and the direct address — because a recruiter on a machine with no configured mail client must not hit a dead end.

### 14.3 What the UI must not say

It must not say "Message sent." Nothing was sent; the browser handed a string to the operating system. The success state says _"Your mail app should have opened with the message ready to send."_ If the reader's client did not open, the fallback is right there.

### 14.4 Why not a form service

Formspree, Web3Forms, and Resend all require an endpoint and either a key or an account, and all of them move personal data through a third party. That is a security and privacy decision, not a styling one. If a hosted form is wanted, it is Phase 8 with an explicit privacy note — and the `mailto` path stays as the fallback regardless.

---

## 15. Resume Center

The existing dialog stays exactly as it is (three documents, two-column grid, "Choose your resume"). Phase 7 adds a **section** at position 13 that surfaces the same three documents without requiring a click:

- Three cards in a row (stacked on mobile): **EN**, **FR 2026**, **LM**.
- Each card: code, language, one-line description, file size, "Open" and "Download" — both pointing at the single path defined in `resumeDocuments.ts`. No second copy of any filename.
- A mono note: _"The French edition is the current default. The 2025 French edition remains available at its original URL."_
- The `ResumeTrigger` component continues to work from the hero, the dock, and the contact section, opening the same dialog. One registry, two surfaces.

---

## 16. WhatsApp QR

- **Link:** the existing `SOCIAL_LINKS.whatsapp` (number derived from `PROFILE.phone`, prefilled message written from the sender's side). No new constant.
- **Asset:** `public/qr/whatsapp.svg`, generated once by `scripts/generate-whatsapp-qr.mjs` and committed. The page ships a static SVG — no runtime QR library, no canvas, no CLS.
- **Component:** a framed plate with the QR at ~160px, the number in mono, a caption ("Scan to open WhatsApp"), and a tappable "Open WhatsApp" button for phones (where scanning your own screen is impossible).
- **Security:** the QR encodes only `https://wa.me/<digits>?text=<message>`. No tracking parameters, no shortener, no redirect. The QR is regenerated only when the number or message changes, and the script's output is committed so the encoded payload is reviewable in the diff.

---

## 17. Premium Footer

Four columns plus a base bar:

| Column    | Content                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Identity  | Name, position, one-line statement, availability badge, local time                                                   |
| Navigate  | Home, Projects, Experience, Timeline, Contact (the five dock stations) + Skills, Gallery, Roadmap, Resume, Assistant |
| Documents | EN CV, FR 2026 CV, Motivation letter — with sizes                                                                    |
| Reach     | Email, phone, LinkedIn, GitHub, WhatsApp                                                                             |

Base bar: `© 2026 Youssef El Bajoury` · `Built with Next.js and TypeScript` · `Content verified 2026-11-16` · back-to-top.

The "content verified" date is not decoration: it is the same date as the GitHub snapshot and it tells a reader how fresh the numbers are. It must be updated whenever the snapshot is refreshed, from one constant (`CONTENT_VERIFIED_ON`), not typed in three places.

The dock stays mounted above the footer. The footer is the last section but not a dock destination.

---

## 18. Visual hierarchy and motion

### 18.1 Section indices

Mono indices `01`–`15` in `SectionKicker`, matching the order in 3.1. They are the reader's map of a long page and the cheapest possible way to make fifteen sections feel authored rather than stacked. The footer is unnumbered.

### 18.2 Rhythm

- **Tone alternation:** plain canvas (2, 6, 9, 14) between panelled sections, so the page breathes every second or third beat.
- **Rule weight:** a full `FrameRule` only at the top of a major movement (Hero, Experience, Timeline, Footer). The compact sections use a hairline.
- **Accent discipline:** one saturated action per composition. The explorer's selected chip, the form's submit, and the QR's open button are the only cyan objects in their sections.
- **Type:** section headings stay sans; every count, date, status, and coordinate stays mono. The two-voice rule from the Hero is not relaxed for the new sections.

### 18.3 Motion

- All reveals use the existing `buildRevealVariants` + `REVEAL_VIEWPORT`; no new easing curves.
- Stagger caps: 8 items maximum, 40ms apart. Fifteen sections with uncapped stagger is a page that finishes loading after the reader has left.
- The marquee is the only continuous animation; everything else settles.
- `prefers-reduced-motion: reduce` disables the marquee, the stagger, and the spine draw, and leaves every piece of information visible.

### 18.4 Density controls (the anti-overcrowding rules)

1. No section may show more than 12 primary objects at rest.
2. Anything beyond that is behind one disclosure (`aria-expanded`), never a "read more" that navigates away.
3. No two adjacent sections may both be full-height.
4. No section may restate another section's prose; it links.
5. Every section must be skimmable in under ten seconds at 1440×900.

---

## 19. Dependencies

| Dependency                 | Status                | Justification                                                         |
| -------------------------- | --------------------- | --------------------------------------------------------------------- |
| `qrcode` + `@types/qrcode` | **new devDependency** | Generates the committed WhatsApp SVG once. Not shipped to the client. |
| Chart library              | **not added**         | Six CSS/SVG visuals do not justify 60–200 kB                          |
| Date library               | **not added**         | Periods are display strings plus two integers                         |
| Icon library               | **existing only**     | Phosphor deep imports for the dock; Lucide already used elsewhere     |
| Form service               | **not added**         | `mailto` + clipboard                                                  |
| LLM SDK                    | **not added**         | No model calls in Phase 7                                             |
| `octokit`                  | **not added**         | One `fetch` in a script; three endpoints                              |

Bundle impact of Phase 7 should be **under 25 kB gzipped** of new client JS, almost all of it the explorer, gallery, and assistant state machines. If it exceeds that, the assistant or the gallery filter is doing too much.

---

## 20. Security, accessibility, performance

### 20.1 Security

- **No new secrets, no new environment variables.** `lib/env.ts` is unchanged.
- **No runtime third-party requests**, so the existing CSP surface does not widen.
- **External links** (GitHub deep links, LinkedIn, WhatsApp) use `rel="noopener noreferrer"`; `target="_blank"` only where leaving the site is intended and labelled.
- **Form:** no network call, no storage, no `dangerouslySetInnerHTML`. All interpolated values are plain strings; React escapes them. Input lengths are capped before composition.
- **Assistant:** no `eval`, no model, no user input persisted or reflected into HTML.
- **QR:** static asset, single encoded URL, no redirect.
- **Snapshot script:** reads an optional token from the environment, never writes it, never bundles it. Runs only when invoked.
- **Content validation script:** fails closed on a dangling id, so a broken reference cannot ship silently.

### 20.2 Accessibility

- Disclosure pattern for skills categories (`button` + `aria-expanded` + `aria-controls`), one open at a time, Escape closes.
- Timeline filter is a `radiogroup`, not three unlabelled links.
- Gallery filters are toggle buttons with `aria-pressed`; the result count is announced in a polite live region.
- Assistant transcript is a `log` region with `aria-live="polite"`; suggestions are real buttons.
- Form: visible labels, `aria-invalid`, `aria-describedby`, focus management on error, 44px minimum targets.
- Marquee: pauses on focus, static under reduced motion, duplicated track `aria-hidden`.
- Every new section keeps the existing skip link and heading order (one `h2` per section, `h3` for entries).

### 20.3 Performance

- The four heavy project images already dominate the page; Phase 7 adds no new raster image except the QR (SVG) and two architecture SVGs.
- Gallery card media reuses the already-imported static images; `next/image` with explicit sizes, `loading="lazy"` below the fold.
- The assistant and gallery are client islands; their data is imported as modules, not fetched.
- Target: no new long task over 50ms, CLS unchanged, Lighthouse not worse than the current baseline (which must be recorded before the first Phase 7 commit so "not worse" is measurable).

---

## 21. Decisions needed before implementation

Each item has a recommendation. Anything not approved is not built.

### 21.1 Branch and existing work — **blocking**

43 files from Phases 2 and 6 are uncommitted. Phase 7 cannot start on top of that: a 60-file diff is unreviewable, and a bug in the new work could not be attributed.

**Recommendation:** commit the Phase 2/6 work on `update/portfolio-profile-2026` as 3–4 conventional commits (profile/data, academic section + assets, resumes, docs), then cut `feature/portfolio-2.0` from it. No push either way.

### 21.2 Academic work leaves the homepage — **blocking**

`AcademicSection` retires as a section; its four exercises become gallery cards and its module becomes a timeline entry (3.4).

**Recommendation:** approve. It is the only way to honour both the 15-section list and the "don't present coursework as products" rule. The screenshots, summaries, highlights, and deep links are all preserved.

### 21.3 Publishing the IZIRY detail — **needs your judgement**

The CV already states the four IZIRY bullets (pricing/forecasting engine, R3 validation pipeline, Simulation Center, Ollama explanation layer). The site currently says "project specifics remain confidential".

**Recommendation:** publish the CV's own wording, with no client name, no data, and no metric. Rationale: the information is already in a downloadable PDF, so withholding it on the site only makes the timeline look thin. If any of those four bullets is under NDA, say so and the site keeps the current confidential line.

### 21.4 Learning Roadmap content — **blocking for section 9**

Ten candidate items are listed in 9.3, all marked `proposed`. None renders until approved.

**Recommendation:** approve 6 of them (two per the first three lanes) and leave the rest `proposed`. If you approve none, section 9 ships with the honest empty state and the page still has fifteen sections.

### 21.5 Assistant — **blocking for section 11**

**Recommendation:** deterministic retrieval over the site's own data, explicitly labelled "No language model is called" (13.2). A real LLM assistant is Phase 8, with a server route, a key, rate limiting, and a privacy note.

### 21.6 Contact form — **blocking for section 12**

**Recommendation:** validated form → `mailto:` with a copy fallback (14.2). No third-party form service, no endpoint, no key.

### 21.7 QR asset — **needs one devDependency**

**Recommendation:** `qrcode` as a devDependency, output committed to `public/qr/whatsapp.svg`, no runtime dependency (16). Alternative if you want zero new packages: I hand-author the SVG from a locally generated matrix and commit it, with the generator script left out.

### 21.8 Technology icons — **cosmetic, but decide once**

**Recommendation:** monograms in Phase 7, `icon` field ready for verified local SVGs later (12). No brand-logo dependency.

### 21.9 Dock composition — **needs confirmation**

**Recommendation:** Home · Projects · Experience · Timeline · Contact. About leaves the dock because it is now section 3 and one scroll away; Timeline enters because it is the deepest section on the page (3.3).

### 21.10 Architecture diagrams — **needs confirmation**

**Recommendation:** author two SVGs (AutoFlow, Morocco Retail) from the documented components, captioned as diagrams rather than screenshots (11). Smart Health Room keeps its existing real diagram. No diagram is drawn for Rolex or for the two engagements.

### 21.11 GitHub data — **needs confirmation**

**Recommendation:** committed static snapshot with a visible `asOf` date and a refresh script, no runtime fetch (10.2). The alternative — live fetch with a token — adds a secret, a rate limit, and a failure state for no gain on three repos.

---

## 22. Implementation sequence

Eleven steps. Each ends with `lint`, `typecheck`, and a production build; nothing is pushed. Steps 3–10 are independent enough to reorder, but the data layer (step 1) must land first.

| Step     | Work                                                                                                      | Files touched                                                                                                                                                    | Gate                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **7.0**  | Commit Phase 2/6 work; cut `feature/portfolio-2.0`; record a Lighthouse baseline and current page height  | none                                                                                                                                                             | Clean tree, baseline numbers written into this doc                              |
| **7.1**  | Data foundation: six types, four data files, gallery derivation, content validator, `CONTENT_VERIFIED_ON` | `types/*`, `data/technologies/*`, `data/timeline/*`, `data/github/*`, `data/roadmap/*`, `data/gallery/*`, `constants/content.ts`, `scripts/validate-content.mjs` | `npm run validate:content` passes; `tsc` passes                                 |
| **7.2**  | Marquee + Professional Introduction + Experience rewrite                                                  | marquee feature, `AboutPreview`, `content/about/about.ts`, `ExperienceSection`, `data/experience/experience.ts`                                                  | Home renders sections 1–5; education no longer duplicated                       |
| **7.3**  | Skills Explorer, retire `skills-architecture` and `data/skills`                                           | skills-explorer feature, deletions                                                                                                                               | 15 categories, one open at a time, keyboard-only pass                           |
| **7.4**  | Timeline                                                                                                  | timeline feature                                                                                                                                                 | 9 entries, real dates, filter works, reduced-motion pass                        |
| **7.5**  | GitHub Activity + snapshot script                                                                         | github-activity feature, `scripts/snapshot-github.mjs`, `data/github/snapshot.ts`                                                                                | Numbers match the API; `asOf` visible                                           |
| **7.6**  | Project Gallery + academic absorption                                                                     | gallery feature, deletions of `features/academic`, `app/projects/[slug]/page.tsx` architecture plate                                                             | 10 cards, 4 filters, 4 screenshots preserved, deep links verified 200           |
| **7.7**  | Learning Roadmap (only approved items)                                                                    | roadmap feature, `data/roadmap/roadmap.ts`                                                                                                                       | Approved items render; proposed items do not                                    |
| **7.8**  | Assistant                                                                                                 | assistant feature, `data/assistant/knowledge.ts`                                                                                                                 | Every answer has a citation; no-match path honest                               |
| **7.9**  | Contact form + WhatsApp + Resume Center section                                                           | contact-form feature, whatsapp feature, resume-center additions, QR asset + script                                                                               | `mailto` composition correct; QR decodes to the wa.me URL; three PDFs still 200 |
| **7.10** | Premium Footer, dock, page composition, metadata                                                          | `Footer.tsx`, `navigationItems.ts`, `app/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`                                                       | Indices 01–15 in order; dock 5 stations; sitemap lists 5 URLs                   |
| **7.11** | QA sweep                                                                                                  | none                                                                                                                                                             | Section 24 checklist fully green                                                |

**Commit policy:** one conventional commit per step (`feat(phase7): …`, `refactor(phase7): …`, `chore(phase7): …`), no `--no-verify`, no reformatting of untouched files. Husky and lint-staged already enforce this.

**Rollback:** the branch is disposable until approved. `main` is never touched.

---

## 23. Exact file modification list

### 23.1 New — types (6)

| File                  | Contents                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `types/technology.ts` | `TechnologyCategory`, `TechnologyStatus`, `Technology`                                          |
| `types/timeline.ts`   | `TimelineKind`, `TimelineEntry`                                                                 |
| `types/roadmap.ts`    | `RoadmapStatus`, `RoadmapLane`, `RoadmapItem`                                                   |
| `types/github.ts`     | `GitHubRepoSnapshot`, `GitHubSnapshot`                                                          |
| `types/gallery.ts`    | `GalleryCategory`, `GalleryRecord` (a discriminated union over project / academic / engagement) |
| `types/assistant.ts`  | `AssistantIntent`, `AssistantAnswer`, `AssistantCitation`                                       |

### 23.2 New — data and constants (8)

| File                              | Contents                                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `data/technologies/categories.ts` | The 15 categories in render order, each with label, one-line description, and display order                             |
| `data/technologies/catalogue.ts`  | ~110 `Technology` records from the CV + project files, with the status rule from 6.2                                    |
| `data/timeline/timeline.ts`       | 9 `TimelineEntry` records, real CV dates (8.2)                                                                          |
| `data/roadmap/roadmap.ts`         | 6 lanes + 10 `proposed` items, none approved by default (9.3)                                                           |
| `data/github/snapshot.ts`         | The 2026-11-16 snapshot, generated by the script and committed                                                          |
| `data/assistant/knowledge.ts`     | ~12 intents with composed answers and mandatory citations                                                               |
| `data/gallery/gallery.ts`         | Derives the 10 gallery records from `projects.ts` + `academic.ts`; adds the two engagement records; no duplicated prose |
| `constants/content.ts`            | `CONTENT_VERIFIED_ON = "2026-11-16"`, used by the footer and the GitHub section                                         |

### 23.3 New — features (44)

| Folder                                  | Files                                                                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/marketing/tech-marquee`       | `index.ts`, `TechnologyMarquee.tsx`, `marqueeMotion.ts`                                                                                                 |
| `features/credibility/skills-explorer`  | `index.ts`, `SkillsExplorer.tsx`, `components/CategoryRow.tsx`, `components/TechnologyDetail.tsx`, `components/StatusFilter.tsx`, `useSkillExplorer.ts` |
| `features/credibility/github-activity`  | `index.ts`, `GitHubActivity.tsx`, `components/RepoCard.tsx`, `components/LanguageBar.tsx`, `components/CommitBars.tsx`                                  |
| `features/credibility/timeline`         | `index.ts`, `TimelineSection.tsx`, `components/TimelineTrack.tsx`, `components/TimelineEntry.tsx`, `timelineMotion.ts`                                  |
| `features/credibility/learning-roadmap` | `index.ts`, `LearningRoadmap.tsx`, `components/RoadmapLane.tsx`, `components/RoadmapItem.tsx`                                                           |
| `features/showcase/project-gallery`     | `index.ts`, `ProjectGallery.tsx`, `components/GalleryCard.tsx`, `components/GalleryFilters.tsx`, `components/CourseworkNote.tsx`, `useGalleryFilter.ts` |
| `features/conversion/assistant`         | `index.ts`, `PortfolioAssistant.tsx`, `components/Transcript.tsx`, `components/SuggestionChips.tsx`, `useAssistant.ts`                                  |
| `features/conversion/contact-form`      | `index.ts`, `RecruiterContactForm.tsx`, `components/FormField.tsx`, `components/SendFallback.tsx`, `contactSchema.ts`, `buildMailto.ts`                 |
| `features/conversion/whatsapp`          | `index.ts`, `WhatsAppPanel.tsx`                                                                                                                         |
| `features/credibility/resume-center`    | `ResumeCenterSection.tsx`, `components/ResumeSectionCard.tsx`                                                                                           |

### 23.4 New — app, scripts, assets, docs (10)

| File                                                           | Purpose                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `app/sitemap.ts`                                               | `/`, plus the four `/projects/[slug]` URLs, with `lastModified` from `CONTENT_VERIFIED_ON` |
| `app/robots.ts`                                                | Allow all, sitemap URL from `env.NEXT_PUBLIC_SITE_URL`                                     |
| `app/not-found.tsx`                                            | On-brand 404, links to `/` and `/projects`                                                 |
| `scripts/validate-content.mjs`                                 | Cross-reference validation (5.6)                                                           |
| `scripts/snapshot-github.mjs`                                  | Regenerates `data/github/snapshot.ts`                                                      |
| `scripts/generate-whatsapp-qr.mjs`                             | Emits `public/qr/whatsapp.svg`                                                             |
| `public/qr/whatsapp.svg`                                       | Committed QR asset                                                                         |
| `public/projects/autoflow/architecture.svg`                    | Documented-architecture diagram (11)                                                       |
| `public/projects/morocco-retail-intelligence/architecture.svg` | Documented-architecture diagram (11)                                                       |
| `components/shared/LocalTimeBadge.tsx`                         | Moved from `contact-hub`; footer keeps local time                                          |

### 23.5 Modified (13)

| File                                                   | Change                                                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                                         | Replace 8-section composition with the 15 sections in 3.1                                                            |
| `app/layout.tsx`                                       | Metadata refresh (title/description unchanged in substance), footer stays in layout                                  |
| `app/projects/[slug]/page.tsx`                         | Architecture plate + metric provenance footnotes + explicit `notFound()` guard                                       |
| `components/layout/Footer.tsx`                         | Four-column premium footer (17)                                                                                      |
| `components/layout/navigation-dock/navigationItems.ts` | `timeline` replaces `about`; comment updated to record the decision                                                  |
| `data/experience/experience.ts`                        | CV-derived IZIRY/CFIT highlights; education entries gain `endYear`/`startYear` and programme detail for the timeline |
| `data/projects/projects.ts`                            | Add `architecture` reference for AutoFlow and Morocco Retail; no other change                                        |
| `types/project.ts`                                     | Add optional `architecture?: { src, alt, caption }`                                                                  |
| `features/experience/ExperienceSection.tsx`            | Drop the education column (now section 8), render highlights, add a cross-link to the timeline                       |
| `features/marketing/about/AboutPreview.tsx`            | Rewritten as the Professional Introduction (3 paragraphs + 6 disciplines)                                            |
| `content/about/about.ts`                               | New copy, same facts                                                                                                 |
| `features/credibility/resume-center/index.ts`          | Export `ResumeCenterSection`                                                                                         |
| `package.json`                                         | Scripts `validate:content`, `snapshot:github`, `qr:whatsapp`; devDeps `qrcode`, `@types/qrcode`                      |

`README.md` gets a short section map and the three new scripts — optional, but the repo currently has a 196-byte README and Phase 7 triples the number of commands.

### 23.6 Deleted (9)

| File                                                                    | Reason                                             |
| ----------------------------------------------------------------------- | -------------------------------------------------- |
| `features/academic/AcademicSection.tsx`                                 | Absorbed into gallery + timeline (3.4)             |
| `features/academic/index.ts`                                            | Same                                               |
| `features/credibility/skills-architecture/components/SkillsPreview.tsx` | Replaced by the explorer                           |
| `features/credibility/skills-architecture/index.ts`                     | Same                                               |
| `data/skills/skills.ts`                                                 | Replaced by `data/technologies/catalogue.ts`       |
| `types/skill.ts`                                                        | Replaced by `types/technology.ts`                  |
| `features/conversion/contact-hub/components/ContactPreview.tsx`         | Replaced by `RecruiterContactForm`                 |
| `features/conversion/contact-hub/components/LocationPanel.tsx`          | Content folded into the footer                     |
| `features/conversion/contact-hub/index.ts`                              | Folder retired (except the moved `LocalTimeBadge`) |

**Net diff:** 68 new paths (one of which is a move), 13 modified, 9 deleted, plus this plan document. Large but proportionate: nine of the fifteen sections do not exist today.

---

## 24. Verification checklist

### Build and types

- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run typecheck` — clean
- [ ] `npm run build` — clean, all 5 routes prerendered
- [ ] `npm run validate:content` — clean
- [ ] No unused exports left behind by the 9 deletions

### Content honesty

- [ ] Every `used-in-project` technology resolves to a project that names it
- [ ] No percentage, bar, or "advanced/intermediate" label anywhere
- [ ] No metric without a provenance footnote
- [ ] No contribution heatmap, no fabricated commit count, no invented star count
- [ ] Academic cards carry the coursework badge and the module note
- [ ] Engagement cards carry no screenshots and no metrics
- [ ] `AutoFlow_Images/` appears nowhere in `app/` or `features/`
- [ ] Roadmap renders only `approved` items
- [ ] Assistant labels itself as non-generative and cites every answer

### Routes and links

- [ ] `/`, `/projects/autoflow`, `/projects/smart-health-room`, `/projects/morocco-retail-intelligence`, `/projects/rolex-experience` → 200
- [ ] `/sitemap.xml` and `/robots.txt` → 200 and correct contents
- [ ] Unknown project slug → 404 page
- [ ] All four résumé PDFs → 200
- [ ] All four academic screenshots → 200
- [ ] All three GitHub deep links → 200
- [ ] `wa.me` link and QR payload identical

### Navigation

- [ ] Dock has exactly 5 stations; every id exists on the page
- [ ] Scroll spy activates each station in order, including `timeline`
- [ ] Section indices render 01–15 in the specified order
- [ ] Every footer link resolves to a real section or file

### Accessibility

- [ ] Keyboard-only pass: dock, explorer, timeline filter, gallery filter, assistant, form, QR
- [ ] `aria-expanded` / `aria-controls` correct on every disclosure
- [ ] Live regions announce gallery result count and assistant answers
- [ ] Form errors are announced and focus moves to the first invalid field
- [ ] Reduced-motion pass: marquee static, no stagger, all content visible
- [ ] Contrast unchanged from the current palette

### Visual regression

- [ ] No horizontal overflow at 360 / 390 / 768 / 1000 / 1440 px
- [ ] Rolex section pixel-identical to today
- [ ] Existing screenshots unchanged
- [ ] No section exceeds its height budget in 3.1 by more than 25%
- [ ] Page height stays under ~1.6× the current page despite 15 sections

### Performance and security

- [ ] New client JS under 25 kB gzipped
- [ ] Lighthouse not worse than the 7.0 baseline
- [ ] No new environment variable, no secret in the bundle
- [ ] No `dangerouslySetInnerHTML`, no runtime third-party request
- [ ] External links carry `rel="noopener noreferrer"`

---

## 25. Summary of what changes in one paragraph

The site keeps its identity and its four case studies, and gains a data layer: a fifteen-category technology catalogue with evidence-linked statuses, a nine-entry timeline built from the CV's real dates, a GitHub section that shows three repositories and thirteen commits honestly, a gallery that absorbs the academic work instead of promoting it, and a roadmap that stays invisible until its items are real. The homepage is reordered so the roles come before the projects, the skills list becomes drillable instead of flat, and the closing movement splits into writing, taking a document, or sending a WhatsApp. Nothing is invented, nothing is deployed, and nothing is pushed to `main` without approval.

**Awaiting:** approval on 21.1–21.11, or a list of changes to this plan. No implementation starts before that.
