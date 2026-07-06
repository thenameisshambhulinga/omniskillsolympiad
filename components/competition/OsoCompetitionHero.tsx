"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CircuitBoard,
  Medal,
  Trophy,
} from "lucide-react";

import OsoFloatingIllustrationStage from "@/components/landing/clean/OsoFloatingIllustrationStage";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

type OsoCompetitionHeroProps = {
  omniId: string;
  siliconPoints: number;
  nationalRank: string;
  readinessScore: number;
  currentStage: string;
  completedSteps: number;
  totalSteps: number;
};

export default function OsoCompetitionHero({
  omniId,
  siliconPoints,
  nationalRank,
  readinessScore,
  currentStage,
  completedSteps,
  totalSteps,
}: OsoCompetitionHeroProps) {
  const completionPercent =
    totalSteps > 0
      ? Math.max(0, Math.min(100, Math.round((completedSteps / totalSteps) * 100)))
      : 0;

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-slate-200 bg-white/82 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.14),transparent_32%)]"
      />

      <div className="relative z-10 grid gap-10 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <Trophy className="h-4 w-4" />
            Competition Architecture
          </div>

          <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Build your engineering competition identity with{" "}
            <span className="text-blue-600">ranked skill progression.</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-slate-600">
            OSO tracks your daily challenge activity, offline evaluations,
            readiness score, VIBGYOR growth stage, Silicon Points and national
            ranking inside one measurable competition journey.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <HeroMetric
              icon={<BadgeCheck className="h-5 w-5" />}
              label="OMNI ID"
              value={omniId}
              tone="blue"
            />

            <HeroMetric
              icon={<CircuitBoard className="h-5 w-5" />}
              label="Stage"
              value={currentStage}
              tone="emerald"
            />

            <HeroMetric
              icon={<BarChart3 className="h-5 w-5" />}
              label="Readiness"
              value={`${readinessScore}%`}
              tone="yellow"
            />

            <HeroMetric
              icon={<Medal className="h-5 w-5" />}
              label="Rank"
              value={nationalRank}
              tone="blue"
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white/76 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Competition journey progress
              </p>

              <p className="text-sm font-black text-slate-950">
                {completedSteps}/{totalSteps} steps
              </p>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-blue-600"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/daily-challenges"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Daily Mission
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/daily-leaderboard"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              View Ranking
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <OsoFloatingIllustrationStage
            glow="yellow"
            className="mx-auto w-full max-w-[560px]"
          >
            <OsoIllustrationAsset
              src={OSO_ILLUSTRATIONS.competitionsWinner}
              alt="A student holding a first-place competition achievement placard."
              blend
              imageClassName="oso-floating-illustration-img mx-auto max-h-[470px] max-w-[540px]"
            />
          </OsoFloatingIllustrationStage>

          <div className="mx-auto mt-4 max-w-[500px] rounded-[2rem] border border-slate-200 bg-white/76 p-5 shadow-[0_18px_46px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Silicon Points
            </p>

            <div className="mt-2 flex items-end justify-between gap-5">
              <p className="oso-heading text-4xl font-black text-slate-950">
                {siliconPoints}
              </p>

              <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-yellow-700">
                Active profile
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroMetric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "yellow" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "yellow"
        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/78 p-4 shadow-sm backdrop-blur-xl">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClass}`}>
        {icon}
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-base font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}