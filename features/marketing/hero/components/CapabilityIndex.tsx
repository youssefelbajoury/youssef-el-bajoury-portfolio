import { CAPABILITY_INDEX } from "../heroContent";
import { DURATION, EASE_PREMIUM, ENTRANCE } from "../heroMotion";

/**
 * Six domains, set as a technical manifest.
 *
 * This is how the Hero claims eleven capabilities without listing one. It
 * carries almost no visual weight — 11px mono at the bottom of the frame —
 * and does most of the storytelling, which is exactly the trade you want:
 * the breadth is stated as fact, quietly, and never sold.
 *
 * At `lg` the six items sit on a 6-column grid, which is precisely two
 * columns of the page's 12 each, so every item's left edge lands on a grid
 * line the frame's ticks already mark.
 *
 * The column count below `lg` tracks the width of the container rather than the
 * width of the screen, which is why it does not simply climb. The widest label
 * is "06 INTELLIGENCE" — 129px at 11px mono on 0.2em tracking — and the index
 * is full-bleed on mobile but sits inside a seven-column column on tablet:
 *
 *   < 640      2 × 3, full bleed        171px cells at 390
 *   640–767    3 × 2, full bleed        197px cells at 640
 *   768–1023   2 × 3, inside the body   205px cells at 768
 *   ≥ 1024     6 × 1, along the frame   160px cells at 1024
 *
 * Three columns at 768 would give 137px cells and clear the longest label by
 * two pixels, which is not a margin — it is a coincidence waiting to break.
 *
 * MOTION. The row sweeps left to right on entry, 45ms between items — the
 * reading direction, so it registers as a line being set rather than six
 * things appearing. On hover a rule draws under the domain and the label
 * lifts one step in the type hierarchy. Nothing scales and nothing moves:
 * these are 11px labels on a strict grid, and a grid where the cells resize
 * under the pointer is not a grid.
 */
export function CapabilityIndex() {
  return (
    <ul className="grid grid-cols-2 gap-y-16 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-6">
      {CAPABILITY_INDEX.map((domain, index) => (
        <li
          key={domain.index}
          className="group flex animate-hero-rise items-baseline gap-8"
          style={{
            animationDelay: `${ENTRANCE.capabilityIndex + index * ENTRANCE.capabilityStep}ms`,
          }}
        >
          <span
            aria-hidden
            className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-text-tertiary transition-colors duration-fast ease-premium group-hover:text-text-secondary"
          >
            {domain.index}
          </span>

          {/* The rule is a child of the label rather than a sibling, so it
              inherits the label's exact width — a domain's underline should
              measure the domain, and "Intelligence" and "Data" are not the
              same length. `origin-left` makes it draw outward from the start
              of the word, which is the direction the word is read in. */}
          <span className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary transition-colors duration-fast ease-premium group-hover:text-text-primary">
            {domain.name}
            <span
              aria-hidden
              className="absolute -bottom-4 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform group-hover:scale-x-100"
              style={{
                transitionDuration: `${DURATION.rule / 2}ms`,
                transitionTimingFunction: EASE_PREMIUM,
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
