export type QuizScoringQuestion = {
  id: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  points: number;
};

export type SubmittedQuizAnswer = {
  questionId: string;
  selectedAnswer: string;
};

export type QuizScoreResult = {
  score: number;
  total: number;
  percentage: number;
  answeredCount: number;
  unansweredCount: number;
  duplicateAnswerCount: number;
  unknownQuestionCount: number;
  invalidAnswerCount: number;
};

export function normalizeQuizAnswers(answers: unknown[]) {
  const normalized: SubmittedQuizAnswer[] = [];

  for (const rawAnswer of answers) {
    if (!rawAnswer || typeof rawAnswer !== "object" || Array.isArray(rawAnswer)) {
      continue;
    }

    const candidate = rawAnswer as Record<string, unknown>;

    const questionId =
      typeof candidate.questionId === "string" ? candidate.questionId.trim() : "";

    const selectedAnswer =
      typeof candidate.selectedAnswer === "string"
        ? candidate.selectedAnswer.trim()
        : "";

    if (!questionId || !selectedAnswer) {
      continue;
    }

    normalized.push({
      questionId,
      selectedAnswer,
    });
  }

  return normalized;
}

export function scoreQuizAnswers({
  questions,
  answers,
}: {
  questions: QuizScoringQuestion[];
  answers: unknown[];
}): QuizScoreResult {
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const scoredQuestionIds = new Set<string>();

  let score = 0;
  let answeredCount = 0;
  let duplicateAnswerCount = 0;
  let unknownQuestionCount = 0;
  let invalidAnswerCount = 0;

  for (const rawAnswer of answers) {
    if (!isSubmittedQuizAnswer(rawAnswer)) {
      invalidAnswerCount += 1;
      continue;
    }

    const questionId = rawAnswer.questionId.trim();
    const selectedAnswer = normalizeAnswer(rawAnswer.selectedAnswer);

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

    const validOptions = [
      officialQuestion.optionA,
      officialQuestion.optionB,
      officialQuestion.optionC,
      officialQuestion.optionD,
    ]
      .filter((option): option is string => typeof option === "string")
      .map(normalizeAnswer);

    if (validOptions.length > 0 && !validOptions.includes(selectedAnswer)) {
      invalidAnswerCount += 1;
      continue;
    }

    answeredCount += 1;

    if (selectedAnswer === normalizeAnswer(officialQuestion.correctAnswer)) {
      score += normalizePoints(officialQuestion.points);
    }
  }

  const total = questions.reduce(
    (sum, question) => sum + normalizePoints(question.points),
    0,
  );

  const safeScore = Math.min(score, total);
  const percentage =
    total === 0 ? 0 : Number(((safeScore / total) * 100).toFixed(2));

  return {
    score: safeScore,
    total,
    percentage,
    answeredCount,
    unansweredCount: Math.max(0, questions.length - answeredCount),
    duplicateAnswerCount,
    unknownQuestionCount,
    invalidAnswerCount,
  };
}

function isSubmittedQuizAnswer(value: unknown): value is SubmittedQuizAnswer {
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

function normalizePoints(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(100, Math.round(value)));
}
