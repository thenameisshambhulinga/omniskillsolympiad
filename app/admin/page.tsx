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
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

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
  ] = await Promise.all([
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <MotionWrapper>
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]" />
          <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.36em] text-cyan-300 sm:text-sm">
                Admin Command Center
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                One control room for{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  challenges, competition and posters
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
                This is the admin-only operations layer. Daily challenges,
                offline competition progress and event posters stay connected
                from login to the final student experience.
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
                  tone="purple"
                />
                <StatusBadge
                  icon={<Database className="h-4 w-4" />}
                  label="Database Driven"
                  tone="cyan"
                />
              </div>
            </div>

            <GlassCard className="relative overflow-hidden p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-3 shadow-[0_0_32px_rgba(34,211,238,0.12)]">
                    <Gauge className="h-7 w-7 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
                      Platform Load
                    </p>
                    <p className="mt-1 text-4xl font-black text-white">
                      {totalAttempts}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniMetric
                    label="Onboarded"
                    value={`${onboardingPercent}%`}
                    tone="cyan"
                  />
                  <MiniMetric
                    label="Published"
                    value={`${challengePublishPercent}%`}
                    tone="purple"
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </MotionWrapper>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Users className="h-6 w-6 text-cyan-300" />}
          label="Users"
          value={totalUsers}
          helper={`${onboardedUsers} onboarded`}
          delay={0.04}
        />

        <KpiCard
          icon={<CircuitBoard className="h-6 w-6 text-purple-300" />}
          label="Challenges"
          value={totalChallenges}
          helper={`${publishedChallenges} published`}
          delay={0.08}
        />

        <KpiCard
          icon={<Swords className="h-6 w-6 text-emerald-300" />}
          label="Competition Profiles"
          value={competitionProfiles}
          helper={`${verifiedCompetitionProfiles} verified`}
          delay={0.12}
        />

        <KpiCard
          icon={<Megaphone className="h-6 w-6 text-amber-300" />}
          label="Live Posters"
          value={livePosters}
          helper={`${draftPosters} drafts`}
          delay={0.16}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <MotionWrapper delay={0.18}>
          <GlassCard className="h-full p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  Operations
                </p>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  Control Modules
                </h2>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                <Database className="h-6 w-6 text-cyan-300" />
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <ActionLink
                href="/admin/create-daily-challenge"
                icon={<Plus className="h-5 w-5" />}
                title="Create Daily Challenge"
                description="Launch a new daily engineering mission."
                tone="cyan"
              />

              <ActionLink
                href="/admin/manage-challenges"
                icon={<CircuitBoard className="h-5 w-5" />}
                title="Manage Daily Challenges"
                description="Edit questions, publish challenges and monitor readiness."
                tone="purple"
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
                tone="amber"
              />
            </div>
          </GlassCard>
        </MotionWrapper>

        <MotionWrapper delay={0.22}>
          <GlassCard className="h-full p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-300">
                  Live Intelligence
                </p>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  Recent Operations
                </h2>
              </div>

              <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-3">
                <Activity className="h-6 w-6 text-purple-300" />
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/40">
                  Daily Challenge Queue
                </p>

                <div className="space-y-3">
                  {recentChallenges.map((challenge) => (
                    <Link
                      key={challenge.id}
                      href={`/admin/challenge/${challenge.id}`}
                      className="block rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-white">
                          Day {challenge.dayNumber}
                        </p>
                        <span
                          className={
                            challenge.isPublished
                              ? "rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-200"
                              : "rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[10px] font-black uppercase text-amber-200"
                          }
                        >
                          {challenge.isPublished ? "Live" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-1 text-sm text-white/55">
                        {challenge.title}
                      </p>
                      <p className="mt-2 text-xs font-bold text-white/35">
                        {challenge.questions.length} questions attached
                      </p>
                    </Link>
                  ))}

                  {recentChallenges.length === 0 && (
                    <EmptyState label="No daily challenges created yet." />
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/40">
                  Competition Updates
                </p>

                <div className="space-y-3">
                  {recentCompetitionHistory.map((entry) => {
                    const participant = userById.get(entry.userId);

                    return (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-white/10 bg-black/25 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-white">
                              {participant?.fullName ??
                                participant?.email ??
                                "Participant"}
                            </p>
                            <p className="mt-1 text-xs font-bold text-white/35">
                              {participant?.omniId ?? entry.userId}
                            </p>
                          </div>

                          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase text-cyan-200">
                            {entry.verificationStatus}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-white/55">
                          {entry.assessmentName ?? "Competition update"} ·{" "}
                          {entry.vibgyorStage} / {entry.omniStep}
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-xs font-bold text-white/35">
                          <Clock3 className="h-3.5 w-3.5" />
                          {entry.createdAt.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}

                  {recentCompetitionHistory.length === 0 && (
                    <EmptyState label="No competition updates recorded yet." />
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </MotionWrapper>
      </section>

      {pendingCompetitionProfiles > 0 && (
        <MotionWrapper delay={0.26}>
          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-5 text-amber-100">
            <p className="text-sm font-black">
              {pendingCompetitionProfiles} competition profile
              {pendingCompetitionProfiles === 1 ? " is" : "s are"} waiting for
              admin verification.
            </p>
          </div>
        </MotionWrapper>
      )}
    </div>
  );
}

function StatusBadge({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "cyan" | "purple" | "emerald";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
      : tone === "purple"
        ? "border-purple-400/25 bg-purple-400/10 text-purple-200"
        : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${toneClass}`}
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
  tone: "cyan" | "purple";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
      : "border-purple-400/20 bg-purple-400/10 text-purple-200";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  helper: string;
  delay: number;
}) {
  return (
    <MotionWrapper delay={delay}>
      <GlassCard className="h-full p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">
              {label}
            </p>
            <p className="mt-3 text-4xl font-black text-white">{value}</p>
            <p className="mt-2 text-sm font-semibold text-white/45">
              {helper}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            {icon}
          </div>
        </div>
      </GlassCard>
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
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: "cyan" | "purple" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:border-cyan-300/45 hover:bg-cyan-400/15"
      : tone === "purple"
        ? "border-purple-400/25 bg-purple-400/10 text-purple-100 hover:border-purple-300/45 hover:bg-purple-400/15"
        : tone === "emerald"
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/45 hover:bg-emerald-400/15"
          : "border-amber-400/25 bg-amber-400/10 text-amber-100 hover:border-amber-300/45 hover:bg-amber-400/15";

  return (
    <HoverScale>
      <Link
        href={href}
        className={`group flex items-center justify-between gap-4 rounded-[1.5rem] border p-5 shadow-[0_0_34px_rgba(0,0,0,0.12)] transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${toneClass}`}
      >
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            {icon}
          </div>

          <div>
            <p className="font-black text-white">{title}</p>
            <p className="mt-1 text-sm text-white/50">{description}</p>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
      </Link>
    </HoverScale>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-5 text-center text-sm font-semibold text-white/40">
      {label}
    </div>
  );
}