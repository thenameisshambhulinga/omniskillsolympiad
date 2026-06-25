import type { ReactNode } from "react";
import {
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

import AssessmentEntryCard from "@/components/competition-control/AssessmentEntryCard";
import CompetitionEventCard from "@/components/competition-control/CompetitionEventCard";
import JudgeEvaluationCard from "@/components/competition-control/JudgeEvaluationCard";
import ParticipantLookupCard from "@/components/competition-control/ParticipantLookupCard";
import SiliconPointsAwardCard from "@/components/competition-control/SiliconPointsAwardCard";
import StageCompletionCard from "@/components/competition-control/StageCompletionCard";
import { prisma } from "@/lib/prisma";
import { withDatabaseFallback } from "@/lib/server/database-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type CompetitionUserSummary = {
  id: string;
  fullName: string | null;
  email: string;
  omniId: string | null;
};

type CompetitionProfileSummary = {
  id: string;
  userId: string;
  vibgyorStage: string;
  omniStep: string;
  assessmentName: string | null;
  assessmentScore: number | null;
  verificationStatus: string;
  siliconPoints: number;
  updatedAt: Date;
  User_CompetitionProfile_userIdToUser: CompetitionUserSummary;
};

type CompetitionHistorySummary = {
  id: string;
  userId: string;
  vibgyorStage: string;
  omniStep: string;
  assessmentName: string | null;
  assessmentScore: number | null;
  verificationStatus: string;
  siliconPoints: number;
  createdAt: Date;
  User_CompetitionHistory_userIdToUser: CompetitionUserSummary;
};

type AdminCompetitionData = {
  databaseOnline: boolean;
  stats: {
    totalParticipants: number;
    competitionProfiles: number;
    verifiedProfiles: number;
    pendingProfiles: number;
    rejectedProfiles: number;
    underReviewProfiles: number;
    historyCount: number;
    totalCompetitionPoints: number;
  };
  recentProfiles: CompetitionProfileSummary[];
  recentHistory: CompetitionHistorySummary[];
};

const EMPTY_ADMIN_COMPETITION_DATA: AdminCompetitionData = {
  databaseOnline: false,
  stats: {
    totalParticipants: 0,
    competitionProfiles: 0,
    verifiedProfiles: 0,
    pendingProfiles: 0,
    rejectedProfiles: 0,
    underReviewProfiles: 0,
    historyCount: 0,
    totalCompetitionPoints: 0,
  },
  recentProfiles: [],
  recentHistory: [],
};

