"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import {
  VIBGYOR_PROGRESS_STAGES,
  getStageStatus,
  type VibgyorJourneySnapshot,
} from "@/lib/profile/vibgyor-progress";

export default function OmniStageTracker({
  snapshot,
}: {
  snapshot: VibgyorJourneySnapshot;
}) {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:p-8">
      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-purple-300">
          VIBGYOR Stage Tracker
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-7">
          {VIBGYOR_PROGRESS_STAGES.map((stage, index) => {
            const status = getStageStatus(stage, snapshot.siliconPoints);
            const completed = status === "COMPLETED";
            const current = status === "IN_PROGRESS";

            return (
              <motion.article
                key={stage.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.04 }}
                whileHover={{ y: -5, scale: 1.012 }}
                className={`relative overflow-hidden rounded-[2rem] border p-5 text-center ${
                  current
                    ? "border-cyan-400/35 bg-cyan-400/10 shadow-[0_0_70px_rgba(34,211,238,0.16)]"
                    : completed
                      ? "border-emerald-400/25 bg-emerald-400/10"
                      : "border-white/10 bg-black/25"
                }`}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    backgroundColor:
                      completed || current
                        ? stage.color
                        : "rgba(255,255,255,0.1)",
                  }}
                />

                <div
                  className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border text-2xl font-black"
                  style={{
                    borderColor:
                      completed || current
                        ? stage.color
                        : "rgba(255,255,255,0.12)",
                    backgroundColor:
                      completed || current
                        ? stage.softColor
                        : "rgba(255,255,255,0.04)",
                    color:
                      completed || current
                        ? stage.color
                        : "rgba(255,255,255,0.36)",
                  }}
                >
                  {completed ? (
                    <Check className="h-7 w-7" />
                  ) : current ? (
                    "●"
                  ) : (
                    "○"
                  )}
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/38">
                  {status.replace("_", " ")}
                </p>

                <h3 className="mt-2 text-lg font-black text-white">
                  {stage.letter}
                </h3>

                <p className="mt-1 text-sm font-bold text-white/55">
                  {stage.name}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Legend symbol="✓" label="Completed" />
          <Legend symbol="●" label="Current" />
          <Legend symbol="○" label="Locked" />
        </div>
      </div>
    </section>
  );
}

function Legend({ symbol, label }: { symbol: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-bold text-white/60">
      <span className="text-cyan-200">{symbol}</span>
      {label}
    </div>
  );
}
