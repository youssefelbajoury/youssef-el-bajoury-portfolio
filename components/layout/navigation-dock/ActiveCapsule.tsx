"use client";

import { motion } from "framer-motion";

import { CAPSULE_RIM, CAPSULE_SPRING } from "./dockMaterial";

/** Shared id — this is one capsule that travels, not five that toggle. */
export const CAPSULE_LAYOUT_ID = "navigation-dock-capsule";

/**
 * The illuminated glass capsule behind the active item.
 *
 * It is mounted inside whichever item is active and shares one `layoutId`, so
 * switching sections makes Framer travel and re-shape the same element between
 * two different widths rather than crossfading two rectangles. Because Framer
 * drives a layout change through scale, the capsule genuinely stretches as it
 * leaves and compresses as it lands — the squash comes from the physics, not
 * from a keyframe pretending to be physics.
 *
 * There is exactly one moving element in here: the progress light. Everything
 * else — rim, illumination, spotlight — is static lighting. Ambient motion
 * belongs to the dock's glass, one layer out; stacking a second travelling
 * thing inside the capsule turns a signature into a busy widget.
 *
 * Reduced motion is handled by the `motion-reduce:` variant and the enclosing
 * MotionConfig rather than by branching on a hook — the branch would render
 * different markup on the server than on the client and break hydration.
 */
export function ActiveCapsule() {
  return (
    <motion.span
      aria-hidden
      layoutId={CAPSULE_LAYOUT_ID}
      transition={CAPSULE_SPRING}
      style={{ borderRadius: 9999, boxShadow: CAPSULE_RIM }}
      /* Inset vertically: the item is 44px tall to meet the touch-target
         minimum, but the capsule is the 40px object the eye reads. The extra
         2px per side is hit area, not glass. */
      className="absolute inset-x-0 inset-y-[2px] overflow-hidden"
    >
      {/* Body — a thin sheet of brighter glass sitting in the dock's glass. */}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]" />

      {/* Internal illumination: cyan pooled under the floor of the capsule,
          kept low so the accent reads as light in the material rather than as
          a coloured fill. */}
      <span className="absolute inset-x-0 -bottom-1/2 h-[160%] bg-[radial-gradient(56%_100%_at_50%_100%,rgba(46,230,255,0.30),rgba(46,230,255,0.05)_52%,transparent_74%)]" />

      {/* Spotlight from above. */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(72%_100%_at_50%_0%,rgba(255,255,255,0.16),transparent_72%)]" />

      {/* Progress — the one moving element. A light travelling a hairline
          track, with its own bloom riding along: an instrument reporting that
          this section is held, not a bar reporting that something is loading. */}
      <span className="absolute inset-x-12 bottom-[3px] h-px overflow-hidden rounded-full bg-[rgba(255,255,255,0.09)]">
        <motion.span
          className="absolute inset-y-0 w-2/5 rounded-full bg-[linear-gradient(90deg,transparent,rgba(46,230,255,0.9)_45%,rgba(196,247,255,1)_50%,rgba(46,230,255,0.9)_55%,transparent)] shadow-[0_0_6px_1px_rgba(46,230,255,0.45)] motion-reduce:hidden"
          animate={{ x: ["-110%", "360%"] }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            repeatDelay: 1.6,
            ease: [0.5, 0, 0.5, 1],
          }}
        />
      </span>
    </motion.span>
  );
}
