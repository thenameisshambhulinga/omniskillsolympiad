"use client";

import { motion } from "framer-motion";
import { ArrowRight, Medal, Palette, Zap } from "lucide-react";

import type { TierProgress, VibgyorProgress } from "@/lib/profile/tier-engine";

type CompetitionJourneyCardProps = {
  tierProgress: TierProgress;
  vibgyorProgress: VibgyorProgress;
  siliconPoints: number;
};

function stageClass(stage: VibgyorProgress["currentStage"]) {
  const classes: Record<VibgyorProgress["currentStage"], string> = {
    Violet: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    Indigo: "border-indigo-400/25 bg-indigo-400/10 text-indigo-200",
    Blue: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    Green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    Yellow: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
    Orange: "border-orange-400/25 bg-orange-400/10 text-orange-200",
    Red: "border-red-400/25 bg-red-400/10 text-red-200",
  };

  return classes[stage];
}

export default function CompetitionJourneyCard({
  tierProgress,
  vibgyorProgress,
  siliconPoints,
}: CompetitionJourneyCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(168,85,247,0.14),transparent_32%)]"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-cyan-200" />
          <p className="section-label">Competition Journey</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5"
          >
            <div className="flex items-center gap-3">
              <Medal className="h-5 w-5 text-cyan-200" />
              <p className="metric-label">Current Tier</p>
            </div>

            <p className="mt-4 text-3xl font-black text-white">
              {tierProgress.currentTier}
            </p>

            <p className="mt-3 text-sm font-semibold text-white/55">
              {tierProgress.nextTier
                ? `${tierProgress.pointsToNextTier} points to ${tierProgress.nextTier}`
                : "Maximum tier achieved"}
            </p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${tierProgress.progressPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400"
              />
            </div>

            <p className="mt-3 text-right text-sm font-black text-cyan-200">
              {tierProgress.progressPercent}%
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className={`rounded-[2rem] border p-5 ${stageClass(
              vibgyorProgress.currentStage,
            )}`}
          >
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5" />
              <p className="metric-label">VIBGYOR Stage</p>
            </div>

            <p className="mt-4 text-3xl font-black">
              {vibgyorProgress.currentStage}
            </p>

            <p className="mt-3 text-sm font-semibold text-white/55">
              {vibgyorProgress.nextStage
                ? `${vibgyorProgress.pointsToNextStage} points to ${vibgyorProgress.nextStage}`
                : "Final VIBGYOR stage achieved"}
            </p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${vibgyorProgress.progressPercent}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-linear-to-r from-violet-300 via-cyan-300 to-red-300"
              />
            </div>

            <p className="mt-3 text-right text-sm font-black">
              {vibgyorProgress.progressPercent}%
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -4, scale: 1.012 }}
            className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
          >
            <p className="metric-label">Current Silicon Points</p>

            <p className="mt-4 text-5xl font-black text-white">
              {siliconPoints}
            </p>

            <div className="mt-5 flex items-center gap-3 text-sm font-bold text-white/55">
              <span>{tierProgress.currentTier}</span>
              <ArrowRight className="h-4 w-4 text-cyan-200" />
              <span>{tierProgress.nextTier || "Legend"}</span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm font-bold text-white/55">
              <span>{vibgyorProgress.currentStage}</span>
              <ArrowRight className="h-4 w-4 text-purple-200" />
              <span>{vibgyorProgress.nextStage || "Red"}</span>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
