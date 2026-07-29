"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SocialLinks } from "@/components/shared/SocialLinks";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-navigation border-b transition-colors duration-medium ease-standard ${
        isScrolled
          ? "border-glass-border bg-glass-background backdrop-blur-glass"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-24 py-16 md:px-32">
        <Link
          href="/"
          className="rounded-sm text-paragraph font-semibold tracking-tight text-text-primary transition-colors duration-fast ease-standard hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Youssef El Bajoury
        </Link>
        <SocialLinks size="sm" />
      </div>
    </header>
  );
}
