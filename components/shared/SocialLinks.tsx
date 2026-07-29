"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";

import { GitHubGlyph, LinkedInGlyph } from "@/components/shared/BrandGlyphs";
import { SOCIAL_LINKS } from "@/constants/profile";

const LINKS = [
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: GitHubGlyph },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: LinkedInGlyph },
  { label: "Email", href: SOCIAL_LINKS.email, Icon: Mail },
] as const;

interface SocialLinksProps {
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<SocialLinksProps["size"]>, string> = {
  sm: "size-32",
  md: "size-40",
};

const ICON_SIZE_CLASSES: Record<NonNullable<SocialLinksProps["size"]>, string> = {
  sm: "size-16",
  md: "size-20",
};

export function SocialLinks({ size = "md", className = "" }: SocialLinksProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <ul className={`flex items-center gap-8 ${className}`}>
      {LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <motion.a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
            aria-label={label}
            whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
            className={`flex items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-fast ease-standard hover:border-border-strong hover:bg-hover-surface hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${SIZE_CLASSES[size]}`}
          >
            <Icon className={ICON_SIZE_CLASSES[size]} aria-hidden />
          </motion.a>
        </li>
      ))}
    </ul>
  );
}
