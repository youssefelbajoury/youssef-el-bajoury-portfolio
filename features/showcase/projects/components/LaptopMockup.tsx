import Image from "next/image";

import type { ProjectShot } from "@/types/project";

interface LaptopMockupProps {
  shot: ProjectShot;
  /** Set on the first mockup in the viewport-adjacent tile only. */
  priority?: boolean;
  /** Adds a mirrored, masked floor reflection beneath the machine. */
  reflection?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * A screenshot presented as a product shot rather than a raw capture: milled
 * aluminium lid, black bezel with a camera dot, a screen carrying its own
 * glass sheen and vignette, a hinge base wider than the lid, and an optional
 * floor reflection.
 *
 * Every dimension is proportional (rem/percentage), so one component serves
 * the 7-column hero tile and a narrow mobile column without redrawing.
 *
 * The screen image scales on `group-hover`, which is owned by the enclosing
 * TiltCard — the zoom stays in sync with the tilt instead of firing on its own.
 */
export function LaptopMockup({
  shot,
  priority = false,
  reflection = false,
  className = "",
  sizes = "(min-width: 1024px) 55vw, 92vw",
}: LaptopMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Ambient accent bloom behind the machine */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[10%] -top-[14%] bottom-[10%] rounded-full bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--project-accent-rgb)/18%),transparent_70%)] blur-3xl transition-opacity duration-slow ease-premium group-hover:opacity-90"
      />

      {/* Lid */}
      <div className="relative rounded-[1.35rem] bg-gradient-to-b from-[#43474e] via-[#1d2023] to-[#0d0f11] p-[0.4rem] shadow-[0_44px_88px_-36px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.16)]">
        <div className="relative rounded-[1.05rem] bg-[#040506] p-[0.42rem] ring-1 ring-inset ring-white/[0.07]">
          <div
            aria-hidden
            className="absolute left-1/2 top-[0.14rem] size-[3px] -translate-x-1/2 rounded-full bg-white/20"
          />

          <div className="relative aspect-[16/10] overflow-hidden rounded-[0.7rem] bg-black">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              priority={priority}
              sizes={sizes}
              placeholder="blur"
              className="object-cover object-top transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.045]"
            />

            {/* Glass sheen — a fixed diagonal highlight across the panel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_36%,rgba(255,255,255,0)_64%,rgba(255,255,255,0.06)_100%)]"
            />

            {/* Screen vignette — keeps bright screenshots from blowing out the
                near-black canvas at the edges */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_48px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Hinge base — deliberately wider than the lid, as on a real machine */}
      <div
        aria-hidden
        className="relative -mx-[6%] h-[0.8rem] rounded-b-[0.55rem] rounded-t-[0.1rem] bg-gradient-to-b from-[#52575e] via-[#2a2e33] to-[#131518] shadow-[0_20px_34px_-14px_rgba(0,0,0,0.9)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
        <div className="absolute left-1/2 top-0 h-[0.2rem] w-[13%] -translate-x-1/2 rounded-b-full bg-[#0a0b0d]/85" />
      </div>

      {reflection ? (
        <div
          aria-hidden
          className="relative mt-[0.35rem] aspect-[16/3] overflow-hidden opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
        >
          <Image
            src={shot.src}
            alt=""
            fill
            sizes={sizes}
            className="-scale-y-100 object-cover object-top blur-[2px]"
          />
        </div>
      ) : null}
    </div>
  );
}
