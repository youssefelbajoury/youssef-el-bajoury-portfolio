import Image from "next/image";

import type { ProjectShot } from "@/types/project";

interface BrowserFrameProps {
  shot: ProjectShot;
  /** Rendered in the chrome's address pill. Route only — never a fake domain. */
  label: string;
  /** Portion of the capture to reveal. Wide strips read better cropped short. */
  aspect?: string;
  className?: string;
  sizes?: string;
}

/**
 * The second screenshot treatment: a windowed capture with real browser
 * chrome. Used where a laptop would repeat itself, so the two shots inside one
 * project never read as the same object twice.
 */
export function BrowserFrame({
  shot,
  label,
  aspect = "aspect-[16/9]",
  className = "",
  sizes = "(min-width: 1024px) 55vw, 92vw",
}: BrowserFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0b0d0f] shadow-[0_32px_64px_-28px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center gap-12 border-b border-white/[0.06] bg-white/[0.03] px-16 py-12">
        <div aria-hidden className="flex shrink-0 gap-8">
          <span className="size-8 rounded-full bg-white/15" />
          <span className="size-8 rounded-full bg-white/15" />
          <span className="size-8 rounded-full bg-white/15" />
        </div>
        <span className="truncate rounded-full border border-white/[0.07] bg-black/40 px-12 py-4 font-mono text-tooltip text-text-tertiary">
          {label}
        </span>
      </div>

      <div className={`relative ${aspect} overflow-hidden`}>
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className="object-cover object-top transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),transparent_45%)]"
        />
      </div>
    </div>
  );
}
