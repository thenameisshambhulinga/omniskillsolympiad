export type ProfileMetric = {
  label: string;
  value: string | number;
  helper?: string;
  tooltip?: string;
};

export type ProfileSocialLink = {
  label: "LinkedIn" | "GitHub" | "Portfolio";
  href: string;
};

export type AchievementStatus = "unlocked" | "progress" | "locked";

export type ProfileAchievementRarity = "common" | "rare" | "epic" | "legendary";

export type ProfileAchievementIcon =
  | "award"
  | "brain"
  | "circuit"
  | "flame"
  | "medal"
  | "shield"
  | "star"
  | "target"
  | "trophy"
  | "zap";

export interface ProfileAchievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: AchievementStatus;
  rarity?: ProfileAchievementRarity;
  icon?: ProfileAchievementIcon;
  earnedAt?: string | null;
}

export type ProfileCompletionItem = {
  label: string;
  completed: boolean;
};

export type EngineeringProfile = {
  id: string;
  name: string;
  email: string;
  image: string;
  omniId: string;

  college: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
  state: string;
  district: string;
  pincode: string;

  tier: string;
  siliconPoints: number;
  nationalRank: string;
  stateRank: string;
  collegeRank: string;
  streak: number;
  challengesSolved: number;
  averageAccuracy: number;
  mockTests: number;
  omniScore: number;
  successRate: number;

  bio: string;
  skills: string[];
  careerInterests: string[];

  socials: ProfileSocialLink[];
  completion: ProfileCompletionItem[];
  achievements: ProfileAchievement[];
};