export default async function AdminCompetitionPage() {
  const data = await getAdminCompetitionData();

  const verificationPercent = getPercent(
    data.stats.verifiedProfiles,
    data.stats.competitionProfiles,
  );

  const pendingDecisionCount =
    data.stats.pendingProfiles + data.stats.underReviewProfiles;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
      {!data.databaseOnline ? <DatabaseOfflineNotice /> : null}

      <section className="relative overflow-hidden rounded-[2.75rem] border border-white bg-white/78 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <CompetitionHeroBackground />

        <div className="relative z-10 grid gap-10 xl:grid-cols-[1.12fr_0.88fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              <Swords className="h-4 w-4" />
              Admin Competition Control
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight tracking-tight text-[#6d6e6f] sm:text-5xl lg:text-6xl">
              Official event, assessment and verification{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                command board.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              Manage participant lookup, VIBGYOR stage progress, OMNI step,
              official assessment entries, judge signals, Silicon Points, and
              verification tracking from one admin-safe workspace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ControlPill
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Admin Only"
                tone="emerald"
              />

              <ControlPill
                icon={<DatabaseZap className="h-4 w-4" />}
                label={data.databaseOnline ? "Database Online" : "Safe Fallback"}
                tone={data.databaseOnline ? "blue" : "rose"}
              />

              <ControlPill
                icon={<Sparkles className="h-4 w-4" />}
                label="Competition Authority"
                tone="purple"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-200/60 blur-3xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-blue-700">
                  <BarChart3 className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Verification Health
                  </p>
                  <p className="mt-1 text-4xl font-black text-slate-950">
                    {verificationPercent}%
                  </p>
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500"
                  style={{ width: `${verificationPercent}%` }}
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <HeroMiniMetric
                  label="Profiles"
                  value={data.stats.competitionProfiles}
                  tone="blue"
                />

                <HeroMiniMetric
                  label="Pending"
                  value={pendingDecisionCount}
                  tone="yellow"
                />

                <HeroMiniMetric
                  label="History"
                  value={data.stats.historyCount}
                  tone="purple"
                />

                <HeroMiniMetric
                  label="Points"
                  value={data.stats.totalCompetitionPoints}
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
          label="Participants"
          value={data.stats.totalParticipants}
          helper="Student role accounts"
          tone="blue"
        />

        <KpiCard
          icon={<ClipboardCheck className="h-6 w-6" />}
          label="Competition Profiles"
          value={data.stats.competitionProfiles}
          helper={`${data.stats.pendingProfiles} pending · ${data.stats.underReviewProfiles} in review`}
          tone="cyan"
        />

        <KpiCard
          icon={<BadgeCheck className="h-6 w-6" />}
          label="Verified Profiles"
          value={data.stats.verifiedProfiles}
          helper={`${data.stats.rejectedProfiles} rejected`}
          tone="emerald"
        />

        <KpiCard
          icon={<Trophy className="h-6 w-6" />}
          label="History Records"
          value={data.stats.historyCount}
          helper="Official competition logs"
          tone="yellow"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminGlassPanel className="p-6 sm:p-7">
          <PanelHeader
            eyebrow="Participants"
            title="Recent Competition Profiles"
            icon={<Users className="h-6 w-6" />}
            tone="blue"
          />

          <div className="mt-6 grid gap-3">
            {data.recentProfiles.length > 0 ? (
              data.recentProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">
                        {profile.User_CompetitionProfile_userIdToUser.fullName ||
                          profile.User_CompetitionProfile_userIdToUser.email}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {profile.User_CompetitionProfile_userIdToUser.omniId ??
                          profile.User_CompetitionProfile_userIdToUser.email}
                      </p>
                    </div>

                    <VerificationPill status={profile.verificationStatus} />
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <MiniInfo label="Stage" value={profile.vibgyorStage} />
                    <MiniInfo label="OMNI Step" value={profile.omniStep} />
                    <MiniInfo
                      label="Points"
                      value={String(profile.siliconPoints)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState label="No competition profiles yet." />
            )}
          </div>
        </AdminGlassPanel>

        <AdminGlassPanel className="p-6 sm:p-7">
          <PanelHeader
            eyebrow="History"
            title="Recent Competition Updates"
            icon={<BarChart3 className="h-6 w-6" />}
            tone="yellow"
          />

          <div className="mt-6 grid gap-3">
            {data.recentHistory.length > 0 ? (
              data.recentHistory.map((entry) => {
                const participant = entry.User_CompetitionHistory_userIdToUser;

                return (
                  <div
                    key={entry.id}
                    className="rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950">
                          {participant.fullName || participant.email}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {entry.assessmentName ?? "Competition update"}
                        </p>
                      </div>

                      <VerificationPill status={entry.verificationStatus} />
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-4">
                      <MiniInfo label="Stage" value={entry.vibgyorStage} />
                      <MiniInfo label="OMNI" value={entry.omniStep} />
                      <MiniInfo
                        label="Points"
                        value={String(entry.siliconPoints)}
                      />
                      <MiniInfo
                        label="Date"
                        value={formatDate(entry.createdAt)}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState label="No competition history yet." />
            )}
          </div>
        </AdminGlassPanel>
      </section>

      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-950 p-5 shadow-[0_28px_110px_rgba(15,23,42,0.22)] sm:p-6 lg:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.16),transparent_34%)]"
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                Competition Workbench
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                Admin action adapters
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/58">
                These cards prepare structured competition-control entries
                safely. Write APIs remain protected behind admin authorization.
              </p>
            </div>

            <ControlPill
              icon={<ShieldAlert className="h-4 w-4" />}
              label="Protected Actions"
              tone="emerald"
            />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="space-y-8">
              <ParticipantLookupCard />
              <StageCompletionCard />
              <SiliconPointsAwardCard />
            </div>

            <div className="space-y-8">
              <AssessmentEntryCard />
              <JudgeEvaluationCard />
              <CompetitionEventCard />
            </div>
          </div>
        </div>
      </section>

      {pendingDecisionCount > 0 ? (
        <section className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-5 text-yellow-900 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-black leading-7">
              {pendingDecisionCount} competition profile
              {pendingDecisionCount === 1 ? " needs" : "s need"} admin review.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

async function getAdminCompetitionData(): Promise<AdminCompetitionData> {
  return withDatabaseFallback<AdminCompetitionData>({
    label: "AdminCompetitionPage.getAdminCompetitionData",
    fallback: EMPTY_ADMIN_COMPETITION_DATA,
    action: async () => {
      const [
        totalParticipants,
        competitionProfiles,
        verifiedProfiles,
        pendingProfiles,
        underReviewProfiles,
        rejectedProfiles,
        historyCount,
        pointAggregate,
        recentProfiles,
        recentHistory,
      ] = await prisma.$transaction([
        prisma.user.count({
          where: {
            role: "STUDENT",
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
            verificationStatus: "PENDING",
          },
        }),
        prisma.competitionProfile.count({
          where: {
            verificationStatus: "UNDER_REVIEW",
          },
        }),
        prisma.competitionProfile.count({
          where: {
            verificationStatus: "REJECTED",
          },
        }),
        prisma.competitionHistory.count(),
        prisma.competitionHistory.aggregate({
          _sum: {
            siliconPoints: true,
          },
        }),
        prisma.competitionProfile.findMany({
          orderBy: {
            updatedAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            userId: true,
            vibgyorStage: true,
            omniStep: true,
            assessmentName: true,
            assessmentScore: true,
            verificationStatus: true,
            siliconPoints: true,
            updatedAt: true,
            User_CompetitionProfile_userIdToUser: {
              select: {
                id: true,
                fullName: true,
                email: true,
                omniId: true,
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
            assessmentScore: true,
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
          totalParticipants,
          competitionProfiles,
          verifiedProfiles,
          pendingProfiles,
          rejectedProfiles,
          underReviewProfiles,
          historyCount,
          totalCompetitionPoints: pointAggregate._sum.siliconPoints ?? 0,
        },
        recentProfiles,
        recentHistory,
      };
    },
  });
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

        <div className={`rounded-2xl border p-3 ${getToneClass(tone)}`}>
          {icon}
        </div>
      </div>
    </AdminGlassPanel>
  );
}

function HeroMiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "yellow" | "purple" | "emerald";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/72 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-black ${getTextTone(tone)}`}>
        {value}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-slate-800">{value}</p>
    </div>
  );
}

function ControlPill({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "blue" | "cyan" | "emerald" | "purple" | "rose";
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

function VerificationPill({ status }: { status: string }) {
  const config =
    status === "VERIFIED"
      ? {
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        }
      : status === "REJECTED"
        ? {
            icon: <XCircle className="h-3.5 w-3.5" />,
            className: "border-rose-200 bg-rose-50 text-rose-700",
          }
        : status === "UNDER_REVIEW"
          ? {
              icon: <Radio className="h-3.5 w-3.5" />,
              className: "border-blue-200 bg-blue-50 text-blue-700",
            }
          : {
              icon: <ShieldAlert className="h-3.5 w-3.5" />,
              className: "border-yellow-200 bg-yellow-50 text-yellow-700",
            };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] ${config.className}`}
    >
      {config.icon}
      {status.replaceAll("_", " ")}
    </span>
  );
}

function DatabaseOfflineNotice() {
  return (
    <section className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-7 text-red-700">
      Database is temporarily unavailable. Competition control is showing safe
      empty values instead of crashing.
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

function CompetitionHeroBackground() {
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

function getTextTone(tone: "blue" | "yellow" | "purple" | "emerald") {
  if (tone === "yellow") {
    return "text-yellow-700";
  }

  if (tone === "purple") {
    return "text-purple-700";
  }

  if (tone === "emerald") {
    return "text-emerald-700";
  }

  return "text-blue-700";
}

function getPercent(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(value);
}