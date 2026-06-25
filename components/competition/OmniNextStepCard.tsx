"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import type { OmniStep } from "@/lib/profile/omni-roadmap";
import type { VibgyorStageName } from "@/lib/profile/tier-engine";

export default function OmniNextStepCard({
  nextStep,
}: {
  nextStep:
    | (OmniStep & {
        stageName: VibgyorStageName;
        stageLetter: string;
      })
    | null;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-cyan-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Next OMNI Step
          </p>
        </div>

        {nextStep ? (
          <>
            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/25 bg-black/30 text-3xl font-black text-cyan-100">
                {nextStep.code}
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                  {nextStep.stageName} - {nextStep.code}
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {nextStep.meaning}
                </h3>
              </div>
            </div>

            <p className="mt-5 text-lg font-bold text-white/72">
              {nextStep.skill}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Reward
                </p>
                <p className="mt-2 flex items-center gap-2 text-lg font-black text-cyan-200">
                  <Zap className="h-4 w-4" />+{nextStep.rewardPoints} Silicon
                  Points
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Difficulty
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {nextStep.difficulty}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-7 rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 p-6">
            <h3 className="text-3xl font-black text-white">Journey Complete</h3>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-200">
              National innovation pathway completed
              <ArrowRight className="h-4 w-4" />
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}
