"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  Medal,
  Route,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionProgressBar,
  CompetitionStatusPill,
} from "@/components/competition/CompetitionGlassPanel";
import type { CompetitionLiveArena } from "@/lib/competition/competition-live-arena";
import { getCompetitionMomentumLabel } from "@/lib/competition/competition-live-arena";

type OsoCompetitionCommandCenterProps = {
  readinessScore: number;
  siliconPoints: number;
  completedSteps: number;
  totalSteps: number;
  currentTier: string;
  liveArenaCount: number;
  recommendedArena: CompetitionLiveArena | null;
};

export default function OsoCompetitionCommandCenter({
  readinessScore,
  siliconPoints,
  completedSteps,
  totalSteps,
  currentTier,
  liveArenaCount,
  recommendedArena,
}: OsoCompetitionCommandCenterProps) {
  const journeyProgress =
    totalSteps > 0
      ? Math.max(0, Math.min(100, Math.round((completedSteps / totalSteps) * 100)))
      : 0;

  const momentumLabel = getCompetitionMomentumLabel({
    readinessScore,
    liveArenaCount,
  });

  const actions = [
    {
      label: "Next Arena",
      title: recommendedArena?.title ?? "Open Daily-Challenges",
      helper:
        recommendedArena?.insight ??
        "No live arena is available yet. Use the challenge library when admin publishes one.",
      href: recommendedArena?.href ?? "/daily-challenges",
      icon: Zap,
      tone: "blue" as const,
      cta: recommendedArena?.primaryCta ?? "Open Library",
    },
    {
      label: "Ranking",
      title: "Compare standing",
      helper: "Check where your Silicon Points place you among students.",
      href: "/daily-leaderboard",
      icon: Trophy,
      tone: "yellow" as const,
      cta: "View Rank",
    },
    {
      label: "Passport",
      title: "Upgrade skill identity",
      helper: "Keep skills, academic data and portfolio signals updated.",
      href: "/onboarding?edit=passport",
      icon: BadgeCheck,
      tone: "emerald" as const,
      cta: "Edit Passport",
    },
    {
      label: "Protected Tests",
      title: "Selection-ready attempts",
      helper: "Move from daily practice to formal protected assessment.",
      href: "/quiz",
      icon: ShieldCheck,
      tone: "cyan" as const,
      cta: "Open Tests",
    },
  ];

  return (
    <CompetitionGlassPanel className="p-5 sm:p-6 lg:p-7" hover={false}>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-stretch">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                Competition Command Center
              </p>

              <h2 className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                One clean place for your next move.
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
                Built to avoid dashboard noise: live arena, rank, passport and
                assessment routes are separated into direct action lanes.
              </p>
            </div>

            <CompetitionStatusPill label={momentumLabel} tone="blue" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SignalCard
              icon={<Gauge className="h-5 w-5" />}
              label="Readiness"
              value={`${readinessScore}%`}
              helper="Engineering signal"
            />

            <SignalCard
              icon={<Medal className="h-5 w-5" />}
              label="Points"
              value={siliconPoints}
              helper="Silicon score"
            />

            <SignalCard
              icon={<Route className="h-5 w-5" />}
              label="Journey"
              value={`${journeyProgress}%`}
              helper={currentTier}
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              <span>VIBGYOR progress</span>
              <span>
                {completedSteps}/{totalSteps}
              </span>
            </div>

            <CompetitionProgressBar value={journeyProgress} tone="blue" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <motion.article
                key={action.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: 0.34,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group rounded-[1.65rem] border border-slate-200 bg-white/86 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_64px_rgba(15,23,42,0.09)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <CompetitionStatusPill label={action.label} tone={action.tone} />
                </div>

                <h3 className="oso-heading mt-5 line-clamp-2 text-xl font-black leading-tight text-slate-950">
                  {action.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-slate-600">
                  {action.helper}
                </p>

                <Link
                  href={action.href}
                  className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition group-hover:text-blue-700"
                >
                  {action.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </CompetitionGlassPanel>
  );
}

function SignalCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
        </div>
      </div>

      <p className="mt-3 text-xs font-bold leading-5 text-slate-500">{helper}</p>
    </div>
  );
}
