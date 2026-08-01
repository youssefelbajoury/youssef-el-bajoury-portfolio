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
import type { ShowcaseProject } from "@/types/project";

import { ROLEX_EXPERIENCE_CASE_STUDY, SMART_HEALTH_ROOM_CASE_STUDY } from "./case-studies";

/*
  ─────────────────────────────────────────────────────────────────────────────
  TODO(youssef) — CONFIRM BEFORE THIS SHIPS PUBLICLY
  ─────────────────────────────────────────────────────────────────────────────
  Two fields below are the author's to verify, and were deliberately written
  conservatively rather than guessed at (MASTER_SPECIFICATION.md, "Writing
  Guidelines": no fake metrics, no unverifiable statements):

  1. `technologies` — these are capability- and discipline-level pills derived
     only from what is visibly evidenced in the project's own screenshots.
     Framework names (React / Next.js / Node / MongoDB / Flutter / …) were NOT
     invented. Replace these arrays with the real stack once confirmed.

  2. `year` — inferred ordering only (Smart Health Room is the newer build).
     Correct the values if they are wrong.

  3. `repoUrl` / `liveUrl` — intentionally absent. Both actions render disabled
     and clearly labelled until real URLs are added here.

  4. `caseStudy` — the written sections (architecture, challenges, solutions,
     lessons) live in ./case-studies.ts and ship empty for the same reason.
     That file is prose only; the viewer renders each section the moment it has
     an entry.
  ─────────────────────────────────────────────────────────────────────────────
*/

const SMART_HEALTH_ROOM: ShowcaseProject = {
  id: "smart-health-room",
  slug: "smart-health-room",
  title: "Smart Health Room",
  discipline: "Connected Healthcare Platform",
  description:
    "A connected room that reads its own environment and acts on it. Sensors stream temperature, humidity, and air quality from an ESP32 and Arduino control layer into a web platform, a mobile companion, and a real-time dashboard — with an assistant layer that turns raw readings into health and sleep guidance.",
  year: "2026",
  context: "Academic Project",
  accent: {
    base: "#2ee6ff",
    bright: "#8ef3ff",
    rgb: "46 230 255",
  },
  features: [
    { label: "IoT", icon: "iot" },
    { label: "Artificial Intelligence", icon: "ai" },
    { label: "Web Platform", icon: "web" },
    { label: "Mobile Application", icon: "mobile" },
    { label: "Backend", icon: "backend" },
    { label: "Real-time Dashboard", icon: "dashboard" },
  ],
  technologies: [
    "ESP32",
    "Arduino",
    "Sensor Network",
    "Real-time Telemetry",
    "Web Platform",
    "Mobile App",
    "AI Assistant",
    "Analytics Dashboard",
  ],
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

const ROLEX_EXPERIENCE: ShowcaseProject = {
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
 * Ordered newest-first. The showcase renders each project through its own
 * bespoke composition, so this array is the source of truth for content and
 * ordering — not for layout.
 */
export const SHOWCASE_PROJECTS = [SMART_HEALTH_ROOM, ROLEX_EXPERIENCE] as const;

export { ROLEX_EXPERIENCE, SMART_HEALTH_ROOM };
