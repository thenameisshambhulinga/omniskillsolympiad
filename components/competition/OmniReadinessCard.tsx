"use client";

import { motion } from "framer-motion";
import { Gauge, Medal, Route, Zap } from "lucide-react";

import type { VibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export default function OmniReadinessCard({
  snapshot,
}: {
  snapshot: VibgyorJourneySnapshot;
}) {
  const metrics = [
    {
      label: "Tier",
      value: snapshot.currentTier,
      helper: `${snapshot.tierProgressPercent}% tier progress`,
      icon: Medal,
    },
    {
      label: "Silicon Points",
      value: snapshot.siliconPoints,
      helper: "Progression score",
      icon: Zap,
    },
    {
      label: "Journey Completion",
      value: `${snapshot.journeyCompletion}%`,
      helper: `${snapshot.completedSteps}/${snapshot.totalSteps} steps`,
      icon: Route,
    },
  ];

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
          <Gauge className="h-5 w-5 text-emerald-200" />

          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Engineering Readiness
          </p>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-center">
          <div className="flex flex-col items-center text-center">
            <div
              className="grid h-44 w-44 place-items-center rounded-full"
              style={{
                background: `conic-gradient(rgb(52 211 153) ${snapshot.readinessScore}%, rgba(255,255,255,0.08) 0)`,
              }}
            >
              <div className="grid h-32 w-32 place-items-center rounded-full border border-white/10 bg-black/70 backdrop-blur-xl">
                <span className="text-4xl font-black text-white">
                  {snapshot.readinessScore}%
                </span>
              </div>
            </div>

            <h3 className="mt-5 text-2xl font-black text-white">
              {snapshot.readinessLevel}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
                >
                  <Icon className="h-5 w-5 text-emerald-200" />

                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                    {metric.label}
                  </p>

                  <p className="mt-3 truncate text-2xl font-black text-white">
                    {metric.value}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white/50">
                    {metric.helper}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
