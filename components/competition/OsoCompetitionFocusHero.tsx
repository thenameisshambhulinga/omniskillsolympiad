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

import CompetitionGlassPanel, {
  CompetitionProgressBar,
} from "@/components/competition/CompetitionGlassPanel";
import OsoFloatingIllustrationStage from "@/components/landing/clean/OsoFloatingIllustrationStage";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

type OsoCompetitionFocusHeroProps = {
  omniId: string;
  siliconPoints: number;
  nationalRank: string;
  readinessScore: number;
  currentStage: string;
  currentTier: string;
  completedSteps: number;
  totalSteps: number;
};

export default function OsoCompetitionFocusHero({
  omniId,
  siliconPoints,
  nationalRank,
  readinessScore,
  currentStage,
  currentTier,
  completedSteps,
  totalSteps,
}: OsoCompetitionFocusHeroProps) {
  const progress =
    totalSteps > 0
      ? Math.max(0, Math.min(100, Math.round((completedSteps / totalSteps) * 100)))
      : 0;

  return (
    <CompetitionGlassPanel hover={false} className="p-6 sm:p-8 lg:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <Trophy className="h-4 w-4" />
            Competition Page
          </div>

          <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Compete, get ranked, and build your{" "}
            <span className="text-blue-600">engineering skill identity.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
            This page gives you only the important competition signals: your
            rank, stage, readiness, active arenas, Skill Passport snapshot and
            WorldSkills pathway.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <HeroSignal
              icon={<BadgeCheck className="h-5 w-5" />}
              label="OMNI ID"
              value={omniId}
              tone="blue"
            />

            <HeroSignal
              icon={<CircuitBoard className="h-5 w-5" />}
              label="Stage"
              value={currentStage}
              tone="emerald"
            />

            <HeroSignal
              icon={<BarChart3 className="h-5 w-5" />}
              label="Readiness"
              value={`${readinessScore}%`}
              tone="yellow"
            />

            <HeroSignal
              icon={<Medal className="h-5 w-5" />}
              label="National Rank"
              value={nationalRank}
              tone="blue"
            />
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Competition Journey
                </p>
                <p className="mt-1 text-sm font-bold text-slate-600">
                  {completedSteps}/{totalSteps} VIBGYOR steps completed ·{" "}
                  {currentTier}
                </p>
              </div>

              <p className="text-sm font-black text-slate-950">
                {progress}% complete
              </p>
            </div>

            <CompetitionProgressBar value={progress} tone="blue" className="mt-4" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/daily-challenges"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Attempt Daily Challenge
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
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <OsoFloatingIllustrationStage
            glow="yellow"
            className="mx-auto w-full max-w-[560px]"
          >
            <OsoIllustrationAsset
              src={OSO_ILLUSTRATIONS.competitionsWinner}
              alt="A student celebrating first place in a competition."
              blend
              imageClassName="oso-floating-illustration-img mx-auto max-h-[470px] max-w-[540px]"
            />
          </OsoFloatingIllustrationStage>

          <div className="mx-auto mt-4 max-w-[500px] rounded-[2rem] border border-slate-200 bg-white/78 p-5 shadow-[0_18px_46px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Silicon Points
            </p>

            <div className="mt-2 flex items-end justify-between gap-5">
              <p className="oso-heading text-4xl font-black text-slate-950">
                {siliconPoints}
              </p>

              <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-yellow-700">
                Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </CompetitionGlassPanel>
  );
}

function HeroSignal({
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
    tone === "yellow"
      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
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