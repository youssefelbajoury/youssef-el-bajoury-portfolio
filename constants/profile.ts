/**
 * Site-wide profile constants — real, verified facts only.
 * Never add placeholder or invented values here (see MASTER_SPECIFICATION.md
 * "Hero Copy Rules": the site must remain honest and evidence-based).
 */

export const PROFILE = {
  name: "Youssef El Bajoury",
  location: "Casablanca, Morocco",
  availability: {
    label: "Available for Full-Time Opportunities",
    supportingText: "Open to new opportunities",
  },
  contactEmail: "youssefelbajoury321@gmail.com",
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/Joseeeeeeph",
  linkedin: "https://www.linkedin.com/in/youssef-el-bajoury-192451375/",
  email: `mailto:${PROFILE.contactEmail}`,
} as const;

/**
 * Roles cycled in the Hero's rotating role line, per MASTER_SPECIFICATION.md
 * "Hero Content > Dynamic Typing".
 */
export const HERO_ROLES = [
  "Full Stack Software Engineer",
  "IoT Engineer",
  "AI Enthusiast",
  "Product Engineer",
  "Systems Thinker",
  "Builder",
  "Problem Solver",
  "Fast Learner",
] as const;
