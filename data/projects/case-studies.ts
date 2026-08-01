import type { ProjectCaseStudy } from "@/types/project";

/*
  ─────────────────────────────────────────────────────────────────────────────
  AUTHORING — the written half of each case study
  ─────────────────────────────────────────────────────────────────────────────
  This file is prose and nothing else. It is separate from projects.ts because
  everything there is structural (ids, slugs, screenshots, accents) while
  everything here is a first-person claim about how a project was built.

  All four lists ship empty on purpose, and that is not an oversight.

  A challenge, a solution and a lesson are statements about what their author
  actually did and actually learned. There is no source for them anywhere in
  this repository — not in the screenshots, not in the descriptions, not in the
  skills data — so writing them here would mean inventing them, and invented
  reflection is indistinguishable from the real thing once it is on the page.
  The same rule already governs `technologies`, `year` and `repoUrl` in
  projects.ts (see the TODO at the top of that file) and the route at
  app/projects/[slug]/page.tsx, which states outright that the write-up is still
  being written rather than padding itself with sections.

  The viewer is finished and waiting. Each section appears the moment its list
  has an entry, in the order below, and an honest "in progress" note names the
  ones that are still empty until every list is filled.

  Fill them like this:

    architecture: [
      { name: "Sensing", detail: "…what runs at this tier, in one sentence." },
      { name: "Transport", detail: "…" },
    ],
    challenges: ["One problem per entry. What was hard, and why it was hard."],
    solutions:  ["What you did about it. Same order as the challenges reads best."],
    results:    ["What it produced. Only what can be evidenced — a shipped
                  surface, a measured number, a grade, a demo that ran."],
    lessons:    ["What you would do differently, or now know."],

  Keep entries to one idea each — they render as a list, not as paragraphs.

  `results` is the one to be most careful with. It is the field a portfolio is
  most tempted to fill with numbers nobody measured ("40% faster", "10k users"),
  and an unevidenced figure there is worse than an empty section: a reader who
  finds one invented number has no way to trust the other nine.
  ─────────────────────────────────────────────────────────────────────────────
*/

export const SMART_HEALTH_ROOM_CASE_STUDY: ProjectCaseStudy = {
  architecture: [],
  challenges: [],
  solutions: [],
  results: [],
  lessons: [],
};

export const ROLEX_EXPERIENCE_CASE_STUDY: ProjectCaseStudy = {
  architecture: [],
  challenges: [],
  solutions: [],
  results: [],
  lessons: [],
};
