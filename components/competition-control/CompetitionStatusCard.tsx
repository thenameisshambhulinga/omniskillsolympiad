"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Gauge,
  Layers3,
  Medal,
  Route,
  Trophy,
  Zap,
} from "lucide-react";

import type {
  CompetitionControlAssessmentStatus,
  CompetitionControlStatus,
  CompetitionControlVerificationStatus,
} from "@/lib/competition-control/status-engine";

function getAssessmentTone(status: CompetitionControlAssessmentStatus) {
  if (status === "Completed") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "In Review") {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  return "border-white/10 bg-white/[0.04] text-white/45";
}

function getVerificationTone(status: CompetitionControlVerificationStatus) {
  if (status === "Verified") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "Under Review") {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  return "border-amber-400/25 bg-amber-400/10 text-amber-200";
}

export default function CompetitionStatusCard({
  status,
}: {
  status: CompetitionControlStatus;
}) {
  const cards = [
    {
      label: "Current VIBGYOR Stage",
      value: status.stage.label.toUpperCase(),
      helper: status.stage.description,
      icon: Layers3,
      tone: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    },
    {
      label: "Current OMNI Step",
      value: status.omniStep.label,
      helper: status.omniStep.description,
      icon: Route,
      tone: "border-purple-400/20 bg-purple-400/10 text-purple-200",
    },
    {
      label: "Assessment Status",
      value: status.assessmentStatus,
      helper: "Offline assessment progress",
      icon: ClipboardCheck,
      tone: getAssessmentTone(status.assessmentStatus),
    },
    {
      label: "Verification Status",
      value: status.verificationStatus,
      helper: "Mentor / judge review status",
      icon: BadgeCheck,
      tone: getVerificationTone(status.verificationStatus),
    },
    {
      label: "National Rank",
      value: status.nationalRank,
      helper: "Current leaderboard position",
      icon: Trophy,
      tone: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    },
    {
      label: "Silicon Points",
      value: status.siliconPoints,
      helper: "Competition progress score",
      icon: Zap,
      tone: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    },
    {
      label: "Engineering Tier",
      value: status.engineeringTier,
      helper: "Tier engine output",
      icon: Medal,
      tone: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.52)] backdrop-blur-2xl lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.15),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_34%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2">
              <BarChart3 className="h-4 w-4 text-cyan-200" />
              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">
                Competition Status
              </p>
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
              Live Offline
              <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                Competition Progress
              </span>
            </h2>
          </div>

          <div className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-emerald-200" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
                  Readiness
                </p>
                <p className="mt-1 text-3xl font-black text-white">
                  {status.readinessPercent}%
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${status.readinessPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: index * 0.04 }}
                whileHover={{ y: -5, scale: 1.012 }}
                className={`relative overflow-hidden rounded-[2rem] border p-5 ${card.tone}`}
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10">
                  <Icon className="h-5 w-5" />

                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
                    {card.label}
                  </p>

                  <p className="mt-3 line-clamp-2 text-2xl font-black text-white">
                    {card.value}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white/55">
                    {card.helper}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
