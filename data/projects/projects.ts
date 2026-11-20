import autoflowFleetConceptual from "@/public/projects/autoflow/01-fleet-management-conceptual-ui.png";
import autoflowFullStackConceptual from "@/public/projects/autoflow/02-full-stack-dashboard-conceptual-ui.png";
import autoflowAiConceptual from "@/public/projects/autoflow/03-ai-dashboard-conceptual-ui.png";
import autoflowDeveloperConceptual from "@/public/projects/autoflow/04-developer-portfolio-conceptual-ui.png";
import autoflowDeveloperDashboardConceptual from "@/public/projects/autoflow/05-developer-dashboard-conceptual-ui.png";
import moroccoRetailSales from "@/public/projects/morocco-retail-intelligence/01-sales-performance.png";
import moroccoRetailExecutive from "@/public/projects/morocco-retail-intelligence/02-executive-overview.png";
import moroccoRetailInventory from "@/public/projects/morocco-retail-intelligence/03-inventory-health.png";
import moroccoRetailProcurement from "@/public/projects/morocco-retail-intelligence/04-procurement.png";
import moroccoRetailPlatform from "@/public/projects/morocco-retail-intelligence/05-platform-health.png";
import allModelsShot from "@/public/projects/rolex-experience/all-models.png";
import collectionHomeShot from "@/public/projects/rolex-experience/collection-home.png";
import rolexGalleryAllModels from "@/public/projects/rolex-experience/gallery/all-models.png";
import rolexGalleryByTheme from "@/public/projects/rolex-experience/gallery/by-theme.png";
import rolexGalleryHome from "@/public/projects/rolex-experience/gallery/home.png";
import rolexGalleryLogin from "@/public/projects/rolex-experience/gallery/login.png";
import rolexGalleryProductClassic from "@/public/projects/rolex-experience/gallery/product-classic.png";
import rolexGalleryProductDetail from "@/public/projects/rolex-experience/gallery/product-detail.png";
import rolexGalleryProductPage from "@/public/projects/rolex-experience/gallery/product-page.png";
import rolexGalleryProductPro from "@/public/projects/rolex-experience/gallery/product-professional.png";
import productDetailShot from "@/public/projects/rolex-experience/product-detail.png";
import shrGalleryAdminUsers from "@/public/projects/smart-health-room/gallery/admin-users.png";
import shrGalleryAiAssistant from "@/public/projects/smart-health-room/gallery/ai-assistant.png";
import shrGalleryAlerts from "@/public/projects/smart-health-room/gallery/alerts.png";
import shrGalleryAnalytics from "@/public/projects/smart-health-room/gallery/analytics.png";
import shrGalleryRemoteControl from "@/public/projects/smart-health-room/gallery/remote-control.png";
import shrGalleryRoomMap from "@/public/projects/smart-health-room/gallery/room-map.png";
import shrGallerySensors from "@/public/projects/smart-health-room/gallery/sensors.png";
import shrGalleryTelemetryCard from "@/public/projects/smart-health-room/gallery/telemetry-card.png";
import shrGalleryUserDashboard from "@/public/projects/smart-health-room/gallery/user-dashboard.png";
import logoShot from "@/public/projects/smart-health-room/logo.png";
import roomOverviewShot from "@/public/projects/smart-health-room/room-overview.png";
import systemArchitectureShot from "@/public/projects/smart-health-room/system-architecture.png";
import type { ScreenshotProject, ShowcaseProject, SystemShowcaseProject } from "@/types/project";

import {
  AUTOFLOW_CASE_STUDY,
  MOROCCO_RETAIL_CASE_STUDY,
  ROLEX_EXPERIENCE_CASE_STUDY,
  SMART_HEALTH_ROOM_CASE_STUDY,
} from "./case-studies";

/*
  ─────────────────────────────────────────────────────────────────────────────
  PROJECT SOURCE DATA
  ─────────────────────────────────────────────────────────────────────────────
  Structural only: ids, slugs, screenshots, accents, metrics, and the written
  half imported from ./case-studies.ts.

  PROVENANCE. Every technology, capability and metric below is taken from the
  project it describes — the Smart Health Room stack, the AutoFlow schema and
  test run, and the Morocco Retail platform's own documentation. Nothing is
  inferred from a screenshot alone.

  LINKS. `repoUrl` is set only where a verified public repository exists —
  Morocco Retail, Smart Health Room and Rolex. AutoFlow has no supplied
  repository, so its action renders disabled and clearly labelled rather than
  pointing at nothing. `liveUrl` is absent throughout: none of these is deployed
  at a public address.

  STILL ABSENT, ON PURPOSE:
  Challenges, solutions and lessons — they live in ./case-studies.ts and ship
  empty where no verified narrative exists.
  ─────────────────────────────────────────────────────────────────────────────
*/

