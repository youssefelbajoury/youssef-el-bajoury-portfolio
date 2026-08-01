import {
  READING_LIGHT,
  SCENE_CONNECTION,
  SCENE_CONSTRUCTION,
  SCENE_LABEL,
  SCENE_NODE,
  SCENE_OBJECT,
} from "../heroMaterial";
import {
  SCENE_DATUM,
  SCENE_OBJECT_BASE,
  SCENE_PARTICLES,
  SCENE_RUN,
  SCENE_STATIONS,
  SCENE_VIEWBOX,
} from "../sceneGeometry";

/**
 * The engineering scene — six things, drawn, standing on a datum line.
 *
 * WHAT IT IS FOR. A recruiter gives this page three seconds and reads no text.
 * In those three seconds the composition says "designer with taste". This layer
 * makes it also say "engineer who works across screens, services, data, cloud,
 * hardware and models" — by drawing them, at 2–5%, in space the composition was
 * already wasting.
 *
 * WHY IT IS NOT CLUTTER. Three rules, and they are the whole difference between
 * a technical drawing and icons scattered on a page:
 *
 *   IT RESTS ON SOMETHING. Every station stands on one datum and connects to
 *     its neighbours along one horizontal run. Objects sharing a baseline read
 *     as a system; objects at arbitrary heights read as clip art, which is
 *     precisely the failure the brief names.
 *
 *   IT IS AN ELEVATION, NOT A GRAPH. GlobalBackground already draws this system
 *     as topology. This draws it as things, square on, in outline. Two
 *     registers, no competition — put both in the same one and the page muds.
 *
 *   IT HAS A LINE HIERARCHY. Object outlines, connection lines, construction
 *     lines and annotation each carry a different alpha. That hierarchy is why
 *     it reads as *drawn* rather than as texture, and it is the thing nobody
 *     bothers with at 3%.
 *
 * HUMAN FIRST. The drawing is small, low, and left — it sits beneath the call
 * to action, in the band the audit found empty, and it never crosses the
 * headline, the plate or the index. The system is literally the foundation the
 * person stands on, which is the hierarchy the brief asks for.
 *
 * Held to `lg` and up. The band is measured against the 7 / 1 / 4 grid, and
 * below `lg` that grid collapses to one stacked column with no spare band. A
 * schematic squeezed between stacked content is the failure the brief forbids,
 * so on smaller screens it is not drawn at all.
 */
export function EngineeringScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden select-none lg:block">
      <ReadingLight />
      <Particles />
      <Band />
    </div>
  );
}

/**
 * The pass's one cursor interaction.
 *
 * A light shift rather than a parallax or a reflection, because the layer it
 * acts on is a *drawing*: a blueprint does not tilt toward you and does not
 * reflect — it resolves under the lamp you move across it. The gradient is
 * enormous and very weak, so no edge of it is ever resolvable; what registers
 * is that the schematic near the cursor is a little more legible, never that a
 * circle is following the mouse.
 *
 * It consumes --hero-px/py, which HeroStage already publishes, so this adds no
 * listener and no client component. Translating the element by a fraction of
 * its own size moves the gradient's centre across the full width for one
 * composited transform and never a layout.
 */
function ReadingLight() {
  return (
    /* Sized to 80% of the band rather than filling it. The layer has to be
       rasterised and composited every frame it moves, so its area is a direct
       cost; 80% keeps the texture smaller while the gradient's own falloff
       still reaches the edges. Travel is scaled to match — 31% of a 80% box is
       the same reach across the container as 25% of a full one. */
    <div
      className="absolute left-1/2 top-1/2 h-[80%] w-[80%] will-change-transform"
      style={{
        backgroundImage: READING_LIGHT,
        transform:
          "translate3d(calc(-50% + var(--hero-px) * 31%), calc(-50% + var(--hero-py) * 31%), 0)",
      }}
    />
  );
}

/**
 * The drawing itself, anchored to the bottom-left of the content column.
 *
 * `w-[65%]` and `bottom-8` are not arbitrary — see the measurement table in
 * sceneGeometry.ts. 65% clears the plate's left edge by at least 49px at every
 * width tested, and the 8px lift keeps the datum off the bottom frame rule so
 * the two hairlines never merge into one thick line.
 *
 * Height is left to the SVG's intrinsic aspect ratio rather than fixed, so the
 * band scales with the column instead of stretching.
 */
