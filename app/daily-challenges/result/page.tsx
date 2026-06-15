import Link from "next/link";

import {
  ArrowLeft,
  Award,
  BrainCircuit,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateEngineeringTier } from "@/lib/engineering-tier";
import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
interface Props {
  searchParams: Promise<{
    score?: string;
    total?: string;
  }>;
}

type AttemptAnalytics = {
  tabSwitchCount: number;
  suspicious: boolean;
  startedAt: Date | null;
  submittedAt: Date | null;
  expiresAt: Date | null;
};

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    const score = Number(params.score || 0);
    const total = Number(params.total || 0);
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const siliconPoints = score * 10;

    const performanceLevel =
      percentage >= 90
        ? "Elite Engineer"
        : percentage >= 75
          ? "Advanced Performer"
          : percentage >= 50
            ? "Growing Competitor"
            : "Needs Improvement";

    return (
      <ResultShell
        score={score}
        total={total}
        percentage={percentage}
        siliconPoints={siliconPoints}
        performanceLevel={performanceLevel}
      />
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { dailyAttempts: true },
  });

  if (!user) {
    const score = Number(params.score || 0);
    const total = Number(params.total || 0);
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const siliconPoints = score * 10;

    const performanceLevel =
      percentage >= 90
        ? "Elite Engineer"
        : percentage >= 75
          ? "Advanced Performer"
          : percentage >= 50
            ? "Growing Competitor"
            : "Needs Improvement";

    return (
      <ResultShell
        score={score}
        total={total}
        percentage={percentage}
        siliconPoints={siliconPoints}
        performanceLevel={performanceLevel}
      />
    );
  }

  const latestAttempt =
    user.dailyAttempts && user.dailyAttempts.length
      ? [...user.dailyAttempts].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )[0]
      : undefined;

  const score = latestAttempt ? latestAttempt.score : Number(params.score || 0);
  const total = latestAttempt ? latestAttempt.total : Number(params.total || 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const siliconPoints = latestAttempt ? latestAttempt.score * 10 : score * 10;

  const performanceLevel =
    percentage >= 90
      ? "Elite Engineer"
      : percentage >= 75
        ? "Advanced Performer"
        : percentage >= 50
          ? "Growing Competitor"
          : "Needs Improvement";

  const engineeringTierResult = calculateEngineeringTier(user.siliconPoints);
  const engineeringTier = engineeringTierResult.level;

  const engineeringLevel =
    user.siliconPoints >= 1500
      ? "Elite Engineer"
      : user.siliconPoints >= 900
        ? "Level 5"
        : user.siliconPoints >= 500
          ? "Level 4"
          : user.siliconPoints >= 250
            ? "Level 3"
            : user.siliconPoints >= 100
              ? "Level 2"
              : "Level 1";

  const usersAbove = await prisma.user.count({
    where: { siliconPoints: { gt: user.siliconPoints } },
  });

  const rank = usersAbove + 1;

  const analytics: AttemptAnalytics | null = latestAttempt
    ? {
        tabSwitchCount: latestAttempt.tabSwitchCount,
        suspicious: latestAttempt.suspicious,
        startedAt: latestAttempt.startedAt,
        submittedAt: latestAttempt.submittedAt,
        expiresAt: latestAttempt.expiresAt,
      }
    : null;

  return (
    <ResultShell
      score={score}
      total={total}
      percentage={percentage}
      siliconPoints={siliconPoints}
      performanceLevel={performanceLevel}
      userName={user.fullName || "Engineer"}
      streak={user.streak}
      totalSilicon={user.siliconPoints}
      rank={rank}
      analytics={analytics}
      engineeringTier={engineeringTier}
      engineeringLevel={engineeringLevel}
    />
  );
}

