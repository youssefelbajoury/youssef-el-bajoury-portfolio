import { ContactPreview } from "@/features/conversion/contact-hub";
import { SkillsPreview } from "@/features/credibility/skills-architecture";
import { AboutPreview } from "@/features/marketing/about";
import { Hero } from "@/features/marketing/hero";
import { ProjectShowcase } from "@/features/showcase/projects";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProjectShowcase />
      <AboutPreview />
      <SkillsPreview />
      <ContactPreview />
    </main>
  );
}
