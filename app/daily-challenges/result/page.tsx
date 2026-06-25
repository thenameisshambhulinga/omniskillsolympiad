import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Flame,
  Home,
  LayoutDashboard,
  Medal,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getServerSession } from "next-auth";

import ResultCelebrationGate from "@/components/daily-challenges/ResultCelebrationGate";
import { authOptions } from "@/lib/auth";
import { calculateEngineeringTier } from "@/lib/engineering-tier";
import { prisma } from "@/lib/prisma";
import { withDatabaseResult } from "@/lib/server/database-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type ResultPageProps = {
  searchParams: Promise<{
    score?: string;
    total?: string;
    challengeId?: string;
    celebrate?: string;
  }>;
};

type ResultData = {
  challengeId: string | null;
  challengeTitle: string;
  challengeDay: number | null;
  score: number;
  total: number;
  percentage: number;
  siliconPointsEarned: number;
  performanceLevel: string;
  userName: string;
  streak: number;
  totalSilicon: number;
  rank: number | null;
  engineeringTier: string;
  engineeringLevel: string;
  integrity: {
    tabSwitchCount: number;
    suspicious: boolean;
    startedAt: string | null;
    submittedAt: string | null;
    expiresAt: string | null;
  } | null;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;

  const playCelebrationIntro = params.celebrate === "1";
  const fallbackScore = normalizeNumber(params.score);
  const fallbackTotal = normalizeNumber(params.total);
  const challengeId =
    typeof params.challengeId === "string" ? params.challengeId.trim() : "";

  const session = await getServerSession(authOptions);
  const userEmail =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  if (!userEmail) {
    return (
      <ResultShell
        data={buildFallbackResult({
          score: fallbackScore,
          total: fallbackTotal,
          challengeId: challengeId || null,
        })}
        playCelebrationIntro={playCelebrationIntro}
      />
    );
  }

  const result = await withDatabaseResult({
    label: "DailyResultPage.getExactAttemptReport",
    action: async () => {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
          fullName: true,
          siliconPoints: true,
          streak: true,
        },
      });

      if (!user) {
        return buildFallbackResult({
          score: fallbackScore,
          total: fallbackTotal,
          challengeId: challengeId || null,
        });
      }

      const attempt = await prisma.dailyAttempt.findFirst({
        where: {
          userId: user.id,
          completed: true,
          ...(challengeId ? { challengeId } : {}),
        },
        orderBy: [
          {
            submittedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          challengeId: true,
          challengeDay: true,
          score: true,
          total: true,
          percentage: true,
          tabSwitchCount: true,
          suspicious: true,
          startedAt: true,
          submittedAt: true,
          expiresAt: true,
          challenge: {
            select: {
              title: true,
              dayNumber: true,
            },
          },
        },
      });

      const score = attempt?.score ?? fallbackScore;
      const total = attempt?.total ?? fallbackTotal;
      const percentage =
        typeof attempt?.percentage === "number"
          ? Math.round(attempt.percentage)
          : total > 0
            ? Math.round((score / total) * 100)
            : 0;

      const usersAbove = await prisma.user.count({
        where: {
          siliconPoints: {
            gt: user.siliconPoints,
          },
        },
      });

      const tier = calculateEngineeringTier(user.siliconPoints);

      return {
        challengeId: attempt?.challengeId ?? (challengeId || null),
        challengeTitle:
          attempt?.challenge?.title ??
          (challengeId ? "Selected Challenge" : "Latest Daily Challenge"),
        challengeDay:
          attempt?.challenge?.dayNumber ?? attempt?.challengeDay ?? null,
        score,
        total,
        percentage,
        siliconPointsEarned: score * 10,
        performanceLevel: getPerformanceLevel(percentage),
        userName: user.fullName || "Engineer",
        streak: user.streak,
        totalSilicon: user.siliconPoints,
        rank: usersAbove + 1,
        engineeringTier: tier.tier,
        engineeringLevel: tier.level,
        integrity: attempt
          ? {
              tabSwitchCount: attempt.tabSwitchCount,
              suspicious: attempt.suspicious,
              startedAt: toIsoOrNull(attempt.startedAt),
              submittedAt: toIsoOrNull(attempt.submittedAt),
              expiresAt: toIsoOrNull(attempt.expiresAt),
            }
          : null,
      } satisfies ResultData;
    },
  });

  return (
    <ResultShell
      data={
        result.ok
          ? result.data
          : buildFallbackResult({
              score: fallbackScore,
              total: fallbackTotal,
              challengeId: challengeId || null,
            })
      }
      playCelebrationIntro={playCelebrationIntro}
    />
  );
}

