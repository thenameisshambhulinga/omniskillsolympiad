import type {
  AssessmentTrend,
  OfflineAssessment,
} from "@/lib/profile/assessment-ledger";
import type { EngineeringReadinessResult } from "@/lib/profile/readiness-engine";
import type { VibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export type CompetitionMomentum = "Stable" | "Rising" | "Needs Push";

export type CompetitionPassportStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

export type CompetitionPassportMilestone = {
  id: string;
  title: string;
  status: CompetitionPassportStatus;
  completionPercent: number;
  reward: string;
  description: string;
};

export type CompetitionPassportTimelineItem = {
  id: string;
  title: string;
  description: string;
  type: "identity" | "stage" | "assessment" | "tier" | "rank" | "readiness";
  date: string;
  status: CompetitionPassportStatus;
};

export type CompetitionPassportInput = {
  omniId: string;
  siliconPoints: number;
  nationalRank: string;
  stateRank: string;
  collegeRank: string;
  rankChange: number;
  createdAt: Date | string;
  vibgyorSnapshot: VibgyorJourneySnapshot;
  readiness: EngineeringReadinessResult;
  latestAssessment: OfflineAssessment | null;
  assessmentTrend: AssessmentTrend;
};

export type CompetitionPassport = {
  omniId: string;
  currentStage: string;
  currentStep: string;
  currentTier: string;
  currentSiliconPoints: number;
  currentRank: string;
  stateRank: string;
  collegeRank: string;
  rankChange: number;
  journeyCompletion: number;
  engineeringReadiness: number;
  readinessLevel: string;
  latestAssessmentScore: number;
  nextStage: string;
  pointsRequired: number;
  stepsRequired: number;
  targetReadiness: number;
  completedStages: number;
  completedSteps: number;
  remainingSteps: number;
  currentMomentum: CompetitionMomentum;
  milestones: CompetitionPassportMilestone[];
  timeline: CompetitionPassportTimelineItem[];
};

function formatDate(date: Date | string) {
  const safeDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(safeDate.getTime())) {
    return "Pending";
  }

  return safeDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getMomentum(input: CompetitionPassportInput): CompetitionMomentum {
  if (input.assessmentTrend.trend === "Improving") {
    return "Rising";
  }

  if (input.readiness.score < 35) {
    return "Needs Push";
  }

  return "Stable";
}

export function getCompetitionStatus(input: CompetitionPassportInput) {
  return {
    currentStage: input.vibgyorSnapshot.currentStage.name,
    currentStep: `${input.vibgyorSnapshot.currentStep.code} — ${input.vibgyorSnapshot.currentStep.meaning}`,
    currentTier: input.vibgyorSnapshot.currentTier,
    latestAssessmentScore: input.latestAssessment?.score ?? 0,
    readinessLevel: input.readiness.level,
  };
}

export function getNextMilestone(input: CompetitionPassportInput) {
  return {
    nextStage: input.vibgyorSnapshot.nextStage?.name ?? "Complete",
    pointsRequired:
      input.vibgyorSnapshot.nextStage === null
        ? 0
        : Math.max(
            0,
            input.vibgyorSnapshot.nextStage.minPoints -
              input.vibgyorSnapshot.siliconPoints,
          ),
    stepsRequired: input.vibgyorSnapshot.remainingSteps,
    targetReadiness:
      input.readiness.score >= 80
        ? 90
        : input.readiness.score >= 60
          ? 80
          : input.readiness.score >= 40
            ? 60
            : 40,
  };
}

export function getProgressSnapshot(input: CompetitionPassportInput): {
  journeyCompletion: number;
  completedStages: number;
  completedSteps: number;
  remainingSteps: number;
  currentMomentum: CompetitionMomentum;
} {
  return {
    journeyCompletion: input.vibgyorSnapshot.journeyCompletion,
    completedStages: input.vibgyorSnapshot.completedStages.length,
    completedSteps: input.vibgyorSnapshot.completedSteps,
    remainingSteps: input.vibgyorSnapshot.remainingSteps,
    currentMomentum: getMomentum(input),
  };
}

export function getCompetitionMilestones(
  input: CompetitionPassportInput,
): CompetitionPassportMilestone[] {
  const journey = input.vibgyorSnapshot;
  const latestAssessment = input.latestAssessment;
  const readiness = input.readiness;

  const milestones: CompetitionPassportMilestone[] = [
    {
      id: "identity-activated",
      title: "Engineering Identity Activated",
      status: "COMPLETED",
      completionPercent: 100,
      reward: "OMNI Passport",
      description: "Permanent engineering identity created.",
    },
    {
      id: "current-stage-completion",
      title: `${journey.currentStage.name} Completion`,
      status:
        journey.journeyCompletion >= 100
          ? "COMPLETED"
          : journey.completedSteps > 0
            ? "IN_PROGRESS"
            : "LOCKED",
      completionPercent: journey.journeyCompletion,
      reward: "+50 Silicon Points",
      description: journey.currentStage.purpose,
    },
    {
      id: "readiness-target",
      title: `${readiness.level} Readiness`,
      status:
        readiness.score >= 80
          ? "COMPLETED"
          : readiness.score >= 40
            ? "IN_PROGRESS"
            : "LOCKED",
      completionPercent: readiness.score,
      reward: "WorldSkills Track Progress",
      description: readiness.improvementGuidance,
    },
  ];

  if (latestAssessment) {
    milestones.splice(2, 0, {
      id: "assessment-performance",
      title: latestAssessment.title,
      status:
        latestAssessment.status === "Completed"
          ? "COMPLETED"
          : latestAssessment.status === "In Review"
            ? "IN_PROGRESS"
            : "LOCKED",
      completionPercent: latestAssessment.score,
      reward: `+${latestAssessment.readinessImpact} Readiness`,
      description: latestAssessment.notes,
    });
  }

  return milestones;
}

export function getCompetitionTimeline(
  input: CompetitionPassportInput,
): CompetitionPassportTimelineItem[] {
  const date = formatDate(input.createdAt);

  const stageItems: CompetitionPassportTimelineItem[] =
    input.vibgyorSnapshot.completedStages.map((stage) => ({
      id: `${stage.key}-completed`,
      title: `${stage.name} Completed`,
      description: `${stage.letter} stage completed through offline progression.`,
      type: "stage",
      date,
      status: "COMPLETED",
    }));

  const timeline: CompetitionPassportTimelineItem[] = [
    {
      id: "engineering-identity-activated",
      title: "Engineering Identity Activated",
      description: `${input.omniId} issued as competition passport.`,
      type: "identity",
      date,
      status: "COMPLETED",
    },
    ...stageItems,
    {
      id: "tier-upgraded",
      title: "Tier Updated",
      description: `${input.vibgyorSnapshot.currentTier} tier currently active.`,
      type: "tier",
      date,
      status: "IN_PROGRESS",
    },
    {
      id: "stage-unlocked",
      title: "Stage Active",
      description: `${input.vibgyorSnapshot.currentStage.name} is the active VIBGYOR stage.`,
      type: "stage",
      date,
      status: "IN_PROGRESS",
    },
    {
      id: "leaderboard-updated",
      title: "Leaderboard Updated",
      description:
        input.rankChange > 0
          ? `Rank improved by ${input.rankChange} positions this week.`
          : "Leaderboard position is being tracked.",
      type: "rank",
      date,
      status: "IN_PROGRESS",
    },
  ];

  if (input.latestAssessment) {
    timeline.splice(
      1 + stageItems.length,
      0,
      {
        id: "assessment-completed",
        title: "Assessment Completed",
        description: `${input.latestAssessment.title} scored ${input.latestAssessment.score}%.`,
        type: "assessment",
        date: input.latestAssessment.date,
        status:
          input.latestAssessment.status === "Completed"
            ? "COMPLETED"
            : "IN_PROGRESS",
      },
      {
        id: "assessment-improved",
        title: "Assessment Trend Updated",
        description: `${input.assessmentTrend.trend} assessment trend recorded.`,
        type: "readiness",
        date: input.latestAssessment.date,
        status: "IN_PROGRESS",
      },
    );
  }

  return timeline;
}

export function getCompetitionPassport(
  input: CompetitionPassportInput,
): CompetitionPassport {
  const status = getCompetitionStatus(input);
  const nextMilestone = getNextMilestone(input);
  const progress = getProgressSnapshot(input);

  return {
    omniId: input.omniId,
    currentStage: status.currentStage,
    currentStep: status.currentStep,
    currentTier: status.currentTier,
    currentSiliconPoints: input.siliconPoints,
    currentRank: input.nationalRank,
    stateRank: input.stateRank,
    collegeRank: input.collegeRank,
    rankChange: input.rankChange,
    journeyCompletion: progress.journeyCompletion,
    engineeringReadiness: input.readiness.score,
    readinessLevel: input.readiness.level,
    latestAssessmentScore: status.latestAssessmentScore,
    nextStage: nextMilestone.nextStage,
    pointsRequired: nextMilestone.pointsRequired,
    stepsRequired: nextMilestone.stepsRequired,
    targetReadiness: nextMilestone.targetReadiness,
    completedStages: progress.completedStages,
    completedSteps: progress.completedSteps,
    remainingSteps: progress.remainingSteps,
    currentMomentum: progress.currentMomentum,
    milestones: getCompetitionMilestones(input),
    timeline: getCompetitionTimeline(input),
  };
}