function Band() {
  const { width, height } = SCENE_VIEWBOX;

  return (
    /* Deliberately NOT promoted to its own compositor layer.
       The obvious optimisation here is `transform-gpu`, on the theory that the
       reading light moving over ~120 unpromoted vector elements forces a
       repaint of all of them every frame. It was tried and A/B-measured in one
       page session: median 18.8ms promoted against 18.4ms unpromoted, p95 36.3
       against 25.2. It does not help, and it costs a permanent layer for an
       element that never moves. Left unpromoted until a trace on real hardware
       says otherwise. */
    <div className="absolute bottom-8 left-0 w-[65%]">
      <svg
        className="w-full"
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        /* One stroke width for the whole drawing, set once. A technical drawing
           varies line weight through value, not through width — one pen, and
           the alpha does the rest. */
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Datum />
        <ConnectionRun />
        {/* Zipped against the registry rather than placed by hand, so a station
            can never be drawn at another station's coordinate — the drawing and
            its annotation read their x from the same row. */}
        {SCENE_STATIONS.map((station, position) => {
          const Art = STATION_ART[position];
          return Art ? <Art key={station.index} x={station.x} /> : null;
        })}
        <Annotations />
      </svg>
    </div>
  );
}

/**
 * The datum, drawn as a dimension line — end ticks turned outward, a tick under
 * each station. That convention is what tells the eye it is a measurement and
 * not a border.
 */
function Datum() {
  return (
    <g stroke={SCENE_CONSTRUCTION}>
      <path d={`M8 ${SCENE_DATUM} H832`} />
      <path d={`M8 ${SCENE_DATUM - 5} V${SCENE_DATUM + 5}`} />
      <path d={`M832 ${SCENE_DATUM - 5} V${SCENE_DATUM + 5}`} />
      {SCENE_STATIONS.map((station) => (
        <path key={station.index} d={`M${station.x} ${SCENE_DATUM - 3} V${SCENE_DATUM + 3}`} />
      ))}
    </g>
  );
}

/**
 * The API run: one continuous line threading all six stations, with a
 * connection point at each and a short drop from every object onto it. Drawn as
 * one path rather than five segments, because a system's transport is one
 * thing and not five couplings.
 */
function ConnectionRun() {
  /* Derived from the extremes rather than the first and last rows, so the run
     still spans every station if the registry is ever reordered. */
  const xs = SCENE_STATIONS.map((station) => station.x);

  return (
    <g>
      <path d={`M${Math.min(...xs)} ${SCENE_RUN} H${Math.max(...xs)}`} stroke={SCENE_CONNECTION} />
      {SCENE_STATIONS.map((station) => (
        <g key={station.index}>
          <path
            d={`M${station.x} ${SCENE_OBJECT_BASE} V${SCENE_RUN}`}
            stroke={SCENE_CONSTRUCTION}
          />
          <circle cx={station.x} cy={SCENE_RUN} r="2" fill={SCENE_NODE} />
        </g>
      ))}
    </g>
  );
}

/**
 * 01 — Interface. A laptop in elevation with a phone beside it.
 *
 * Two objects on one station, because "interface" is not one screen. It is also
 * why the phone is here rather than standing alone somewhere: six stations must
 * stay six, or the drawing stops matching the six-entry legend beneath it.
 */
function Interface({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="-46" y="30" width="62" height="38" rx="2" stroke={SCENE_OBJECT} />
      <rect x="-41" y="35" width="52" height="28" rx="1" stroke={SCENE_CONSTRUCTION} />
      <path d="M-46 68 L-54 78 H24 L16 68" stroke={SCENE_OBJECT} />
      <path d="M-24 74 H-6" stroke={SCENE_CONSTRUCTION} />
      <rect x="26" y="36" width="22" height="42" rx="4" stroke={SCENE_OBJECT} />
      <rect x="30" y="43" width="14" height="28" rx="1" stroke={SCENE_CONSTRUCTION} />
      <path d="M33 40 H41" stroke={SCENE_CONSTRUCTION} />
    </g>
  );
}

/** 02 — Services. Three service bars, each with a status point. */
function Services({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {[32, 49, 66].map((y) => (
        <g key={y}>
          <rect x="-30" y={y} width="60" height="12" rx="2" stroke={SCENE_OBJECT} />
          <circle cx="-22" cy={y + 6} r="1.6" fill={SCENE_NODE} />
          <path d={`M-15 ${y + 6} H20`} stroke={SCENE_CONSTRUCTION} />
        </g>
      ))}
    </g>
  );
}

