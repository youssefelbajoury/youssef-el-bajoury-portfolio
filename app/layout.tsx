import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Footer } from "@/components/layout/Footer";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { NavigationDock } from "@/components/layout/navigation-dock";
import { PortfolioLoader } from "@/components/layout/portfolio-loader";
import { env } from "@/lib/env";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Youssef El Bajoury — Full Stack Software Engineer",
  description:
    "I build production-grade software that transforms complex business challenges into simple, scalable, and intuitive digital solutions.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  /*
    scroll-smooth so the Hero's plain `href="#contact"` anchor travels the same
    way the dock does, with no JavaScript. The reduced-motion block in
    globals.css already forces scroll-behavior back to auto, and the dock passes
    an explicit `behavior` to scrollIntoView, so neither is affected.
  */
  return (
    <html lang="en" className={`dark scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}>
      {/* The trailing padding is the dock's berth: the floating dock is out of
          flow, so the page has to end above it rather than under it. */}
      <body className="bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] font-sans text-text-primary antialiased">
        <GlobalBackground />
        {children}
        <Footer />
        <NavigationDock />

        {/* Last in the document, and it changes nothing above it. The loader is
            a fixed overlay: the page is rendered, laid out and painted exactly
            as it would be without it, and the overlay is simply on top until
            loading finishes. Nothing here is conditional on it, which is why
            uncovering the site cannot shift a single pixel. */}
        <PortfolioLoader />
      </body>
    </html>
  );
}
