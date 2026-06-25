"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Unlock } from "lucide-react";

import type { OmniChallengeEngineResult } from "@/lib/challenges/omni-challenge-engine";
import { getStageUnlockProgress } from "@/lib/challenges/omni-challenge-engine";

export default function OmniStageUnlockCard({
  engine,
}: {
  engine: OmniChallengeEngineResult;
}) {
  const unlock = getStageUnlockProgress(engine);
  const unlocked = unlock.nextStage === null || unlock.unlockProgress >= 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[2.75rem] border border-purple-400/20 bg-purple-400/10 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {unlocked ? (
            <Unlock className="h-5 w-5 text-emerald-200" />
          ) : (
            <Lock className="h-5 w-5 text-purple-200" />
          )}

          <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-200">
            Stage Unlock Engine
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/40">
              Current Stage
            </p>

            <h3 className="mt-3 text-4xl font-black text-white">
              {unlock.currentStage}
            </h3>
          </div>

          <ArrowRight className="hidden h-8 w-8 text-white/25 lg:block" />

          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/40">
              Next Stage
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-200">
              {unlock.nextStage ?? "Complete"}
            </h3>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/40">
              Unlock Progress
            </p>

            <p className="mt-3 text-4xl font-black text-white">
              {unlock.unlockProgress}%
            </p>
          </div>
        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${unlock.unlockProgress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-gradient-to-r from-purple-300 via-cyan-300 to-emerald-300"
          />
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <InfoCard label="Remaining Points" value={unlock.remainingPoints} />
          <InfoCard
            label="Remaining Challenges"
            value={unlock.remainingChallenges}
          />
          <InfoCard
            label="Status"
            value={unlocked ? "Unlocked" : "In Progress"}
          />
        </div>

        <div className="mt-7 rounded-[2rem] border border-white/10 bg-black/25 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
            Requirements
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {unlock.requirements.map((requirement) => (
              <p
                key={requirement}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/60"
              >
                {requirement}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
