"use client";

import GlassCard from "@/components/ui/GlassCard";
import HoverScale from "@/components/motion/HoverScale";
import MotionWrapper from "@/components/motion/MotionWrapper";
import MetricInfoTooltip from "@/components/dashboard/intelligence/MetricInfoTooltip";

type DashboardHeroProps = {
  userName: string;
  siliconPoints: number;
  streak: number;
  rank: number;
  engineeringTier?: string;
  engineeringLevel?: string;
};

export default function DashboardHero({
  userName,
  siliconPoints,
  streak,
  rank,
  engineeringTier,
  engineeringLevel,
}: DashboardHeroProps) {
  return (
    <MotionWrapper>
      <section
        aria-labelledby="dashboard-hero-title"
        className="relative rounded-[2rem] border border-white/10 bg-white/3 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6 md:rounded-[2.5rem] md:p-8 lg:p-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,rgba(34,211,238,0.04))]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
        />

        <div className="relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300 sm:text-sm">
              Engineering Command Center
            </p>

            <h1
              id="dashboard-hero-title"
              className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl xl:text-6xl"
            >
              Welcome back,{" "}
              <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
              Track your engineering growth, protect your streak, climb the
              leaderboard, and keep building momentum across the Silicon
              Skillathon ecosystem.
            </p>

            {(engineeringTier || engineeringLevel) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {engineeringTier && (
                  <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200 shadow-[0_0_28px_rgba(168,85,247,0.16)]">
                    {engineeringTier}
                  </span>
                )}

                {engineeringLevel && (
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
                    {engineeringLevel}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <HeroStatCard
              label="Silicon Points"
              value={siliconPoints}
              helper="Competition Momentum"
              align="right"
            />

            <HeroStatCard
              label="Streak"
              value={streak}
              helper="Daily Discipline"
              align="right"
            />

            <HeroStatCard
              label="Rank"
              value={`#${rank}`}
              helper="Leaderboard Position"
              align="left"
            />
          </div>
        </div>
      </section>
    </MotionWrapper>
  );
}

function HeroStatCard({
  label,
  value,
  helper,
  align,
}: {
  label: string;
  value: string | number;
  helper: string;
  align?: "left" | "right";
}) {
  const tooltipMap: Record<
    string,
    {
      title: string;
      description: string;
      improvement?: string;
      rewardImpact?: string;
    }
  > = {
    "Silicon Points": {
      title: "Silicon Points",
      description:
        "Earn points by completing challenges, quizzes, competitions and streak activities. Points directly influence rankings and future rewards.",
      improvement:
        "Complete daily challenges and maintain streaks to grow faster.",
      rewardImpact:
        "Higher points improve ranking visibility and unlock future recognition.",
    },
    Streak: {
      title: "Streak",
      description:
        "Number of consecutive active days maintaining challenge participation.",
      improvement: "Return daily and complete at least one challenge.",
      rewardImpact: "Longer streaks strengthen consistency signals.",
    },
    Rank: {
      title: "National Rank",
      description: "Your position among all registered students across India.",
      improvement: "Improve points, accuracy, and competition participation.",
      rewardImpact:
        "Top national ranks increase visibility for major opportunities.",
    },
  };

  const tooltip = tooltipMap[label];

  return (
    <HoverScale>
      <GlassCard className="relative h-45 min-w-55 w-full flex-col justify-between overflow-visible p-5 sm:p-6">
        <div className="relative z-10 flex h-full flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.28em] text-white/45 sm:text-xs">
              {label}
            </p>
            {tooltip && <MetricInfoTooltip {...tooltip} />}
          </div>

          <div className="space-y-1">
            <p className="whitespace-nowrap text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              {value}
            </p>
            <p className="truncate text-xs text-white/55 sm:text-sm">
              {helper}
            </p>
          </div>
        </div>
      </GlassCard>
    </HoverScale>
  );
}
