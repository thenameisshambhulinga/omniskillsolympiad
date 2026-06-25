export const PROTECTED_TEST_DURATION_MINUTES = 30;
export const MIN_PROTECTED_TEST_QUESTIONS = 40;
export const MAX_PROTECTED_TEST_QUESTIONS = 50;
export const MAX_TAB_SWITCHES_BEFORE_SUSPICIOUS = 5;
export const AUTOSAVE_INTERVAL_MS = 15000;

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

export function getRemainingMs(expiresAt: Date | null, now = new Date()) {
  if (!expiresAt) return 0;
  return Math.max(0, expiresAt.getTime() - now.getTime());
}

export function hasQuizExpired(expiresAt: Date | null, now = new Date()) {
  return Boolean(expiresAt && expiresAt.getTime() <= now.getTime());
}

export function normalizeTabSwitchCount(value: unknown) {
  const count = Number(value ?? 0);

  if (!Number.isFinite(count)) {
    return 0;
  }

  return Math.max(0, Math.min(999, Math.round(count)));
}
