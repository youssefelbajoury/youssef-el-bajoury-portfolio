"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Boxes,
  BrainCircuit,
  Cloud,
  Cpu,
  Database,
  LayoutGrid,
  Network,
  Server,
  Smartphone,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { buildRevealVariants, REVEAL_VIEWPORT } from "@/components/shared/revealMotion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionShell } from "@/components/shared/SectionShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TECHNICAL_SKILL_CATEGORIES } from "@/data/skills/skills-data";
import type { TechnicalSkillCategory } from "@/data/skills/skills-data";
import { getTechnologyAsset } from "@/data/technology-assets";
import { RULE_COLOR } from "@/styles/material";

import { SkillCategoryPanel } from "./SkillCategoryPanel";

import type { LucideIcon } from "lucide-react";

type CategoryId = (typeof TECHNICAL_SKILL_CATEGORIES)[number]["id"];

const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  frontend: LayoutGrid,
  backend: Server,
  databases: Database,
  mobile: Smartphone,
  ai: BrainCircuit,
  "big-data": Boxes,
  cloud: Cloud,
  api: Network,
  bi: Activity,
  iot: Cpu,
  tools: Wrench,
};

/** The first few names keep the card's rhythm; the full set lives in the panel. */
const PREVIEW_COUNT = 4;

/**
 * Technical skills, still set as a drawn index of numbered panels.
 *
 * Each card now carries the first supplied logo from its category as a small
 * representative mark, with the lucide glyph kept only as a fallback for a
 * missing asset. A short badge preview remains on the card; the complete, exact
 * CV list with every logo is rendered only in the panel.
 */
export function SkillsPreview() {
  const [activeCategory, setActiveCategory] = useState<TechnicalSkillCategory | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { container, item } = buildRevealVariants(prefersReducedMotion);

  return (
    <SectionShell id="skills" labelledBy="skills-title">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        variants={container}
      >
        <motion.div variants={item}>
          <SectionHeading
            index="05"
            kicker="Technical Skills"
            titleId="skills-title"
            title="Every layer of the stack."
            statement={
              <>
                Eleven areas, one working system &mdash; from the interface and its APIs down to the
                data platform, the cloud it runs on, and the devices at the edge.
              </>
            }
          />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-64 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TECHNICAL_SKILL_CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            const representative = getTechnologyAsset(category.technologies[0] ?? "");
            const preview = category.technologies.slice(0, PREVIEW_COUNT);
            const remainder = category.technologies.length - preview.length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={(event) => {
                  /* Keep the trigger focused even when activation is
                     programmatic, so the native dialog restores to the card
                     that opened it rather than to whichever card happened to
                     hold focus beforehand. Pointer and keyboard activation
                     already do this; making it explicit closes the gap. */
                  event.currentTarget.focus();
                  setActiveCategory(category);
                }}
                aria-haspopup="dialog"
                aria-label={`Open the ${category.title} technology gallery`}
                className="group/category block w-full rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <Card className="relative p-24">
                  <div className="flex items-center gap-12">
                    <span className="relative flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.045)]">
                      {representative ? (
                        <Image
                          src={representative.image}
                          alt={representative.alt}
                          width={representative.image.width}
                          height={representative.image.height}
                          sizes="32px"
                          className="size-full object-contain p-[5px]"
                        />
                      ) : (
                        <Icon
                          className="size-20 text-text-tertiary"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      )}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-h6 font-medium tracking-tight text-text-primary">
                        {category.title}
                      </h3>
                      <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-text-tertiary">
                        {category.technologies.length} technologies
                      </p>
                    </div>

                    {/* The sheet number, flush right. Two digits, tabular, and
                        the one field on the panel set as a machine would set it. */}
                    <span
                      aria-hidden
                      className="ml-auto font-mono text-[11px] tabular-nums tracking-[0.1em] text-text-tertiary"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div aria-hidden className="mt-16 h-px" style={{ backgroundColor: RULE_COLOR }} />

                  <ul className="mt-16 flex flex-wrap gap-8">
                    {preview.map((technology) => (
                      <li key={technology}>
                        <Badge>{technology}</Badge>
                      </li>
                    ))}
                    {remainder > 0 ? (
                      <li aria-hidden>
                        <Badge>+{remainder}</Badge>
                      </li>
                    ) : null}
                  </ul>

                  {/* A hairline, not a ring: the accent is ink on the panel,
                      never emitted light around it. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-24 bottom-0 h-px origin-left scale-x-0 bg-[rgba(46,230,255,0.55)] transition-transform duration-medium ease-premium group-hover/category:scale-x-100 group-focus-visible/category:scale-x-100"
                  />
                </Card>
              </button>
            );
          })}
        </motion.div>

        <motion.div variants={item} className="mt-48">
          <Button variant="secondary" size="sm" disabled>
            View Full Tech Stack
          </Button>
          <p className="mt-12 font-mono text-[11px] tracking-[0.14em] text-text-tertiary">
            Full tech stack page coming soon.
          </p>
        </motion.div>
      </motion.div>

      {activeCategory ? (
        <SkillCategoryPanel
          category={activeCategory}
          onClose={() => setActiveCategory(null)}
          onCategoryChange={setActiveCategory}
        />
      ) : null}
    </SectionShell>
  );
}
