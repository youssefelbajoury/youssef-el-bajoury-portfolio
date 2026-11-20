# Phase 8 — Premium Interactive Experience

**Status:** proposal. No existing file has been modified.
**Base:** the current Phase 6 site — 8 homepage sections, 4 case-study routes, no backend, no deploy.
**Scope:** a visual and interaction layer on the existing architecture. Not a re-architecture.

---

## 0. Relationship to the Phase 7 plan

`docs/PHASE_7_PLAN.md` proposed a 15-section reorder (skills explorer, GitHub activity, roadmap, assistant, contact form, resume center, 15-category catalogue). **It was never approved and nothing from it was implemented.**

Phase 8 asks for a different thing: six visual systems (hero, marquee, card-fan, parallax, timeline, gallery) plus a QR panel and a footer. Four of them overlap Phase 7's timeline, gallery, QR, and footer, so this plan reuses the _data modelling_ from Phase 7 where it fits, and drops everything Phase 8 does not ask for.

**Decision D1 (blocking):** Phase 8 supersedes Phase 7 as the active work. The 15-section reorder, skills explorer, GitHub activity, roadmap, assistant, contact form, and resume center are **not** built here. If you want them later they come back as a separate phase on top of this one.

---

## 1. What exists, and what it already does

This matters because three of the eight requests are partly implemented, and rebuilding them would be both wasteful and a regression.

| Requested                                | Current state                                                                                       | Phase 8 action                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Animated headline, text reveal, entrance | **Already built.** Per-line CSS entrance on a single expo-out curve, 950ms, `backwards` fill, no JS | Keep. Add only a mask-based line reveal; do not rebuild |
| Floating technology elements             | Absent                                                                                              | **New** `FloatingTechField`                             |
| Interactive background                   | Pointer-driven key light, trace field, scroll depth — already interactive                           | Extend with a cursor spotlight, same pointer smoothing  |
| Glow / gradient                          | Key light, grain, scrim, plate reflection                                                           | Keep; no new glow source                                |
| Animated CTA buttons                     | Magnetic primary, specular tracking, 2px arrow nudge                                                | Keep; change the labels and destinations                |
| Download CV                              | `ResumeTrigger` exists, third action on its own line                                                | Promote to secondary action                             |
| View Projects                            | Absent (primary currently goes to `#contact`)                                                       | **New** primary action                                  |
| Contact info in hero                     | Availability + coordinates only                                                                     | Add email / location / availability line                |
| Marquee                                  | Absent                                                                                              | **New** band                                            |
| Card-fan carousel                        | Absent                                                                                              | **New** inside the Skills section                       |
| Parallax                                 | Pointer parallax in the Hero; no scroll parallax                                                    | **New** scroll layer, Framer Motion only                |
| Scroll animations                        | `revealMotion.ts` shared by all sections                                                            | Keep; add presets additively                            |
| Timeline                                 | Education list inside Experience                                                                    | **New** section; education moves out of Experience      |
| Gallery                                  | 4 curated project tiles + 4 case-study routes                                                       | **New** archive section with lightbox                   |
| QR                                       | Absent                                                                                              | **New** local SVG + panel                               |
| Footer                                   | Name, socials, copyright, location                                                                  | Rebuild to the 8-column spec                            |

**Two things are explicitly preserved:**

- `public/portrait/youssef-el-bajoury.jpeg` — the real photograph. No generated portrait is introduced, and the existing one is not replaced.
- Every file in `public/projects/`, `public/academic/`, and `public/resume/`. Phase 8 adds assets; it deletes none.

---

## 2. Dependencies — the only two

| Package                    | Type              | Why                                                                                                                | Runtime cost                              |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `simple-icons`             | **devDependency** | Official brand SVG paths for 108 verified technologies. A script extracts the path data into a committed TS module | **Zero** — nothing ships from the package |
| `qrcode` + `@types/qrcode` | **devDependency** | Generates `public/qr/whatsapp.svg` locally. No phone number leaves the machine                                     | **Zero** — one committed SVG              |

**Explicitly not installed:**

- `gsap` — forbidden without authorization, and both 21st.dev references depend on it.
- `lenis` — forbidden, and it would be a second smooth-scroll controller.
- `embla-carousel`, `swiper`, `framer-motion-carousel` — a carousel library for one fan of twelve cards is 15–40 kB for a component we can express in transforms.
- Any icon CDN or runtime logo request — the marks are committed path data, so there are no broken images and no third-party request.

**New npm scripts:** `logos:generate`, `qr:generate`, `concept:optimize`.

---

## 3. Homepage after Phase 8

Twelve blocks. `BAND` means a thin strip, not a section.

