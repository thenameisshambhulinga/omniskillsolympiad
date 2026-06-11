import type { Achievement } from "@/types/achievement";

export type AchievementInput = {
  siliconPoints: number;
  streak: number;
  nationalRank?: number | null;
  challengesSolved: number;
  averageAccuracy: number;
  skillsCount: number;
};

const earnedNow = "2026-01-01T00:00:00.000Z";

export function generateAchievements(input: AchievementInput): Achievement[] {
  const {
    siliconPoints,
    streak,
    nationalRank,
    challengesSolved,
    averageAccuracy,
    skillsCount,
  } = input;

  return [
    {
      id: "first-challenge",
      title: "First Challenge Completed",
      description: "Completed the first Omni Skills Olympiad challenge.",
      rarity: "common",
      icon: "award",
      earnedAt: challengesSolved >= 1 ? earnedNow : null,
      progress: Math.min(100, challengesSolved >= 1 ? 100 : 0),
    },
    {
      id: "seven-day-streak",
      title: "7 Day Streak",
      description: "Maintained consistent challenge participation for 7 days.",
      rarity: "rare",
      icon: "flame",
      earnedAt: streak >= 7 ? earnedNow : null,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
    },
    {
      id: "top-100-national",
      title: "Top 100 National",
      description: "Entered the top 100 national leaderboard.",
      rarity: "epic",
      icon: "trophy",
      earnedAt:
        typeof nationalRank === "number" &&
        nationalRank > 0 &&
        nationalRank <= 100
          ? earnedNow
          : null,
      progress:
        typeof nationalRank === "number" && nationalRank > 0
          ? Math.min(100, Math.round((100 / nationalRank) * 100))
          : 0,
    },
    {
      id: "points-builder",
      title: "Silicon Builder",
      description: "Earned 100+ Silicon Points.",
      rarity: "rare",
      icon: "zap",
      earnedAt: siliconPoints >= 100 ? earnedNow : null,
      progress: Math.min(100, Math.round((siliconPoints / 100) * 100)),
    },
    {
      id: "accuracy-signal",
      title: "Accuracy Signal",
      description: "Reached 80% average accuracy.",
      rarity: "epic",
      icon: "target",
      earnedAt: averageAccuracy >= 80 ? earnedNow : null,
      progress: Math.min(100, Math.round((averageAccuracy / 80) * 100)),
    },
    {
      id: "skill-stack",
      title: "Skill Stack Activated",
      description: "Added at least 5 technical skills to the profile.",
      rarity: "common",
      icon: "star",
      earnedAt: skillsCount >= 5 ? earnedNow : null,
      progress: Math.min(100, Math.round((skillsCount / 5) * 100)),
    },
    {
      id: "engineering-identity",
      title: "Engineering Identity",
      description: "Activated a shareable Omni Skills Olympiad identity.",
      rarity: "legendary",
      icon: "shield",
      earnedAt: earnedNow,
      progress: 100,
    },
  ];
}

export function getEarnedAchievements(achievements: Achievement[]) {
  return achievements.filter((achievement) => achievement.earnedAt);
}

export function getLockedAchievements(achievements: Achievement[]) {
  return achievements.filter((achievement) => !achievement.earnedAt);
}
