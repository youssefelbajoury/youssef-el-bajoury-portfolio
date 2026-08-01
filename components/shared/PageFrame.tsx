import { CROP_MARK_COLOR, RULE_COLOR, TICK_COLOR } from "@/styles/material";

/**
 * The drafted page frame: hairline rules, column ticks along a rule, and crop
 * marks at the four corners.
 *
 * This is the single highest-leverage detail on the page. A technical drawing
 * frame is read instantly and pre-consciously as "drafted" rather than
 * "assembled", and no component library ships one — which is exactly why it
 * works. It costs about forty lines and no runtime.
 *
 * The frame is inset to the content container rather than bled to the viewport
 * edge. Inset reads as a printed page; full-bleed reads as a section divider.
 *
 * It began in the Hero and now frames every section, which is the point: one
 * drafting system stated on every sheet, rather than a Hero that was designed
 * and a page that was assembled beneath it.
 */

/** Column boundaries on a 12-column grid: the 11 gaps between the columns. */
const COLUMN_BOUNDARIES = Array.from({ length: 11 }, (_, i) => (i + 1) / 12);

interface FrameRuleProps {
  /**
   * Ticks are drawn on the top rule only. On both rules they would read as a
   * table; on one, as a ruler.
   */
  withTicks?: boolean;
}

/**
 * Ticks and crop marks are drawn from `md` up.
 *
 * At 768 the eleven ticks fall every 59px, which is a ruler, and the crop marks
 * sit 8px into a 32px gutter, which is a margin. Both hold.
 *
 * Mobile is deliberately left clean. The gutter there is 24px and the marks
 * would land 5px from the edge of the glass, where a registration mark stops
 * reading as a registration mark and starts reading as dirt on the screen.
 */
const FRAME_DETAIL = "hidden md:block";

export function FrameRule({ withTicks = false }: FrameRuleProps) {
  return (
    <div
      aria-hidden
      className="relative h-px w-full shrink-0"
      style={{ backgroundColor: RULE_COLOR }}
    >
      {withTicks &&
        COLUMN_BOUNDARIES.map((fraction) => (
          <span
            key={fraction}
            className={`absolute top-0 h-[6px] w-px ${FRAME_DETAIL}`}
            style={{ left: `${fraction * 100}%`, backgroundColor: TICK_COLOR }}
          />
        ))}
    </div>
  );
}

/**
 * Crop marks — the L-shaped registration corners a print sheet is trimmed to.
 *
 * Offset outside the content box, so they mark the boundary rather than
 * decorate the inside of it. Suppressed on mobile — see FRAME_DETAIL.
 */
export function CropMarks() {
  const arm = "absolute bg-current";
  const corners = [
    { key: "tl", box: "-left-8 -top-8", h: "left-0 top-0", v: "left-0 top-0" },
    { key: "tr", box: "-right-8 -top-8", h: "right-0 top-0", v: "right-0 top-0" },
    { key: "bl", box: "-bottom-8 -left-8", h: "bottom-0 left-0", v: "bottom-0 left-0" },
    { key: "br", box: "-bottom-8 -right-8", h: "bottom-0 right-0", v: "bottom-0 right-0" },
  ] as const;

  return (
    <div aria-hidden className={FRAME_DETAIL} style={{ color: CROP_MARK_COLOR }}>
      {corners.map((corner) => (
        <span key={corner.key} className={`absolute size-[11px] ${corner.box}`}>
          <span className={`${arm} h-px w-[11px] ${corner.h}`} />
          <span className={`${arm} h-[11px] w-px ${corner.v}`} />
        </span>
      ))}
    </div>
  );
}
