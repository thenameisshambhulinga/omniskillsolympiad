import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CircuitBoard,
  Clock3,
  Database,
  Gauge,
  Megaphone,
  Plus,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import MotionWrapper from "@/components/motion/MotionWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminPage() {
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
      questions: {
        select: {
          id: true,
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
    },
  }),
]);

  const recentCompetitionUserIds = [
    ...new Set(recentCompetitionHistory.map((entry) => entry.userId)),
  ];

  const recentCompetitionUsers = recentCompetitionUserIds.length
    ? await prisma.user.findMany({
        where: {
          id: {
            in: recentCompetitionUserIds,
          },
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          omniId: true,
        },
      })
    : [];

  const userById = new Map(
    recentCompetitionUsers.map((user) => [user.id, user]),
  );

  const onboardingPercent =
    totalUsers > 0 ? Math.round((onboardedUsers / totalUsers) * 100) : 0;

  const challengePublishPercent =
    totalChallenges > 0
      ? Math.round((publishedChallenges / totalChallenges) * 100)
      : 0;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
      <MotionWrapper>
        <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
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

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-700 sm:text-sm">
                Admin Command Center
              </p>

              <h1 className="oso-heading mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                One clean control room for{" "}
                <span className="text-blue-600">
                  challenges, competitions and posters.
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-600 md:text-lg md:leading-9">
                Daily challenge control, event operations, and live poster
                publishing now sit inside one admin command layer without
                changing the underlying workflow or database logic.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <StatusBadge
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Admin Verified"
                  tone="emerald"
                />
                <StatusBadge
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Unified Control"
                  tone="yellow"
                />
                <StatusBadge
                  icon={<Database className="h-4 w-4" />}
                  label="Database Driven"
                  tone="blue"
                />
              </div>
            </div>

            <AdminGlassPanel className="relative overflow-hidden p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-100 blur-3xl"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-blue-700">
                    <Gauge className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Platform Load
                    </p>
                    <p className="mt-1 text-4xl font-black text-slate-950">
                      {totalAttempts}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniMetric
                    label="Onboarded"
                    value={`${onboardingPercent}%`}
                    tone="blue"
                  />
                  <MiniMetric
                    label="Published"
                    value={`${challengePublishPercent}%`}
                    tone="yellow"
                  />
                </div>
              </div>
            </AdminGlassPanel>
          </div>
        </section>
      </MotionWrapper>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Users className="h-6 w-6" />}
          label="Users"
          value={totalUsers}
          helper={`${onboardedUsers} onboarded`}
          tone="blue"
          delay={0.04}
        />

        <KpiCard
          icon={<CircuitBoard className="h-6 w-6" />}
          label="Challenges"
          value={totalChallenges}
          helper={`${publishedChallenges} published`}
          tone="cyan"
          delay={0.08}
        />

        <KpiCard
          icon={<Swords className="h-6 w-6" />}
          label="Competition Profiles"
          value={competitionProfiles}
          helper={`${verifiedCompetitionProfiles} verified`}
          tone="emerald"
          delay={0.12}
        />

        <KpiCard
          icon={<Megaphone className="h-6 w-6" />}
          label="Live Posters"
          value={livePosters}
          helper={`${draftPosters} drafts`}
          tone="yellow"
          delay={0.16}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <MotionWrapper delay={0.18}>
          <AdminGlassPanel className="h-full p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-700">
                  Operations
                </p>
                <h2 className="oso-heading mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                  Control Modules
                </h2>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-blue-700">
                <Database className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <ActionLink
                href="/admin/create-daily-challenge"
                icon={<Plus className="h-5 w-5" />}
                title="Create Daily Challenge"
                description="Launch a new daily engineering mission."
                tone="blue"
              />

              <ActionLink
                href="/admin/manage-challenges"
                icon={<CircuitBoard className="h-5 w-5" />}
                title="Manage Daily Challenges"
                description="Edit questions, publish challenges and monitor readiness."
                tone="cyan"
              />

              <ActionLink
                href="/admin/competition"
                icon={<Swords className="h-5 w-5" />}
                title="Competition Control"
                description="Control offline progress, assessment and verification."
                tone="emerald"
              />

              <ActionLink
                href="/admin/announcements"
                icon={<Megaphone className="h-5 w-5" />}
                title="Poster Publisher"
                description="Publish landing/login posters without code changes."
                tone="yellow"
              />
            </div>
          </AdminGlassPanel>
        </MotionWrapper>

        <MotionWrapper delay={0.22}>
          <AdminGlassPanel className="h-full p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-700">
                  Live Intelligence
                </p>
                <h2 className="oso-heading mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                  Recent Operations
                </h2>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-yellow-700">
                <Activity className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Latest Challenges
                </p>

                <div className="space-y-3">
                  {recentChallenges.map((challenge) => (
                    <Link
                      href={`/admin/challenge/${challenge.id}`}
                      key={challenge.id}
                      className="block rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/45"
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
                        {challenge.questions.length} questions attached
                      </p>
                    </Link>
                  ))}

                  {recentChallenges.length === 0 ? (
                    <EmptyState label="No daily challenges created yet." />
                  ) : null}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Competition Updates
                </p>

                <div className="space-y-3">
                  {recentCompetitionHistory.map((entry) => {
                    const participant = userById.get(entry.userId);

                    return (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-slate-200 bg-white/80 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              {participant?.fullName ??
                                participant?.email ??
                                "Participant"}
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                              {participant?.omniId ?? entry.userId}
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

                  {recentCompetitionHistory.length === 0 ? (
                    <EmptyState label="No competition updates recorded yet." />
                  ) : null}
                </div>
              </div>
            </div>
          </AdminGlassPanel>
        </MotionWrapper>
      </section>

      {pendingCompetitionProfiles > 0 ? (
        <MotionWrapper delay={0.26}>
          <div className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-5 text-yellow-900 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-black">
              {pendingCompetitionProfiles} competition profile
              {pendingCompetitionProfiles === 1 ? " is" : "s are"} waiting for
              admin verification.
            </p>
          </div>
        </MotionWrapper>
      ) : null}
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
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/78 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.06),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.08),transparent_35%)]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatusBadge({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "blue" | "yellow" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "yellow"
        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${toneClass}`}
    >
      {icon}
      {label}
    </span>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "yellow";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] opacity-75">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  helper,
  delay,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  helper: string;
  delay: number;
  tone: "blue" | "cyan" | "emerald" | "yellow";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "cyan"
        ? "border-cyan-200 bg-cyan-50 text-cyan-700"
        : tone === "emerald"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <MotionWrapper delay={delay}>
      <AdminGlassPanel className="h-full p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {label}
            </p>
            <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              {helper}
            </p>
          </div>

          <div className={`rounded-2xl border p-3 ${toneClass}`}>{icon}</div>
        </div>
      </AdminGlassPanel>
    </MotionWrapper>
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
  tone: "blue" | "cyan" | "emerald" | "yellow";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "cyan"
        ? "border-cyan-200 bg-cyan-50 text-cyan-700"
        : tone === "emerald"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white/82 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.045)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl border p-3 ${toneClass}`}>{icon}</div>

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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}