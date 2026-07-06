export interface StreakMachineInput {
  completedChallenges: number;
  currentStreak: number;
  missedChallengeWindows: number;
}

export interface StreakMachineResult {
  streak: number;
  protectedUntilNextCycle: boolean;
  streakProgress: number;
  streakStatus: string;
}

const STREAK_REQUIREMENT = 7;
const MAX_MISSED_WINDOWS = 7;

export function calculateEngineeringStreak(
  input: StreakMachineInput,
): StreakMachineResult {
  const { completedChallenges, currentStreak, missedChallengeWindows } = input;

  const streakCycles = Math.floor(completedChallenges / STREAK_REQUIREMENT);

  let updatedStreak = streakCycles;

  if (missedChallengeWindows >= MAX_MISSED_WINDOWS) {
    updatedStreak = 0;
  }

  const streakProgress = completedChallenges % STREAK_REQUIREMENT;

  return {
    streak: updatedStreak,

    protectedUntilNextCycle: missedChallengeWindows < MAX_MISSED_WINDOWS,

    streakProgress,

    streakStatus:
      missedChallengeWindows >= MAX_MISSED_WINDOWS ? "Broken" : "Protected",
  };
}