|   # | Block              | Index | Status                  |
| --: | ------------------ | ----- | ----------------------- |
|   1 | Hero               | —     | enhanced                |
|   2 | Technology Marquee | —     | **new band**            |
|   3 | Featured Projects  | 01    | unchanged               |
|   4 | About              | 02    | unchanged               |
|   5 | Experience         | 03    | education block removed |
|   6 | Timeline           | 04    | **new**                 |
|   7 | Academic           | 05    | renumbered only         |
|   8 | Skills + card-fan  | 06    | carousel added          |
|   9 | Project Gallery    | 07    | **new**                 |
|  10 | Location           | 08    | renumbered only         |
|  11 | Contact            | 09    | renumbered only         |
|  12 | WhatsApp QR        | —     | **new band**            |
|   — | Footer             | —     | rebuilt                 |

**Why this order:** the existing narrative (proof → person → roles) is preserved. The marquee answers "what is the surface area" immediately after the hero. The timeline follows Experience because it is the same story with dates. The gallery sits after Skills because it is an archive, not an argument — the featured section has already made the argument. The QR band closes the contact movement without altering `ContactPreview`'s centred composition.

**Renumbering:** adding Timeline (04) and Gallery (07) shifts Academic 04→05, Skills 05→06, Location 06→08, Contact 07→09. Four one-line index props change; no layout changes.

---

## 4. Stage 8.0 — Preflight and asset generation

No visual change in this stage. This is the only stage that touches `package.json`.

### 4.1 Work

1. Record a baseline: `lint`, `typecheck`, `build`, page height at 1440, Lighthouse scores, current JS payload. Written into this document so "no regression" is measurable.
2. Install `simple-icons`, `qrcode`, `@types/qrcode` as devDependencies.
3. `scripts/generate-logo-marks.mjs` — imports only the slugs in the allow-list, emits `data/technologies/marks.ts`:

```ts
// GENERATED by scripts/generate-logo-marks.mjs — do not edit.
export const MARKS = {
  react: { title: "React", hex: "61DAFB", path: "M14.23 12.004..." },
  ...
} as const;
export type MarkSlug = keyof typeof MARKS;
```

