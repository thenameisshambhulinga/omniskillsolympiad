"use client";

import { motion } from "framer-motion";
import { Award, Crown, Gem, Medal, Shield, Sparkles } from "lucide-react";

export type RankTier =
  | "national_champion"
  | "national_elite"
  | "national_achiever"
  | "platinum"
  | "diamond"
  | "sapphire"
  | "standard";

export function getRankTier(rank: number): RankTier {
  if (rank === 1) return "national_champion";
  if (rank === 2) return "national_elite";
  if (rank === 3) return "national_achiever";
  if (rank <= 10) return "platinum";
  if (rank <= 50) return "diamond";
  if (rank <= 100) return "sapphire";
  return "standard";
}

const rankConfig: Record<
  RankTier,
  {
    label: string;
    colors: string;
    icon: React.ComponentType<{ className?: string }>;
    ariaLabel: string;
  }
> = {
  national_champion: {
    label: "National Champion",
    colors: "from-amber-200 via-yellow-400 to-orange-500",
    icon: Crown,
    ariaLabel: "National Champion Rank One",
  },
  national_elite: {
    label: "National Elite",
    colors: "from-slate-100 via-slate-300 to-slate-500",
    icon: Medal,
    ariaLabel: "National Elite Rank Two",
  },
  national_achiever: {
    label: "National Achiever",
    colors: "from-orange-300 via-amber-600 to-yellow-800",
    icon: Award,
    ariaLabel: "National Achiever Rank Three",
  },
  platinum: {
    label: "Top 10 Engineer",
    colors: "from-cyan-100 via-slate-200 to-blue-300",
    icon: Shield,
    ariaLabel: "Top Ten Engineer Platinum Rank",
  },
  diamond: {
    label: "Top 50 Engineer",
    colors: "from-blue-200 via-cyan-300 to-purple-300",
    icon: Gem,
    ariaLabel: "Top Fifty Engineer Diamond Rank",
  },
  sapphire: {
    label: "Top 100 Engineer",
    colors: "from-blue-300 via-sky-500 to-indigo-500",
    icon: Sparkles,
    ariaLabel: "Top One Hundred Engineer Sapphire Rank",
  },
  standard: {
    label: "Ranked Engineer",
    colors: "from-white/50 via-white/70 to-white/40",
    icon: Shield,
    ariaLabel: "Standard Ranked Engineer",
  },
};

export default function RankEmblem({
  rank,
  size = "md",
}: {
  rank: number;
  type?: RankTier;
  size?: "sm" | "md" | "lg";
}) {
  const tier = getRankTier(rank);
  const config = rankConfig[tier];
  const Icon = config.icon;

  const sizeClass =
    size === "lg" ? "h-24 w-24" : size === "sm" ? "h-14 w-14" : "h-20 w-20";

  const iconClass =
    size === "lg" ? "h-11 w-11" : size === "sm" ? "h-6 w-6" : "h-9 w-9";

  return (
    <motion.div
      aria-label={config.ariaLabel}
      whileHover={{ scale: 1.05, rotate: -1 }}
      className={`relative flex ${sizeClass} items-center justify-center rounded-full border border-white/15 bg-black/40 shadow-[0_0_60px_rgba(34,211,238,0.16)]`}
    >
      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 rounded-full bg-linear-to-br ${config.colors} opacity-80`}
      />

      <div className="absolute inset-[4px] rounded-full bg-black/80 backdrop-blur-xl" />

      <Icon className={`relative z-10 ${iconClass} text-white`} />
    </motion.div>
  );
}
