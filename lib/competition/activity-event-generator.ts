import { buildProfileAchievements } from "@/lib/profile/achievement-engine";
import { getTierProgress, getVibgyorProgress } from "@/lib/profile/tier-engine";

export type CompetitionActivityType =
  | "challenge"
  | "submission"
  | "points"
  | "tier"
  | "rank"
  | "achievement"
  | "identity";

export type CompetitionActivityEvent = {
  id: string;
  type: CompetitionActivityType;
  title: string;
  description: string;
  createdAt: string;
  priority: number;
};

export type CompetitionActivityInput = {
  user: {
    id: string;
    fullName: string | null;
    email: string;
    createdAt: Date;
    siliconPoints: number;
    streak: number;
    skills: string[];
    isOnboarded: boolean;
    omniId: string | null;
  };
  dailyAttempts: {
    id: string;
    score: number;
    total: number;
    percentage: number;
    challengeDay: number;
    createdAt: Date;
    submittedAt: Date | null;
    completed: boolean;
  }[];
  activities?: {
    id: string;
    type: string;
    title: string;
    description: string | null;
    createdAt: Date;
  }[];
  previousRank?: number | null;
  currentRank?: number | null;
};

function toIso(date: Date | null | undefined) {
  return (date ?? new Date(0)).toISOString();
}

function normalizeActivityType(type: string): CompetitionActivityType {
  if (
    type === "challenge" ||
    type === "submission" ||
    type === "points" ||
    type === "tier" ||
    type === "rank" ||
    type === "achievement" ||
    type === "identity"
  ) {
    return type;
  }

  return "identity";
}

function uniqueEvents(events: CompetitionActivityEvent[]) {
  const map = new Map<string, CompetitionActivityEvent>();

  events.forEach((event) => {
    if (!map.has(event.id)) {
      map.set(event.id, event);
    }
  });

  return [...map.values()].sort((a, b) => {
    const dateDiff =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    if (dateDiff !== 0) return dateDiff;

    return b.priority - a.priority;
  });
}

export function generateCompetitionActivityEvents({
  user,
  dailyAttempts,
  activities = [],
  previousRank = null,
  currentRank = null,
}: CompetitionActivityInput): CompetitionActivityEvent[] {
  const realActivityEvents: CompetitionActivityEvent[] = activities.map(
    (activity) => ({
      id: `activity-${activity.id}`,
      type: normalizeActivityType(activity.type),
      title: activity.title,
      description: activity.description || "Engineering activity recorded.",
      createdAt: activity.createdAt.toISOString(),
      priority: 90,
    }),
  );

  const completedAttempts = dailyAttempts.filter(
    (attempt) => attempt.completed,
  );

  const challengeEvents: CompetitionActivityEvent[] = completedAttempts.map(
    (attempt) => ({
      id: `challenge-${attempt.id}`,
      type: "challenge",
      title: `Daily Challenge ${attempt.challengeDay} Completed`,
      description: `${attempt.score}/${attempt.total} score with ${Math.round(
        attempt.percentage,
      )}% accuracy.`,
      createdAt: toIso(attempt.submittedAt ?? attempt.createdAt),
      priority: 80,
    }),
  );

  const submissionEvents: CompetitionActivityEvent[] = dailyAttempts
    .filter((attempt) => attempt.submittedAt)
    .map((attempt) => ({
      id: `submission-${attempt.id}`,
      type: "submission",
      title: `Challenge ${attempt.challengeDay} Submitted`,
      description:
        "Submission recorded inside the Omni Skills Olympiad engine.",
      createdAt: toIso(attempt.submittedAt),
      priority: 70,
    }));

  const tierProgress = getTierProgress(user.siliconPoints);
  const vibgyorProgress = getVibgyorProgress(user.siliconPoints);

  const milestoneEvents: CompetitionActivityEvent[] = [];

  if (user.isOnboarded && user.omniId) {
    milestoneEvents.push({
      id: `identity-${user.id}`,
      type: "identity",
      title: "OMNI Identity Activated",
      description: `${user.omniId} became a verified Omni Skills Olympiad engineering identity.`,
      createdAt: user.createdAt.toISOString(),
      priority: 100,
    });
  }

  if (user.siliconPoints >= 100) {
    milestoneEvents.push({
      id: `points-100-${user.id}`,
      type: "points",
      title: "100 Silicon Points Milestone",
      description:
        "Crossed the first major Silicon Points milestone and entered competitive growth mode.",
      createdAt: user.createdAt.toISOString(),
      priority: 75,
    });
  }

  if (user.siliconPoints >= 300) {
    milestoneEvents.push({
      id: `points-300-${user.id}`,
      type: "points",
      title: "300 Silicon Points Milestone",
      description:
        "Built strong platform momentum through challenges, skills and competition progress.",
      createdAt: user.createdAt.toISOString(),
      priority: 75,
    });
  }

  if (tierProgress.currentTier !== "Explorer") {
    milestoneEvents.push({
      id: `tier-${tierProgress.currentTier}-${user.id}`,
      type: "tier",
      title: `${tierProgress.currentTier} Tier Reached`,
      description: `Current engineering tier advanced to ${tierProgress.currentTier}.`,
      createdAt: user.createdAt.toISOString(),
      priority: 85,
    });
  }

  milestoneEvents.push({
    id: `vibgyor-${vibgyorProgress.currentStage}-${user.id}`,
    type: "tier",
    title: `${vibgyorProgress.currentStage} VIBGYOR Stage Active`,
    description: `Current practical electronics growth stage is ${vibgyorProgress.currentStage}.`,
    createdAt: user.createdAt.toISOString(),
    priority: 65,
  });

  if (
    typeof previousRank === "number" &&
    typeof currentRank === "number" &&
    currentRank > 0 &&
    previousRank > currentRank
  ) {
    milestoneEvents.push({
      id: `rank-improved-${user.id}-${currentRank}`,
      type: "rank",
      title: "Leaderboard Position Improved",
      description: `Rank improved from #${previousRank} to #${currentRank}.`,
      createdAt: new Date().toISOString(),
      priority: 95,
    });
  }

  const achievements = buildProfileAchievements({
    createdAt: user.createdAt,
    siliconPoints: user.siliconPoints,
    streak: user.streak,
    skills: user.skills,
    isOnboarded: user.isOnboarded,
    dailyAttempts: completedAttempts.map((attempt) => ({ id: attempt.id })),
  });

  const achievementEvents: CompetitionActivityEvent[] = achievements
    .filter((achievement) => achievement.status === "unlocked")
    .map((achievement) => ({
      id: `achievement-${achievement.id}-${user.id}`,
      type: "achievement",
      title: `${achievement.title} Badge Unlocked`,
      description: achievement.description,
      createdAt: achievement.earnedAt || user.createdAt.toISOString(),
      priority: 88,
    }));

  return uniqueEvents([
    ...realActivityEvents,
    ...challengeEvents,
    ...submissionEvents,
    ...milestoneEvents,
    ...achievementEvents,
  ]);
}
