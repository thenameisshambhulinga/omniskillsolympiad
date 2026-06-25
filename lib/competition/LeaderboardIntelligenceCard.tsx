"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Crosshair, Radar, Trophy, Users } from "lucide-react";

export type LeaderboardIntelligence = {
  currentRank: number;
  totalCompetitors: number;
  weeklyRankChange: number;
  closestRival: {
    name: string;
    rank: number;
    scoreGap: number;
  } | null;
  nextRankTarget: {
    rank: number;
    pointsRequired: number;
  } | null;
};

function getPercentile(rank: number, total: number) {
  if (total <= 1) return 100;

  const percentile = ((total - rank) / (total - 1)) * 100;

  return Math.max(0, Math.min(100, Math.round(percentile)));
}

export default function LeaderboardIntelligenceCard({
  intelligence,
}: {
  intelligence: LeaderboardIntelligence;
}) {
  const percentile = getPercentile(
    intelligence.currentRank,
    intelligence.totalCompetitors,
  );

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(251,191,36,0.12),transparent_30%),radial-gradient(circle_at_85%_35%,rgba(34,211,238,0.12),transparent_35%)]"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Radar className="h-5 w-5 text-amber-200" />
          <p className="section-label text-amber-300">
            Leaderboard Intelligence
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-amber-400/25 bg-amber-400/10 p-5"
          >
            <Trophy className="h-5 w-5 text-amber-200" />
            <p className="mt-4 metric-label">Current Rank</p>
            <p className="mt-3 text-4xl font-black text-white">
              #{intelligence.currentRank}
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-cyan-400/25 bg-cyan-400/10 p-5"
          >
            <Users className="h-5 w-5 text-cyan-200" />
            <p className="mt-4 metric-label">Percentile</p>
            <p className="mt-3 text-4xl font-black text-white">{percentile}%</p>
          </motion.article>

          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 p-5"
          >
            <ArrowUpRight className="h-5 w-5 text-emerald-200" />
            <p className="mt-4 metric-label">Weekly Change</p>
            <p className="mt-3 text-4xl font-black text-white">
              {intelligence.weeklyRankChange > 0
                ? `+${intelligence.weeklyRankChange}`
                : intelligence.weeklyRankChange}
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-purple-400/25 bg-purple-400/10 p-5"
          >
            <Crosshair className="h-5 w-5 text-purple-200" />
            <p className="mt-4 metric-label">Closest Rival</p>
            <p className="mt-3 truncate text-xl font-black text-white">
              {intelligence.closestRival
                ? intelligence.closestRival.name
                : "No rival yet"}
            </p>
            {intelligence.closestRival && (
              <p className="mt-2 text-sm font-bold text-white/55">
                #{intelligence.closestRival.rank} •{" "}
                {intelligence.closestRival.scoreGap} pts gap
              </p>
            )}
          </motion.article>

          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-rose-400/25 bg-rose-400/10 p-5"
          >
            <Trophy className="h-5 w-5 text-rose-200" />
            <p className="mt-4 metric-label">Next Target</p>
            <p className="mt-3 text-xl font-black text-white">
              {intelligence.nextRankTarget
                ? `Rank #${intelligence.nextRankTarget.rank}`
                : "Top rank reached"}
            </p>
            {intelligence.nextRankTarget && (
              <p className="mt-2 text-sm font-bold text-white/55">
                {intelligence.nextRankTarget.pointsRequired} pts required
              </p>
            )}
          </motion.article>
        </div>
      </div>
    </section>
  );
}
