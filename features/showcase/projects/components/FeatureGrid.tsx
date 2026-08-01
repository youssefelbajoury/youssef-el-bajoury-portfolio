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
    /* A ruled table, not a set of tiles: the 1px gaps are the rules between
       cells and they carry the frame's own value, so this reads as part of the
       same drawing as the section around it. */
    <ul
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-[rgba(255,255,255,0.06)] ${className}`}
    >
      {features.map((feature) => {
        const Icon = FEATURE_ICONS[feature.icon];

        return (
          <li
            key={feature.label}
            className="group/feature flex items-center gap-12 bg-[#0c0d0f] px-16 py-16 transition-colors duration-medium ease-premium hover:bg-[#131417]"
          >
            <Icon
              className="size-16 shrink-0 text-text-tertiary transition-colors duration-medium ease-premium group-hover/feature:text-text-secondary"
              strokeWidth={1.25}
              aria-hidden
            />
            <span className="text-paragraph-sm font-medium text-text-secondary transition-colors duration-medium ease-premium group-hover/feature:text-text-primary">
              {feature.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
