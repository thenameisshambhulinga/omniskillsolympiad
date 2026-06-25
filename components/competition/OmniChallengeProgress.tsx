"use client";

import { motion } from "framer-motion";
import { BarChart3, Medal, Route, Trophy, Zap } from "lucide-react";

import type { OmniChallengeEngineResult } from "@/lib/challenges/omni-challenge-engine";

export default function OmniChallengeProgress({
  engine,
}: {
  engine: OmniChallengeEngineResult;
}) {
  const metrics = [
    {
      label: "Completed Challenges",
      value: `${engine.completedCount} / ${engine.totalChallenges}`,
      icon: BarChart3,
    },
    {
      label: "Remaining Challenges",
      value: engine.remainingCount,
      icon: Route,
    },
    {
      label: "Current Stage",
      value: engine.currentStage,
      icon: Zap,
    },
    {
      label: "Current Tier",
      value: engine.currentTier,
      icon: Medal,
    },
    {
      label: "Current Rank",
      value: engine.currentRank,
      icon: Trophy,
    },
    {
      label: "Journey Progress",
      value: `${engine.journeyProgress}%`,
      icon: BarChart3,
    },
  ];

  return (
    <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(168,85,247,0.14),transparent_34%)]" />

          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
              Challenge Progress
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              OMNI Challenge
              <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                Progression System
              </span>
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;

                return (
                  <motion.article
                    key={metric.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.42, delay: index * 0.04 }}
                    whileHover={{ y: -4, scale: 1.012 }}
                    className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
                  >
                    <Icon className="h-5 w-5 text-cyan-200" />

                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                      {metric.label}
                    </p>

                    <p className="mt-3 truncate text-2xl font-black text-white">
                      {metric.value}
                    </p>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${engine.journeyProgress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-violet-300 via-cyan-300 to-red-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
