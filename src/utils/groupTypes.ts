import { Plane, Home, PartyPopper, Briefcase } from "lucide-react";

export const GROUP_TYPES = [
  { key: "trip"     as const, label: "Trip",     Icon: Plane       },
  { key: "roommate" as const, label: "Roommate", Icon: Home        },
  { key: "event"    as const, label: "Event",    Icon: PartyPopper },
  { key: "project"  as const, label: "Project",  Icon: Briefcase   },
];

export type GroupType = "trip" | "roommate" | "event" | "project";

export const TYPE_BADGE_CLASS: Record<string, string> = {
  trip:     "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20",
  roommate: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  event:    "bg-purple-500/15 text-purple-300 border border-purple-500/20",
  project:  "bg-amber-500/15 text-amber-300 border border-amber-500/20",
};
