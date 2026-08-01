/**
 * The plate: an abstract plan view of Casablanca with outbound bearings.
 *
 * Deliberately NOT a map of Morocco and not a world map. Two honest scales are
 * kept separate rather than blended, because a street grid and a transatlantic
 * route on one canvas is a scale contradiction:
 *
 *   - The interior is city-scale — coastline, sparse blocks, a few arterials.
 *   - The bearings leave that interior as labelled vectors. They are headings,
 *     not flight paths, which is the difference between "I build software
 *     globally" and "I travel".
 *
 * Geometry is polar (range rings, radials) on purpose: GlobalBackground already
 * owns the page's cartesian grid and node graph, so repeating that here would
 * read as one muddy texture instead of two deliberate layers.
 *
 * Pure SVG — no map library, no tiles, no WebGL. Animation is limited to
 * stroke-dashoffset and transform, both fully neutralised by the global
 * prefers-reduced-motion rule in styles/globals.css.
 */

/** Casablanca, in plate coordinates. Everything else is positioned from here. */
const ORIGIN = { x: 248, y: 238 } as const;

/** Concentric range rings, in plate units. */
const RANGE_RINGS = [44, 82, 124, 170, 220] as const;

/**
 * Outbound bearings. Directions are geographically honest relative to
 * Casablanca — North America across the Atlantic to the west-northwest, Europe
 * to the north-northeast, the Middle East due east, the rest of Africa to the
 * south-southeast.
 */
const BEARINGS = [
  {
    id: "north-america",
    label: "N. AMERICA",
    d: `M ${ORIGIN.x} ${ORIGIN.y} Q 130 152 46 108`,
    node: { x: 46, y: 108 },
    text: { x: 54, y: 94, anchor: "start" as const },
  },
  {
    id: "europe",
    label: "EUROPE",
    d: `M ${ORIGIN.x} ${ORIGIN.y} Q 372 104 498 52`,
    node: { x: 498, y: 52 },
    text: { x: 490, y: 38, anchor: "end" as const },
  },
  {
    id: "middle-east",
    label: "MIDDLE EAST",
    d: `M ${ORIGIN.x} ${ORIGIN.y} Q 444 182 606 196`,
    node: { x: 606, y: 196 },
    text: { x: 598, y: 182, anchor: "end" as const },
  },
  {
    id: "africa",
    label: "AFRICA",
    d: `M ${ORIGIN.x} ${ORIGIN.y} Q 350 348 438 418`,
    node: { x: 438, y: 418 },
    text: { x: 446, y: 410, anchor: "start" as const },
  },
] as const;

/** Sparse city blocks. Hand-placed, all inland of the coastline. */
const BLOCKS = [
  [150, 258, 40, 20],
  [200, 250, 44, 26],
  [252, 256, 34, 22],
  [296, 274, 50, 28],
  [186, 292, 58, 24],
  [256, 288, 40, 30],
  [308, 312, 44, 22],
  [352, 298, 38, 26],
  [222, 332, 52, 26],
  [290, 348, 46, 24],
  [360, 342, 42, 28],
  [140, 320, 44, 22],
] as const;

/** Arterials — three only, at angles that agree with the block field. */
const ROADS = ["M 96 268 L 520 452", "M 300 196 L 190 424", "M 150 352 L 486 296"] as const;

/** The Atlantic sits north-west of the city; this is the shoreline. */
const COASTLINE = "M -20 78 C 120 128 268 186 392 258 S 566 372 660 424";
const OCEAN = `${COASTLINE} L 660 -20 L -20 -20 Z`;

