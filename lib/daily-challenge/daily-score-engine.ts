export type DailyScoringQuestion = {
  id: string;
  correctAnswer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

export type SubmittedDailyAnswer = {
  questionId: string;
  selectedAnswer: string;
};

export type DailyScoreResult = {
  score: number;
  total: number;
  percentage: number;
  answeredCount: number;
  unansweredCount: number;
  duplicateAnswerCount: number;
  unknownQuestionCount: number;
  invalidAnswerCount: number;
};

export function scoreDailyAnswers({
  questions,
  answers,
}: {
  questions: DailyScoringQuestion[];
  answers: unknown[];
}): DailyScoreResult {
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const scoredQuestionIds = new Set<string>();

  let score = 0;
  let answeredCount = 0;
  let duplicateAnswerCount = 0;
  let unknownQuestionCount = 0;
  let invalidAnswerCount = 0;

  for (const rawAnswer of answers) {
    if (!isSubmittedDailyAnswer(rawAnswer)) {
      invalidAnswerCount += 1;
      continue;
    }

    const questionId = rawAnswer.questionId.trim();
    const selectedAnswer = rawAnswer.selectedAnswer.trim();

    if (!questionId || !selectedAnswer) {
      invalidAnswerCount += 1;
      continue;
    }

    if (scoredQuestionIds.has(questionId)) {
      duplicateAnswerCount += 1;
      continue;
    }

    const officialQuestion = questionMap.get(questionId);

    if (!officialQuestion) {
      unknownQuestionCount += 1;
      continue;
    }

    scoredQuestionIds.add(questionId);

    const selected = normalizeAnswer(selectedAnswer);
    const correct = normalizeAnswer(officialQuestion.correctAnswer);

    const officialOptions = [
      officialQuestion.optionA,
      officialQuestion.optionB,
      officialQuestion.optionC,
      officialQuestion.optionD,
    ].map(normalizeAnswer);

    if (!officialOptions.includes(selected)) {
      invalidAnswerCount += 1;
      continue;
    }

    answeredCount += 1;

    if (selected === correct) {
      score += 1;
    }
  }

  const total = questions.length;
  const safeScore = Math.min(score, total);
  const percentage =
    total === 0 ? 0 : Number(((safeScore / total) * 100).toFixed(2));

  return {
    score: safeScore,
    total,
    percentage,
    answeredCount,
    unansweredCount: Math.max(0, total - answeredCount),
    duplicateAnswerCount,
    unknownQuestionCount,
    invalidAnswerCount,
  };
}

function isSubmittedDailyAnswer(value: unknown): value is SubmittedDailyAnswer {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.questionId === "string" &&
    typeof candidate.selectedAnswer === "string"
  );
}

function normalizeAnswer(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}