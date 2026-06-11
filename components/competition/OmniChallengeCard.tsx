"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Lock, Play, Shield, Zap } from "lucide-react";

import type { OmniChallenge } from "@/lib/challenges/omni-challenge-engine";
import OmniRewardPreview from "@/components/competition/OmniRewardPreview";

function getStatusStyle(status: OmniChallenge["status"]) {
  if (status === "completed") {
    return {
      label: "Completed",
      icon: CheckCircle2,
      wrapper: "border-emerald-400/25 bg-emerald-400/10",
      text: "text-emerald-200",
      button:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-100 cursor-default",
    };
  }

  if (status === "available") {
    return {
      label: "Available",
      icon: Play,
      wrapper: "border-cyan-400/25 bg-cyan-400/10",
      text: "text-cyan-200",
      button: "border-cyan-400/30 bg-cyan-300 text-black hover:bg-cyan-200",
    };
  }

  return {
    label: "Locked",
    icon: Lock,
    wrapper: "border-white/10 bg-white/[0.035]",
    text: "text-white/38",
    button: "border-white/10 bg-white/[0.04] text-white/35 cursor-not-allowed",
  };
}

export default function OmniChallengeCard({
  challenge,
}: {
  challenge: OmniChallenge;
}) {
  const style = getStatusStyle(challenge.status);
  const StatusIcon = style.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: challenge.status === "locked" ? 0 : -6, scale: 1.01 }}
      transition={{ duration: 0.42 }}
      className={`relative overflow-hidden rounded-[2.25rem] border p-5 shadow-[0_28px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl ${style.wrapper}`}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-white/40">
              {challenge.stage} - {challenge.stepCode}
            </p>

            <h3 className="mt-3 text-2xl font-black leading-tight text-white">
              {challenge.title}
            </h3>
          </div>

          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xl font-black text-white">
            {challenge.stepCode}
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/58">
          {challenge.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-black text-white/60">
            <Shield className="h-3.5 w-3.5" />
            {challenge.difficulty}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-black text-white/60">
            <Clock className="h-3.5 w-3.5" />
            {challenge.estimatedTime}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-200">
            <Zap className="h-3.5 w-3.5" />+{challenge.rewardPoints}
          </span>
        </div>

        <div className="mt-6">
          <OmniRewardPreview
            rewardPoints={challenge.rewardPoints}
            badgeReward={challenge.badgeReward}
            stageProgress={challenge.stageProgress}
            completionPercent={challenge.completionPercent}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
            Requirements
          </p>

          <div className="mt-3 space-y-2">
            {challenge.requirements.map((requirement) => (
              <p
                key={requirement}
                className="text-sm font-semibold leading-6 text-white/58"
              >
                • {requirement}
              </p>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={challenge.status !== "available"}
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black transition ${style.button}`}
        >
          <StatusIcon className="h-4 w-4" />
          {challenge.status === "available" ? "Start Challenge" : style.label}
        </button>
      </div>
    </motion.article>
  );
}