The script **fails** if an allow-listed slug is missing from the package, so a logo can never silently render empty. 4. `scripts/generate-whatsapp-qr.mjs` — `QRCode.toString(SOCIAL_LINKS.whatsapp, { type: "svg", margin: 1, errorCorrectionLevel: "M" })` → `public/qr/whatsapp.svg`. The encoded URL is printed to stdout for review. 5. `scripts/optimize-concept-images.mjs` — copies the five `AutoFlow_Images/*.png` into `public/projects/autoflow/conceptual/`, downscales to 1600px wide and encodes WebP with `sharp` (already present as Next's image dependency). **Originals stay where they are.**

### 4.2 Files

**New:** `data/technologies/marks.ts` (generated), `scripts/generate-logo-marks.mjs`, `scripts/generate-whatsapp-qr.mjs`, `scripts/optimize-concept-images.mjs`, `public/qr/whatsapp.svg`, `public/projects/autoflow/conceptual/{fleet-dashboard,portfolio-overview,neon-dashboard,neon-hero,fullstack-dashboard}.webp`, `public/projects/autoflow/conceptual/README.md` (states they are AI-generated concept visuals, not screenshots).
**Modified:** `package.json`.

**Gate:** build passes, no page diff, `marks.ts` contains exactly the allow-list, QR decodes to `SOCIAL_LINKS.whatsapp`.

---

## 5. Stage 8.1 — Hero

The Hero is the most measured component in the repository: a 12-column composition with per-line optical corrections, a single light source, and a documented entrance score. **Nothing existing moves.** Every addition is a layer behind or beside the current grid.

### 5.1 Additions

**a. Floating technology marks** — `FloatingTechField.tsx`

- Four marks (TypeScript, PostgreSQL, Docker, ESP32), 18% opacity, 28–40px, placed in bands the composition already leaves empty (the same bands the trace field documents: above the headline, column 8, the far-left flank).
- Movement: ±6px pointer parallax (reusing `--hero-px/py`) plus a 9–14s CSS float. Transform only.
- `aria-hidden` — they are decorative duplicates of the marquee, so a screen reader hears each technology once.
- Hidden below `md` (the tablet composition has no empty band), static under reduced motion.

**b. Cursor spotlight** — `CursorSpotlight.tsx`

- A 520px radial gradient at 4% white, following the pointer with the existing `POINTER_SMOOTHING` (0.12/frame).
- Sits above the scrim, below the grain. Disabled on touch (`pointer: coarse`) and reduced motion.
- It is a _shift in illumination_, not a second light source: it never exceeds the key light's intensity, and it is the same white as the page's highlights.

**c. Headline mask reveal** — `heroMotion.ts` + `Hero.tsx` (line wrapper only)

- Current: each line rises 14px and fades. New: the same transform inside `overflow: hidden`, so the line appears to be uncovered rather than to slide. No per-word split — splitting would break the measured optical corrections in `HERO_HEADLINE_OPTICAL`.
- Duration unchanged (950ms), curve unchanged, `backwards` fill unchanged.

**d. Actions** — `HeroActions.tsx`

| Order     | Label                                      | Destination                                 | Treatment                                                      |
| --------- | ------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| Primary   | **View Projects**                          | `#projects`                                 | Saturated cyan, magnetic, specular — the only saturated object |
| Secondary | **Download CV**                            | `ResumeTrigger` (opens the existing dialog) | Glass, hairline, arrow                                         |
| Tertiary  | **Let's Work Together**                    | `#contact`                                  | Same glass recipe, one glyph different                         |
| Meta      | GitHub · email · Casablanca · availability | external / `mailto:` / text                 | Mono line under the actions                                    |

The GitHub control moves from a full button to a mono meta link, because Phase 8 requires two named buttons and three full-width controls in a column is a toolbar.

**e. Contact information** — `heroContent.ts`

One mono line: `youssefelbajoury321@gmail.com · Casablanca, Morocco · Open to full-time & internships`. All three values are read from `PROFILE`; nothing is retyped. The phone number stays off the hero (it is in the contact section and the QR).

### 5.2 Files

**New:** `features/marketing/hero/components/FloatingTechField.tsx`, `features/marketing/hero/components/CursorSpotlight.tsx`.
**Modified:** `features/marketing/hero/Hero.tsx`, `features/marketing/hero/components/HeroActions.tsx`, `features/marketing/hero/heroContent.ts`, `features/marketing/hero/heroMotion.ts`.

**Gate:** desktop composition pixel-identical except the new layers; tablet and mobile unchanged in layout; reduced-motion pass; headline still flush-left at 1440.

---

## 6. Stage 8.2 — Technology marquee

### 6.1 Content

28 technologies, every one verified from the CV or a project record. Ordered so adjacent marks read as a stack, not alphabetically:

```
TypeScript · React · Next.js · Node.js · Express · Python · Java · Spring Boot
PostgreSQL · MongoDB · Redis · Prisma · Docker · Kubernetes · Git · Linux
dbt · Apache Airflow · Apache Kafka · Apache Spark · Superset · MinIO
TensorFlow · PyTorch · scikit-learn · Flutter · ESP32 · Raspberry Pi
```

`data/technologies/showcase.ts` holds the curated order with `id`, `name`, `slug`, and optional `projectIds`. The marquee reads it; it does not carry its own list.

**Logos not available as official marks** (verified against `simple-icons`): React Native and gRPC have no entry. They remain text in the Skills section and are **not** in the marquee — a made-up glyph would violate the brief.

### 6.2 Behaviour

- One row, duplicated track (`aria-hidden` on the copy), CSS `translate3d` keyframes, 42s linear, no JS.
- Pause on `:hover` and `:focus-within`.
- `prefers-reduced-motion`: static, horizontally scrollable, no duplication.
- Mask fade at both edges so marks never collide with the frame rule.
- Height budget: **72px** plus the frame. It is a band, not a section.
- Each mark: `<span role="img" aria-label="TypeScript">` wrapping the inline SVG, plus a visible name on `md+` (the logo alone is not an accessible label for a text alternative).
- Monochrome `currentColor` at 55% opacity, 100% on hover. No brand colours — the page has one accent and 28 brand palettes would end it.

### 6.3 Files

**New:** `features/marketing/tech-marquee/{index.ts, TechnologyMarquee.tsx, marqueeMotion.ts}`, `data/technologies/showcase.ts`, `types/technology.ts`.

**Gate:** 60fps scroll, no CLS, pause works by keyboard, reduced-motion static, no broken image (there are no image requests at all).

---

## 7. Stage 8.3 — Card-fan carousel

The reference uses GSAP. This is a Framer Motion recreation of the _concept_, not a port of the code: a fanned arc, elastic entrance, hover spread, circular pagination.

### 7.1 Placement

Inside the **Skills** section, above the nine category panels: a 12-card fan of the highest-signal technologies, each card naming one project it was used in. The nine panels stay exactly as they are below it.

Rationale: a standalone carousel section would be a thirteenth block for a component that is a visual index of the same data the Skills section already owns.

### 7.2 Geometry

- 12 cards, each 180×240 (desktop), positioned on an arc: `rotate = (i - active) * 9°`, `y = |i - active| * 14px`, `scale = 1 - |i - active| * 0.04`, `zIndex = 12 - |i - active|`.
- Only the nearest five are rendered at full opacity; the rest fade to 0.25 and stay clickable via the prev/next controls.
- Active card: logo at 56px, name, category, and one project attribution (`Used in AutoFlow`).
- **Elastic entrance:** `spring({ stiffness: 220, damping: 26, mass: 0.9 })` from `scale 0.86, y 24` — a settle, not a bounce. The page's one-curve rule applies to entrances; springs are reserved for _interaction_ (drag, hover, pagination), which is where the existing `MagneticAction` already uses them.
- **Hover spread:** the arc opens by 4° on either side of the hovered card and the card lifts 6px. Pointer only; disabled on touch.
- **Rotation:** prev/next rotates the arc by one step (9°), animating 420ms. Circular: from the last card, next returns to the first.
- **Responsive:** 12 cards at ≥1280, 9 at 1024–1279, 7 at 768–1023, 5 below 768 with a swipeable track and the same controls.

### 7.3 Accessibility

- Container: `role="group"`, `aria-roledescription="carousel"`, `aria-label="Selected technologies"`.
- Each card is a real `<button>` with `aria-label="React — used in AutoFlow"`; the active card has `aria-current="true"`.
- Prev/next are labelled buttons; `←`/`→` move the fan when focus is inside it; `Home`/`End` jump to the ends.
- The active card's details are mirrored into a polite live region, so the visual fan is not the only way to read it.
- Reduced motion: no spring, no spread, instant step change.

### 7.4 Files

**New:** `features/credibility/skills-architecture/components/TechFanCarousel.tsx`, `.../components/FanCard.tsx`, `.../useFanCarousel.ts`.
**Modified:** `features/credibility/skills-architecture/components/SkillsPreview.tsx` (mount the fan above the grid).

**Gate:** keyboard-only complete pass, no layout shift on mount, 5 breakpoints, reduced-motion pass.

---

## 8. Stage 8.4 — Parallax and scroll animations

### 8.1 Parallax

`components/shared/useLayerParallax.ts` wraps `useScroll({ target, offset: ["start end", "end start"] })` and `useTransform`, returning a `MotionValue<number>` in pixels. It returns a constant `0` under reduced motion, so no branch is needed at every call site.

Applied to three layers only:

| Layer           | Travel                       | Why                                                                          |
| --------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Marquee band    | ±40px horizontal             | The band is already in motion; scroll adds depth without a second animation  |
| Timeline spine  | 0 → 100% draw                | Section 9 uses the same value for the progress line                          |
| Gallery columns | ±20px vertical, desktop only | Two columns disagreeing by 40px reads as depth; on mobile it reads as jitter |

**Not applied to:** section text, project tiles, the Hero (it has pointer parallax already), or anything with `position: sticky`. Parallax on body copy is the fastest way to make a page feel broken.

**No Lenis. No second scroll controller.** `html { scroll-behavior: smooth }` and the dock's `useSectionSpy` are untouched. `useScroll` reads native scroll and never writes to it.

### 8.2 Reveal presets

`components/shared/revealPresets.ts` — additive, so no existing section changes behaviour:

- `fadeUp` — the current 14px rise (default)
- `fadeIn` — opacity only, for media
- `slideIn` — 18px horizontal, for the gallery's second column
- `scaleIn` — 0.97 → 1, for lightbox media only

All four use the existing `EASE_APPLE` curve and the existing `REVEAL_VIEWPORT`. One new curve would mean two sites on one page.

### 8.3 Timeline progress

`useScroll` on the timeline container drives `scaleY` on the spine and sets the active item by comparing each item's midpoint against the viewport's 42% line (the same focus line `useSectionSpy` uses). One IntersectionObserver would fire for two adjacent items; a single measured line gives one answer per frame.

### 8.4 Files

**New:** `components/shared/useLayerParallax.ts`, `components/shared/revealPresets.ts`.
**Modified:** `features/marketing/tech-marquee/TechnologyMarquee.tsx` (consume the value), gallery and timeline consume it on creation.

**Gate:** no scroll jank on a 4× CPU throttle, dock spy still activates correctly, reduced motion removes all three transforms.

---

## 9. Stage 8.5 — Synchronized timeline

### 9.1 Content — real dates only

| Date                  | Entry                                                                                      | Kind         |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------ |
| 2022 – 2023           | Baccalauréat, Sciences Physiques — Lycée Al Farabi, Casablanca, Mention Assez Bien         | education    |
| 2023 – 2025           | Technicien Spécialisé, Développement Digital (Web Full Stack) — OFPPT / ISFO, diploma 2025 | education    |
| 2025                  | CFIT — Full Stack Developer Intern, Casablanca                                             | professional |
| 2025 – 2026           | Licence Professionnelle DAISI — FSAC, Casablanca                                           | education    |
| 2025 – 2026           | Smart Health Room — final-year project                                                     | project      |
| 2026 – Present        | Master II-BDCC — ENSET Mohammedia, Université Hassan II                                    | education    |
| 24 Sep 2026 – Present | IZIRY — Full Stack Developer / AI Engineering Intern                                       | professional |
| 2026 – Present        | AutoFlow — ERP and fleet management                                                        | project      |
| 2026                  | Morocco Retail Intelligence Data Platform                                                  | project      |

Every date is copied from `public/resume/Youssef-El-Bajoury-CV-FR-2026.pdf`. Nothing is interpolated. Morocco Retail gets the year only, because the CV gives no month and the GitHub repository's creation date is not a project start date.

### 9.2 Behaviour

- Vertical spine, year column on the left at `lg`, inline above each title below it.
- **Active item:** the entry crossing the 42% viewport line gets the status-lens treatment (the same 6px lit dot the availability badge uses) and its highlights expand. Everything else stays collapsed.
- **Progress:** the spine fills as the section scrolls, driven by the same `useScroll` value as the parallax.
- Filter: All / Professional / Academic as a `radiogroup`; project milestones follow the Professional filter.
- Cross-links: project entries → `/projects/[slug]`; DAISI → the TP repository root; IZIRY and CFIT → no link (nothing publishable).
- Reduced motion: spine fully drawn, no fill animation, active state still updates (it is information, not decoration).

### 9.3 Consequence for Experience

`ExperienceSection` currently renders an education list. That list moves to the timeline, and Experience keeps the two roles plus a mono link: `Education → 04`. `EDUCATION` in `data/experience/experience.ts` stays exported and gains `startYear`/`endYear` for sorting; nothing is deleted.

### 9.4 Files

**New:** `data/timeline/timeline.ts`, `types/timeline.ts`, `features/credibility/timeline/{index.ts, TimelineSection.tsx, components/TimelineTrack.tsx, components/TimelineItem.tsx, useActiveTimelineItem.ts, timelineMotion.ts}`.
**Modified:** `features/experience/ExperienceSection.tsx`, `data/experience/experience.ts`, `app/page.tsx`.

**Gate:** all 9 entries in CV order, no invented date, keyboard filter, active state correct at 360/768/1440, reduced-motion pass.

---

## 10. Stage 8.6 — Project gallery and lightbox

### 10.1 Content — every image already exists

| Group             | Images                                                                                                                        | Source                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Rolex Experience  | 9 (home, all models, by theme, product ×3, login, product page, detail)                                                       | `public/projects/rolex-experience/`                                             |
| Smart Health Room | 9 (dashboard, room map, analytics, alerts, remote control, sensors, telemetry, admin, AI assistant) + overview + architecture | `public/projects/smart-health-room/`                                            |
| Morocco Retail    | 5 Superset dashboards                                                                                                         | `public/projects/morocco-retail-intelligence/`                                  |
| AutoFlow          | 5 **conceptual** visuals                                                                                                      | `AutoFlow_Images/` → optimized copies in `public/projects/autoflow/conceptual/` |

**No original file is moved or replaced.** AutoFlow copies are labelled `CONCEPTUAL` on the card, in the lightbox caption, and in the `alt` text. They are never called screenshots.

### 10.2 Behaviour

- **Filters:** All (28) · Rolex (9) · Smart Health Room (11) · Morocco Retail (5) · AutoFlow concept (5). Filter state reflected in `#gallery=rolex`.
- **Layout:** masonry-ish 3/2/1 columns, `next/image` with explicit `sizes`, `loading="lazy"` below the fold, `placeholder="blur"` from the static import. No layout shift: every card has a fixed aspect box.
- **Lightbox:** portal to `body`, backdrop blur, `aria-modal`, focus trap, `Escape` closes, `←`/`→` navigate, counter (`4 / 28`), caption, and a visible "Conceptual visualisation" chip when applicable. Body scroll locked; focus returns to the originating card on close.
- **Transitions:** card → lightbox uses a shared `layoutId` on the image; close reverses it. 320ms, the existing curve.
- **Captions:** taken from each image's existing `alt` text where one exists; new captions for the AutoFlow visuals state what they are.
- **Keyboard:** the grid is a list of buttons; the lightbox is a dialog with its own roving focus.

### 10.3 Duplication guard

The Featured Projects section stays the curated narrative (four tiles, case-study dialogs). The gallery is the **archive**: all 28 images, filters, no prose. The featured section gets one link — `Browse all 28 visuals → #gallery` — so the two sections cannot be mistaken for each other.

### 10.4 Files

**New:** `data/gallery/gallery.ts`, `types/gallery.ts`, `features/showcase/gallery/{index.ts, ProjectGallery.tsx, components/GalleryCard.tsx, components/GalleryFilters.tsx, components/Lightbox.tsx, useGalleryFilter.ts, useLightbox.ts}`.
**Modified:** `app/page.tsx`, `features/showcase/projects/ProjectShowcase.tsx` (one archive link).

**Gate:** 28 images load, 0 broken, lightbox keyboard pass, filter URL state, no CLS, reduced-motion pass.

---

## 11. Stage 8.7 — WhatsApp QR

- **Encoded value:** the existing `SOCIAL_LINKS.whatsapp` — `https://wa.me/212688039822?text=…`. The digits are derived from `PROFILE.phone`; the number is not typed a second time.
- **Generation:** local, at authoring time, with `qrcode`. Output committed to `public/qr/whatsapp.svg`. No external QR service, no request carrying the number.
- **Panel:** one compact band between Contact and Footer — QR at 148px inside a framed plate, the number in mono, a caption ("Scan to open WhatsApp"), and a tappable "Open WhatsApp" button for phones. Height budget: 220px.
- **Fallback:** the button is a real `<a href={SOCIAL_LINKS.whatsapp}>`; the QR is never the only path.
- **Accessibility:** the QR is `role="img"` with `aria-label="QR code to open a WhatsApp conversation with Youssef El Bajoury"`; the caption is visible text, not an image of text.
- **Refresh:** `npm run qr:generate` rewrites the SVG; the encoded payload is printed to the console so a change is reviewable in the diff.

**New:** `features/conversion/whatsapp/{index.ts, WhatsAppPanel.tsx}`.
**Gate:** QR decodes to the exact `wa.me` URL, link works, no external request.

---

## 12. Stage 8.8 — Footer

### 12.1 Structure

```
┌ YB   Youssef El Bajoury ────────────────────────────────┐
│ Software Engineer | Full Stack Development               │
│ ● Open to CDI & Pre-Employment Internships               │
│                                                          │
│ NAVIGATE        REACH              DOCUMENTS    ELSEWHERE│
│ Home            Email              English CV   GitHub   │
│ Projects        +212 688-039822    French CV    LinkedIn │
│ About           Casablanca, MA     Cover letter WhatsApp │
│ Experience      Local time (GMT+1)                       │
│ Timeline                                                 │
│ Skills                                                   │
│ Gallery                                                  │
│ Contact                                                  │
│                                                          │
│ © 2026 …                                    Back to top ↑ │
└──────────────────────────────────────────────────────────┘
```

- **YB mark:** two letters set as a typographic monogram in a hairline square — his initials, not a fabricated logo. Inline SVG, `currentColor`, one path per letter.
- **Navigation shortcuts:** the five dock ids plus Timeline, Skills, Gallery, and the three documents. Every href is an existing anchor or an existing `/public` file.
- **Availability:** reads `PROFILE.availability`, same badge as the hero.
- **Local time:** the existing `LocalTimeBadge` logic moves to `components/shared/LocalTimeBadge.tsx` and is reused; no new clock code.
- **Back to top:** a button, not an anchor, so it can `scrollTo` and then move focus to `#home`; under reduced motion it jumps instead of scrolling. Hidden until the reader is past the hero (IntersectionObserver on the hero, one observer).
- **Copyright:** current year, computed as today.

### 12.2 Files

**New:** `components/shared/YBMark.tsx`, `components/shared/BackToTop.tsx`, `components/shared/LocalTimeBadge.tsx`.
**Modified:** `components/layout/Footer.tsx`.

**Gate:** all footer links resolve, back-to-top restores focus, contrast pass, 360px stack.

---

## 13. Visual and motion rules (unchanged from the existing system)

1. **One light.** Nothing added may read as a second light source. The spotlight is 4% white and never brighter than the key light.
2. **One accent.** The only saturated objects are the hero's primary action, the active fan card's hairline, and the form-free contact action. Logos are monochrome.
3. **One entrance curve.** `EASE_APPLE` for entrances; springs only for interaction.
4. **Transform, opacity, filter only.** No animated width, height, top, left, or background-position. The marquee is the single exception (`translate3d` on a track is still transform).
5. **Nothing pops.** No bounce, no overshoot on entrance, no scale-from-zero.
6. **Two voices.** Sans for people and prose, mono for dates, counts, coordinates, status, and captions. New components follow it.
7. **Reduced motion is a real state.** Every new behaviour has a defined static form; none of them merely runs faster.

---

## 14. Accessibility contract

- Marquee: duplicate track `aria-hidden`, pause on focus, static under reduced motion.
- Fan carousel: labelled group, buttons with `aria-label`, `aria-current` on the active card, arrow-key support, live region for the active card.
- Timeline: `radiogroup` filter, active item announced via `aria-current="step"`, expandable highlights with `aria-expanded`.
- Gallery: list of buttons, dialog with focus trap, `aria-modal`, Escape, arrows, counter, focus restoration.
- QR: `role="img"` with a text alternative, plus a visible text link.
- Footer: real `<nav>` landmarks, back-to-top is a button, skip link still works.
- Every new interactive element: visible `focus-visible` ring, 44px minimum target on touch.

---

## 15. Performance budget

| Item                                                         | Budget                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| New client JS (marquee + fan + lightbox + timeline + footer) | **< 30 kB gzipped**                                                 |
| New images                                                   | 0 originals; 5 optimized WebP copies ≈ 1.2 MB total                 |
| Marquee                                                      | 0 JS, CSS transform only                                            |
| Lightbox                                                     | renders only when open (portal + dynamic import of the dialog body) |
| LCP                                                          | unchanged (the hero portrait remains the priority image)            |
| CLS                                                          | 0 — every gallery card has a fixed aspect box                       |
| Lighthouse                                                   | not below the 8.0 baseline                                          |

If the fan carousel pushes past 30 kB, it is because the cards are importing all 108 marks instead of the 12 in the list; the generated module is per-slug and the fan imports exactly twelve.

---

## 16. Security and privacy

- No new runtime dependency, therefore no new supply-chain surface in the shipped bundle.
- No runtime third-party request: logos are inline path data, the QR is a committed SVG, images are local.
- The QR is generated offline. The phone number never reaches a QR web service.
- External links keep `rel="noopener noreferrer"`; `target="_blank"` only for GitHub, LinkedIn, and WhatsApp.
- Lightbox captions and alt text come from typed data, never from user input; no `dangerouslySetInnerHTML` anywhere.
- `lib/env.ts` is untouched; no new environment variable; no secret in the client.
- The generated `marks.ts` is reviewed in the diff, so a logo path cannot change silently.

---

## 17. Exact file list

### 17.1 New (45)

**Data and types (7):** `data/technologies/marks.ts` (generated), `data/technologies/showcase.ts`, `data/timeline/timeline.ts`, `data/gallery/gallery.ts`, `types/technology.ts`, `types/timeline.ts`, `types/gallery.ts`.

**Shared (5):** `components/shared/useLayerParallax.ts`, `components/shared/revealPresets.ts`, `components/shared/YBMark.tsx`, `components/shared/BackToTop.tsx`, `components/shared/LocalTimeBadge.tsx`. The existing `WhatsAppGlyph` in `BrandGlyphs.tsx` is reused as-is.

**Hero (2):** `features/marketing/hero/components/FloatingTechField.tsx`, `features/marketing/hero/components/CursorSpotlight.tsx`.

**Marquee (3):** `features/marketing/tech-marquee/{index.ts, TechnologyMarquee.tsx, marqueeMotion.ts}`.

**Carousel (3):** `features/credibility/skills-architecture/components/TechFanCarousel.tsx`, `components/FanCard.tsx`, `useFanCarousel.ts`.

**Timeline (6):** `features/credibility/timeline/{index.ts, TimelineSection.tsx, components/TimelineTrack.tsx, components/TimelineItem.tsx, useActiveTimelineItem.ts, timelineMotion.ts}`.

**Gallery (7):** `features/showcase/gallery/{index.ts, ProjectGallery.tsx, components/GalleryCard.tsx, components/GalleryFilters.tsx, components/Lightbox.tsx, useGalleryFilter.ts, useLightbox.ts}`.

**QR (2):** `features/conversion/whatsapp/{index.ts, WhatsAppPanel.tsx}`.

**Scripts (3):** `scripts/generate-logo-marks.mjs`, `scripts/generate-whatsapp-qr.mjs`, `scripts/optimize-concept-images.mjs`.

**Assets (7):** `public/qr/whatsapp.svg`, 5 × `public/projects/autoflow/conceptual/*.webp`, `public/projects/autoflow/conceptual/README.md`.

### 17.2 Modified (14)

| File                                                                    | Change                                              |
| ----------------------------------------------------------------------- | --------------------------------------------------- |
| `app/page.tsx`                                                          | Insert marquee, timeline, gallery, QR band          |
| `features/marketing/hero/Hero.tsx`                                      | Add the two new layers + line mask                  |
| `features/marketing/hero/components/HeroActions.tsx`                    | View Projects / Download CV / contact / GitHub meta |
| `features/marketing/hero/heroContent.ts`                                | Contact line, action copy                           |
| `features/marketing/hero/heroMotion.ts`                                 | Float, spotlight, mask constants                    |
| `features/experience/ExperienceSection.tsx`                             | Education block → timeline link                     |
| `data/experience/experience.ts`                                         | `startYear` / `endYear` on education                |
| `features/credibility/skills-architecture/components/SkillsPreview.tsx` | Mount the fan; index 05 → 06                        |
| `features/showcase/projects/ProjectShowcase.tsx`                        | Archive link                                        |
| `features/academic/AcademicSection.tsx`                                 | Index 04 → 05                                       |
| `features/conversion/contact-hub/components/LocationPanel.tsx`          | Index 06 → 08                                       |
| `features/conversion/contact-hub/components/ContactPreview.tsx`         | Index 07 → 09                                       |
| `components/layout/Footer.tsx`                                          | Rebuild                                             |
| `package.json`                                                          | 3 devDeps, 3 scripts                                |

### 17.3 Deleted

**None.** No existing asset, component, or data file is removed. `data/skills`, `features/academic`, and all four case studies stay exactly where they are.

---

## 18. Implementation order and checkpoints

| Stage | Work                                                   | Checkpoint before continuing                        |
| ----- | ------------------------------------------------------ | --------------------------------------------------- |
| 8.0   | Baseline + devDeps + generated marks/QR/concept images | Build clean, no visual diff                         |
| 8.1   | Hero                                                   | 5-width visual diff, reduced-motion pass            |
| 8.2   | Marquee                                                | 60fps, pause, static fallback                       |
| 8.3   | Fan carousel                                           | Keyboard-only pass, 5 breakpoints                   |
| 8.4   | Parallax + presets                                     | Throttled scroll test, dock spy intact              |
| 8.5   | Timeline                                               | Dates reviewed against the CV, active state correct |
| 8.6   | Gallery + lightbox                                     | 28 images, 0 broken, dialog a11y                    |
| 8.7   | QR                                                     | Decode test, no external request                    |
| 8.8   | Footer                                                 | Link audit, focus restoration                       |
| 8.9   | QA sweep                                               | Section 19                                          |

Each stage is a separate commit. No push, no deploy, no force-push, no `--no-verify`.

---

## 19. Verification checklist

**Build**

- [ ] `lint` 0 errors / 0 warnings · `typecheck` clean · `build` clean
- [ ] All 5 routes prerender; all 4 case-study routes still 200
- [ ] No unused import or dead component left behind

**Content**

- [ ] Timeline dates match the CV exactly (9 entries)
- [ ] No invented achievement, metric, or date
- [ ] AutoFlow visuals labelled conceptual in card, caption, and alt
- [ ] 0 broken images across 28 gallery items and 28 marquee marks
- [ ] Every logo is an official `simple-icons` path, not a drawn approximation
- [ ] No percentage or proficiency claim added

**Motion**

- [ ] Reduced motion: marquee static, fan instant, parallax 0, timeline fully drawn
- [ ] No animation on width/height/top/left
- [ ] No scroll jank at 4× CPU throttle
- [ ] Dock scroll spy and `#anchor` navigation unchanged

**Accessibility**

- [ ] Keyboard-only: hero actions, marquee pause, fan, timeline filter, gallery, lightbox, footer
- [ ] Focus trap + restore in the lightbox
- [ ] Live regions announce the active fan card and gallery count
- [ ] Contrast unchanged; focus rings visible on every new control

**Visual**

- [ ] No horizontal overflow at 360 / 390 / 768 / 1000 / 1280 / 1440
- [ ] Hero composition unchanged except the new layers
- [ ] Existing Rolex, SHR, MRIDP screenshots and the portrait untouched
- [ ] Page height increase under 45% despite four new blocks

**Security**

- [ ] No new runtime dependency, no new env var, no secret
- [ ] QR encodes only the `wa.me` URL; generation was local
- [ ] External links carry `rel="noopener noreferrer"`

---

## 20. Decisions needed

| #       | Decision                                                                                                                                        | Recommendation |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **D1**  | Phase 8 supersedes the unapproved Phase 7 plan; no 15-section reorder                                                                           | Approve        |
| **D2**  | Two devDependencies (`simple-icons`, `qrcode`) used only at authoring time; zero runtime additions                                              | Approve        |
| **D3**  | Hero actions become **View Projects** (primary), **Download CV** (secondary), **Let's Work Together** (tertiary); GitHub demoted to a meta link | Approve        |
| **D4**  | Card-fan lives inside the Skills section rather than as its own block                                                                           | Approve        |
| **D5**  | Gallery is an archive (28 images) alongside the curated Featured Projects, not a replacement                                                    | Approve        |
| **D6**  | Education moves out of Experience into the timeline; Experience keeps a link                                                                    | Approve        |
| **D7**  | QR sits in its own compact band between Contact and Footer                                                                                      | Approve        |
| **D8**  | Logos render monochrome, not in brand colours                                                                                                   | Approve        |
| **D9**  | React Native and gRPC stay text-only because `simple-icons` has no official mark for them                                                       | Approve        |
| **D10** | AutoFlow concept images are copied and optimized into `public/`, originals untouched, always labelled conceptual                                | Approve        |

Nothing is implemented until D1–D10 are answered. The first commit after approval is stage 8.0, which changes no visual output.
