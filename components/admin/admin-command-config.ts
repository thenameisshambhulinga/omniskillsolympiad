import {
  BarChart3,
  CalendarClock,
  CircuitBoard,
  Megaphone,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import type { OsoTone } from "@/components/oso/OsoGlassSurface";

export type AdminCommandModule = {
  title: string;
  description: string;
  href: string;
  meta: string;
  tone: OsoTone;
  icon: typeof CircuitBoard;
};

export const adminCommandModules: AdminCommandModule[] = [
  {
    title: "Daily Challenge Control",
    description:
      "Create, publish, review and manage daily engineering challenges.",
    href: "/admin/manage-challenges",
    meta: "Challenge Ops",
    tone: "blue",
    icon: CircuitBoard,
  },
  {
    title: "Poster Publisher",
    description:
      "Publish landing and login announcement posters without touching code.",
    href: "/admin/announcements",
    meta: "Content Ops",
    tone: "yellow",
    icon: Megaphone,
  },
  {
    title: "Competition Control",
    description:
      "Manage offline competition flow, verification and evaluation signals.",
    href: "/admin/competition",
    meta: "Event Ops",
    tone: "emerald",
    icon: Swords,
  },
  {
    title: "Leaderboard Intelligence",
    description:
      "Review public ranking movement and platform performance visibility.",
    href: "/daily-leaderboard",
    meta: "Rank View",
    tone: "cyan",
    icon: Trophy,
  },
];

export const adminSignalModules = [
  {
    label: "Users",
    tone: "blue" as OsoTone,
    icon: Users,
  },
  {
    label: "Challenges",
    tone: "cyan" as OsoTone,
    icon: CircuitBoard,
  },
  {
    label: "Posters",
    tone: "yellow" as OsoTone,
    icon: Megaphone,
  },
  {
    label: "Competition",
    tone: "emerald" as OsoTone,
    icon: BarChart3,
  },
  {
    label: "Verification",
    tone: "slate" as OsoTone,
    icon: ShieldCheck,
  },
  {
    label: "Activity",
    tone: "blue" as OsoTone,
    icon: CalendarClock,
  },
];