function ResultShell({
  score,
  total,
  percentage,
  siliconPoints,
  performanceLevel,
  userName,
  streak,
  totalSilicon,
  rank,
  analytics,
  engineeringTier,
  engineeringLevel,
}: {
  score: number;
  total: number;
  percentage: number;
  siliconPoints: number;
  performanceLevel: string;
  userName?: string;
  streak?: number;
  totalSilicon?: number;
  rank?: number;
  analytics?: AttemptAnalytics | null;
  engineeringTier?: string;
  engineeringLevel?: string;
}) {
  const scoreProgress =
    total > 0 ? Math.min(100, Math.round((score / total) * 100)) : 0;
  const tierProgress = totalSilicon
    ? Math.min(100, Math.round((totalSilicon / 1500) * 100))
    : percentage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,rgba(34,211,238,0.03))]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
        <MotionWrapper>
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 md:rounded-[2.5rem] lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 sm:text-sm">
                  Challenge Completed
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  Performance{" "}
                  <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Report
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
                  Your engineering challenge performance has been evaluated
                  successfully. Review your score, XP gain, streak momentum,
                  rank position, and achievement unlocks.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    <Sparkles className="h-4 w-4" />
                    {performanceLevel}
                  </span>

                  {engineeringTier && (
                    <span className="rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
                      {engineeringTier}
                    </span>
                  )}

                  {engineeringLevel && (
                    <span className="rounded-full border border-blue-400/25 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                      {engineeringLevel}
                    </span>
                  )}
                </div>

                {userName && (
                  <p className="mt-5 text-sm text-white/50">
                    Achievement profile synchronized for{" "}
                    <span className="font-semibold text-cyan-200">
                      {userName}
                    </span>
                    .
                  </p>
                )}
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_80px_rgba(34,211,238,0.16)] backdrop-blur-2xl">
                  <div className="absolute inset-4 rounded-full border border-white/10" />
                  <div className="absolute inset-8 rounded-full border border-purple-400/20" />

                  <div className="relative z-10 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/40">
                      Accuracy
                    </p>

                    <h2 className="mt-2 text-6xl font-black tabular-nums text-cyan-200">
                      {percentage}%
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-white/55">
                      {score}/{total} correct
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </MotionWrapper>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ResultMetricCard
            icon={<Trophy className="h-6 w-6 text-yellow-300" />}
            label="Final Score"
            value={`${score}/${total}`}
            helper="Challenge result"
          />

          <ResultMetricCard
            icon={<BrainCircuit className="h-6 w-6 text-cyan-300" />}
            label="Silicon Points Earned"
            value={`+${siliconPoints}`}
            helper="XP synchronized"
          />

          <ResultMetricCard
            icon={<Target className="h-6 w-6 text-emerald-300" />}
            label="Performance Accuracy"
            value={`${percentage}%`}
            helper="Answer precision"
          />

          <ResultMetricCard
            icon={<TrendingUp className="h-6 w-6 text-purple-300" />}
            label="National Rank"
            value={typeof rank === "number" ? `#${rank}` : "--"}
            helper="Competition position"
          />
        </section>

        <MotionWrapper>
          <section className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="relative overflow-hidden p-6 sm:p-8">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-cyan-300" />
                  <h2 className="text-2xl font-black text-white">
                    Tier Progression
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Your engineering tier visualization reflects the current
                  platform scoring state without changing any scoring logic.
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    <span>{engineeringLevel || "Level Progress"}</span>
                    <span>{tierProgress}%</span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                      style={{ width: `${tierProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden p-6 sm:p-8">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-300" />
                  <h2 className="text-2xl font-black text-white">
                    Streak Protection
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Daily consistency is protected through the existing streak
                  system. This section only visualizes the stored streak value.
                </p>

                <div className="mt-6 rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200/70">
                    Protected Engineering Streak
                  </p>

                  <p className="mt-3 text-5xl font-black text-orange-200">
                    {typeof streak === "number" ? streak : 0}
                    <span className="ml-2 text-lg text-white/50">
                      day{streak === 1 ? "" : "s"}
                    </span>
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>
        </MotionWrapper>

        <MotionWrapper>
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-cyan-300" />
              <h2 className="text-2xl font-black text-white">
                Achievement Unlocks
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <AchievementBadge
                title="Challenge Finisher"
                description="Completed a daily engineering challenge."
                active
              />

              <AchievementBadge
                title="Accuracy Surge"
                description="Unlocked by strong answer precision."
                active={percentage >= 75}
              />

              <AchievementBadge
                title="Elite Signal"
                description="Unlocked at 90%+ challenge accuracy."
                active={percentage >= 90}
              />
            </div>
          </GlassCard>
        </MotionWrapper>

        <MotionWrapper>
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Performance Insights
            </h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
                <h3 className="text-lg font-bold text-cyan-200">
                  Competitive Strength
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  Strong engineering reasoning and technical analysis capability
                  observed during this challenge session.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-purple-400/20 bg-purple-400/10 p-5">
                <h3 className="text-lg font-bold text-purple-200">
                  Recommended Focus
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  Continue improving speed consistency and advanced multi-domain
                  problem-solving capability for higher competitive rankings.
                </p>
              </div>
            </div>

            {analytics && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/45">
                    Integrity Snapshot
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <p className="text-sm text-white/55">
                    Tab switches:{" "}
                    <span className="font-semibold text-white">
                      {analytics.tabSwitchCount}
                    </span>
                  </p>

                  <p className="text-sm text-white/55">
                    Suspicious:{" "}
                    <span className="font-semibold text-white">
                      {analytics.suspicious ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        </MotionWrapper>

        <MotionWrapper>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <HoverScale>
              <Link
                href="/daily-challenges"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-400 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(34,211,238,0.18)] transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <ArrowLeft className="h-5 w-5" />
                Back To Challenges
              </Link>
            </HoverScale>

            <HoverScale>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                Go To Dashboard
              </Link>
            </HoverScale>
          </div>
        </MotionWrapper>
      </div>
    </main>
  );
}

function ResultMetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <HoverScale>
      <GlassCard className="h-full p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            {icon}
          </div>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">
            Live
          </span>
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
          {label}
        </p>

        <h3 className="mt-3 text-4xl font-black tracking-tight text-white">
          {value}
        </h3>

        <p className="mt-3 text-sm text-white/55">{helper}</p>
      </GlassCard>
    </HoverScale>
  );
}

function AchievementBadge({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={
        active
          ? "rounded-[1.5rem] border border-cyan-400/25 bg-cyan-400/10 p-5 shadow-[0_0_32px_rgba(34,211,238,0.12)]"
          : "rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 opacity-55"
      }
    >
      <div className="flex items-center gap-3">
        <div
          className={
            active
              ? "h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]"
              : "h-3 w-3 rounded-full bg-white/20"
          }
        />

        <h3 className="font-bold text-white">{title}</h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}
