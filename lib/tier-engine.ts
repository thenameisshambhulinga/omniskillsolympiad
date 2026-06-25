import type {
  EngineeringTier,
  EngineeringTierName,
  TierProgress,
} from "@/types/tier";

export const ENGINEERING_TIERS: EngineeringTier[] = [
  {
    name: "Explorer",
    minPoints: 0,
    maxPoints: 99,
    description: "Started the Omni Skills Olympiad engineering journey.",
    accent: "cyan",
  },
  {
    name: "Builder",
    minPoints: 100,
    maxPoints: 249,
    description: "Building technical consistency through challenges.",
    accent: "blue",
  },
  {
    name: "Innovator",
    minPoints: 250,
    maxPoints: 499,
    description: "Showing strong innovation and problem-solving momentum.",
    accent: "purple",
  },
  {
    name: "Specialist",
    minPoints: 500,
    maxPoints: 999,
    description: "Developing focused engineering specialization.",
    accent: "emerald",
  },
  {
    name: "Expert",
    minPoints: 1000,
    maxPoints: 1999,
    description: "Performing at advanced engineering competition level.",
    accent: "amber",
  },
  {
    name: "Master",
    minPoints: 2000,
    maxPoints: 3499,
    description: "Mastering high-consistency technical execution.",
    accent: "rose",
  },
  {
    name: "Elite",
    minPoints: 3500,
    maxPoints: 4999,
    description: "Recognized as an elite engineering competitor.",
    accent: "fuchsia",
  },
  {
    name: "Legend",
    minPoints: 5000,
    maxPoints: null,
    description: "Legendary Omni Skills Olympiad engineering identity.",
    accent: "violet",
  },
];

export function getEngineeringTier(points: number): EngineeringTier {
  const safePoints = Math.max(0, Number.isFinite(points) ? points : 0);

  return (
    ENGINEERING_TIERS.find((tier) => {
      const upperBound = tier.maxPoints ?? Number.POSITIVE_INFINITY;
      return safePoints >= tier.minPoints && safePoints <= upperBound;
    }) ?? ENGINEERING_TIERS[0]
  );
}

export function getNextEngineeringTier(points: number): EngineeringTier | null {
  const currentTier = getEngineeringTier(points);
  const currentIndex = ENGINEERING_TIERS.findIndex(
    (tier) => tier.name === currentTier.name,
  );

  return ENGINEERING_TIERS[currentIndex + 1] ?? null;
}

export function getTierProgress(points: number): TierProgress {
  const safePoints = Math.max(0, Number.isFinite(points) ? points : 0);
  const currentTier = getEngineeringTier(safePoints);
  const nextTier = getNextEngineeringTier(safePoints);

  if (!nextTier || currentTier.maxPoints === null) {
    return {
      currentTier,
      nextTier: null,
      points: safePoints,
      pointsIntoTier: safePoints - currentTier.minPoints,
      pointsRequiredForNextTier: null,
      progressPercent: 100,
    };
  }

  const tierSpan = nextTier.minPoints - currentTier.minPoints;
  const pointsIntoTier = safePoints - currentTier.minPoints;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((pointsIntoTier / tierSpan) * 100)),
  );

  return {
    currentTier,
    nextTier,
    points: safePoints,
    pointsIntoTier,
    pointsRequiredForNextTier: nextTier.minPoints - safePoints,
    progressPercent,
  };
}

export function isTierName(value: string): value is EngineeringTierName {
  return ENGINEERING_TIERS.some((tier) => tier.name === value);
}
