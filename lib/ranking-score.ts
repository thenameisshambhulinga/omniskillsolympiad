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
  const score =
    accuracy * 0.4 +
    consistency * 0.25 +
    difficultyMultiplier * 20 +
    streak * 0.1 -
    violations * 2;

  return Math.max(0, Number(score.toFixed(2)));
}
