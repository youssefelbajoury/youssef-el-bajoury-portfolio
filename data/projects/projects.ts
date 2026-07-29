import allModelsShot from "@/public/projects/rolex-experience/all-models.png";
import collectionHomeShot from "@/public/projects/rolex-experience/collection-home.png";
import productDetailShot from "@/public/projects/rolex-experience/product-detail.png";
import logoShot from "@/public/projects/smart-health-room/logo.png";
import roomOverviewShot from "@/public/projects/smart-health-room/room-overview.png";
import systemArchitectureShot from "@/public/projects/smart-health-room/system-architecture.png";
import type { ShowcaseProject } from "@/types/project";

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

  3. `repoUrl` — intentionally absent. The GitHub action renders disabled and
     clearly labelled until a real public repository URL is added here.
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
  logo: {
    src: logoShot,
    alt: "Smart Health Room logo",
  },
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
};

/**
 * Ordered newest-first. The showcase renders each project through its own
 * bespoke composition, so this array is the source of truth for content and
 * ordering — not for layout.
 */
export const SHOWCASE_PROJECTS = [SMART_HEALTH_ROOM, ROLEX_EXPERIENCE] as const;

export { ROLEX_EXPERIENCE, SMART_HEALTH_ROOM };
