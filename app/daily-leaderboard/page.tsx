import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Crown,
  Gauge,
  LayoutDashboard,
  Medal,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import {
  calculateOmniScore,
  determineEngineeringTier,
} from "@/lib/engineering-system";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type ProcessedRanking = Awaited<
  ReturnType<typeof getProcessedRankings>
>[number];

export default async function DailyLeaderboardPage() {
  const processedRankings = await getProcessedRankings();
  const topThree = processedRankings.slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <LeaderboardBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-10">
        <header className="grid gap-8 rounded-[2.5rem] border border-white bg-white/72 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-700 shadow-[0_12px_34px_rgba(34,211,238,0.12)]">
              <Sparkles className="h-4 w-4" />
              Omni Skills Olympiad Rankings
            </div>

            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-tight tracking-tight text-[#6d6e6f] sm:text-6xl lg:text-7xl">
              Engineering
              <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              Rankings are generated using omni-score intelligence, engineering
              consistency, challenge performance, accuracy metrics, and
              protected streak systems.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-slate-800 shadow-[0_18px_54px_rgba(15,23,42,0.09)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          {topThree.length > 0 ? (
            topThree.map((entry, index) => (
              <TopRankCard key={entry.id} entry={entry} index={index} />
            ))
          ) : (
            <EmptyLeaderboardState />
          )}
        </section>

        <LeaderboardTable rankings={processedRankings} />
      </div>
    </main>
  );
}

async function getProcessedRankings() {
  const rankings = await prisma.seasonProgress.findMany({
    orderBy: [
      {
        weightedRankScore: "desc",
      },
      {
        averageAccuracy: "desc",
      },
      {
        consistencyScore: "desc",
      },
    ],
    take: 100,
    select: {
      id: true,
      currentDay: true,
      completedDays: true,
      consistencyScore: true,
      averageAccuracy: true,
      weightedRankScore: true,
      totalPoints: true,
      eliminated: true,
      championBlocked: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          image: true,
          college: true,
          branch: true,
          omniId: true,
          siliconPoints: true,
          streak: true,
        },
      },
    },
  });

  return rankings.map((entry) => {
    const omniScore = calculateOmniScore({
      averageAccuracy: sanitizeNumber(entry.averageAccuracy),
      consistencyScore: sanitizeNumber(entry.consistencyScore),
      completedDays: sanitizeNumber(entry.completedDays),
      totalPoints: sanitizeNumber(entry.totalPoints),
    });

    const safeOmniScore = sanitizeNumber(omniScore);
    const engineeringTier = determineEngineeringTier(safeOmniScore);

    return {
      ...entry,
      omniScore: safeOmniScore,
      engineeringTier,
    };
  });
}

