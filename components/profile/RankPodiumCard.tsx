"use client";

import { motion } from "framer-motion";
import { Medal, Trophy } from "lucide-react";

function getRankNumber(rank: string) {
  return Number(rank.replace("#", ""));
}

function getStyle(rank: number) {
  if (rank === 1) {
    return {
      title: "Gold Champion",
      border: "border-amber-400/30",
      bg: "bg-amber-400/10",
      text: "text-amber-200",
    };
  }

  if (rank === 2) {
    return {
      title: "Silver Elite",
      border: "border-slate-300/30",
      bg: "bg-slate-300/10",
      text: "text-slate-200",
    };
  }

  if (rank === 3) {
    return {
      title: "Bronze Achiever",
      border: "border-orange-400/30",
      bg: "bg-orange-400/10",
      text: "text-orange-200",
    };
  }

  return {
    title: "Ranked Engineer",
    border: "border-cyan-400/25",
    bg: "bg-cyan-400/10",
    text: "text-cyan-200",
  };
}

export default function RankPodiumCard({
  label,
  rank,
}: {
  label: string;
  rank: string;
}) {
  const rankNumber = getRankNumber(rank);
  const style = getStyle(rankNumber);

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.012 }}
      className={`relative overflow-hidden rounded-[2rem] border ${style.border} ${style.bg} p-5 backdrop-blur-2xl`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="metric-label">{label}</p>
          <p className="mt-3 text-4xl font-black text-white">{rank}</p>
          <p className={`mt-2 text-sm font-bold ${style.text}`}>
            {style.title}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${style.border} bg-black/25`}
        >
          {rankNumber <= 3 ? (
            <Trophy className={`h-7 w-7 ${style.text}`} />
          ) : (
            <Medal className={`h-7 w-7 ${style.text}`} />
          )}
        </div>
      </div>
    </motion.article>
  );
}
