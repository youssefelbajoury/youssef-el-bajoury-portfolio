import { PROFILE } from "@/constants/profile";

export function AvailabilityBadge() {
  return (
    <div className="inline-flex items-center gap-12 rounded-lg border border-border bg-[color-mix(in_srgb,var(--color-surface)_60%,transparent)] px-16 py-12 backdrop-blur-glass">
      <span className="relative flex size-8 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex size-8 rounded-full bg-success" />
      </span>
      <div className="text-left">
        <p className="text-paragraph-sm font-semibold text-text-primary">
          {PROFILE.availability.label}
        </p>
        <p className="text-caption text-text-secondary">{PROFILE.availability.supportingText}</p>
      </div>
    </div>
  );
}
