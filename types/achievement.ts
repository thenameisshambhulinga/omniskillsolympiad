export type AchievementRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export type AchievementIcon =
  | "award"
  | "flame"
  | "trophy"
  | "zap"
  | "target"
  | "star"
  | "shield";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  rarity: AchievementRarity;
  icon: AchievementIcon;
  earnedAt: string | null;
  progress?: number;
};
