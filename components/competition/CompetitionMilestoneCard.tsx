"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle2, Clock, Lock } from "lucide-react";

import type { CompetitionPassportMilestone } from "@/lib/profile/competition-passport";

function getStatusIcon(status: CompetitionPassportMilestone["status"]) {
  if (status === "COMPLETED") return CheckCircle2;
  if (status === "IN_PROGRESS") return Clock;
  return Lock;
}

function getStatusClass(status: CompetitionPassportMilestone["status"]) {
  if (status === "COMPLETED") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "IN_PROGRESS") {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  return "border-white/10 bg-white/[0.04] text-white/40";
}

export default function CompetitionMilestoneCard({
  milestone,
}: {
  milestone: CompetitionPassportMilestone;
}) {
  const StatusIcon = getStatusIcon(milestone.status);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.42 }}
      className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/25 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Award className="h-5 w-5 text-cyan-200" />

          <h3 className="mt-4 text-xl font-black text-white">
            {milestone.title}
          </h3>

          <p className="mt-3 text-sm font-semibold leading-7 text-white/55">
            {milestone.description}
          </p>
        </div>

        <div
          className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black ${getStatusClass(
            milestone.status,
          )}`}
        >
          <StatusIcon className="h-4 w-4" />
          {milestone.status.replace("_", " ")}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm font-bold text-white/60">
        <span>Completion</span>
        <span>{milestone.completionPercent}%</span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${milestone.completionPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
          Reward
        </p>

        <p className="mt-2 text-lg font-black text-white">{milestone.reward}</p>
      </div>
    </motion.article>
  );
}
