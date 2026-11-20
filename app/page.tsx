import { AcademicSection } from "@/features/academic";
import { PortfolioAssistant } from "@/features/conversion/ai-recruiter-assistant";
import { RecruiterContactForm } from "@/features/conversion/contact-form";
import { ContactPreview, LocationPanel } from "@/features/conversion/contact-hub";
import { SkillsPreview } from "@/features/credibility/skills-architecture";
import { ExperienceSection } from "@/features/experience";
import { AboutPreview } from "@/features/marketing/about";
import { Hero } from "@/features/marketing/hero";
import { ProjectShowcase } from "@/features/showcase/projects";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProjectShowcase />
      <AboutPreview />
      <ExperienceSection />
      <AcademicSection />
      <SkillsPreview />
      <LocationPanel />
      <PortfolioAssistant />
      <ContactPreview form={<RecruiterContactForm />} />
    </main>
  );
}
