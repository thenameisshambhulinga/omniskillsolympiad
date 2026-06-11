export type EngineeringTierName =
  | "Explorer"
  | "Builder"
  | "Innovator"
  | "Specialist"
  | "Expert"
  | "Master"
  | "Elite"
  | "Legend";

export type EngineeringTier = {
  name: EngineeringTierName;
  minPoints: number;
  maxPoints: number | null;
  description: string;
  accent: string;
};

export type TierProgress = {
  currentTier: EngineeringTier;
  nextTier: EngineeringTier | null;
  points: number;
  pointsIntoTier: number;
  pointsRequiredForNextTier: number | null;
  progressPercent: number;
};
