"use client";

import { motion } from "framer-motion";
import { Award, BarChart3, Medal, Zap } from "lucide-react";

export default function OmniRewardPreview({
  rewardPoints,
  badgeReward,
  stageProgress,
  completionPercent,
}: {
  rewardPoints: number;
  badgeReward: string;
  stageProgress: number;
  completionPercent: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid gap-3 sm:grid-cols-2"
    >
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <Zap className="h-4 w-4 text-cyan-200" />
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
          Silicon Points
        </p>
        <p className="mt-2 text-xl font-black text-white">+{rewardPoints}</p>
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <Award className="h-4 w-4 text-amber-200" />
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
          Badge Reward
        </p>
        <p className="mt-2 truncate text-sm font-black text-white">
          {badgeReward}
        </p>
      </div>

      <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4">
        <Medal className="h-4 w-4 text-purple-200" />
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
          Tier XP
        </p>
        <p className="mt-2 text-xl font-black text-white">+{rewardPoints}</p>
      </div>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
        <BarChart3 className="h-4 w-4 text-emerald-200" />
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
          Completion
        </p>
        <p className="mt-2 text-xl font-black text-white">
          {Math.max(stageProgress, completionPercent)}%
        </p>
      </div>
    </motion.div>
  );
}