/** 03 — Data. The cylinder, with one platter line. */
function Data({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`} stroke={SCENE_OBJECT}>
      <ellipse cx="0" cy="38" rx="26" ry="8" />
      <path d="M-26 38 V70" />
      <path d="M26 38 V70" />
      <path d="M-26 70 A26 8 0 0 0 26 70" />
      <path d="M-26 54 A26 8 0 0 0 26 54" stroke={SCENE_CONSTRUCTION} />
    </g>
  );
}

/**
 * 04 — Cloud. The network-diagram glyph as a single hairline outline.
 *
 * The one symbol here that risks reading as a cartoon. What keeps it technical
 * is that it is one closed path, at the same pen weight as the cylinder and the
 * chip, with no fill, no gradient and no soft corner — the standard symbol on a
 * real network drawing rather than a weather icon.
 */
function Cloud({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M-34 70 A12 12 0 0 1 -30 46 A19 19 0 0 1 -1 34 A16 16 0 0 1 26 45 A13 13 0 0 1 30 70 Z"
        stroke={SCENE_OBJECT}
      />
      <circle cx="-12" cy="57" r="1.8" fill={SCENE_NODE} />
      <circle cx="4" cy="51" r="1.8" fill={SCENE_NODE} />
      <circle cx="15" cy="60" r="1.8" fill={SCENE_NODE} />
      <path d="M-12 57 L4 51 L15 60" stroke={SCENE_CONSTRUCTION} />
    </g>
  );
}

/**
 * 05 — Edge. A microcontroller in plan: body, die, pin rows, radiating arcs.
 *
 * The pin rows are what make it unmistakably an MCU rather than a rectangle,
 * and the arcs are what make it a wireless one — which is the single most
 * specific thing this whole drawing says about the work.
 */
function Edge({ x }: { x: number }) {
  const pins = [42, 52, 62, 72];

  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="-28" y="34" width="56" height="44" rx="2" stroke={SCENE_OBJECT} />
      <rect x="-15" y="46" width="30" height="20" rx="1" stroke={SCENE_CONSTRUCTION} />
      <g stroke={SCENE_CONNECTION}>
        {pins.map((y) => (
          <path key={y} d={`M-28 ${y} H-38 M28 ${y} H38`} />
        ))}
      </g>
      <path d="M12 30 A12 12 0 0 1 34 30" stroke={SCENE_CONNECTION} />
      <path d="M16 22 A19 19 0 0 1 42 22" stroke={SCENE_CONSTRUCTION} />
    </g>
  );
}

/**
 * 06 — Intelligence. A 2–3–2 fan: twelve edges, the smallest network that still
 * reads as one. A denser mesh at this alpha stops resolving into nodes and
 * becomes a smudge, which is how every low-opacity "AI" graphic fails.
 */
function Intelligence({ x }: { x: number }) {
  const input = [42, 68];
  const hidden = [34, 55, 76];
  const output = [42, 68];

  return (
    <g transform={`translate(${x} 0)`}>
      <g stroke={SCENE_CONSTRUCTION}>
        {input.map((from) =>
          hidden.map((to) => <path key={`i${from}-${to}`} d={`M-26 ${from} L0 ${to}`} />)
        )}
        {hidden.map((from) =>
          output.map((to) => <path key={`h${from}-${to}`} d={`M0 ${from} L26 ${to}`} />)
        )}
      </g>
      <g fill={SCENE_NODE}>
        {input.map((y) => (
          <circle key={`i${y}`} cx="-26" cy={y} r="2.5" />
        ))}
        {hidden.map((y) => (
          <circle key={`h${y}`} cx="0" cy={y} r="2.5" />
        ))}
        {output.map((y) => (
          <circle key={`o${y}`} cx="26" cy={y} r="2.5" />
        ))}
      </g>
    </g>
  );
}

/** The six drawings, in registry order: 01 Interface … 06 Intelligence. */
const STATION_ART = [Interface, Services, Data, Cloud, Edge, Intelligence] as const;

/**
 * Annotation: the technology tag above each object, at 9px.
 *
 * Above rather than below, and without the index number, for one reason — the
 * capability index sits directly beneath this band on a different column rhythm,
 * and a numbered label under each station would read as a second, misaligned
 * copy of it. The number stays on the legend; the drawing carries the tag.
 *
 * Every tag names something in data/skills.ts or data/projects.ts, never a
 * measurement. See the `tag` field in sceneGeometry.ts for why.
 */
function Annotations() {
  return (
    <g
      fill={SCENE_LABEL}
      fontSize="9"
      letterSpacing="1.4"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {SCENE_STATIONS.map((station) => (
        <text key={station.index} x={station.x} y="12" textAnchor="middle">
          {station.tag}
        </text>
      ))}
    </g>
  );
}

/**
 * Fourteen particles on their own layer, spread across the section's empty
 * regions rather than confined to the drawing's band.
 *
 * Drift is 5px over 22–35 seconds — under a pixel every four seconds. Nothing
 * here is meant to be caught moving; what it buys is that the layer is never
 * quite the same twice, which is the difference between a page that is still
 * and one that is dead.
 */
function Particles() {
  return (
    <div className="absolute inset-0">
      {SCENE_PARTICLES.map((particle) => (
        <span
          key={`${particle.left}-${particle.top}`}
          className="absolute size-[3px] animate-scene-drift rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            backgroundColor: SCENE_NODE,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
