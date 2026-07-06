export interface CompetitionMetrics {
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  successRate: number;

  omniScore: number;

  currentStreak: number;

  engineeringLevel: string;

  nationalRank?: number;
  stateRank?: number;
  collegeRank?: number;
}