const AUTOFLOW: SystemShowcaseProject = {
  id: "autoflow",
  slug: "autoflow",
  title: "AutoFlow",
  discipline: "Full Stack Platform",
  description:
    "A TypeScript monorepo built as a production-shaped platform: four packages over one PostgreSQL schema, an OpenAPI contract, Redis, and a Dockerised runtime. The engineering is the argument — 32 tables, 70 foreign keys, and 461 unit tests holding the whole thing together.",
  year: "2026",
  context: "Conceptual / In development",
  accent: {
    base: "#34d399",
    bright: "#6ee7b7",
    rgb: "52 211 153",
  },
  features: [
    { label: "PostgreSQL Schema", icon: "database" },
    { label: "Prisma ORM", icon: "data" },
    { label: "OpenAPI Contract", icon: "api" },
    { label: "Express API", icon: "backend" },
    { label: "Redis", icon: "storage" },
    { label: "Automated Tests", icon: "testing" },
    { label: "Docker", icon: "container" },
    { label: "TypeScript Monorepo", icon: "orchestration" },
  ],
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Prisma",
    "Redis",
    "Docker",
    "OpenAPI",
  ],
  metrics: [
    { value: "32", label: "Tables" },
    { value: "70", label: "Foreign keys" },
    { value: "49", label: "API paths" },
    { value: "107", label: "Schemas" },
    { value: "461", label: "Tests passing" },
    { value: "4/4", label: "Packages built" },
  ],
  metricNote:
    "Counted from the project's schema and OpenAPI contract. The test figure is the API package's unit run; the integration suite needs a live PostgreSQL and is not included.",
  gallery: [
    {
      src: autoflowFleetConceptual,
      alt: "Conceptual UI — AutoFlow fleet management dashboard concept, still in development.",
      caption: "Conceptual UI · In development — Fleet management",
    },
    {
      src: autoflowFullStackConceptual,
      alt: "Conceptual UI — neon-blue full-stack dashboard concept for AutoFlow, still in development.",
      caption: "Conceptual UI · In development — Full-stack dashboard",
    },
    {
      src: autoflowAiConceptual,
      alt: "Conceptual UI — futuristic AI developer dashboard concept for AutoFlow, still in development.",
      caption: "Conceptual UI · In development — AI dashboard",
    },
    {
      src: autoflowDeveloperConceptual,
      alt: "Conceptual UI — neon-blue developer portfolio interface concept for AutoFlow, still in development.",
      caption: "Conceptual UI · In development — Developer interface",
    },
    {
      src: autoflowDeveloperDashboardConceptual,
      alt: "Conceptual UI — neon-blue developer dashboard concept for AutoFlow, still in development.",
      caption: "Conceptual UI · In development — Developer dashboard",
    },
  ],
  caseStudy: AUTOFLOW_CASE_STUDY,
};

