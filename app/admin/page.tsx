import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CircuitBoard,
  Crown,
  Database,
  Gauge,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminPage() {
  await requireAdmin();

  const [totalChallenges, totalUsers, totalAttempts, leaderboard] =
    await Promise.all([
      prisma.dailyChallenge.count(),
      prisma.user.count(),
      prisma.dailyAttempt.count(),
      (prisma as any).seasonProgress.findMany({
        where: {
          championBlocked: false,
        },
        include: {
          user: true,
        },
        orderBy: {
          weightedRankScore: "desc",
        },
        take: 5,
      }),
    ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-36 top-24 h-[38rem] w-[38rem] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <MotionWrapper>
          <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]" />
            <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.36em] text-cyan-300 sm:text-sm">
                  Silicon Skillathon Admin
                </p>

                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  Enterprise{" "}
                  <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Control Center
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
                  Monitor challenge operations, user growth, attempts, and
                  leaderboard health from a single executive-grade command
                  dashboard.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Verified
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
                    <CircuitBoard className="h-4 w-4" />
                    Operations Live
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                    <Sparkles className="h-4 w-4" />
                    Competition Ready
                  </span>
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
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/70">
                        Challenges
                      </p>
                      <p className="mt-2 text-2xl font-black text-cyan-200">
                        {totalChallenges}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200/70">
                        Users
                      </p>
                      <p className="mt-2 text-2xl font-black text-purple-200">
                        {totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        </MotionWrapper>

        <section className="grid gap-5 md:grid-cols-3">
          <KpiCard
            icon={<CircuitBoard className="h-6 w-6 text-cyan-300" />}
            label="Challenges"
            value={totalChallenges}
            helper="Published and draft operations"
            delay={0.04}
          />

          <KpiCard
            icon={<Users className="h-6 w-6 text-purple-300" />}
            label="Users"
            value={totalUsers}
            helper="Registered competitors"
            delay={0.08}
          />

          <KpiCard
            icon={<Activity className="h-6 w-6 text-emerald-300" />}
            label="Attempts"
            value={totalAttempts}
            helper="Challenge submissions tracked"
            delay={0.12}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <MotionWrapper delay={0.16}>
            <GlassCard className="h-full p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                    Quick Actions
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                    Challenge Operations
                  </h2>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                  <Database className="h-6 w-6 text-cyan-300" />
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <HoverScale>
                  <Link
                    href="/admin/create-daily-challenge"
                    className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-cyan-400/25 bg-cyan-400/10 p-5 shadow-[0_0_34px_rgba(34,211,238,0.1)] transition hover:border-cyan-300/45 hover:bg-cyan-400/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-3">
                        <Plus className="h-5 w-5 text-cyan-200" />
                      </div>

                      <div>
                        <p className="font-bold text-white">Create Challenge</p>
                        <p className="mt-1 text-sm text-white/50">
                          Launch a new daily engineering mission.
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-cyan-200 transition group-hover:translate-x-1" />
                  </Link>
                </HoverScale>

                <HoverScale>
                  <Link
                    href="/admin/manage-challenges"
                    className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-purple-400/30 hover:bg-purple-400/10 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl border border-purple-400/25 bg-purple-400/10 p-3">
                        <BarChart3 className="h-5 w-5 text-purple-200" />
                      </div>

                      <div>
                        <p className="font-bold text-white">
                          Manage Challenges
                        </p>
                        <p className="mt-1 text-sm text-white/50">
                          Review, edit, and operate challenge inventory.
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-purple-200 transition group-hover:translate-x-1" />
                  </Link>
                </HoverScale>
              </div>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <GlassCard className="h-full p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-300">
                    Ranking Monitor
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                    Leaderboard Preview
                  </h2>
                </div>

                <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-3">
                  <Trophy className="h-6 w-6 text-purple-300" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {leaderboard.map((entry: any, index: number) => (
                  <HoverScale key={entry.id}>
                    <div className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-white/10 bg-black/25 p-4 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.05]">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={
                            index === 0
                              ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/30 bg-yellow-400/10 text-sm font-black text-yellow-200 shadow-[0_0_24px_rgba(250,204,21,0.14)]"
                              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-black text-white/60"
                          }
                        >
                          {index === 0 ? (
                            <Crown className="h-5 w-5" />
                          ) : (
                            `#${index + 1}`
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-white">
                            {entry.user.fullName}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
                            Competitor Rank #{index + 1}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black tabular-nums text-cyan-200">
                          {entry.weightedRankScore.toFixed(2)}
                        </p>

                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Omni Score
                        </p>
                      </div>
                    </div>
                  </HoverScale>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/daily-leaderboard"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  Open Full Leaderboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </GlassCard>
          </MotionWrapper>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <MotionWrapper delay={0.24}>
            <GlassCard className="h-full p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Challenge Health
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                Operational
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Challenge creation, management, and leaderboard synchronization
                are available from the admin control surface.
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.28}>
            <GlassCard className="h-full p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Activity Feed
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                {totalAttempts} Attempts
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Total tracked challenge attempts across the current competition
                environment.
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.32}>
            <GlassCard className="h-full p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-300">
                Competition Monitoring
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                {leaderboard.length} Ranked
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Previewing the top active competitors by weighted rank score.
              </p>
            </GlassCard>
          </MotionWrapper>
        </section>
      </div>
    </main>
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
      <HoverScale>
        <GlassCard className="h-full p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              {icon}
            </div>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">
              Live
            </span>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
            {label}
          </p>

          <p className="mt-3 text-5xl font-black tracking-tight text-white">
            {value}
          </p>

          <p className="mt-3 text-sm leading-6 text-white/55">{helper}</p>
        </GlassCard>
      </HoverScale>
    </MotionWrapper>
  );
}
