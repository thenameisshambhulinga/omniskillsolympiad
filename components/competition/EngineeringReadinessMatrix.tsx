"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Brain,
  Gauge,
  ShieldCheck,
  Target,
  Trophy,
  Wrench,
} from "lucide-react";

import type { EngineeringReadinessResult } from "@/lib/profile/readiness-engine";

export default function EngineeringReadinessMatrix({
  readiness,
}: {
  readiness: EngineeringReadinessResult;
}) {
  const factorCards = [
    { label: "Tier Weight", value: readiness.factors.tier },
    { label: "Silicon Points", value: readiness.factors.siliconPoints },
    { label: "Journey Completion", value: readiness.factors.journeyCompletion },
    {
      label: "Daily Participation",
      value: readiness.factors.dailyParticipation,
    },
    { label: "Consistency", value: readiness.factors.consistency },
    { label: "Activity", value: readiness.factors.activity },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.17),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.15),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_34%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2">
              <Brain className="h-4 w-4 text-cyan-200" />

              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">
                Engineering Readiness Matrix
              </p>
            </div>

            <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
              WorldSkills-Style
              <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                Capability Analysis
              </span>
            </h2>
          </div>

          <div className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 px-6 py-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">
              Readiness Level
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {readiness.level}
            </p>
          </div>
        </div>

        <div className="mt-9 grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-center">
          <div className="flex flex-col items-center text-center">
            <div
              className="grid h-52 w-52 place-items-center rounded-full"
              style={{
                background: `conic-gradient(rgb(34 211 238) ${readiness.score}%, rgba(255,255,255,0.08) 0)`,
              }}
            >
              <div className="grid h-38 w-38 place-items-center rounded-full border border-white/10 bg-black/75 backdrop-blur-xl">
                <div>
                  <p className="text-5xl font-black text-white">
                    {readiness.score}%
                  </p>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
                    Readiness
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm font-semibold leading-7 text-white/55">
              Calculated from tier, Silicon Points, journey completion, daily
              participation, consistency and platform activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {factorCards.map((factor, index) => (
              <motion.article
                key={factor.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.012 }}
                className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                <Gauge className="h-5 w-5 text-cyan-200" />

                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {factor.label}
                </p>

                <p className="mt-3 text-3xl font-black text-white">
                  {factor.value}%
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${factor.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <MatrixPanel
            icon={<ShieldCheck className="h-5 w-5 text-emerald-200" />}
            title="Strength Areas"
            tone="emerald"
            items={readiness.strengthAreas}
          />

          <MatrixPanel
            icon={<Wrench className="h-5 w-5 text-amber-200" />}
            title="Focus Areas"
            tone="amber"
            items={readiness.focusAreas}
          />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-purple-400/20 bg-purple-400/10 p-6">
            <Target className="h-5 w-5 text-purple-200" />

            <p className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-purple-200">
              Improvement Guidance
            </p>

            <p className="mt-4 text-sm font-semibold leading-7 text-white/68">
              {readiness.improvementGuidance}
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-cyan-200" />

                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Next Milestone
                </p>
              </div>

              <p className="mt-3 flex items-center gap-2 text-lg font-black text-white">
                {readiness.nextMilestone}
                <ArrowUpRight className="h-4 w-4 text-cyan-200" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function MatrixPanel({
  icon,
  title,
  tone,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "emerald" | "amber";
  items: string[];
}) {
  const classes =
    tone === "emerald"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : "border-amber-400/20 bg-amber-400/10 text-amber-200";

  return (
    <div className={`rounded-[2.25rem] border p-6 ${classes}`}>
      {icon}

      <p className="mt-4 text-xs font-black uppercase tracking-[0.24em]">
        {title}
      </p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <p
            key={item}
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-white/68"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
