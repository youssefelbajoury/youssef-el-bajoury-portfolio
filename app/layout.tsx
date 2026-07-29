import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Footer } from "@/components/layout/Footer";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { Navbar } from "@/components/layout/Navbar";
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
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background font-sans text-text-primary antialiased">
        <GlobalBackground />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
