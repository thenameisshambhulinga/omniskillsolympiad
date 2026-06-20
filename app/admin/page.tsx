import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CircuitBoard,
  Clock3,
  Database,
  Gauge,
  LayoutDashboard,
  Megaphone,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { withDatabaseResult } from "@/lib/server/database-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type AdminCommandCenterData = Awaited<ReturnType<typeof getAdminCommandCenterData>>;

const EMPTY_ADMIN_COMMAND_CENTER_DATA = {
  databaseOnline: false,
  stats: {
    totalUsers: 0,
    onboardedUsers: 0,
    totalChallenges: 0,
    publishedChallenges: 0,
    totalAttempts: 0,
    livePosters: 0,
    draftPosters: 0,
    competitionProfiles: 0,
    verifiedCompetitionProfiles: 0,
    pendingCompetitionProfiles: 0,
    competitionHistoryCount: 0,
  },
  recentChallenges: [],
  recentCompetitionHistory: [],
};

export default async function AdminPage() {
  const commandResult = await withDatabaseResult({
    label: "AdminCommandCenter.getDashboardData",
    action: getAdminCommandCenterData,
  });

  const commandData: AdminCommandCenterData = commandResult.ok
    ? commandResult.data
    : EMPTY_ADMIN_COMMAND_CENTER_DATA;

  const {
    stats,
    recentChallenges,
    recentCompetitionHistory,
    databaseOnline,
  } = commandData;

  const draftChallenges = Math.max(
    0,
    stats.totalChallenges - stats.publishedChallenges,
  );

  const onboardingPercent = getPercent(
    stats.onboardedUsers,
    stats.totalUsers,
  );

  const challengePublishPercent = getPercent(
    stats.publishedChallenges,
    stats.totalChallenges,
  );

  const posterPublishPercent = getPercent(
    stats.livePosters,
    stats.livePosters + stats.draftPosters,
  );

  const verificationPercent = getPercent(
    stats.verifiedCompetitionProfiles,
    stats.competitionProfiles,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
      {!databaseOnline ? <DatabaseOfflineNotice /> : null}

      <section className="relative overflow-hidden rounded-[2.75rem] border border-white bg-white/78 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <AdminHeroBackground />

        <div className="relative z-10 grid gap-10 xl:grid-cols-[1.12fr_0.88fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              <Sparkles className="h-4 w-4" />
              Admin Command Center
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight tracking-tight text-[#6d6e6f] sm:text-5xl lg:text-6xl">
              One command room for{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                challenges, competitions and posters.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              Control daily challenge publishing, event verification, live
              poster content and platform intelligence from one safe admin
              layer.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <StatusBadge
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Admin Verified"
                tone="emerald"
              />
              <StatusBadge
                icon={<Database className="h-4 w-4" />}
                label={databaseOnline ? "Database Online" : "Database Fallback"}
                tone={databaseOnline ? "blue" : "rose"}
              />
              <StatusBadge
                icon={<Sparkles className="h-4 w-4" />}
                label="Unified Control"
                tone="yellow"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AdminPrimaryLink href="/admin/create-daily-challenge">
                <Plus className="h-4 w-4" />
                Create Challenge
              </AdminPrimaryLink>

              <AdminSecondaryLink href="/admin/announcements">
                <Megaphone className="h-4 w-4" />
                Publish Poster
              </AdminSecondaryLink>

              <AdminSecondaryLink href="/admin/competition">
                <Swords className="h-4 w-4" />
                Competition Control
              </AdminSecondaryLink>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/78 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-200/60 blur-3xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-blue-700">
                  <Gauge className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Platform Load
                  </p>
                  <p className="mt-1 text-4xl font-black text-slate-950">
                    {stats.totalAttempts}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MiniProgressMetric
                  label="Onboarding"
                  value={onboardingPercent}
                  tone="blue"
                />
                <MiniProgressMetric
                  label="Published Challenges"
                  value={challengePublishPercent}
                  tone="cyan"
                />
                <MiniProgressMetric
                  label="Live Posters"
                  value={posterPublishPercent}
                  tone="yellow"
                />
                <MiniProgressMetric
                  label="Verified Events"
                  value={verificationPercent}
                  tone="emerald"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Users className="h-6 w-6" />}
          label="Users"
          value={stats.totalUsers}
          helper={`${stats.onboardedUsers} onboarded`}
          tone="blue"
        />

        <KpiCard
          icon={<CircuitBoard className="h-6 w-6" />}
          label="Challenges"
          value={stats.totalChallenges}
          helper={`${stats.publishedChallenges} published · ${draftChallenges} drafts`}
          tone="cyan"
        />

        <KpiCard
          icon={<Swords className="h-6 w-6" />}
          label="Competition Profiles"
          value={stats.competitionProfiles}
          helper={`${stats.verifiedCompetitionProfiles} verified · ${stats.pendingCompetitionProfiles} pending`}
          tone="emerald"
        />

        <KpiCard
          icon={<Megaphone className="h-6 w-6" />}
          label="Live Posters"
          value={stats.livePosters}
          helper={`${stats.draftPosters} drafts`}
          tone="yellow"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminGlassPanel className="p-6 sm:p-7">
          <PanelHeader
            eyebrow="Operations"
            title="Control Modules"
            icon={<Database className="h-6 w-6" />}
            tone="blue"
          />

          <div className="mt-6 grid gap-4">
            <ActionLink
              href="/admin/create-daily-challenge"
              icon={<Plus className="h-5 w-5" />}
              title="Create Daily Challenge"
              description="Launch a new protected daily engineering mission."
              tone="blue"
            />

            <ActionLink
              href="/admin/manage-challenges"
              icon={<CircuitBoard className="h-5 w-5" />}
              title="Manage Daily Challenges"
              description="Edit questions, inspect readiness and publish missions."
              tone="cyan"
            />

            <ActionLink
              href="/admin/competition"
              icon={<Swords className="h-5 w-5" />}
              title="Competition Control"
              description="Manage event verification, stages, points and history."
              tone="emerald"
            />

            <ActionLink
              href="/admin/announcements"
              icon={<Megaphone className="h-5 w-5" />}
              title="Poster Publisher"
              description="Publish landing and login posters without code changes."
              tone="yellow"
            />

            <ActionLink
              href="/daily-leaderboard"
              icon={<Trophy className="h-5 w-5" />}
              title="Leaderboard Intelligence"
              description="Review public ranking movement and omni-score signals."
              tone="purple"
            />
          </div>
        </AdminGlassPanel>

        <AdminGlassPanel className="p-6 sm:p-7">
          <PanelHeader
            eyebrow="Live Intelligence"
            title="Recent Operations"
            icon={<Activity className="h-6 w-6" />}
            tone="yellow"
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <RecentChallengeList challenges={recentChallenges} />
            <RecentCompetitionList history={recentCompetitionHistory} />
          </div>
        </AdminGlassPanel>
      </section>

      {stats.pendingCompetitionProfiles > 0 ? (
        <section className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-5 text-yellow-900 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-black leading-7">
              {stats.pendingCompetitionProfiles} competition profile
              {stats.pendingCompetitionProfiles === 1 ? " is" : "s are"} waiting
              for admin verification.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

async function getAdminCommandCenterData() {
  const [
    totalUsers,
    onboardedUsers,
    totalChallenges,
    publishedChallenges,
    totalAttempts,
    livePosters,
    draftPosters,
    competitionProfiles,
    verifiedCompetitionProfiles,
    pendingCompetitionProfiles,
    competitionHistoryCount,
    recentChallenges,
    recentCompetitionHistory,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({
      where: {
        isOnboarded: true,
      },
    }),
    prisma.dailyChallenge.count(),
    prisma.dailyChallenge.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.dailyAttempt.count(),
    prisma.announcementPoster.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.announcementPoster.count({
      where: {
        isPublished: false,
      },
    }),
    prisma.competitionProfile.count(),
    prisma.competitionProfile.count({
      where: {
        verificationStatus: "VERIFIED",
      },
    }),
    prisma.competitionProfile.count({
      where: {
        verificationStatus: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
    }),
    prisma.competitionHistory.count(),
    prisma.dailyChallenge.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        title: true,
        dayNumber: true,
        isPublished: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    }),
    prisma.competitionHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        userId: true,
        vibgyorStage: true,
        omniStep: true,
        assessmentName: true,
        verificationStatus: true,
        siliconPoints: true,
        createdAt: true,
        User_CompetitionHistory_userIdToUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            omniId: true,
          },
        },
      },
    }),
  ]);

  return {
    databaseOnline: true,
    stats: {
      totalUsers,
      onboardedUsers,
      totalChallenges,
      publishedChallenges,
      totalAttempts,
      livePosters,
      draftPosters,
      competitionProfiles,
      verifiedCompetitionProfiles,
      pendingCompetitionProfiles,
      competitionHistoryCount,
    },
    recentChallenges,
    recentCompetitionHistory,
  };
}

