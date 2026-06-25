export const PROTECTED_TEST_DURATION_MINUTES = 30;
export const MIN_PROTECTED_TEST_QUESTIONS = 40;
export const MAX_PROTECTED_TEST_QUESTIONS = 50;

export function getQuizDurationMs(durationMinutes: number) {
  const safeMinutes = Number.isFinite(durationMinutes)
    ? Math.max(1, Math.min(180, Math.round(durationMinutes)))
    : PROTECTED_TEST_DURATION_MINUTES;

  return safeMinutes * 60 * 1000;
}

export function isProtectedTestReady(questionCount: number) {
  return (
    questionCount >= MIN_PROTECTED_TEST_QUESTIONS &&
    questionCount <= MAX_PROTECTED_TEST_QUESTIONS
  );
}
