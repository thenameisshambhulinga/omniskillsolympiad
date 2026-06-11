import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AssessmentEntryCard from "@/components/competition-control/AssessmentEntryCard";
import CompetitionEventCard from "@/components/competition-control/CompetitionEventCard";
import CompetitionStatusCard from "@/components/competition-control/CompetitionStatusCard";
import JudgeEvaluationCard from "@/components/competition-control/JudgeEvaluationCard";
import ParticipantLookupCard from "@/components/competition-control/ParticipantLookupCard";
import SiliconPointsAwardCard from "@/components/competition-control/SiliconPointsAwardCard";
import StageCompletionCard from "@/components/competition-control/StageCompletionCard";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCompetitionStatus } from "@/lib/competition-control/status-engine";
import { getVerificationStatus } from "@/lib/competition/verification-engine";
import {
  getAssessmentHistory,
  getAssessmentTrend,
  getLatestAssessment,
} from "@/lib/profile/assessment-ledger";
import { getCompetitionPassport } from "@/lib/profile/competition-passport";
import { getJourneyProgress } from "@/lib/profile/omni-roadmap";
import {
  buildReadinessInputFromSnapshot,
  getEngineeringReadiness,
} from "@/lib/profile/readiness-engine";
import { getRankSnapshot } from "@/lib/profile/rank-engine";
import { getTierProgress } from "@/lib/profile/tier-engine";
import { getVibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export default async function CompetitionControlPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      omniId: true,
      college: true,
      state: true,
      siliconPoints: true,
      isOnboarded: true,
      skills: true,
      careerInterests: true,
      streak: true,
      createdAt: true,
      activities: {
        select: {
          id: true,
        },
      },
      dailyAttempts: {
        where: {
          completed: true,
        },
        select: {
          id: true,
        },
      },
      seasonProgress: {
        select: {
          totalPoints: true,
          weightedRankScore: true,
          consistencyScore: true,
          averageAccuracy: true,
          completedDays: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.isOnboarded) {
    redirect("/onboarding");
  }

  const rankUsers = await prisma.user.findMany({
    select: {
      id: true,
      college: true,
      state: true,
      siliconPoints: true,
      seasonProgress: {
        select: {
          weightedRankScore: true,
        },
      },
    },
  });

  const siliconPoints = Math.max(
    user.siliconPoints ?? 0,
    user.seasonProgress?.totalPoints ?? 0,
    Math.round(user.seasonProgress?.weightedRankScore ?? 0),
  );

  const roadmapSnapshot = getJourneyProgress(siliconPoints);
  const vibgyorSnapshot = getVibgyorJourneySnapshot(siliconPoints);
  const tierProgress = getTierProgress(siliconPoints);

  const readinessInput = buildReadinessInputFromSnapshot({
    snapshot: vibgyorSnapshot,
    dailyCompletedCount:
      user.seasonProgress?.completedDays ?? user.dailyAttempts.length,
    activityCount: user.activities.length,
    consistencyScore: user.seasonProgress?.consistencyScore ?? user.streak ?? 0,
    averageAccuracy: user.seasonProgress?.averageAccuracy ?? 0,
    skills: user.skills ?? [],
    careerInterests: user.careerInterests ?? [],
  });

  const engineeringReadiness = getEngineeringReadiness(readinessInput);

  const assessmentInput = {
    snapshot: vibgyorSnapshot,
    readiness: engineeringReadiness,
  };

  const assessmentHistory = getAssessmentHistory(assessmentInput);
  const latestAssessment = getLatestAssessment(assessmentInput);
  const assessmentTrend = getAssessmentTrend(assessmentInput);

  const rankSnapshot = getRankSnapshot({
    currentUser: user,
    users: rankUsers,
  });

  const competitionPassport = getCompetitionPassport({
    omniId: user.omniId ?? "OMNI Pending",
    siliconPoints,
    nationalRank: rankSnapshot.nationalRank,
    stateRank: rankSnapshot.stateRank,
    collegeRank: rankSnapshot.collegeRank,
    rankChange: 0,
    createdAt: user.createdAt,
    vibgyorSnapshot,
    readiness: engineeringReadiness,
    latestAssessment,
    assessmentTrend,
  });

  const verificationStatus = getVerificationStatus({
    passport: competitionPassport,
    assessments: assessmentHistory,
    passportTimeline: competitionPassport.timeline,
  });

  const competitionStatus = getCompetitionStatus({
    vibgyorSnapshot,
    latestAssessment,
    verificationStatus,
    readiness: engineeringReadiness,
    tierProgress,
    nationalRank: rankSnapshot.nationalRank,
    siliconPoints,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <section className="relative z-10 mx-auto max-w-[1600px]">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.52)] backdrop-blur-2xl lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.15),transparent_34%)]" />

          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
              Competition Control Center
            </p>

            <h1 className="mt-5 max-w-6xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              Event & Evaluation
              <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                Entry Layer
              </span>
            </h1>

            <p className="mt-7 max-w-4xl text-lg leading-8 text-white/62">
              Internal operations interface prepared for future Admin, Mentor,
              Judge and Coordinator workflows. This sprint uses existing engines
              and adapter-safe forms only — no database writes, no schema
              changes and no verification workflow changes.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CompetitionStatusCard status={competitionStatus} />
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
      </section>
    </main>
  );
}