function RecentChallengeList({
  challenges,
}: {
  challenges: AdminCommandCenterData["recentChallenges"];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        Latest Challenges
      </p>

      <div className="space-y-3">
        {challenges.map((challenge) => (
          <Link
            href={`/admin/challenge/${challenge.id}`}
            key={challenge.id}
            className="block rounded-2xl border border-slate-200 bg-white/82 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/45"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-slate-950">
                Day {challenge.dayNumber}
              </p>

              <span
                className={
                  challenge.isPublished
                    ? "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700"
                    : "rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-[10px] font-black uppercase text-yellow-700"
                }
              >
                {challenge.isPublished ? "Live" : "Draft"}
              </span>
            </div>

            <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-600">
              {challenge.title}
            </p>

            <p className="mt-2 text-xs font-bold text-slate-400">
              {challenge._count.questions} questions ·{" "}
              {challenge._count.attempts} attempts
            </p>
          </Link>
        ))}

        {challenges.length === 0 ? (
          <EmptyState label="No daily challenges created yet." />
        ) : null}
      </div>
    </div>
  );
}

function RecentCompetitionList({
  history,
}: {
  history: AdminCommandCenterData["recentCompetitionHistory"];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        Competition Updates
      </p>

      <div className="space-y-3">
        {history.map((entry) => {
          const participant = entry.User_CompetitionHistory_userIdToUser;

          return (
            <div
              key={entry.id}
              className="rounded-2xl border border-slate-200 bg-white/82 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-950">
                    {participant.fullName || participant.email}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {participant.omniId ?? entry.userId}
                  </p>
                </div>

                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase text-blue-700">
                  {entry.verificationStatus}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-600">
                {entry.assessmentName ?? "Competition update"} ·{" "}
                {entry.vibgyorStage} / {entry.omniStep}
              </p>

              <p className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                {entry.createdAt.toLocaleString()}
              </p>
            </div>
          );
        })}

        {history.length === 0 ? (
          <EmptyState label="No competition updates recorded yet." />
        ) : null}
      </div>
    </div>
  );
}

function AdminGlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2.25rem] border border-white bg-white/78 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.07),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.09),transparent_35%)]"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function PanelHeader({
  eyebrow,
  title,
  icon,
  tone,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  tone: "blue" | "yellow";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-black text-[#6d6e6f] sm:text-3xl">
          {title}
        </h2>
      </div>

      <div className={`rounded-2xl border p-3 ${toneClass}`}>{icon}</div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  helper: string;
  tone: "blue" | "cyan" | "emerald" | "yellow";
}) {
  const toneClass = getToneClass(tone);

  return (
    <AdminGlassPanel className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            {helper}
          </p>
        </div>

        <div className={`rounded-2xl border p-3 ${toneClass}`}>{icon}</div>
      </div>
    </AdminGlassPanel>
  );
}

function ActionLink({
  href,
  icon,
  title,
  description,
  tone,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  tone: "blue" | "cyan" | "emerald" | "yellow" | "purple";
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white/82 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.045)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl border p-3 ${getToneClass(tone)}`}>
          {icon}
        </div>

        <div>
          <p className="font-black text-slate-950">{title}</p>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
    </Link>
  );
}

function StatusBadge({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "blue" | "yellow" | "emerald" | "rose";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ${getToneClass(
        tone,
      )}`}
    >
      {icon}
      {label}
    </span>
  );
}

function MiniProgressMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "cyan" | "yellow" | "emerald";
}) {
  const barClass =
    tone === "blue"
      ? "bg-blue-600"
      : tone === "cyan"
        ? "bg-cyan-600"
        : tone === "yellow"
          ? "bg-yellow-500"
          : "bg-emerald-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <p className="text-sm font-black text-slate-950">{value}%</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AdminPrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
    >
      {children}
    </Link>
  );
}

function AdminSecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.1em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
    >
      {children}
    </Link>
  );
}

function DatabaseOfflineNotice() {
  return (
    <section className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-7 text-red-700">
      Database is temporarily unavailable. Admin dashboard is showing safe empty
      values instead of crashing.
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}

function AdminHeroBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.14),transparent_34%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-8 h-28 w-28 rounded-[45%_55%_62%_38%] bg-blue-100/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-8 h-24 w-24 rounded-[58%_42%_38%_62%] bg-yellow-100/80"
      />
    </>
  );
}

function getToneClass(
  tone: "blue" | "cyan" | "emerald" | "yellow" | "purple" | "rose",
) {
  if (tone === "cyan") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "yellow") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (tone === "purple") {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (tone === "rose") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

function getPercent(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}