function ResultShell({
  data,
  playCelebrationIntro,
}: {
  data: ResultData;
  playCelebrationIntro: boolean;
}) {
  const tierProgress = Math.min(
    100,
    Math.max(0, Math.round((data.totalSilicon / 1500) * 100)),
  );

  const accuracyProgress = Math.min(100, Math.max(0, data.percentage));

  return (
    <ResultCelebrationGate playIntro={playCelebrationIntro}>
      <main className="relative min-h-screen overflow-hidden bg-[#f8f9fa] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
        <ResultBackground />

        <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-6">
          <section className="relative overflow-hidden rounded-[2.75rem] border border-white/20 bg-slate-950 p-6 text-white shadow-[0_34px_120px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(168,85,247,0.22),transparent_32%),radial-gradient(circle_at_72%_92%,rgba(250,204,21,0.16),transparent_36%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-300 via-purple-300 via-pink-300 to-yellow-300" />

            <div className="relative z-10 grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-cyan-100">
                  <Sparkles className="h-4 w-4" />
                  Challenge Performance Report
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-cyan-200/80">
                  {typeof data.challengeDay === "number"
                    ? `Day ${data.challengeDay}`
                    : "Daily Challenge"}
                </p>

                <h1 className="mt-3 max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                  {data.challengeTitle}
                </h1>

                <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-white/64 sm:text-lg">
                  Your submission has been evaluated. Review your accuracy,
                  Silicon Points gain, rank position, streak momentum and
                  achievement signals.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ResultPill tone="cyan">
                    <Sparkles className="h-4 w-4" />
                    {data.performanceLevel}
                  </ResultPill>

                  <ResultPill tone="purple">{data.engineeringTier}</ResultPill>

                  <ResultPill tone="blue">{data.engineeringLevel}</ResultPill>
                </div>

                <p className="mt-5 text-sm font-semibold text-white/55">
                  Achievement profile synchronized for{" "}
                  <span className="font-black text-cyan-100">
                    {data.userName}
                  </span>
                  .
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <ReportLink href="/daily-challenges" tone="cyan">
                    <ArrowLeft className="h-4 w-4" />
                    Challenge Hub
                  </ReportLink>

                  <ReportLink href="/dashboard" tone="white">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </ReportLink>

                  <ReportLink href="/" tone="white">
                    <Home className="h-4 w-4" />
                    Home
                  </ReportLink>
                </div>
              </div>

              <div className="flex justify-center xl:justify-end">
                <ScoreOrbit
                  percentage={accuracyProgress}
                  score={data.score}
                  total={data.total}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Trophy className="h-6 w-6" />}
              label="Final Score"
              value={`${data.score}/${data.total}`}
              helper="Server-verified result"
              tone="yellow"
            />

            <MetricCard
              icon={<Zap className="h-6 w-6" />}
              label="Silicon Points"
              value={`+${data.siliconPointsEarned}`}
              helper="Points earned in this challenge"
              tone="cyan"
            />

            <MetricCard
              icon={<Target className="h-6 w-6" />}
              label="Accuracy"
              value={`${data.percentage}%`}
              helper="Answer precision"
              tone="emerald"
            />

            <MetricCard
              icon={<BarChart3 className="h-6 w-6" />}
              label="Rank"
              value={typeof data.rank === "number" ? `#${data.rank}` : "--"}
              helper="Based on Silicon Points"
              tone="purple"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <ProgressPanel
              icon={<Award className="h-6 w-6" />}
              title="Tier Progression"
              description="This follows your current stored Silicon Points and engineering tier state."
              label={data.engineeringLevel}
              progress={tierProgress}
              tone="cyan"
            />

            <ProgressPanel
              icon={<Flame className="h-6 w-6" />}
              title="Streak Momentum"
              description="Your consistency signal is synced with protected challenge attempts."
              label={`${data.streak} day${data.streak === 1 ? "" : "s"}`}
              progress={Math.min(100, data.streak * 10)}
              tone="orange"
            />
          </section>

          <section className="rounded-[2.25rem] border border-white bg-white/84 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-center gap-3">
              <Medal className="h-6 w-6 text-blue-700" />
              <h2 className="text-3xl font-black text-[#6d6e6f]">
                Achievement Unlocks
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <AchievementBadge
                title="Challenge Finisher"
                description="Completed a daily engineering challenge."
                active={data.total > 0}
              />

              <AchievementBadge
                title="Accuracy Surge"
                description="Unlocked by strong answer precision."
                active={data.percentage >= 75}
              />

              <AchievementBadge
                title="Elite Signal"
                description="Unlocked at 90%+ challenge accuracy."
                active={data.percentage >= 90}
              />
            </div>

            {data.integrity ? (
              <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
                    Integrity Snapshot
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <SnapshotItem
                    label="Tab switches"
                    value={String(data.integrity.tabSwitchCount)}
                  />
                  <SnapshotItem
                    label="Suspicious"
                    value={data.integrity.suspicious ? "Yes" : "No"}
                  />
                  <SnapshotItem
                    label="Started"
                    value={formatDateTime(data.integrity.startedAt)}
                  />
                  <SnapshotItem
                    label="Submitted"
                    value={formatDateTime(data.integrity.submittedAt)}
                  />
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </ResultCelebrationGate>
  );
}

function ResultBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
        src="/videos/performance-celebration.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_90%_14%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_58%_100%,rgba(168,85,247,0.16),transparent_36%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/82 to-[#f8f9fa]" />
      <div className="absolute left-10 top-28 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="absolute right-10 top-64 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
    </div>
  );
}

