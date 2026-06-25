import type { ProfileAchievement } from "@/types/profile";

type AchievementUser = {
  createdAt: Date;
  siliconPoints: number;
  streak: number;
  skills: string[];
  isOnboarded: boolean;
  dailyAttempts: {
    id: string;
  }[];
};

function getStatus(progress: number): ProfileAchievement["status"] {
  if (progress >= 100) return "unlocked";
  if (progress > 0) return "progress";
  return "locked";
}

function hasSkill(skills: string[], keywords: string[]) {
  return skills.some((skill) =>
    keywords.some((keyword) =>
      skill.toLowerCase().includes(keyword.toLowerCase()),
    ),
  );
}

export function buildProfileAchievements(
  user: AchievementUser,
): ProfileAchievement[] {
  const completedChallenges = user.dailyAttempts.length;

  const challengeProgress = Math.min(
    100,
    Math.round((completedChallenges / 10) * 100),
  );

  const streakProgress = Math.min(100, Math.round((user.streak / 7) * 100));

  const siliconProgress = Math.min(
    100,
    Math.round((user.siliconPoints / 100) * 100),
  );

  const firmwareProgress = hasSkill(user.skills, ["embedded", "firmware"])
    ? 100
    : 0;

  const pcbProgress = hasSkill(user.skills, ["pcb"]) ? 100 : 0;

  const aiProgress = hasSkill(user.skills, ["ai", "robotics"]) ? 100 : 0;

  const worldSkillsProgress = hasSkill(user.skills, ["worldskills"]) ? 100 : 0;

  return [
    {
      id: "engineering-explorer",
      title: "Engineering Explorer",
      description: "Completed onboarding and activated engineering identity.",
      progress: user.isOnboarded ? 100 : 0,
      status: user.isOnboarded ? "unlocked" : "locked",
      rarity: "common",
      icon: "shield",
      earnedAt: user.isOnboarded ? user.createdAt.toISOString() : null,
    },
    {
      id: "challenge-warrior",
      title: "Challenge Warrior",
      description: `${completedChallenges}/10 daily challenges completed.`,
      progress: challengeProgress,
      status: getStatus(challengeProgress),
      rarity: "rare",
      icon: "trophy",
      earnedAt: challengeProgress >= 100 ? user.createdAt.toISOString() : null,
    },
    {
      id: "consistency-master",
      title: "Consistency Master",
      description: `${user.streak}/7 streak days completed.`,
      progress: streakProgress,
      status: getStatus(streakProgress),
      rarity: "epic",
      icon: "flame",
      earnedAt: streakProgress >= 100 ? user.createdAt.toISOString() : null,
    },
    {
      id: "silicon-builder",
      title: "Silicon Builder",
      description: `${user.siliconPoints}/100 Silicon Points earned.`,
      progress: siliconProgress,
      status: getStatus(siliconProgress),
      rarity: "legendary",
      icon: "zap",
      earnedAt: siliconProgress >= 100 ? user.createdAt.toISOString() : null,
    },
    {
      id: "firmware-explorer",
      title: "Firmware Explorer",
      description: "Demonstrated embedded or firmware skill identity.",
      progress: firmwareProgress,
      status: getStatus(firmwareProgress),
      rarity: "rare",
      icon: "target",
      earnedAt: firmwareProgress >= 100 ? user.createdAt.toISOString() : null,
    },
    {
      id: "pcb-architect",
      title: "PCB Architect",
      description: "Added PCB design capability to engineering profile.",
      progress: pcbProgress,
      status: getStatus(pcbProgress),
      rarity: "epic",
      icon: "circuit",
      earnedAt: pcbProgress >= 100 ? user.createdAt.toISOString() : null,
    },
    {
      id: "ai-innovator",
      title: "AI Innovator",
      description: "Added AI or robotics capability to engineering profile.",
      progress: aiProgress,
      status: getStatus(aiProgress),
      rarity: "epic",
      icon: "brain",
      earnedAt: aiProgress >= 100 ? user.createdAt.toISOString() : null,
    },
    {
      id: "worldskills-candidate",
      title: "WorldSkills Candidate",
      description: "Connected profile identity to WorldSkills preparation.",
      progress: worldSkillsProgress,
      status: getStatus(worldSkillsProgress),
      rarity: "legendary",
      icon: "medal",
      earnedAt:
        worldSkillsProgress >= 100 ? user.createdAt.toISOString() : null,
    },
  ];
}
