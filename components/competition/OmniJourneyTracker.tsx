"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { OmniStage } from "@/lib/profile/omni-roadmap";

export default function OmniJourneyTracker({
  stages,
  currentStage,
}: {
  stages: OmniStage[];
  currentStage: OmniStage;
}) {
  const currentIndex = stages.findIndex(
    (stage) => stage.key === currentStage.key,
  );

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          OMNI Journey Tracker
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-7">
          {stages.map((stage, index) => {
            const completed = index < currentIndex;
            const active = index === currentIndex;

            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.04 }}
                className="relative"
              >
                <div
                  className={`relative overflow-hidden rounded-[2rem] border p-5 text-center ${
                    active
                      ? "border-cyan-400/35 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.16)]"
                      : completed
                        ? "border-emerald-400/25 bg-emerald-400/10"
                        : "border-white/10 bg-black/25"
                  }`}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                      backgroundColor:
                        active || completed
                          ? stage.color
                          : "rgba(255,255,255,0.08)",
                    }}
                  />

                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-black"
                    style={{
                      borderColor:
                        active || completed
                          ? stage.color
                          : "rgba(255,255,255,0.12)",
                      backgroundColor:
                        active || completed
                          ? stage.softColor
                          : "rgba(255,255,255,0.04)",
                      color:
                        active || completed
                          ? stage.color
                          : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {completed ? (
                      <Check className="h-6 w-6" />
                    ) : active ? (
                      "●"
                    ) : (
                      "○"
                    )}
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                    {stage.letter}
                  </p>

                  <h3 className="mt-2 text-lg font-black text-white">
                    {stage.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
