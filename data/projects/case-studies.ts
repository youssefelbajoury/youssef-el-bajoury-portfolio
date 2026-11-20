import type { ProjectCaseStudy } from "@/types/project";

/*
  ─────────────────────────────────────────────────────────────────────────────
  AUTHORING — the written half of each case study
  ─────────────────────────────────────────────────────────────────────────────
  This file is prose and nothing else. It is separate from projects.ts because
  everything there is structural (ids, slugs, screenshots, accents) while
  everything here is a first-person claim about how a project was built.

  THE RULE HAS NOT CHANGED: a challenge, a solution and a lesson are statements
  about what their author actually did and actually learned, and they are only
  written when there is a source for them. Architecture and results are
  different — they can be read off the system itself: a schema, a contract, a
  test run, a dashboard count. Those are filled below for the three projects
  whose evidence exists in the repository. Challenges, solutions and lessons
  stay empty until there is a real narrative to put there, and the viewer names
  them as reserved rather than inventing them.

  `results` is still the field to be most careful with. It is the one a
  portfolio is most tempted to fill with numbers nobody measured ("40% faster",
  "10k users"), and an unevidenced figure there is worse than an empty section:
  a reader who finds one invented number has no way to trust the other nine.

  Every entry below is one idea, because these render as a list rather than as
  paragraphs.
  ─────────────────────────────────────────────────────────────────────────────
*/

export const SMART_HEALTH_ROOM_CASE_STUDY: ProjectCaseStudy = {
  architecture: [
    {
      name: "Sensing",
      detail:
        "ESP32 and Arduino nodes read temperature, humidity, pressure, presence, light, and gas, and expose RFID access at the room boundary.",
    },
    {
      name: "Transport",
      detail:
        "Node.js and Express.js services receive the telemetry and persist it in MongoDB for history and alerting.",
    },
    {
      name: "Interface",
      detail:
        "A Next.js and React web platform and a Flutter mobile companion render live readings, history, alerts, and remote device control.",
    },
    {
      name: "Assist",
      detail:
        "An assistant layer turns the room's own readings into health and sleep guidance rather than generic advice.",
    },
  ],
  challenges: [],
  solutions: [],
  results: [
    "Real-time monitoring of temperature, humidity, pressure, presence, light, and gas.",
    "RFID-based room access control at the door.",
    "Historical readings, threshold alerts, and remote device control across web and mobile.",
    "One backend serving a web platform, a Flutter companion, and an analytics dashboard.",
  ],
  lessons: [],
};

export const AUTOFLOW_CASE_STUDY: ProjectCaseStudy = {
  architecture: [
    {
      name: "Packages",
      detail: "A TypeScript monorepo with four buildable packages sharing one contract.",
    },
    {
      name: "Data",
      detail:
        "PostgreSQL modelled through Prisma: 32 tables, 28 enums, 66 indexes, 20 unique constraints, and 70 foreign keys.",
    },
    {
      name: "Contract",
      detail: "An OpenAPI description covering 49 paths and 107 schemas.",
    },
    {
      name: "Runtime",
      detail: "Node.js and Express.js services with Redis, containerised with Docker.",
    },
  ],
  challenges: [],
  solutions: [],
  results: [
    "4/4 packages build successfully.",
    "461 unit tests pass across the API package; the integration suite requires a live PostgreSQL.",
    "49 OpenAPI paths and 107 schemas describe the API surface.",
    "32 PostgreSQL tables held together by 70 foreign keys and 66 indexes.",
  ],
  lessons: [],
};

export const MOROCCO_RETAIL_CASE_STUDY: ProjectCaseStudy = {
  architecture: [
    {
      name: "Ingestion",
      detail:
        "Python 3.12 ingestion lands external and synthetic source data in MinIO as RAW and BRONZE Parquet.",
    },
    {
      name: "Quality",
      detail:
        "Great Expectations gates the data before it is allowed into Silver in PostgreSQL 16.",
    },
    {
      name: "Transformation",
      detail: "dbt builds staging, intermediate, and mart models, plus an SCD Type 2 snapshot.",
    },
    {
      name: "Warehouse",
      detail: "A Kimball star schema of 7 dimensions and 3 fact tables.",
    },
    {
      name: "Orchestration",
      detail: "Apache Airflow schedules the pipeline end to end.",
    },
    {
      name: "Serving",
      detail:
        "Apache Superset exposes 5 dashboards and 42 charts through a read-only database role.",
    },
    {
      name: "Observability",
      detail: "Prometheus and Grafana monitor the platform; Docker Compose runs the stack.",
    },
  ],
  challenges: [],
  solutions: [],
  results: [
    "7 dimensions and 3 fact tables in the warehouse.",
    "5 Superset dashboards carrying 42 charts.",
    "140 dbt tests.",
    "504 tests passed, 3 skipped.",
    "An 8-job CI workflow is configured, though it has not yet run remotely.",
    "All data is synthetic, and benchmarks are development-machine figures rather than production SLAs.",
  ],
  lessons: [],
};

export const ROLEX_EXPERIENCE_CASE_STUDY: ProjectCaseStudy = {
  architecture: [],
  challenges: [],
  solutions: [],
  results: [],
  lessons: [],
};
