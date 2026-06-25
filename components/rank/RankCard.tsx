"use client";

import { motion } from "framer-motion";
import RankEmblem, { getRankTier } from "@/components/rank/RankEmblem";

const labels = {
  national_champion: "National Champion",
  national_elite: "National Elite",
  national_achiever: "National Achiever",
  platinum: "Top 10 Engineer",
  diamond: "Top 50 Engineer",
  sapphire: "Top 100 Engineer",
  standard: "Ranked Engineer",
};

export default function RankCard({
  title,
  rank,
  metadata,
}: {
  title: string;
  rank: number;
  metadata: string;
}) {
  const tier = getRankTier(rank);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.015 }}
      className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
    >
      <div className="relative z-10 flex items-center gap-5">
        <RankEmblem rank={rank} />

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">
            {labels[tier]}
          </h3>

          <p className="mt-2 text-sm font-bold text-white/55">
            #{rank} {metadata}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
