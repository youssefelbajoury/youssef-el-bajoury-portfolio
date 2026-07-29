/**
 * Fixed, page-wide backdrop — a quiet architecture schematic rather than a
 * decorative gradient. Six nodes (the disciplines named across the page:
 * frontend, API, database, cloud, IoT, AI) are connected by thin traces
 * carrying a slow-traveling signal, visualizing the site's own thesis —
 * "an engineer who thinks in systems" — as atmosphere instead of illustration.
 * Nodes sit inside a central safe zone of the viewBox so they survive the
 * xMidYMid-slice crop across mobile-portrait through ultra-wide aspect
 * ratios. Pure SVG + CSS animation (opacity, stroke-dashoffset, transform
 * only), so it's cheap and fully neutralized by prefers-reduced-motion.
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

      <svg
        viewBox="0 0 1400 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full animate-drift-slow opacity-90 motion-reduce:animate-none"
      >
        <g fill="none" stroke="var(--color-accent)" strokeWidth="1.25">
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
                strokeOpacity={0.4}
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
            <circle cx={n.x} cy={n.y} r={30} fill="var(--color-accent)" opacity={0.14} />
            <circle cx={n.x} cy={n.y} r={5} fill="var(--color-accent)" opacity={0.95} />
            <text
              x={n.x}
              y={n.y - 20}
              textAnchor="middle"
              fontSize="13"
              fontFamily="var(--font-geist-mono)"
              letterSpacing="0.12em"
              fill="var(--color-text-tertiary)"
              opacity={0.85}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
