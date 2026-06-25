export interface OmniScoreInput {
  accuracy: number;
  consistency: number;
  streak: number;
  completedChallenges: number;
  averageSpeed?: number;
  difficultyMultiplier?: number;
}

export function calculateOmniScore(input: OmniScoreInput): number {
  const {
    accuracy,
    consistency,
    streak,
    completedChallenges,
    averageSpeed = 50,
    difficultyMultiplier = 1,
  } = input;

  const accuracyWeight = accuracy * 0.35;

  const consistencyWeight = consistency * 0.15;

  const streakWeight = streak * 10;

  const completionWeight = completedChallenges * 2;

  const speedWeight = averageSpeed * 0.1;

  const difficultyWeight = difficultyMultiplier * 20;

  const omniScore =
    accuracyWeight +
    consistencyWeight +
    streakWeight +
    completionWeight +
    speedWeight +
    difficultyWeight;

  return Math.round(omniScore);
}
