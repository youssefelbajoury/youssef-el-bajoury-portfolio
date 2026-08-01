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
  /** Display form. The dialable form is derived below — never type it twice. */
  phone: "+212 688-039822",
} as const;

/**
 * The message WhatsApp opens with.
 *
 * Written from the *sender's* side, because that is who follows this link: a
 * recruiter or an engineer who has just read the page. A prefilled message that
 * introduces the site's owner to themselves is the tell that nobody read it
 * back before shipping.
 *
 * A template literal rather than one long line so the line breaks are real —
 * `encodeURIComponent` turns them into %0A and WhatsApp renders them as the
 * paragraph breaks they are.
 */
const WHATSAPP_MESSAGE = `Hello Youssef,

I discovered your portfolio and would like to discuss a software engineering opportunity with you.`;

/**
 * wa.me wants digits only — no plus, no spaces, no dashes. Derived from the
 * display number above by stripping everything that is not a digit, so the two
 * cannot drift apart when the number is edited.
 */
const WHATSAPP_NUMBER = PROFILE.phone.replace(/\D/g, "");

export const SOCIAL_LINKS = {
  github: "https://github.com/youssefelbajoury",
  /* `?locale=en` so the profile opens in English regardless of the reader's
     own LinkedIn language setting — a recruiter following this link from a
     German or French session would otherwise land on a localised page. */
  linkedin: "https://www.linkedin.com/in/youssef-el-bajoury-192451375/?locale=en",
  email: `mailto:${PROFILE.contactEmail}`,
  /** Opens the chat with the message already typed, unsent. */
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  /** The author's own shared pin, not a generated search for the city name. */
  maps: "https://maps.app.goo.gl/QqYZKR39XU9aL52f6",
} as const;

/*
  HERO_ROLES (a rotating role line) has been removed along with the component
  that consumed it. Rotating hero titles are the most recognisable signature
  of a generated portfolio, and half the list — "Builder", "Problem Solver",
  "Fast Learner" — was CV filler that read junior. The Hero now states one
  fixed position. Do not reintroduce a rotating title.
*/