const SMART_HEALTH_ROOM: ScreenshotProject = {
  id: "smart-health-room",
  slug: "smart-health-room",
  title: "Smart Health Room",
  discipline: "Connected Healthcare Platform",
  description:
    "A connected room that reads its own environment and acts on it. ESP32 and Arduino nodes stream temperature, humidity, pressure, presence, light, and gas into a Node.js backend, then out to a Next.js web platform, a Flutter companion, and a real-time dashboard — with an assistant layer that turns raw readings into health and sleep guidance.",
  year: "2025 – 2026",
  context: "Academic Project",
  accent: {
    base: "#2ee6ff",
    bright: "#8ef3ff",
    rgb: "46 230 255",
  },
  features: [
    { label: "Real-time Monitoring", icon: "realtime" },
    { label: "Temperature & Humidity", icon: "climate" },
    { label: "Air Pressure", icon: "sensor" },
    { label: "Presence Detection", icon: "presence" },
    { label: "Light Control", icon: "light" },
    { label: "Gas Detection", icon: "gas" },
    { label: "RFID Access", icon: "access" },
    { label: "Historical Data", icon: "history" },
    { label: "Alerts", icon: "alerts" },
    { label: "AI Assistant", icon: "ai" },
    { label: "Web Platform", icon: "web" },
    { label: "Mobile App", icon: "mobile" },
  ],
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Flutter",
    "ESP32",
    "Arduino",
    "Raspberry Pi",
  ],
  repoUrl: "https://github.com/youssefelbajoury/SMART-HEALTH-ROOM",
  shots: {
    hero: {
      src: roomOverviewShot,
      alt: "Smart Health Room overview — a sensor-instrumented room streaming temperature, humidity, and air-quality readings into health, sleep, and room-quality scores alongside a mobile assistant.",
    },
    secondary: {
      src: systemArchitectureShot,
      alt: "Smart Health Room system view — ESP32 and Arduino control hardware wired to the room, feeding a health analysis dashboard, a mobile app, and a tablet analytics view.",
    },
  },
  /*
    The walk through the product, screen by screen, in the order a reader should
    meet it: what the room measures, then what the resident sees, then what the
    operator does. Alt text describes the screen and nothing more — a screenshot
    caption is not the place to make a claim the picture does not show.
  */
  gallery: [
    {
      src: shrGalleryUserDashboard,
      alt: "Smart Health Room resident dashboard — live room readings alongside health and sleep scores.",
    },
    /* The telemetry cards follow the dashboard they sit on: the reader has just
       seen the whole surface, and this is the same data one step closer. Going
       the other way round shows a detail of something nobody has seen yet. */
    {
      src: shrGalleryTelemetryCard,
      alt: "Smart Health Room real-time telemetry — the dashboard's live sensor cards in close-up.",
    },
    {
      src: shrGalleryAnalytics,
      alt: "Smart Health Room analytics view — sensor readings plotted over time.",
    },
    {
      src: shrGalleryRoomMap,
      alt: "Smart Health Room room map — sensor and device positions laid out across the room.",
    },
    {
      src: shrGalleryAiAssistant,
      alt: "Smart Health Room assistant — guidance generated from the room's own readings.",
    },
    {
      src: shrGalleryAlerts,
      alt: "Smart Health Room alerts — threshold notifications raised from live telemetry.",
    },
    {
      src: shrGalleryRemoteControl,
      alt: "Smart Health Room remote control — the room's connected devices operated from the app.",
    },
    {
      src: shrGallerySensors,
      alt: "Smart Health Room public site — the sensor set the room is instrumented with.",
    },
    {
      src: shrGalleryAdminUsers,
      alt: "Smart Health Room administration — the user management table.",
    },
  ],
  logo: {
    src: logoShot,
    alt: "Smart Health Room logo",
  },
  caseStudy: SMART_HEALTH_ROOM_CASE_STUDY,
};

const MOROCCO_RETAIL: SystemShowcaseProject = {
  id: "morocco-retail-intelligence",
  slug: "morocco-retail-intelligence",
  title: "Morocco Retail Intelligence",
  discipline: "Data Engineering Platform",
  description:
    "An end-to-end retail data platform: Python ingestion into MinIO, Great Expectations quality gates, PostgreSQL and dbt transformation into a Kimball star schema, Airflow orchestration, and five Superset dashboards. Built as a Master II-BDCC portfolio project on entirely synthetic data.",
  year: "2026",
  context: "Data Engineering Project",
  accent: {
    base: "#818cf8",
    bright: "#a5b4fc",
    rgb: "129 140 248",
  },
  features: [
    { label: "Ingestion Pipeline", icon: "pipeline" },
    { label: "Data Quality Gates", icon: "quality" },
    { label: "Star Schema", icon: "data" },
    { label: "dbt Models", icon: "orchestration" },
    { label: "Airflow Scheduling", icon: "realtime" },
    { label: "Superset Dashboards", icon: "bi" },
    { label: "Object Storage", icon: "storage" },
    { label: "Observability", icon: "observability" },
  ],
  technologies: [
    "Python 3.12",
    "PostgreSQL 16",
    "dbt",
    "Apache Airflow",
    "Apache Superset",
    "MinIO",
    "Great Expectations",
    "Docker Compose",
    "Prometheus",
    "Grafana",
  ],
  repoUrl: "https://github.com/youssefelbajoury/morocco-retail-intelligence-data-platform",
  metrics: [
    { value: "7 + 3", label: "Dims + facts" },
    { value: "5", label: "Dashboards" },
    { value: "42", label: "Charts" },
    { value: "140", label: "dbt tests" },
    { value: "504", label: "Tests passed" },
    { value: "8", label: "CI jobs" },
  ],
  metricNote:
    "Measured on the development machine with synthetic data; CI is configured but not yet validated remotely.",
  /*
    The five dashboards, in the order the platform's own documentation presents
    them. These are captures of the live Superset instance, not mockups.
  */
  gallery: [
    {
      src: moroccoRetailSales,
      alt: "Morocco Retail Intelligence sales performance dashboard — nine charts with time-range, region, channel, and category filters.",
      caption: "Sales performance",
    },
    {
      src: moroccoRetailExecutive,
      alt: "Morocco Retail Intelligence executive overview dashboard — eight charts with time-range, region, and category filters.",
      caption: "Executive overview",
    },
    {
      src: moroccoRetailInventory,
      alt: "Morocco Retail Intelligence inventory health dashboard — eight charts with time-range, region, and stock-status filters.",
      caption: "Inventory health",
    },
    {
      src: moroccoRetailProcurement,
      alt: "Morocco Retail Intelligence procurement dashboard — eight charts with time-range, region, and category filters.",
      caption: "Procurement",
    },
    {
      src: moroccoRetailPlatform,
      alt: "Morocco Retail Intelligence platform health dashboard — nine charts with time-range and source filters.",
      caption: "Platform health",
    },
  ],
  caseStudy: MOROCCO_RETAIL_CASE_STUDY,
};

