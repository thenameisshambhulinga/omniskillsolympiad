"use client";

import { motion } from "framer-motion";

type AchievementProgressProps = {
  points: number;
};

const TIERS = [
  { min: 0, max: 99, label: "Explorer" },
  { min: 100, max: 249, label: "Builder" },
  { min: 250, max: 499, label: "Engineer" },
  { min: 500, max: 999, label: "Innovator" },
  { min: 1000, max: 1999, label: "Elite" },
  { min: 2000, max: Infinity, label: "Champion" },
] as const;

export default function AchievementProgress({
  points,
}: AchievementProgressProps) {
  const safePoints = Number.isFinite(points) ? Math.max(0, points) : 0;
  const currentTier =
    TIERS.find((tier) => safePoints >= tier.min && safePoints <= tier.max) ??
    TIERS[TIERS.length - 1];
  const nextTier = TIERS.find((tier) => safePoints < tier.min) ?? null;
  const tierStart = currentTier.min;
  const tierEnd =
    currentTier.max === Infinity ? safePoints + 1 : currentTier.max;
  const progress = Math.min(
    100,
    Math.max(
      0,
      ((safePoints - tierStart) / Math.max(1, tierEnd - tierStart)) * 100,
    ),
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-[24px] border border-cyan-400/15 bg-slate-950/50 p-4 text-white shadow-[0_18px_40px_rgba(8,15,35,0.35)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">
            Current Tier
          </p>
          <p className="mt-1 text-lg font-black text-white">
            {currentTier.label}
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
          {safePoints} pts
        </p>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full bg-linear-to-r from-cyan-300 via-sky-300 to-purple-300"
        />
      </div>

      <p className="mt-3 text-xs text-white/70">
        {currentTier.label} — {Math.min(safePoints, tierEnd)} /{" "}
        {tierEnd === Infinity ? "∞" : tierEnd} points
      </p>

      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
        Next tier: {nextTier ? nextTier.label : "Champion level reached"}
      </p>
    </motion.section>
  );
}
