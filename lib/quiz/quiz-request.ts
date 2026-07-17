const MAX_QUIZ_ANSWERS = 200;
const MAX_IDENTIFIER_LENGTH = 128;
const MAX_ANSWER_LENGTH = 32;

export type QuizAnswerInput = {
  questionId: string;
  selectedAnswer: string;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";

  const cleaned = value.trim();

  if (!cleaned || cleaned.length > maxLength) return "";

  return cleaned;
}

export function normalizeQuizId(value: unknown) {
  return cleanText(value, MAX_IDENTIFIER_LENGTH);
}

export function normalizeQuizAnswerArray(value: unknown): QuizAnswerInput[] {
  if (!Array.isArray(value)) return [];

  const uniqueAnswers = new Map<string, QuizAnswerInput>();

  for (const item of value.slice(0, MAX_QUIZ_ANSWERS)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;

    const candidate = item as Record<string, unknown>;
    const questionId = cleanText(candidate.questionId, MAX_IDENTIFIER_LENGTH);
    const selectedAnswer = cleanText(candidate.selectedAnswer, MAX_ANSWER_LENGTH);

    if (!questionId || !selectedAnswer) continue;

    uniqueAnswers.set(questionId, { questionId, selectedAnswer });
  }

  return [...uniqueAnswers.values()];
}

export function normalizeQuizAnswerMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const normalized: Record<string, string> = {};
  let count = 0;

  for (const [rawQuestionId, rawAnswer] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (count >= MAX_QUIZ_ANSWERS) break;

    const questionId = cleanText(rawQuestionId, MAX_IDENTIFIER_LENGTH);
    const selectedAnswer = cleanText(rawAnswer, MAX_ANSWER_LENGTH);

    if (!questionId || !selectedAnswer) continue;

    normalized[questionId] = selectedAnswer;
    count += 1;
  }

  return normalized;
}
