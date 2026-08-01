import { DRAWING } from "@/styles/material";

/**
 * Fixed, page-wide backdrop — a quiet architecture schematic rather than a
 * decorative gradient. Six nodes (the disciplines named across the page:
 * frontend, API, database, cloud, IoT, AI) are connected by thin traces
 * carrying a slow-traveling signal, visualizing the site's own thesis —
 * "an engineer who thinks in systems" — as atmosphere instead of illustration.
 *
 * IT IS A DRAWING, NOT A LIGHT SOURCE. Every line, node and label is white in
 * the 2–5% band (see DRAWING in styles/material.ts), which is the band the
 * Hero's own schematic works in. It used to be saturated cyan: six glowing
 * 30px-radius halos, traces at 40% accent, and a node dot at 95%, all under the
 * page at once. That was the single biggest reason the site read as a designed
 * Hero sitting on top of a differently-designed page — the Hero had to scrim the
 * background away to hold its composition together, and every section below it
 * inherited six emitting objects the material system says cannot exist.
 *
 * The halos are gone. What replaced them is a datum circle: a drawn outline at
 * construction weight, which is the mark a drawing actually uses to call out a
 * point of interest. It still pulses, and at these values the pulse is
 * something you notice on the second visit rather than the first — which is
 * what a background is for.
 *
 * Nodes sit inside a central safe zone of the viewBox so they survive the
 * xMidYMid-slice crop across mobile-portrait through ultra-wide aspect ratios.
 * Pure SVG + CSS animation (opacity, stroke-dashoffset, transform only), so it
 * is cheap and fully neutralized by prefers-reduced-motion.
 */
const NODES = [
  { id: "frontend", label: "FRONTEND", x: 330, y: 300 },
  { id: "api", label: "API", x: 620, y: 480 },
  { id: "database", label: "DATABASE", x: 900, y: 300 },
  { id: "cloud", label: "CLOUD", x: 1080, y: 180 },
  { id: "iot", label: "IOT", x: 1080, y: 620 },
  { id: "ai", label: "AI", x: 900, y: 780 },
] as const;

const EDGES: [string, string][] = [
  ["frontend", "api"],
  ["api", "database"],
  ["database", "cloud"],
  ["database", "iot"],
  ["api", "ai"],
  ["iot", "ai"],
  ["cloud", "iot"],
];

function node(id: string) {
  const found = NODES.find((n) => n.id === id);
  if (!found) throw new Error(`Unknown blueprint node: ${id}`);
  return found;
}

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-background overflow-hidden" aria-hidden>
      <div className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)] bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/*
        THE DRIFT IS ON THIS DIV, NOT ON THE <svg>.

        Chromium does not give an SVG element its own compositing layer for a
        CSS transform animation; an HTML element it does. So `animate-drift-slow`
        on the <svg> was not a GPU transform — it re-rasterised the drawing to
        move it, continuously, for a translation of a fraction of a pixel per
        frame. Moving the same animation onto an HTML wrapper lets the drawing
        raster once and be translated by the compositor instead.

        MEASURED, over four idle seconds at 1440 × 900, via the tracing API —
        RasterTask count, three runs each:

            drift on the <svg>    2635 / 2333 / 2347   median 2347
            drift on this <div>   1378 / 1535 / 1528   median 1528   (−35%)

        The ranges do not overlap. Paint time moved from 62.5ms to 57.0ms, but
        those ranges *do* overlap, so the honest claim is the raster count and
        not the paint time.

        WHAT IS NOT CLAIMED: a frame-rate win. Frame timing was measured too,
        repeatedly, and it was worthless — quantised to vsync buckets and noisy
        enough to reverse direction between runs. Less raster work is worth
        having on a phone whatever the desktop frame counter says, but nobody
        should read a smoother page into this change without measuring it on
        real hardware first.

        NO `will-change`. It was here, on the theory that pre-promoting the
        layer would help; by the raster metric above it made no difference
        (1352 vs 1535 median, ranges overlapping), and it permanently pins a
        full-viewport layer in GPU memory. An unmeasurable win is not worth ten
        megabytes on a mid-range phone.

        VISUALLY IDENTICAL, and it has to be, because the transform is in
        percentages: `translate3d(1.5%, -1.5%, 0)` resolves against the animated
        element's own border box. This div is `absolute inset-0` inside a
        `fixed inset-0` parent, and the <svg> it replaced was `absolute inset-0
        h-full w-full` — both are exactly the viewport, so 1.5% is the same
        number of pixels either way. Same distance, same 40s ease-in-out, same
        everything. Pixel-diffed across four animation phases: the difference is
        smaller than this renderer's own run-to-run variance.
      */}
      <div className="absolute inset-0 animate-drift-slow motion-reduce:animate-none">
        <svg
          viewBox="0 0 1400 1000"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          {/* Traces, at connection weight — one step below an object outline and
            one above a construction line. */}
          <g fill="none" stroke={DRAWING.connection} strokeWidth="1.25">
            {EDGES.map(([fromId, toId], i) => {
              const from = node(fromId);
              const to = node(toId);
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  strokeDasharray="2.5 9"
                  className={i % 2 === 0 ? "animate-signal" : "animate-signal-slow"}
                  style={{ animationDelay: `${i * 900}ms` }}
                />
              );
            })}
          </g>

          {NODES.map((n, i) => (
            <g
              key={n.id}
              className="animate-node-pulse"
              style={{ animationDelay: `${i * 650}ms`, transformOrigin: `${n.x}px ${n.y}px` }}
            >
              {/* The datum circle — drawn, not lit. */}
              <circle
                cx={n.x}
                cy={n.y}
                r={30}
                fill="none"
                stroke={DRAWING.construction}
                strokeWidth="1"
              />
              <circle cx={n.x} cy={n.y} r={4} fill={DRAWING.node} />
              <text
                x={n.x}
                y={n.y - 20}
                textAnchor="middle"
                fontSize="13"
                fontFamily="var(--font-geist-mono)"
                letterSpacing="0.12em"
                fill={DRAWING.label}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
