export type EngineeringTierName =
  | "Explorer"
  | "Builder"
  | "Innovator"
  | "Architect"
  | "Champion"
  | "Elite"
  | "Legend";

export type VibgyorStageName =
  | "Violet"
  | "Indigo"
  | "Blue"
  | "Green"
  | "Yellow"
  | "Orange"
  | "Red";

export type TierProgress = {
  currentTier: EngineeringTierName;
  nextTier: EngineeringTierName | null;
  points: number;
  currentMin: number;
  nextMin: number | null;
  progressPercent: number;
  pointsToNextTier: number | null;
};

export type VibgyorProgress = {
  currentStage: VibgyorStageName;
  nextStage: VibgyorStageName | null;
  points: number;
  currentMin: number;
  nextMin: number | null;
  progressPercent: number;
  pointsToNextStage: number | null;
};

const TIERS: { name: EngineeringTierName; min: number }[] = [
  { name: "Explorer", min: 0 },
  { name: "Builder", min: 100 },
  { name: "Innovator", min: 300 },
  { name: "Architect", min: 700 },
  { name: "Champion", min: 1500 },
  { name: "Elite", min: 3000 },
  { name: "Legend", min: 5000 },
];

const VIBGYOR_STAGES: { name: VibgyorStageName; min: number }[] = [
  { name: "Violet", min: 0 },
  { name: "Indigo", min: 100 },
  { name: "Blue", min: 300 },
  { name: "Green", min: 700 },
  { name: "Yellow", min: 1500 },
  { name: "Orange", min: 3000 },
  { name: "Red", min: 5000 },
];

function normalizePoints(pointsInput: number) {
  return Math.max(0, Number.isFinite(pointsInput) ? pointsInput : 0);
}

export function getTier(pointsInput: number): EngineeringTierName {
  const points = normalizePoints(pointsInput);

  return TIERS.reduce<EngineeringTierName>(
    (activeTier, tier) => (points >= tier.min ? tier.name : activeTier),
    TIERS[0].name,
  );
}

export function getTierProgress(pointsInput: number): TierProgress {
  const points = normalizePoints(pointsInput);

  const currentIndex = TIERS.reduce(
    (activeIndex, tier, index) => (points >= tier.min ? index : activeIndex),
    0,
  );

  const current = TIERS[currentIndex];
  const next = TIERS[currentIndex + 1] ?? null;

  if (!next) {
    return {
      currentTier: current.name,
      nextTier: null,
      points,
      currentMin: current.min,
      nextMin: null,
      progressPercent: 100,
      pointsToNextTier: null,
    };
  }

  const progressPercent = Math.round(
    ((points - current.min) / (next.min - current.min)) * 100,
  );

  return {
    currentTier: current.name,
    nextTier: next.name,
    points,
    currentMin: current.min,
    nextMin: next.min,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    pointsToNextTier: Math.max(0, next.min - points),
  };
}

export function getVibgyorStage(pointsInput: number): VibgyorStageName {
  const points = normalizePoints(pointsInput);

  return VIBGYOR_STAGES.reduce<VibgyorStageName>(
    (activeStage, stage) => (points >= stage.min ? stage.name : activeStage),
    VIBGYOR_STAGES[0].name,
  );
}

export function getVibgyorProgress(pointsInput: number): VibgyorProgress {
  const points = normalizePoints(pointsInput);

  const currentIndex = VIBGYOR_STAGES.reduce(
    (activeIndex, stage, index) => (points >= stage.min ? index : activeIndex),
    0,
  );

  const current = VIBGYOR_STAGES[currentIndex];
  const next = VIBGYOR_STAGES[currentIndex + 1] ?? null;

  if (!next) {
    return {
      currentStage: current.name,
      nextStage: null,
      points,
      currentMin: current.min,
      nextMin: null,
      progressPercent: 100,
      pointsToNextStage: null,
    };
  }

  const progressPercent = Math.round(
    ((points - current.min) / (next.min - current.min)) * 100,
  );

  return {
    currentStage: current.name,
    nextStage: next.name,
    points,
    currentMin: current.min,
    nextMin: next.min,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    pointsToNextStage: Math.max(0, next.min - points),
  };
}