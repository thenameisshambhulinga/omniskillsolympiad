import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import OsoCompetitionBenchmarkSummary from "@/components/competition/OsoCompetitionBenchmarkSummary";
import OsoCompetitionCommandCenter from "@/components/competition/OsoCompetitionCommandCenter";
import OsoCompetitionEssentials from "@/components/competition/OsoCompetitionEssentials";
import OsoCompetitionFocusHero from "@/components/competition/OsoCompetitionFocusHero";
import OsoCompetitionLiveArena from "@/components/competition/OsoCompetitionLiveArena";
import OsoCompetitionPageBackdrop from "@/components/competition/OsoCompetitionPageBackdrop";
import OsoCompetitionProgressiveDetails from "@/components/competition/OsoCompetitionProgressiveDetails";
import OsoPageShell from "@/components/oso/OsoPageShell";
import { authOptions } from "@/lib/auth";
import {
  buildCompetitionLiveArena,
  getRecommendedLiveArena,
} from "@/lib/competition/competition-live-arena";
import {
  publicDailyChallengeWhere,
  studentDailyChallengeOrderBy,
} from "@/lib/daily-challenge/public-challenge-visibility";
import { prisma } from "@/lib/prisma";
import {
  getAssessmentHistory,
  getAssessmentTrend,
  getAverageAssessmentScore,
  getLatestAssessment,
  getUpcomingAssessmentAreas,
} from "@/lib/profile/assessment-ledger";
import { getCompetitionPassport } from "@/lib/profile/competition-passport";
import { getJourneyProgress } from "@/lib/profile/omni-roadmap";
import {
  buildReadinessInputFromSnapshot,
  getEngineeringReadiness,
} from "@/lib/profile/readiness-engine";
import { getRankSnapshot } from "@/lib/profile/rank-engine";
import { getVibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function CompetitionPage() {
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

  const latestAssessment = getLatestAssessment(assessmentInput);
  const assessmentHistory = getAssessmentHistory(assessmentInput);
  const assessmentTrend = getAssessmentTrend(assessmentInput);
  const averageAssessmentScore = getAverageAssessmentScore(assessmentInput);
  const upcomingAssessmentAreas = getUpcomingAssessmentAreas(assessmentInput);

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

  const liveDailyChallenges = await prisma.dailyChallenge.findMany({
    where: publicDailyChallengeWhere,
    orderBy: studentDailyChallengeOrderBy,
    take: 6,
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      createdAt: true,
      questions: {
        select: {
          difficulty: true,
        },
      },
      attempts: {
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          completed: true,
          percentage: true,
          score: true,
          total: true,
          createdAt: true,
          submittedAt: true,
          expiresAt: true,
        },
      },
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });

  const liveArenas = liveDailyChallenges.map((challenge) =>
    buildCompetitionLiveArena(challenge),
  );

  const nextLiveArena = getRecommendedLiveArena(liveArenas);

  const currentTierName = getDisplayValue(
    roadmapSnapshot.currentTier,
    "name",
    "Emerging Engineer",
  );

  const currentStageName = getDisplayValue(
    vibgyorSnapshot.currentStage,
    "name",
    "Foundation",
  );

  const completedSteps = getNumber(vibgyorSnapshot, "completedSteps", 0);
  const totalSteps = Math.max(1, getNumber(vibgyorSnapshot, "totalSteps", 28));

  const badgesEarned = calculateBadgeCount({
    readinessScore: engineeringReadiness.score,
    siliconPoints,
    completedSteps,
    assessmentCount: assessmentHistory.length,
  });
return (
  <OsoPageShell>
          <OsoCompetitionFocusHero
            omniId={user.omniId ?? "OMNI Pending"}
            siliconPoints={siliconPoints}
            nationalRank={rankSnapshot.nationalRank}
            readinessScore={engineeringReadiness.score}
            currentStage={currentStageName}
            currentTier={currentTierName}
            completedSteps={completedSteps}
            totalSteps={totalSteps}
          />

          <OsoCompetitionCommandCenter
            readinessScore={engineeringReadiness.score}
            siliconPoints={siliconPoints}
            completedSteps={completedSteps}
            totalSteps={totalSteps}
            currentTier={currentTierName}
            liveArenaCount={liveArenas.length}
            recommendedArena={nextLiveArena}
          />

          <OsoCompetitionLiveArena arenas={liveArenas} />

          <OsoCompetitionEssentials
            currentStage={currentStageName}
            currentTier={currentTierName}
            completedSteps={completedSteps}
            totalSteps={totalSteps}
            nationalRank={rankSnapshot.nationalRank}
            stateRank={rankSnapshot.stateRank}
            collegeRank={rankSnapshot.collegeRank}
            competitionsParticipated={assessmentHistory.length}
            badgesEarned={badgesEarned}
            domainExpertise={normalizeStringList(user.skills)}
          />

          <OsoCompetitionBenchmarkSummary
            readinessScore={engineeringReadiness.score}
            averageAssessmentScore={averageAssessmentScore}
            latestAssessmentTitle={
              latestAssessment?.title ?? "Awaiting Evaluation"
            }
          />

          <OsoCompetitionProgressiveDetails
            latestAssessment={latestAssessment}
            assessmentHistory={assessmentHistory}
            upcomingAssessmentAreas={upcomingAssessmentAreas}
            assessmentTrend={assessmentTrend}
            averageAssessmentScore={averageAssessmentScore}
            passport={competitionPassport}
            readiness={engineeringReadiness}
          />
          </OsoPageShell>
  );
}

function getNumber(value: unknown, key: string, fallback: number) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return fallback;
  }

  const record = value as Record<string, unknown>;
  const result = record[key];

  return typeof result === "number" && Number.isFinite(result)
    ? result
    : fallback;
}

function getDisplayValue(value: unknown, preferredKey: string, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const preferred = record[preferredKey];
    const name = record.name;
    const label = record.label;
    const title = record.title;

    if (typeof preferred === "string" && preferred.trim()) {
      return preferred.trim();
    }

    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }

    if (typeof label === "string" && label.trim()) {
      return label.trim();
    }

    if (typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  return fallback;
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
}

function calculateBadgeCount({
  readinessScore,
  siliconPoints,
  completedSteps,
  assessmentCount,
}: {
  readinessScore: number;
  siliconPoints: number;
  completedSteps: number;
  assessmentCount: number;
}) {
  let count = 0;

  if (siliconPoints > 0) count += 1;
  if (siliconPoints >= 250) count += 1;
  if (siliconPoints >= 750) count += 1;
  if (completedSteps >= 3) count += 1;
  if (assessmentCount >= 1) count += 1;
  if (readinessScore >= 60) count += 1;
  if (readinessScore >= 80) count += 1;

  return count;
}