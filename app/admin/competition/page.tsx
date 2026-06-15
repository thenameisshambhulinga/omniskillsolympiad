import {
  BadgeCheck,
  ClipboardCheck,
  Medal,
  Radio,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import AssessmentEntryCard from "@/components/competition-control/AssessmentEntryCard";
import CompetitionEventCard from "@/components/competition-control/CompetitionEventCard";
import JudgeEvaluationCard from "@/components/competition-control/JudgeEvaluationCard";
import ParticipantLookupCard from "@/components/competition-control/ParticipantLookupCard";
import SiliconPointsAwardCard from "@/components/competition-control/SiliconPointsAwardCard";
import StageCompletionCard from "@/components/competition-control/StageCompletionCard";
import GlassCard from "@/components/ui/GlassCard";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminCompetitionPage() {
  const [
    totalParticipants,
    competitionProfiles,
    verifiedProfiles,
    pendingProfiles,
    rejectedProfiles,
    historyCount,
  ] = await Promise.all([
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
        verificationStatus: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
    }),
    prisma.competitionProfile.count({
      where: {
        verificationStatus: "REJECTED",
      },
    }),
    prisma.competitionHistory.count(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
      <MotionWrapper>
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.15),transparent_34%)]" />
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative z-10 grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
                Admin Competition Control
              </p>

              <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                Offline event, assessment and verification{" "}
                <span className="bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                  command board
                </span>
              </h1>

              <p className="mt-6 max-w-4xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
                This page is admin-only. It is the professional control layer
                for participant lookup, VIBGYOR stage progress, OMNI step,
                official assessment entry, judge evaluation, Silicon Points and
                verification tracking.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ControlPill
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Admin Only"
                  tone="emerald"
                />
                <ControlPill
                  icon={<Radio className="h-4 w-4" />}
                  label="Offline Event Control"
                  tone="cyan"
                />
                <ControlPill
                  icon={<Swords className="h-4 w-4" />}
                  label="Competition Authority"
                  tone="purple"
                />
              </div>
            </div>

            <GlassCard className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <StatBlock
                  icon={<Users className="h-5 w-5" />}
                  label="Participants"
                  value={totalParticipants}
                  tone="cyan"
                />
                <StatBlock
                  icon={<ClipboardCheck className="h-5 w-5" />}
                  label="Profiles"
                  value={competitionProfiles}
                  tone="purple"
                />
                <StatBlock
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Verified"
                  value={verifiedProfiles}
                  tone="emerald"
                />
                <StatBlock
                  icon={<Trophy className="h-5 w-5" />}
                  label="History"
                  value={historyCount}
                  tone="amber"
                />
              </div>
            </GlassCard>
          </div>
        </section>
      </MotionWrapper>

      <section className="grid gap-5 md:grid-cols-3">
        <StatusPanel
          label="Pending / Review"
          value={pendingProfiles}
          helper="Needs admin decision"
          tone="cyan"
        />
        <StatusPanel
          label="Verified Profiles"
          value={verifiedProfiles}
          helper="Officially confirmed"
          tone="emerald"
        />
        <StatusPanel
          label="Rejected Profiles"
          value={rejectedProfiles}
          helper="Requires correction"
          tone="red"
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
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
      </section>

      <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-3">
            <Medal className="h-5 w-5 text-emerald-200" />
          </div>

          <div>
            <p className="text-sm font-black text-emerald-100">
              Next connection step
            </p>
            <p className="mt-2 text-sm leading-7 text-white/55">
              This admin display is now under the unified admin shell. The next
              batch will connect these forms to real CompetitionProfile and
              CompetitionHistory database writes without changing the student
              competition display structure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ControlPill({
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
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${toneClass}`}
    >
      {icon}
      {label}
    </span>
  );
}

function StatBlock({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "cyan" | "purple" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
      : tone === "purple"
        ? "border-purple-400/20 bg-purple-400/10 text-purple-200"
        : tone === "emerald"
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
          : "border-amber-400/20 bg-amber-400/10 text-amber-200";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}

function StatusPanel({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: number;
  helper: string;
  tone: "cyan" | "emerald" | "red";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
      : tone === "emerald"
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
        : "border-red-400/20 bg-red-400/10 text-red-100";

  return (
    <MotionWrapper>
      <div className={`rounded-[2rem] border p-5 ${toneClass}`}>
        <p className="text-xs font-black uppercase tracking-[0.22em] opacity-70">
          {label}
        </p>
        <p className="mt-3 text-4xl font-black">{value}</p>
        <p className="mt-2 text-sm font-semibold text-white/45">{helper}</p>
      </div>
    </MotionWrapper>
  );
}