"use client";

import { motion } from "framer-motion";
import { BarChart3, Footprints, Gauge, Layers3 } from "lucide-react";

import type { VibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export default function OmniJourneyStatus({
  snapshot,
}: {
  snapshot: VibgyorJourneySnapshot;
}) {
  const statusCards = [
    {
      label: "Current Stage",
      value: snapshot.currentStage.name,
      helper: `${snapshot.currentStage.letter} Stage`,
      icon: Layers3,
    },
    {
      label: "Current OMNI Step",
      value: `${snapshot.currentStep.code} — ${snapshot.currentStep.meaning}`,
      helper: snapshot.currentStep.skill,
      icon: Footprints,
    },
    {
      label: "Completed Steps",
      value: `${snapshot.completedSteps} / ${snapshot.totalSteps}`,
      helper: `${snapshot.remainingSteps} remaining`,
      icon: BarChart3,
    },
    {
      label: "Journey",
      value: `${snapshot.journeyCompletion}%`,
      helper: "Offline progression completion",
      icon: Gauge,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
          VIBGYOR Progression Foundation
        </p>

        <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
          Offline OMNI
          <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            Journey Status
          </span>
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.012 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative z-10">
                  <Icon className="h-5 w-5 text-cyan-200" />

                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                    {card.label}
                  </p>

                  <p className="mt-3 truncate text-2xl font-black text-white">
                    {card.value}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white/55">
                    {card.helper}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
