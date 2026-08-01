import { PROFILE } from "@/constants/profile";
import { STATUS_LENS, STATUS_LENS_SHADOW } from "@/styles/material";

/**
 * The availability line, set exactly as the Hero sets it.
 *
 * The lamp is the site's only 6px object and it is *lit*, not emitting: a white
 * specular at 34% / 26% — the key light's own direction — a shaded underside,
 * and a one-pixel contact shadow thrown down-and-right. What it replaced was a
 * green dot with a `ping` ripple, which is the single most recognisable
 * component-library tell on the web, and which put a second saturated colour on
 * a page whose colour argument is that there is one.
 *
 * The label is mono because it is a status field, and the supporting line sits
 * under it in the same voice. Sans is the person; mono is the machine.
 */
export function AvailabilityBadge() {
  return (
    <div className="inline-flex items-center gap-12">
      <span
        aria-hidden
        className="size-[6px] shrink-0 rounded-full"
        style={{ background: STATUS_LENS, boxShadow: STATUS_LENS_SHADOW }}
      />
      <div className="text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
          {PROFILE.availability.label}
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
          {PROFILE.availability.supportingText}
        </p>
      </div>
    </div>
  );
}
