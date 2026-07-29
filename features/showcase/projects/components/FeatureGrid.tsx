import {
  Activity,
  BrainCircuit,
  Cpu,
  Heart,
  LayoutGrid,
  Monitor,
  Search,
  Server,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  Tag,
} from "lucide-react";

import type { ProjectFeature, ProjectFeatureIcon } from "@/types/project";

import type { LucideIcon } from "lucide-react";

/**
 * Closed map — `ProjectFeatureIcon` is a union, so adding a highlight without
 * an icon here is a compile error rather than a blank square in production.
 */
const FEATURE_ICONS: Record<ProjectFeatureIcon, LucideIcon> = {
  iot: Cpu,
  ai: BrainCircuit,
  web: Monitor,
  mobile: Smartphone,
  backend: Server,
  dashboard: Activity,
  catalogue: LayoutGrid,
  filters: SlidersHorizontal,
  favourites: Heart,
  product: Tag,
  search: Search,
  responsive: Tablet,
};

interface FeatureGridProps {
  features: ProjectFeature[];
  className?: string;
}

export function FeatureGrid({ features, className = "" }: FeatureGridProps) {
  return (
    <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border ${className}`}>
      {features.map((feature) => {
        const Icon = FEATURE_ICONS[feature.icon];

        return (
          <li
            key={feature.label}
            className="group/feature flex items-center gap-12 bg-surface px-16 py-16 transition-colors duration-medium ease-standard hover:bg-surface-raised"
          >
            <Icon
              className="size-16 shrink-0 text-text-tertiary transition-colors duration-medium ease-standard group-hover/feature:text-[var(--project-accent)]"
              aria-hidden
            />
            <span className="text-paragraph-sm font-medium text-text-secondary transition-colors duration-medium ease-standard group-hover/feature:text-text-primary">
              {feature.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
