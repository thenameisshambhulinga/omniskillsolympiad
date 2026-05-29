import Link from "next/link";

import {
  Trophy,
  BrainCircuit,
  Target,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateEngineeringTier } from "@/lib/engineering-tier";

interface Props {
  searchParams: Promise<{
    score?: string;
    total?: string;
  }>;
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;

  // Resolve server session
  const session = await getServerSession(authOptions);

  // If no session, fall back to query params rendering (no DB data)
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

  // Fetch user and latest attempt
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

  // Prefer the most recent attempt if available
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
  const stateRank = "--";
  const collegeRank = "--";

  // attempt analytics
  const analytics = latestAttempt
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

  // Lightweight presentational subcomponent to keep server logic tidy
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
    analytics?: any;
    engineeringTier?: string;
    engineeringLevel?: string;
  }) {
    return (
      <main className="relative z-10 min-h-screen px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          {/* HERO */}
          <div className="overflow-hidden rounded-[40px] border border-white/10 bg-linear-to-br from-cyan-500/10 to-purple-500/10 p-10 backdrop-blur-3xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
                  Challenge Completed
                </p>

                <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">
                  Performance
                  <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    {" "}
                    Report
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                  Your engineering challenge performance has been evaluated
                  successfully. Analytics and competitive metrics are shown
                  below.
                </p>

                <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3">
                  <Sparkles className="h-5 w-5 text-cyan-400" />

                  <span className="font-semibold text-cyan-300">
                    {performanceLevel}
                  </span>
                </div>

                {engineeringTier && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2 ml-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                      {engineeringTier}
                    </span>
                  </div>
                )}

                {engineeringLevel && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2 ml-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                      {engineeringLevel}
                    </span>
                  </div>
                )}

                {typeof streak === "number" && streak !== undefined && (
                  <p className="mt-4 text-sm text-white/60">
                    <span className="font-semibold text-cyan-300">
                      Protected Engineering Streak
                    </span>
                    : {streak} day{streak === 1 ? "" : "s"}
                  </p>
                )}
              </div>

              {/* SCORE CIRCLE */}
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                <div className="text-center">
                  <h2 className="text-6xl font-black text-cyan-400">
                    {percentage}%
                  </h2>

                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                    Accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* SCORE */}
            <div className="rounded-3xl border border-white/10 bg-white/3 p-7">
              <Trophy className="h-8 w-8 text-yellow-400" />

              <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/40">
                Final Score
              </p>

              <h2 className="mt-2 text-5xl font-black">
                {score}/{total}
              </h2>
            </div>

            {/* POINTS */}
            <div className="rounded-3xl border border-white/10 bg-white/3 p-7">
              <BrainCircuit className="h-8 w-8 text-cyan-400" />

              <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/40">
                Silicon Points Earned
              </p>

              <h2 className="mt-2 text-5xl font-black text-cyan-400">
                +{siliconPoints}
              </h2>
            </div>

            {/* ACCURACY */}
            <div className="rounded-3xl border border-white/10 bg-white/3 p-7">
              <Target className="h-8 w-8 text-green-400" />

              <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/40">
                Performance Accuracy
              </p>

              <h2 className="mt-2 text-5xl font-black text-green-400">
                {percentage}%
              </h2>
            </div>
          </div>

          {/* INSIGHTS */}
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-3xl font-black">Performance Insights</h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                <h3 className="text-xl font-bold text-cyan-400">
                  Competitive Strength
                </h3>

                <p className="mt-4 leading-7 text-white/60">
                  Strong engineering reasoning and technical analysis capability
                  observed during this challenge session.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
                <h3 className="text-xl font-bold text-purple-400">
                  Recommended Focus
                </h3>

                <p className="mt-4 leading-7 text-white/60">
                  Continue improving speed consistency and advanced multi-domain
                  problem-solving capability for higher competitive rankings.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/daily-challenges"
              className="inline-flex items-center gap-3 rounded-2xl bg-cyan-400 px-7 py-4 font-bold text-black transition hover:scale-[1.02]"
            >
              <ArrowLeft className="h-5 w-5" />
              Back To Challenges
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 font-bold transition hover:border-cyan-400 hover:bg-cyan-400/10"
            >
              Go To Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="relative z-10 min-h-screen px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <div className="overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-10 backdrop-blur-3xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
                Challenge Completed
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">
                Performance
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {" "}
                  Report
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                Your engineering challenge performance has been evaluated
                successfully. Analytics and competitive metrics are shown below.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3">
                <Sparkles className="h-5 w-5 text-cyan-400" />

                <span className="font-semibold text-cyan-300">
                  {performanceLevel}
                </span>
              </div>
            </div>

            {/* SCORE CIRCLE */}
            <div className="flex h-44 w-44 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
              <div className="text-center">
                <h2 className="text-6xl font-black text-cyan-400">
                  {percentage}%
                </h2>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                  Accuracy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* SCORE */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <Trophy className="h-8 w-8 text-yellow-400" />

            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/40">
              Final Score
            </p>

            <h2 className="mt-2 text-5xl font-black">
              {score}/{total}
            </h2>
          </div>

          {/* POINTS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <BrainCircuit className="h-8 w-8 text-cyan-400" />

            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/40">
              Silicon Points Earned
            </p>

            <h2 className="mt-2 text-5xl font-black text-cyan-400">
              +{siliconPoints}
            </h2>
          </div>

          {/* ACCURACY */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <Target className="h-8 w-8 text-green-400" />

            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/40">
              Performance Accuracy
            </p>

            <h2 className="mt-2 text-5xl font-black text-green-400">
              {percentage}%
            </h2>
          </div>

          {/* COMPETITIVE RANK */}
          <div className="rounded-3xl border border-white/10 bg-white/3 p-7">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              National Rank
            </p>
            <h2 className="mt-2 text-4xl font-black text-purple-400">
              #{rank}
            </h2>

            <div className="mt-4 flex gap-6 text-xs text-white/60">
              <div>
                <p className="text-[10px] uppercase text-white/40">
                  State Rank
                </p>
                <p className="font-semibold">{stateRank}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-white/40">
                  College Rank
                </p>
                <p className="font-semibold">{collegeRank}</p>
              </div>
            </div>

            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-white/50">
              Global Competition Rank
            </p>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-3xl font-black">Performance Insights</h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
              <h3 className="text-xl font-bold text-cyan-400">
                Competitive Strength
              </h3>

              <p className="mt-4 leading-7 text-white/60">
                Strong engineering reasoning and technical analysis capability
                observed during this challenge session.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
              <h3 className="text-xl font-bold text-purple-400">
                Recommended Focus
              </h3>

              <p className="mt-4 leading-7 text-white/60">
                Continue improving speed consistency and advanced multi-domain
                problem-solving capability for higher competitive rankings.
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-wrap gap-5">
          <Link
            href="/daily-challenges"
            className="inline-flex items-center gap-3 rounded-2xl bg-cyan-400 px-7 py-4 font-bold text-black transition hover:scale-[1.02]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back To Challenges
          </Link>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 font-bold transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
