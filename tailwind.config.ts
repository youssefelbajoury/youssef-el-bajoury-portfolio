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
        /* Hero — the one place type is allowed to dominate the page */
        hero: [
          "clamp(3rem, 2rem + 6vw, 7.25rem)",
          { lineHeight: "0.98", letterSpacing: "-0.03em" },
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
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.3)",
        sm: "0 2px 10px rgba(0, 0, 0, 0.35)",
        card: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 20px 40px -24px rgba(0, 0, 0, 0.65)",
        "card-hover":
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 28px 56px -24px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(46, 230, 255, 0.14)",
        glow: "0 0 32px -4px rgba(46, 230, 255, 0.35)",
        "glow-sm": "0 0 16px -2px rgba(46, 230, 255, 0.28)",
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
      },
      transitionDuration: {
        fast: "200ms",
        medium: "400ms",
        slow: "650ms",
        "extra-slow": "950ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
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
        /* Work-in-progress indicator — a single light sweep across a hairline. */
        "wip-sweep": {
          "0%": { transform: "translateX(-110%)" },
          "100%": { transform: "translateX(210%)" },
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
        "wip-sweep": "wip-sweep 3.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
