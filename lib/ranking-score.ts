import {
  basisPointsToPercentage,
  clampInteger,
  percentageToBasisPoints,
} from "@/lib/math/exact-metrics";

interface RankingInput {
  accuracy: number;
  consistency: number;
  streak: number;
  violations: number;
  difficultyMultiplier?: number;
}

export function calculateRankingScore({
  accuracy,
  consistency,
  streak,
  violations,
  difficultyMultiplier = 1,
}: RankingInput) {
  const accuracyBp = percentageToBasisPoints(accuracy);
  const consistencyBp = percentageToBasisPoints(consistency);
  const difficultyBp = clampInteger(difficultyMultiplier * 2_000, 0, 10_000, 2_000);
  const streakBp = clampInteger(streak * 10, 0, 2_000, 0);
  const violationPenaltyBp = clampInteger(violations * 200, 0, 10_000, 0);

  const scoreBp = Math.max(
    0,
    Math.round((accuracyBp * 40 + consistencyBp * 25) / 100) +
      difficultyBp +
      streakBp -
      violationPenaltyBp,
  );

  return basisPointsToPercentage(Math.min(10_000, scoreBp));
}
