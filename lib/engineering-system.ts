import {
  basisPointsToPercentage,
  clampInteger,
  percentageToBasisPoints,
} from "@/lib/math/exact-metrics";

export function calculateOmniScore({
  averageAccuracy,
  consistencyScore,
  completedDays,
  totalPoints,
}: {
  averageAccuracy: number;
  consistencyScore: number;
  completedDays: number;
  totalPoints: number;
}) {
  const accuracyBp = percentageToBasisPoints(averageAccuracy);
  const consistencyBp = percentageToBasisPoints(consistencyScore);
  const completionBp = Math.min(10_000, Math.round((clampInteger(completedDays, 0, 30, 0) * 10_000) / 30));
  const pointsBp = Math.min(10_000, clampInteger(totalPoints, 0, 1_000, 0) * 10);

  const weightedBasisPoints = Math.round(
    (accuracyBp * 40 + consistencyBp * 25 + completionBp * 15 + pointsBp * 20) / 100,
  );

  return basisPointsToPercentage(weightedBasisPoints);
}

export function determineEngineeringTier(score: number) {
  const safeScore = basisPointsToPercentage(percentageToBasisPoints(score));
  if (safeScore >= 95) return { tier: "Grandmaster Engineer", level: "LEVEL 7", badge: "⚡" };
  if (safeScore >= 85) return { tier: "Elite Engineer", level: "LEVEL 6", badge: "🚀" };
  if (safeScore >= 75) return { tier: "Advanced Engineer", level: "LEVEL 5", badge: "🔥" };
  if (safeScore >= 60) return { tier: "Professional Engineer", level: "LEVEL 4", badge: "💠" };
  if (safeScore >= 45) return { tier: "Competitive Engineer", level: "LEVEL 3", badge: "🛡️" };
  if (safeScore >= 30) return { tier: "Emerging Engineer", level: "LEVEL 2", badge: "✨" };
  return { tier: "Foundation Engineer", level: "LEVEL 1", badge: "📘" };
}

export function calculateProtectedStreak({
  currentStreak,
  completedDays,
}: {
  currentStreak: number;
  completedDays: number;
}) {
  return {
    protectedStreak: Math.floor(clampInteger(completedDays, 0, Number.MAX_SAFE_INTEGER, 0) / 7),
    currentStreak: clampInteger(currentStreak, 0, Number.MAX_SAFE_INTEGER, 0),
  };
}