export function ReachPlate() {
  return (
    <svg
      viewBox="0 0 640 440"
      className="h-full w-full"
      aria-hidden
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id="reach-ocean" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.012" />
        </linearGradient>

        <radialGradient id="reach-bloom" cx="0.39" cy="0.54" r="0.5">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>

        {/* Fades every layer out toward the plate edges so nothing collides
            with the border — the panel reads as lit from its centre. */}
        <radialGradient id="reach-falloff" cx="0.39" cy="0.54" r="0.62">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="reach-mask">
          <rect x="0" y="0" width="640" height="440" fill="url(#reach-falloff)" />
        </mask>

        <pattern id="reach-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>

      <g mask="url(#reach-mask)">
        <rect x="0" y="0" width="640" height="440" fill="url(#reach-grid)" opacity="0.5" />
        <path d={OCEAN} fill="url(#reach-ocean)" />
        <rect x="0" y="0" width="640" height="440" fill="url(#reach-bloom)" />

        {/* City fabric */}
        <g fill="none" stroke="var(--color-border-strong)">
          {BLOCKS.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="2" strokeWidth="0.9" />
          ))}
          {ROADS.map((d) => (
            <path key={d} d={d} strokeWidth="1.4" strokeOpacity="0.75" />
          ))}
        </g>

        <path
          d={COASTLINE}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.34"
          strokeWidth="1.25"
        />

        {/* Range rings — the operating radius, drawn from the pin outward */}
        <g fill="none" stroke="var(--color-accent)">
          {RANGE_RINGS.map((r, i) => (
            <circle
              key={r}
              cx={ORIGIN.x}
              cy={ORIGIN.y}
              r={r}
              strokeWidth="0.9"
              strokeOpacity={0.26 - i * 0.045}
              strokeDasharray={i === 0 ? undefined : "1.5 7"}
            />
          ))}
        </g>

        {/* Outbound bearings */}
        <g fill="none" stroke="var(--color-accent)">
          {BEARINGS.map((bearing, i) => (
            <g key={bearing.id}>
              <path d={bearing.d} strokeWidth="1" strokeOpacity="0.16" />
              <path
                d={bearing.d}
                strokeWidth="1.25"
                strokeOpacity="0.7"
                strokeDasharray="2.5 11"
                className={i % 2 === 0 ? "animate-signal" : "animate-signal-slow"}
                style={{ animationDelay: `${i * 1100}ms` }}
              />
              <circle
                cx={bearing.node.x}
                cy={bearing.node.y}
                r="2.75"
                fill="var(--color-accent)"
                fillOpacity="0.9"
                stroke="none"
              />
            </g>
          ))}
        </g>

        {BEARINGS.map((bearing) => (
          <text
            key={bearing.id}
            x={bearing.text.x}
            y={bearing.text.y}
            textAnchor={bearing.text.anchor}
            fontSize="10.5"
            fontFamily="var(--font-geist-mono)"
            letterSpacing="0.18em"
            fill="var(--color-text-tertiary)"
          >
            {bearing.label}
          </text>
        ))}
      </g>

      {/* The pin — the one fully opaque thing on the plate */}
      <g style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }}>
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r="15"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.25"
          className="animate-marker-ping motion-reduce:hidden"
          style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }}
        />
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r="15"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.25"
          className="animate-marker-ping-late motion-reduce:hidden"
          style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }}
        />

        <circle cx={ORIGIN.x} cy={ORIGIN.y} r="22" fill="var(--color-accent)" fillOpacity="0.1" />

        {/* Reticle ticks — the detail that makes the pin read as an instrument */}
        <g stroke="var(--color-accent)" strokeWidth="1" strokeOpacity="0.55">
          <line x1={ORIGIN.x - 26} y1={ORIGIN.y} x2={ORIGIN.x - 15} y2={ORIGIN.y} />
          <line x1={ORIGIN.x + 15} y1={ORIGIN.y} x2={ORIGIN.x + 26} y2={ORIGIN.y} />
          <line x1={ORIGIN.x} y1={ORIGIN.y - 26} x2={ORIGIN.x} y2={ORIGIN.y - 15} />
          <line x1={ORIGIN.x} y1={ORIGIN.y + 15} x2={ORIGIN.x} y2={ORIGIN.y + 26} />
        </g>

        <circle cx={ORIGIN.x} cy={ORIGIN.y} r="4.5" fill="var(--color-accent)" />
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r="9"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        <text
          x={ORIGIN.x}
          y={ORIGIN.y - 36}
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.2em"
          fill="var(--color-text-secondary)"
        >
          CASABLANCA
        </text>
      </g>
    </svg>
  );
}
