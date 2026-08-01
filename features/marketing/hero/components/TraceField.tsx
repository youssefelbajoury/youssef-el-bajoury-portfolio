import { HERO_TRACES } from "../heroContent";
import { SCAN_BEAM, TRACE_COLOR } from "../heroMaterial";
import { PARALLAX, SCROLL_DEPTH } from "../heroMotion";

/**
 * The discoverable layer.
 *
 * Fragments of the systems behind the work, printed onto the page at about 3%
 * and anchored to the 12-column grid. At rest they are not visible; leaning
 * in, they resolve. That delay is the whole effect — a recruiter who spends
 * ten seconds on the page finds something a recruiter who spends two does not.
 *
 * One register only. The GlobalBackground already carries a *geometric*
 * schematic (nodes and edges); this layer is deliberately *typographic*, so
 * the two read as different strata of the same drawing rather than competing
 * for the same job. Two schematics in the same register would make mud.
 *
 * Held back below `md`, and thinned to three traces between `md` and `lg`. On a
 * phone the composition has no spare negative space at all — the portrait now
 * leads it — and a 3% layer squeezed between elements stops reading as a secret
 * and starts reading as dirt. The tablet has exactly one empty band, and only
 * what fits inside it is printed there; see HERO_TRACES.tablet.
 *
 * MOTION. Three channels, all of them under the threshold of notice:
 *
 *   BREATHING   each trace drifts between 45% and 100% of its 3% opacity on a
 *     nine-second cycle, every one of them on a different offset so the field
 *     never pulses in unison. Synchronised is the tell — it reads as a loading
 *     state. Unsynchronised reads as a signal.
 *
 *   PACKETS     a hairline dot runs the width of a trace and out, on a six-
 *     second loop. Only on the traces that name something a packet could
 *     plausibly travel along, because a "packet" leaving a label that is not a
 *     link is nonsense the eye picks up even at 3%.
 *
 *   THE BEAM    one very wide, very faint band crossing the section every 34
 *     seconds. It is not a scanline and must never resolve into one: at a
 *     third of the section's width the edges are unresolvable and what
 *     registers is the level of the page changing slightly as it passes.
 *
 * None of this is meant to be seen on arrival. If you notice it in the first
 * five seconds, it is too strong.
 */
export function TraceField() {
  return (
    /* Sized and padded exactly like the content container, so `left` really is
       a column boundary rather than a fraction of the viewport. Kept a sibling
       *before* the container rather than a child of it: an absolutely
       positioned element paints above in-flow block content, so nesting this
       inside the frame would put the traces on top of the headline instead of
       behind it. */
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden h-full w-full max-w-content select-none px-24 md:block md:px-32"
    >
      {/* The whole field drifts *against* the pointer and lags the scroll.
          Against, not with: a background that moves the same direction as the
          foreground reads as the page sliding, and the opposite direction is
          what actually separates the two planes. */}
      <div
        className="relative h-full w-full will-change-transform"
        style={{
          transform: `translate3d(calc(var(--hero-px) * ${PARALLAX.traces}px), calc(var(--hero-scroll) * ${SCROLL_DEPTH.tracesLag}px), 0)`,
        }}
      >
        {HERO_TRACES.map((trace, index) => (
          /* Two placements per trace, handed over as custom properties and
             applied by class rather than written as `left` and `top` directly.
             The coordinates come from data, and Tailwind cannot generate a class
             from a value it only sees at runtime — but it can generate
             `left-[var(--trace-left)]` once, and let the variable do the moving.
             That is what buys a tablet placement that is genuinely different
             from the desktop one rather than a scaled copy of it. */
          <span
            key={trace.text}
            className={`absolute whitespace-nowrap font-mono text-[11px] tracking-[0.18em] left-[var(--trace-left)] top-[var(--trace-top)] lg:left-[var(--trace-left-lg)] lg:top-[var(--trace-top-lg)] ${
              trace.tablet ? "" : "hidden lg:block"
            }`}
            style={
              {
                "--trace-left": trace.tablet?.left ?? trace.left,
                "--trace-top": trace.tablet?.top ?? trace.top,
                "--trace-left-lg": trace.left,
                "--trace-top-lg": trace.top,
                color: TRACE_COLOR,
              } as React.CSSProperties
            }
          >
            {/* Breathing lives on an inner span so the outer one keeps owning
                position. Prime-ish offsets — 1.7s apart, over a 9s cycle —
                so the ten traces never come back into phase with each other. */}
            <span
              className="block animate-trace-breathe"
              style={{ animationDelay: `${-(index * 1.7).toFixed(2)}s` }}
            >
              {trace.text}
            </span>

            {trace.packet && (
              /* The packet leaves from the end of the label and runs 10px clear
                 of it, then fades. Deliberately not the label's own width: a
                 2px dot crossing 120px of "POST /api/sensors" at 3% opacity is a
                 dot travelling over its own text, which reads as a defect in the
                 text. Leaving *from* the end reads as a packet on a wire. The
                 run is short because the eye only needs the departure. */
              <span
                className="absolute -right-8 top-1/2 block size-[2px] animate-trace-packet rounded-full bg-current"
                style={
                  {
                    "--packet-run": "10px",
                    animationDelay: `${(index * 0.9).toFixed(2)}s`,
                  } as React.CSSProperties
                }
              />
            )}
          </span>
        ))}
      </div>

      {/* The beam sits outside the parallax wrapper: it is the light crossing
          the page, not something printed on it, so it does not drift with the
          layer it illuminates. */}
      <div
        className="absolute inset-y-0 -left-1/3 w-1/3 animate-scan-beam will-change-transform"
        style={{ backgroundImage: SCAN_BEAM }}
      />
    </div>
  );
}
