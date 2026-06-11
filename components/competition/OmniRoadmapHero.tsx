"use client";

import { motion } from "framer-motion";
import { Layers3, Medal, Route, Sparkles } from "lucide-react";
import type { OmniRoadmapSnapshot } from "@/lib/profile/omni-roadmap";

export default function OmniRoadmapHero({
  snapshot,
}: {
  snapshot: OmniRoadmapSnapshot;
}) {
  return (
    <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_460px] xl:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-8 shadow-[0_34px_150px_rgba(0,0,0,0.52)] backdrop-blur-2xl lg:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.15),transparent_34%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2">
                <Route className="h-4 w-4 text-cyan-200" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
                  OMNI Engineering Journey
                </p>
              </div>

              <h2 className="mt-7 max-w-5xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                From Electronics Foundations
                <span className="block bg-gradient-to-r from-violet-300 via-cyan-200 to-red-300 bg-clip-text text-transparent">
                  To National Innovation
                </span>
              </h2>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/62">
                Track your engineering growth across 7 VIBGYOR stages and 28
                OMNI skill milestones powered by Silicon Points.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <HeroMetric
                  icon={<Layers3 className="h-5 w-5 text-cyan-200" />}
                  label="Current Stage"
                  value={snapshot.currentStage.name.toUpperCase()}
                />

                <HeroMetric
                  icon={<Medal className="h-5 w-5 text-purple-200" />}
                  label="Current Tier"
                  value={snapshot.currentTier}
                />

                <HeroMetric
                  icon={<Sparkles className="h-5 w-5 text-emerald-200" />}
                  label="Completed"
                  value={`${snapshot.completedSteps} / ${snapshot.totalSteps}`}
                />

                <HeroMetric
                  icon={<Route className="h-5 w-5 text-amber-200" />}
                  label="Next Stage"
                  value={snapshot.nextStage?.name ?? "Complete"}
                />
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-cyan-400/10 p-8 shadow-[0_34px_150px_rgba(0,0,0,0.52)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                Progress
              </p>

              <p className="mt-5 text-7xl font-black text-white">
                {snapshot.progressPercent}%
              </p>

              <p className="mt-4 text-sm font-semibold leading-7 text-white/58">
                Journey completion based on completed OMNI steps across the
                VIBGYOR electronics engineering roadmap.
              </p>

              <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${snapshot.progressPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-300 via-cyan-300 to-red-300"
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
      {icon}
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-black text-white">{value}</p>
    </div>
  );
}