function ScoreOrbit({
  percentage,
  score,
  total,
}: {
  percentage: number;
  score: number;
  total: number;
}) {
  return (
    <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10 shadow-[0_0_100px_rgba(34,211,238,0.22)]">
      <div className="absolute inset-4 rounded-full border border-white/10" />
      <div className="absolute inset-10 rounded-full border border-purple-300/20" />

      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(rgba(34,211,238,0.86) ${percentage}%, rgba(255,255,255,0.08) 0)`,
          mask: "radial-gradient(farthest-side, transparent calc(100% - 14px), black calc(100% - 13px))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 14px), black calc(100% - 13px))",
        }}
      />

      <div className="relative z-10 text-center">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
          Accuracy
        </p>

        <h2 className="mt-3 text-7xl font-black tracking-tight text-cyan-100">
          {percentage}%
        </h2>

        <p className="mt-2 text-sm font-bold text-white/55">
          {score}/{total} correct
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
  tone: "yellow" | "cyan" | "emerald" | "purple";
}) {
  const toneClass =
    tone === "yellow"
      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
      : tone === "cyan"
        ? "border-cyan-200 bg-cyan-50 text-cyan-700"
        : tone === "emerald"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-purple-200 bg-purple-50 text-purple-700";

  return (
    <article
      className={`rounded-[2rem] border p-5 shadow-[0_18px_54px_rgba(15,23,42,0.07)] ${toneClass}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl border border-white bg-white/80 p-3">
          {icon}
        </div>

        <span className="rounded-full border border-white bg-white/72 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em]">
          Live
        </span>
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.08em] opacity-70">
        {label}
      </p>

      <h3 className="mt-3 text-4xl font-black tracking-tight">{value}</h3>

      <p className="mt-2 text-sm font-semibold opacity-70">{helper}</p>
    </article>
  );
}

function ProgressPanel({
  icon,
  title,
  description,
  label,
  progress,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  label: string;
  progress: number;
  tone: "cyan" | "orange";
}) {
  const gradient =
    tone === "cyan"
      ? "from-cyan-400 via-blue-500 to-purple-500"
      : "from-orange-400 via-yellow-400 to-red-400";

  return (
    <section className="rounded-[2.25rem] border border-white bg-white/84 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-blue-700">
          {icon}
        </div>

        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      </div>

      <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.08em] text-slate-500">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
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
          ? "rounded-[1.5rem] border border-cyan-200 bg-cyan-50 p-5 shadow-sm"
          : "rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 opacity-60"
      }
    >
      <div className="flex items-center gap-3">
        <div
          className={
            active
              ? "h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_18px_rgba(34,211,238,0.65)]"
              : "h-3 w-3 rounded-full bg-slate-300"
          }
        />

        <h3 className="font-black text-slate-950">{title}</h3>
      </div>

      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function SnapshotItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white/70 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-emerald-700">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ReportLink({
  href,
  children,
  tone,
}: {
  href: string;
  children: ReactNode;
  tone: "cyan" | "white";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-300/40 bg-cyan-400/18 text-cyan-50 hover:bg-cyan-400/26"
      : "border-white/10 bg-white/[0.08] text-white/82 hover:border-cyan-300/35 hover:text-cyan-100";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-black uppercase tracking-[0.08em] transition hover:-translate-y-0.5 ${toneClass}`}
    >
      {children}
    </Link>
  );
}

function ResultPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "cyan" | "purple" | "blue";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
      : tone === "purple"
        ? "border-purple-300/30 bg-purple-400/10 text-purple-100"
        : "border-blue-300/30 bg-blue-400/10 text-blue-100";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.08em] ${toneClass}`}
    >
      {children}
    </span>
  );
}

function buildFallbackResult({
  score,
  total,
  challengeId,
}: {
  score: number;
  total: number;
  challengeId: string | null;
}): ResultData {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return {
    challengeId,
    challengeTitle: "Daily Challenge Report",
    challengeDay: null,
    score,
    total,
    percentage,
    siliconPointsEarned: score * 10,
    performanceLevel: getPerformanceLevel(percentage),
    userName: "Engineer",
    streak: 0,
    totalSilicon: score * 10,
    rank: null,
    engineeringTier: "Bronze",
    engineeringLevel: "Level 1",
    integrity: null,
  };
}

function getPerformanceLevel(percentage: number) {
  if (percentage >= 90) return "Elite Engineer";
  if (percentage >= 75) return "Advanced Performer";
  if (percentage >= 50) return "Growing Competitor";
  return "Needs Improvement";
}

function normalizeNumber(value: string | undefined) {
  const parsed = Number(value ?? 0);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.round(parsed));
}

function toIsoOrNull(value: Date | null) {
  return value ? value.toISOString() : null;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleString();
}