function TopRankCard({
  entry,
  index,
}: {
  entry: ProcessedRanking;
  index: number;
}) {
  const rank = index + 1;
  const tone = getRankTone(rank);

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-[2.25rem] border p-6 shadow-[0_26px_90px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_120px_rgba(37,99,235,0.18)] sm:p-7 ${tone.card}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tone.strip}`}
      />

      <div
        aria-hidden="true"
        className={`absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition duration-500 group-hover:scale-110 ${tone.glow}`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_42%)]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div
            className={`inline-flex h-14 min-w-14 items-center justify-center rounded-2xl px-4 text-xl font-black text-slate-950 shadow-[0_14px_40px_rgba(0,0,0,0.20)] ${tone.rankBadge}`}
          >
            #{rank}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.10] px-4 py-2 text-sm font-black tabular-nums text-cyan-100">
            <Zap className="h-4 w-4" />
            {formatScore(entry.omniScore)}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="line-clamp-1 text-3xl font-black tracking-tight text-white">
            {entry.user.fullName || "Anonymous Engineer"}
          </h2>

          <p className="mt-2 line-clamp-1 text-sm font-semibold text-white/52">
            {entry.user.email}
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-cyan-400/[0.18] to-purple-500/[0.18] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
          <span>{entry.engineeringTier.badge}</span>
          <span>{entry.engineeringTier.level}</span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <MiniMetric
            label="Accuracy"
            value={`${formatPercent(entry.averageAccuracy)}%`}
            icon={<Target className="h-4 w-4" />}
          />

          <MiniMetric
            label="Consistency"
            value={formatInteger(entry.consistencyScore)}
            icon={<ShieldCheck className="h-4 w-4" />}
          />
        </div>

        <div className="mt-3 rounded-[1.35rem] border border-white/10 bg-black/[0.20] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-white/42">
                Completed Days
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {formatInteger(entry.completedDays)}
                <span className="text-white/35">/30</span>
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.10] text-cyan-200">
              {rank === 1 ? (
                <Crown className="h-5 w-5" />
              ) : rank === 2 ? (
                <Medal className="h-5 w-5" />
              ) : (
                <Trophy className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-black/[0.22] p-4">
      <div className="flex items-center gap-2 text-cyan-200">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/42">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function LeaderboardTable({ rankings }: { rankings: ProcessedRanking[] }) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white bg-white/76 p-4 shadow-[0_28px_110px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.11),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(168,85,247,0.10),transparent_34%)]" />

      <div className="relative z-10 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-700">
            Full Ranking Table
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#6d6e6f]">
            Omni Score Standings
          </h2>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-slate-600 shadow-sm">
          <BarChart3 className="h-4 w-4 text-cyan-600" />
          Top {rankings.length} engineers
        </div>
      </div>

      {rankings.length > 0 ? (
        <div className="relative z-10 overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-slate-950 shadow-[0_20px_70px_rgba(15,23,42,0.18)] [scrollbar-color:rgba(34,211,238,0.55)_rgba(255,255,255,0.12)] [scrollbar-width:thin]">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-left text-xs uppercase tracking-[0.16em] text-white/48">
                <th className="px-5 py-5">Rank</th>
                <th className="px-5 py-5">Engineer</th>
                <th className="px-5 py-5">Omni Score</th>
                <th className="px-5 py-5">Level</th>
                <th className="px-5 py-5">Accuracy</th>
                <th className="px-5 py-5">Consistency</th>
                <th className="px-5 py-5">Completed</th>
                <th className="px-5 py-5">Total Points</th>
              </tr>
            </thead>

            <tbody>
              {rankings.map((entry, index) => (
                <tr
                  key={entry.id}
                  className="border-b border-white/[0.06] transition hover:bg-cyan-300/[0.06]"
                >
                  <td className="px-5 py-5">
                    <div className="inline-flex h-11 min-w-11 items-center justify-center rounded-2xl bg-cyan-300 px-3 font-black text-slate-950">
                      #{index + 1}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div>
                      <p className="font-black text-white">
                        {entry.user.fullName || "Anonymous"}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white/42">
                        {entry.user.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="inline-flex items-center gap-2 text-xl font-black tabular-nums text-cyan-200">
                      <Gauge className="h-4 w-4" />
                      {formatScore(entry.omniScore)}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-cyan-400/[0.18] to-purple-500/[0.18] px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-white">
                      <span>{entry.engineeringTier.badge}</span>
                      <span>{entry.engineeringTier.level}</span>
                    </div>
                  </td>

                  <td className="px-5 py-5 font-semibold text-white/86">
                    {formatPercent(entry.averageAccuracy)}%
                  </td>

                  <td className="px-5 py-5 font-semibold text-white/86">
                    {formatInteger(entry.consistencyScore)}
                  </td>

                  <td className="px-5 py-5 font-semibold text-white/86">
                    {formatInteger(entry.completedDays)}/30
                  </td>

                  <td className="px-5 py-5 font-semibold text-white/86">
                    {formatInteger(entry.totalPoints)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyLeaderboardState />
      )}
    </section>
  );
}

function EmptyLeaderboardState() {
  return (
    <div className="lg:col-span-3 rounded-[2rem] border border-dashed border-cyan-300 bg-white/72 p-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
      <Trophy className="mx-auto h-12 w-12 text-cyan-600" />

      <h2 className="mt-5 text-3xl font-black text-slate-950">
        No leaderboard entries yet
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-600">
        Once students complete protected daily challenges, their omni-score
        rankings will appear here.
      </p>

      <Link
        href="/daily-challenges"
        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_34px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-600"
      >
        Open Challenges
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function LeaderboardBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fbff_0%,#eef7ff_32%,#f8f7ff_68%,#ffffff_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_90%_16%,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_54%_100%,rgba(168,85,247,0.17),transparent_38%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:78px_78px] opacity-45 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 select-none text-center text-[clamp(4rem,10vw,11rem)] font-black uppercase leading-[0.88] tracking-[0.16em] text-slate-950/[0.035]">
        <span className="block">OMNI SKILLS</span>
        <span className="block">OLYMPIAD</span>
      </div>

      <div className="absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full bg-cyan-300/28 blur-3xl" />
      <div className="absolute -right-40 top-28 h-[38rem] w-[38rem] rounded-full bg-purple-300/26 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-300/22 blur-3xl" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-r from-cyan-200/38 via-purple-200/28 to-blue-200/34 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.65),transparent_38%,rgba(255,255,255,0.34))]" />
    </div>
  );
}

function getRankTone(rank: number) {
  if (rank === 1) {
    return {
      card: "border-yellow-300/30 bg-slate-950/92",
      strip: "from-yellow-300 via-cyan-300 to-purple-400",
      glow: "bg-yellow-300/[0.16]",
      rankBadge: "bg-gradient-to-r from-yellow-300 to-cyan-300",
    };
  }

  if (rank === 2) {
    return {
      card: "border-cyan-300/28 bg-slate-950/92",
      strip: "from-cyan-300 via-blue-400 to-purple-400",
      glow: "bg-cyan-300/[0.16]",
      rankBadge: "bg-gradient-to-r from-cyan-300 to-blue-300",
    };
  }

  return {
    card: "border-purple-300/28 bg-slate-950/92",
    strip: "from-purple-400 via-cyan-300 to-blue-400",
    glow: "bg-purple-300/[0.16]",
    rankBadge: "bg-gradient-to-r from-purple-300 to-cyan-300",
  };
}

function sanitizeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function formatScore(value: number) {
  const safeValue = sanitizeNumber(value);
  return Number.isInteger(safeValue) ? String(safeValue) : safeValue.toFixed(2);
}

function formatPercent(value: number) {
  return sanitizeNumber(value).toFixed(1);
}

function formatInteger(value: number) {
  return String(Math.round(sanitizeNumber(value)));
}