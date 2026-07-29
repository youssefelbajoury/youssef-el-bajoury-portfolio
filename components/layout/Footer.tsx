import { SocialLinks } from "@/components/shared/SocialLinks";
import { PROFILE } from "@/constants/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-content px-24 py-64 md:px-32">
        <div className="flex flex-col items-center gap-24 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="text-h5 font-semibold tracking-tight text-text-primary">{PROFILE.name}</p>
            <p className="mt-8 font-mono text-paragraph-sm text-text-secondary">
              Full Stack &middot; Cloud &middot; AI &middot; IoT Engineer
            </p>
          </div>
          <SocialLinks />
        </div>

        <div className="mt-48 flex flex-col items-center gap-8 border-t border-divider pt-24 font-mono text-caption text-text-tertiary lg:flex-row lg:justify-between">
          <p>
            &copy; {year} {PROFILE.name}. All rights reserved.
          </p>
          <p>Designed &amp; built with Next.js, TypeScript, Tailwind CSS.</p>
          <p>{PROFILE.location}</p>
        </div>
      </div>
    </footer>
  );
}