const ROLEX_EXPERIENCE: ScreenshotProject = {
  id: "rolex-experience",
  slug: "rolex-experience",
  title: "Rolex Experience",
  discipline: "Luxury Digital Experience",
  description:
    "An independent study in how luxury retail earns restraint on the web. The build reconstructs a full catalogue journey — collection landing, filterable model index, and configurable product pages — where typography, whitespace, and pacing carry the brand instead of ornament.",
  year: "2025",
  context: "Academic Project",
  accent: {
    base: "#c9a24c",
    bright: "#f0d894",
    rgb: "201 162 76",
  },
  features: [
    { label: "Model Catalogue", icon: "catalogue" },
    { label: "Category Filters", icon: "filters" },
    { label: "Product Pages", icon: "product" },
    { label: "Favourites", icon: "favourites" },
    { label: "Search", icon: "search" },
    { label: "Responsive Layout", icon: "responsive" },
  ],
  technologies: [
    "Front-End Engineering",
    "Design System",
    "Editorial Layout",
    "Responsive Design",
    "Micro-interactions",
    "Accessibility",
  ],
  repoUrl: "https://github.com/youssefelbajoury/RolexProject",
  shots: {
    hero: {
      src: collectionHomeShot,
      alt: "Rolex Experience collection landing page — an editorial hero introducing the collection above a category navigation row.",
    },
    secondary: {
      src: allModelsShot,
      alt: "Rolex Experience all-models index — a filterable grid of watch models with favourites and per-model detail links.",
    },
    tertiary: {
      src: productDetailShot,
      alt: "Rolex Experience product page — a single model presented with its reference details and a configure action.",
    },
  },
  /* The catalogue journey in the order a shopper walks it: landing, index,
     filtered index, then the product pages the index leads to. */
  gallery: [
    {
      src: rolexGalleryHome,
      alt: "Rolex Experience landing page — an editorial hero above the collection's category navigation.",
    },
    {
      src: rolexGalleryAllModels,
      alt: "Rolex Experience all-models index — the full catalogue as a filterable grid.",
    },
    {
      src: rolexGalleryByTheme,
      alt: "Rolex Experience index filtered by theme — the same catalogue narrowed to one category.",
    },
    {
      src: rolexGalleryProductPage,
      alt: "Rolex Experience product page — a single model with its reference details.",
    },
    {
      src: rolexGalleryProductDetail,
      alt: "Rolex Experience product detail — the model's specification laid out beneath the watch.",
    },
    {
      src: rolexGalleryProductClassic,
      alt: "Rolex Experience classic collection product page.",
    },
    {
      src: rolexGalleryProductPro,
      alt: "Rolex Experience professional collection product page.",
    },
    {
      src: rolexGalleryLogin,
      alt: "Rolex Experience sign-in page.",
    },
  ],
  caseStudy: ROLEX_EXPERIENCE_CASE_STUDY,
};

/**
 * Ordered deliberately rather than by date: the two systems lead, the two
 * screen-led projects follow, and Rolex closes the set. The showcase renders
 * each project through its own composition, so this array is the source of
 * truth for content and ordering — not for layout.
 */
export const SHOWCASE_PROJECTS: readonly ShowcaseProject[] = [
  AUTOFLOW,
  SMART_HEALTH_ROOM,
  MOROCCO_RETAIL,
  ROLEX_EXPERIENCE,
];

export { AUTOFLOW, MOROCCO_RETAIL, ROLEX_EXPERIENCE, SMART_HEALTH_ROOM };
