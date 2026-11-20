import Image from "next/image";

import type { TechnologyAsset } from "@/data/technology-assets";

/**
 * One technology in the explorer gallery.
 *
 * The supplied image is shown at its natural colours inside a fixed square,
 * using `object-fit: contain` so nothing is cropped or stretched. Intrinsic
 * width and height come from the static import in the manifest, and the square
 * itself is sized in CSS, so the card cannot shift when the image loads.
 *
 * The monogram remains only as a last-resort fallback for a technology without
 * a verified local asset. It is never used while a supplied image is present.
 */

interface TechnologyCardProps {
  name: string;
  asset?: TechnologyAsset;
}

function monogram(name: string): string {
  const words = name.split(/[^A-Za-z0-9]+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
  }

  return (name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "?").toUpperCase();
}

export function TechnologyCard({ name, asset }: TechnologyCardProps) {
  const label = asset?.name ?? name;

  return (
    <div className="group/tech relative flex h-[7.5rem] w-full max-w-[9rem] flex-col items-center justify-center gap-8 overflow-hidden rounded-sm border border-[rgba(255,255,255,0.07)] bg-[rgba(12,13,15,0.78)] px-8 py-12 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.055)] backdrop-blur-glass transition-[transform,border-color,box-shadow] duration-200 ease-premium hover:-translate-y-[2px] hover:border-[rgba(46,230,255,0.28)] hover:shadow-[inset_0_1px_0_0_rgba(46,230,255,0.14),0_0_18px_-8px_rgba(46,230,255,0.38)]">
      {/* A restrained neutral well keeps pale artwork legible without tinting
          any logo. The artwork itself is never filtered. */}
      <span className="relative flex size-[48px] shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.05)] sm:size-[56px] lg:size-[64px]">
        {asset ? (
          <Image
            src={asset.image}
            alt={asset.alt}
            width={asset.image.width}
            height={asset.image.height}
            sizes="(min-width: 1024px) 64px, (min-width: 640px) 56px, 48px"
            className="size-full object-contain p-[6px] transition-transform duration-200 ease-premium group-hover/tech:scale-[1.06]"
          />
        ) : (
          <span
            aria-hidden
            className="font-mono text-[13px] font-medium tracking-[0.08em] text-text-tertiary"
          >
            {monogram(label)}
          </span>
        )}
      </span>

      <span className="w-full break-words text-badge font-medium leading-snug text-text-secondary transition-colors duration-200 ease-premium group-hover/tech:text-text-primary">
        {label}
      </span>
    </div>
  );
}
