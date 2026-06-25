"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";

type RankPodiumCardProps = {
  rank: string;
  title: string;
  score?: string | number;
  tier?: string;
};

function parseRank(rank: string) {
  const value = Number(rank.replace("#", "").trim());
  return Number.isFinite(value) ? value : 9999;
}

function getRankStyle(rank: number) {
  if (rank === 1) {
    return {
      label: "Gold Champion",
      icon: Crown,
      border: "border-amber-300/35",
      bg: "bg-amber-400/10",
      glow: "shadow-[0_0_70px_rgba(251,191,36,0.18)]",
      text: "text-amber-200",
      gradient: "from-amber-200 via-yellow-400 to-orange-500",
    };
  }

  if (rank === 2) {
    return {
      label: "Silver Elite",
      icon: Crown,
      border: "border-slate-200/30",
      bg: "bg-slate-300/10",
      glow: "shadow-[0_0_70px_rgba(226,232,240,0.14)]",
      text: "text-slate-200",
      gradient: "from-slate-100 via-slate-300 to-slate-500",
    };
  }

  if (rank === 3) {
    return {
      label: "Bronze Achiever",
      icon: Crown,
      border: "border-orange-300/30",
      bg: "bg-orange-400/10",
      glow: "shadow-[0_0_70px_rgba(251,146,60,0.14)]",
      text: "text-orange-200",
      gradient: "from-orange-200 via-amber-600 to-orange-800",
    };
  }

  return {
    label: "Ranked Engineer",
    icon: Medal,
    border: "border-cyan-300/20",
    bg: "bg-cyan-400/10",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.12)]",
    text: "text-cyan-200",
    gradient: "from-cyan-200 via-blue-400 to-purple-400",
  };
}

export default function RankPodiumCard({
  rank,
  title,
  score,
  tier,
}: RankPodiumCardProps) {
  const rankNumber = parseRank(rank);
  const style = getRankStyle(rankNumber);
  const Icon = style.icon;

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`group relative overflow-hidden rounded-[2rem] border ${style.border} ${style.bg} ${style.glow} p-5 backdrop-blur-2xl`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-linear-to-r ${style.gradient}`}
      />

      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="metric-label">{title}</p>

          <p className="mt-3 text-4xl font-black text-white">{rank}</p>

          <p className={`mt-2 text-sm font-black ${style.text}`}>
            {style.label}
          </p>

          {typeof score !== "undefined" && (
            <p className="mt-2 text-xs font-semibold text-white/45">
              Score: {score}
            </p>
          )}

          {tier && (
            <p className="mt-1 text-xs font-semibold text-white/45">
              Tier: {tier}
            </p>
          )}
        </div>

        <div
          className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${style.border} bg-black/30`}
          aria-label={`${style.label} ${title}`}
        >
          <div
            className={`absolute inset-0 rounded-2xl bg-linear-to-br ${style.gradient} opacity-15`}
          />
          {rankNumber <= 3 ? (
            <Trophy className={`relative z-10 h-8 w-8 ${style.text}`} />
          ) : (
            <Icon className={`relative z-10 h-8 w-8 ${style.text}`} />
          )}
        </div>
      </div>
    </motion.article>
  );
}
