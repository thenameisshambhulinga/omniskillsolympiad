export function calculateAccuracy({
  correctAnswers,
  totalQuestions,
}: {
  correctAnswers: number;
  totalQuestions: number;
}) {
  if (totalQuestions === 0) return 0;

  return Number(((correctAnswers / totalQuestions) * 100).toFixed(1));
}

export function calculateConsistency(
  completedChallenges: number,
  totalChallenges: number,
) {
  if (totalChallenges === 0) return 0;

  return Number(((completedChallenges / totalChallenges) * 100).toFixed(1));
}
