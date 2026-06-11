"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp } from "lucide-react";

import type { AssessmentTrend } from "@/lib/profile/assessment-ledger";

export default function AssessmentTrendCard({
  trend,
  averageScore,
}: {
  trend: AssessmentTrend;
  averageScore: number;
}) {
  const scoreLine = trend.scores.length
    ? trend.scores.join(" → ")
    : "No scores yet";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[3rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-200" />

          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Assessment Trend
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Previous Scores
            </p>

            <p className="mt-3 text-xl font-black text-white">{scoreLine}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Improvement
            </p>

            <p className="mt-3 text-3xl font-black text-white">
              {trend.improvementPercent}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Average Score
            </p>

            <p className="mt-3 text-3xl font-black text-white">
              {averageScore}%
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-black/25 p-5">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-emerald-200" />

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Performance Trend
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {trend.trend}
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, averageScore)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
