export interface StreakEvaluationInput {
  currentStreak: number;
  lastCompletedAt: Date | null;
}

export interface StreakEvaluationResult {
  streak: number;
  protected: boolean;
  reset: boolean;
}

const GRACE_HOURS = 12;

export function evaluateStreak({
  currentStreak,
  lastCompletedAt,
}: StreakEvaluationInput): StreakEvaluationResult {
  if (!lastCompletedAt) {
    return {
      streak: 1,
      protected: false,
      reset: false,
    };
  }

  const now = new Date();

  const diffMs = now.getTime() - new Date(lastCompletedAt).getTime();

  const diffHours = diffMs / (1000 * 60 * 60);

  // SAME DAY
  if (diffHours < 24) {
    return {
      streak: currentStreak,
      protected: true,
      reset: false,
    };
  }

  // GRACE WINDOW
  if (diffHours >= 24 && diffHours <= 24 + GRACE_HOURS) {
    return {
      streak: currentStreak,
      protected: true,
      reset: false,
    };
  }

  // RESET
  return {
    streak: 1,
    protected: false,
    reset: true,
  };
}