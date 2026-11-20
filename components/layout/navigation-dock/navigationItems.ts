/*
  Client-only: the icon components carried in this registry come from a
  package whose barrel initialises a React context at module scope, which the
  react-server build has no `createContext` for. The directive keeps the whole
  registry — and the icon set behind it — out of the server graph.
*/
"use client";

/*
  Imported per icon rather than from the package barrel, which re-exports
  ~9,000 modules — five deep imports keep both the dev graph and the shipped
  bundle to exactly the five icons the dock draws.
*/
import { BriefcaseIcon } from "@phosphor-icons/react/Briefcase";
import { HouseIcon } from "@phosphor-icons/react/House";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/PaperPlaneTilt";
import { SquaresFourIcon } from "@phosphor-icons/react/SquaresFour";
import { UserIcon } from "@phosphor-icons/react/User";

import type { Icon } from "@phosphor-icons/react";

/**
 * A single station on the dock.
 *
 * `badge` and `status` are deliberately part of the contract even though no
 * item sets them today — the dock renders both when present, so a future
 * "3 new case studies" counter or an availability dot on Contact needs data,
 * not a redesign.
 */
export interface DockDestination {
  /** DOM id of the section on the home page, and the hash it links to. */
  readonly id: string;
  readonly label: string;
  readonly Icon: Icon;
  /** A count pill, or a bare dot when the number itself is noise. */
  readonly badge?: number | "dot";
  /** A presence ring on the icon. */
  readonly status?: "online" | "away" | "busy";
}

/**
 * The registry is the single source of truth for both navigation and the
 * scroll spy — the spy observes exactly these ids in exactly this order, so
 * the two can never drift apart.
 *
 * `experience` anchors the dedicated Experience section (roles, education,
 * languages, availability). `skills` is intentionally not a dock destination:
 * it is a reference section, not a place a reader needs a shortcut to.
 * `academic` is not one either: it is read in the same pass as `experience`,
 * immediately below it, and a sixth station would overflow the dock on a
 * narrow phone.
 */
export const DOCK_DESTINATIONS: readonly DockDestination[] = [
  { id: "home", label: "Home", Icon: HouseIcon },
  { id: "projects", label: "Projects", Icon: SquaresFourIcon },
  { id: "about", label: "About", Icon: UserIcon },
  { id: "experience", label: "Experience", Icon: BriefcaseIcon },
  { id: "contact", label: "Contact", Icon: PaperPlaneTiltIcon },
] as const;

export const DOCK_SECTION_IDS: readonly string[] = DOCK_DESTINATIONS.map((entry) => entry.id);
