import type { Config } from "tailwindcss";

/*
  Design Tokens — Tailwind theme extension.

  Colors and spacing reference the CSS variables defined in
  styles/globals.css (per ETAPE 11's "use CSS variables for colors and
  spacing" rule). Radius, shadows, typography, z-index, and motion are
  theme-invariant and are defined directly here as the single source of
  truth for those categories.

  Breakpoints, opacity, and font-weight intentionally use Tailwind's
  built-in defaults, which already match ETAPE 13's scale:
    - Breakpoints: sm(640)=Tablet, md(768)=Laptop, lg(1024)=Desktop,
      xl(1280)=UltraWide (unprefixed = Mobile).
    - Font weights: 300-800 already covers Light..ExtraBold.
*/
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2rem",
        lg: "3rem",
      },
    },
    extend: {
      colors: {
        white: "var(--color-white)",
        black: "var(--color-black)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        divider: "var(--color-divider)",
        "hover-surface": "var(--color-hover-surface)",
        "disabled-surface": "var(--color-disabled-surface)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        "accent-ink": "var(--color-accent-ink)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        glass: {
          background: "var(--glass-background)",
          border: "var(--glass-border)",
        },
      },
      spacing: {
        "4": "var(--space-4)",
        "8": "var(--space-8)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)",
        "32": "var(--space-32)",
        "40": "var(--space-40)",
        "48": "var(--space-48)",
        "56": "var(--space-56)",
        "64": "var(--space-64)",
        "80": "var(--space-80)",
        "96": "var(--space-96)",
        "128": "var(--space-128)",
      },
      maxWidth: {
        content: "80rem",
        readable: "45rem",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        /* Hero — the one place type is allowed to dominate the page.
           Tuned to the two-line headline it exists to set: the cap keeps the
           longer line comfortably inside its seven columns at every viewport,
           and the floor keeps it inside a 320px screen. Line-height can go
           this tight because neither line carries a descender. */
        hero: [
          "clamp(2.25rem, 1.25rem + 5vw, 5.75rem)",
          { lineHeight: "0.93", letterSpacing: "-0.035em" },
        ],
        /* Section titles — still monumental, one step down from hero */
        title: [
          "clamp(2.25rem, 1.75rem + 2.6vw, 4.25rem)",
          { lineHeight: "1.04", letterSpacing: "-0.025em" },
        ],
        h1: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h3: ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        h4: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h5: ["1.25rem", { lineHeight: "1.3" }],
        h6: ["1.125rem", { lineHeight: "1.35" }],
        "paragraph-lg": ["1.125rem", { lineHeight: "1.7" }],
        paragraph: ["1rem", { lineHeight: "1.65" }],
        "paragraph-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.8125rem", { lineHeight: "1.5" }],
        badge: ["0.75rem", { lineHeight: "1.2" }],
        label: ["0.75rem", { lineHeight: "1.4" }],
        code: ["0.875rem", { lineHeight: "1.5" }],
        tooltip: ["0.75rem", { lineHeight: "1.3" }],
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1.25rem",
        xl: "1.75rem",
        full: "9999px",
      },
      /*
        Two shadows, and neither is a glow.

        The page's surfaces are lit from styles/material.ts — one lamp in the
        upper left, so every cast shadow is thrown down and to the right and
        every lit edge faces up and left. A token cannot express that (it has no
        idea which way an element is facing), so the panel, plate and action
        shadows live in the material file and these two are left for the small
        utility cases.

        WHAT WAS REMOVED, and why it should not come back: `glow` and `glow-sm`
        (a cyan halo, i.e. light emitted by a div, on a page with exactly one
        light source) and `card` / `card-hover` (a shadow falling straight down,
        plus a cyan ring on hover). All four are superseded by PANEL_EDGES and
        PRIMARY_ACTION_SHADOW.
      */
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.3)",
        sm: "0 2px 10px rgba(0, 0, 0, 0.35)",
      },
      zIndex: {
        /* 0, not negative — a negative z-index on a fixed, transform-animated
           layer gets composited below the page's own base paint in Chromium,
           making it invisible outright. DOM order (this renders first)
           already keeps it behind every other element. */
        background: "0",
        content: "0",
        sticky: "10",
        navigation: "20",
        dropdown: "30",
        modal: "40",
        toast: "50",
        tooltip: "60",
        "command-palette": "70",
        /* Above everything the page can raise on its own. The loader covers the
           site outright, and anything that could stack over it — a dropdown, a
           toast, the palette — would be a fragment of a page the reader has not
           been shown yet. Native <dialog> still wins via the top layer, which is
           correct and unreachable here: nothing can open one before load. */
        loader: "80",
      },
      transitionDuration: {
        fast: "200ms",
        medium: "400ms",
        slow: "650ms",
        "extra-slow": "950ms",
        /* The spring's own settle time. Pairing `ease-spring` with any other
           duration truncates the curve mid-oscillation, which is the one way to
           make a spring look like a bug. */
        spring: "480ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        /* Defined in styles/globals.css, where the reveal and the case-study
           dialog need them in plain CSS. See the comment there for what each
           one is. */
        apple: "var(--ease-apple)",
        spring: "var(--ease-spring)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        "node-pulse": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.85" },
        },
        "signal-travel": {
          "0%": { "stroke-dashoffset": "400" },
          "100%": { "stroke-dashoffset": "0" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(1.5%, -1.5%, 0)" },
        },
        /* Floating technology pills — a slow vertical drift only, no rotation,
           so the pills read as suspended rather than as animated stickers. */
        "float-soft": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -6px, 0)" },
        },
        /* Location marker — a single range ring expanding out of the pin and
           fading, like a sweep return. Scale/opacity only, so it composites on
           the GPU and never triggers layout. */
        "marker-ping": {
          "0%": { transform: "scale(0.55)", opacity: "0.5" },
          "70%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        /* Work-in-progress indicator — a single light sweep across a hairline. */
        "wip-sweep": {
          "0%": { transform: "translateX(-110%)" },
          "100%": { transform: "translateX(210%)" },
        },

        /* ---- Hero entrance ------------------------------------------------
           Every one of these enters from below, out of focus, and settles.
           Nothing scales up from nothing and nothing overshoots: the brief is
           "orchestrated", and overshoot reads as playful. The blur is what
           separates these from a stock fade-up — an element that resolves into
           focus reads as arriving, where one that merely fades reads as being
           switched on. Timings and delays live in heroMotion.ts. */
        "hero-rise": {
          from: { opacity: "0", transform: "translate3d(0, 10px, 0)", filter: "blur(5px)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)", filter: "blur(0px)" },
        },
        /* Headline lines. Travel is 110% of the line box, so the line starts
           fully below its own clip edge and rises out from behind it — the
           mask is the effect, the movement only carries it. */
        "hero-line": {
          from: { opacity: "0", transform: "translate3d(0, 110%, 0)", filter: "blur(11px)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)", filter: "blur(0px)" },
        },
        /* The lede rule draws from its left end, like a ruled line. */
        "hero-rule": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "hero-plate": {
          from: {
            opacity: "0",
            transform: "translate3d(0, 16px, 0) scale(0.985)",
            filter: "blur(7px)",
          },
          to: { opacity: "1", transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0px)" },
        },

        /* ---- Hero idle ----------------------------------------------------
           The plate breathes by 0.3%. At a 306px plate that is under a pixel
           of travel across seven seconds — far below the threshold at which
           anyone can see it move, and just above the threshold at which the
           object stops reading as printed onto the page. */
        "plate-breathe": {
          "0%, 100%": { transform: "scale3d(1, 1, 1)" },
          "50%": { transform: "scale3d(1.003, 1.003, 1)" },
        },
        /* Hover light sweep across the plate face. Skewed, because a reflection
           travelling across a surface held at an angle is not a vertical band. */
        "plate-sweep": {
          "0%": { opacity: "0", transform: "translate3d(-130%, 0, 0) skewX(-14deg)" },
          "22%": { opacity: "1" },
          "78%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate3d(230%, 0, 0) skewX(-14deg)" },
        },

        /* ---- Hero background ----------------------------------------------
           The trace field, alive. All three of these run at single-digit
           opacity on a near-black canvas and on cycles of 9–34 seconds, so
           none of them is perceptible as motion — they are only perceptible as
           the page not being quite static, which is the entire brief. */
        "trace-breathe": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        /* A telemetry packet running the width of its trace and out. */
        "trace-packet": {
          "0%": { opacity: "0", transform: "translate3d(0, 0, 0)" },
          "14%": { opacity: "1" },
          "86%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate3d(var(--packet-run), 0, 0)" },
        },
        /* The scanning beam: one very wide, very faint vertical band crossing
           the section every 34 seconds. Wide enough that its edges are never
           visible — what registers is a slow change in level, not a shape. */
        "scan-beam": {
          "0%": { transform: "translate3d(-60%, 0, 0)" },
          "100%": { transform: "translate3d(160%, 0, 0)" },
        },

        /* The case study's stage, receiving a new screenshot. Starts at 0.55
           rather than 0: a swap that fades up from nothing shows the surface
           underneath and reads as a flash, where one that fades up from
           half-present reads as the image resolving. */
        "shot-in": {
          from: { opacity: "0.55", transform: "scale3d(1.008, 1.008, 1)" },
          to: { opacity: "1", transform: "scale3d(1, 1, 1)" },
        },

        /* Engineering-scene particles. Units are SVG user units, so the travel
           below is 5–7 units over 22–35 seconds — well under a pixel per
           second. Opacity moves further than position does, which is what
           makes the field read as depth of focus rather than as drift. */
        "scene-drift": {
          "0%, 100%": { opacity: "0.35", transform: "translate3d(0, 0, 0)" },
          "50%": { opacity: "1", transform: "translate3d(5px, -7px, 0)" },
        },
      },
      animation: {
        "node-pulse": "node-pulse 7s ease-in-out infinite",
        "node-pulse-slow": "node-pulse 9s ease-in-out infinite",
        signal: "signal-travel 14s linear infinite",
        "signal-slow": "signal-travel 20s linear infinite",
        "drift-slow": "drift-slow 40s ease-in-out infinite",
        "float-soft": "float-soft 6s ease-in-out infinite",
        "float-soft-late": "float-soft 7.5s ease-in-out infinite",
        "marker-ping": "marker-ping 4.2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "marker-ping-late": "marker-ping 4.2s cubic-bezier(0.16, 1, 0.3, 1) 2.1s infinite",
        "wip-sweep": "wip-sweep 3.4s ease-in-out infinite",

        /* Hero entrance. `backwards` fill is the load-bearing part: it applies
           the 0% frame during the delay, so an element with an 850ms delay is
           invisible from first paint rather than flashing in and then starting
           its animation. Durations come from heroMotion.ts DURATION and are
           repeated here because Tailwind's config cannot import from the app
           graph — if you change one, change the other. */
        "hero-rise": "hero-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
        "hero-line": "hero-line 950ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
        "hero-rule": "hero-rule 620ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
        "hero-plate": "hero-plate 1100ms cubic-bezier(0.16, 1, 0.3, 1) backwards",

        /* Hero idle and background. */
        "plate-breathe": "plate-breathe 7s ease-in-out infinite",
        /* `forwards` is not optional here. A one-shot animation with no fill
           hands the element back to its own styles when it ends — opacity 1 and
           no transform — so the light sweep parked itself across the plate for
           the rest of the hover instead of leaving. Holding the 100% frame ends
           it at opacity 0, translated off the edge. */
        "plate-sweep": "plate-sweep 1.15s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "shot-in": "shot-in 340ms var(--ease-apple) backwards",
        "trace-breathe": "trace-breathe 9s ease-in-out infinite",
        "trace-packet": "trace-packet 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-beam": "scan-beam 34s linear infinite",
        /* Duration and delay are overridden per particle from sceneGeometry.ts;
           the 26s here is only the default for a particle that sets neither. */
        "scene-drift": "scene-drift 26s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
