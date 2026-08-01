import { CropMarks, FrameRule } from "@/components/shared/PageFrame";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { PROFILE } from "@/constants/profile";
import { RULE_COLOR } from "@/styles/material";

/**
 * The colophon.
 *
 * Drawn inside the same frame every section is drawn in — ruled top edge with
 * the twelve column ticks, crop marks at the corners, ruled bottom edge — so
 * the page ends on the drawing rather than falling out of it. The name is the
 * one line set in sans, because it is a person; everything under it is a
 * catalogue field and is therefore mono.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative">
      {/* Same fifth off the seam as every SectionShell, so the page's last
          boundary matches the ones above it. */}
      <div className="mx-auto max-w-content px-24 py-48 md:px-32">
        <div className="relative">
          <CropMarks />
          <FrameRule withTicks />

          <div className="py-40">
            <div className="flex flex-col items-center gap-24 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <p className="text-h5 font-medium tracking-tight text-text-primary">
                  {PROFILE.name}
                </p>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                  Full Stack &middot; Cloud &middot; AI &middot; IoT Engineer
                </p>
              </div>
              <SocialLinks />
            </div>

            <div
              aria-hidden
              className="mt-48 h-px w-full"
              style={{ backgroundColor: RULE_COLOR }}
            />

            <div className="mt-24 flex flex-col items-center gap-8 font-mono text-[11px] tracking-[0.14em] text-text-tertiary lg:flex-row lg:justify-between">
              <p>
                &copy; {year} {PROFILE.name}. All rights reserved.
              </p>
              <p>Designed &amp; built with Next.js, TypeScript, Tailwind CSS.</p>
              <p>{PROFILE.location}</p>
            </div>
          </div>

          <FrameRule />
        </div>
      </div>
    </footer>
  );
}
