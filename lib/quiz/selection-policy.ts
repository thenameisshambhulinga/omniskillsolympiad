import {
  compareRatiosDescending,
  percentageToBasisPoints,
  ratioToBasisPoints,
  safeElapsedMilliseconds,
} from "@/lib/math/exact-metrics";

export type SelectionStatus = "PENDING" | "SELECTED" | "WAITLISTED" | "REJECTED";

export type SelectionSettings = {
  minimumPercentage: number;
  minimumPercentageBasisPoints: number;
  maxTabSwitches: number;
  requireNonSuspicious: boolean;
  shortlistLimit: number | null;
};

export type AttemptForSelection = {
  id: string;
  score: number;
  total: number;
  percentage: number;
  suspicious: boolean;
  tabSwitchCount: number;
  startedAt?: Date | string | null;
  submittedAt: Date | string | null;
  user: { id: string; email: string | null };
};

export type SelectionRow = {
  attemptId: string;
  userId: string;
  email: string;
  score: number;
  total: number;
  percentage: number;
  percentageBasisPoints: number;
  elapsedMilliseconds: number | null;
  suspicious: boolean;
  tabSwitchCount: number;
  submittedAt: string | null;
  eligibleByEquation: boolean;
  rank: number | null;
  status: SelectionStatus;
  reason: string;
};

export function normalizeSelectionSettings(input: {
  minimumPercentage: unknown;
  maxTabSwitches: unknown;
  requireNonSuspicious: unknown;
  shortlistLimit: unknown;
}): SelectionSettings {
  const minimumPercentageBasisPoints = percentageToBasisPoints(input.minimumPercentage, 6000);
  const maxTabSwitches = clampInteger(input.maxTabSwitches, 0, 999, 4);
  const requireNonSuspicious =
    typeof input.requireNonSuspicious === "boolean" ? input.requireNonSuspicious : true;
  const rawLimit = Number(input.shortlistLimit);
  const shortlistLimit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.max(1, Math.min(1_000_000, Math.round(rawLimit)))
      : null;

  return {
    minimumPercentage: minimumPercentageBasisPoints / 100,
    minimumPercentageBasisPoints,
    maxTabSwitches,
    requireNonSuspicious,
    shortlistLimit,
  };
}

export function buildSelectionEquation(settings: SelectionSettings) {
  return `exact(score / total) >= ${settings.minimumPercentage.toFixed(2)}% AND tabSwitchCount <= ${settings.maxTabSwitches} ${
    settings.requireNonSuspicious ? "AND suspicious = false" : "AND suspicious allowed"
  } ${settings.shortlistLimit ? `AND rank <= ${settings.shortlistLimit}` : ""}`.trim();
}

export function buildSelectionRows({
  attempts,
  settings,
}: {
  attempts: AttemptForSelection[];
  settings: SelectionSettings;
}): SelectionRow[] {
  const sorted = [...attempts].sort(compareAttempts);
  let eligiblePosition = 0;

  return sorted.map((attempt) => {
    const percentageBasisPoints = ratioToBasisPoints(attempt.score, attempt.total);
    const elapsed = safeElapsedMilliseconds(attempt.startedAt, attempt.submittedAt);
    const passes =
      attempt.total > 0 &&
      percentageBasisPoints >= settings.minimumPercentageBasisPoints &&
      attempt.tabSwitchCount <= settings.maxTabSwitches &&
      (!settings.requireNonSuspicious || !attempt.suspicious);

    let rank: number | null = null;
    let status: SelectionStatus = "REJECTED";
    let reason = attempt.total <= 0
      ? "Rejected because the attempt has no scorable total."
      : "Did not satisfy the selection equation.";

    if (passes) {
      eligiblePosition += 1;
      rank = eligiblePosition;
      if (settings.shortlistLimit && rank > settings.shortlistLimit) {
        status = "WAITLISTED";
        reason = "Eligible but outside the configured shortlist limit.";
      } else {
        status = "SELECTED";
        reason = "Passed the deterministic selection equation.";
      }
    }

    return {
      attemptId: attempt.id,
      userId: attempt.user.id,
      email: attempt.user.email ?? "unknown",
      score: attempt.score,
      total: attempt.total,
      percentage: percentageBasisPoints / 100,
      percentageBasisPoints,
      elapsedMilliseconds: elapsed === Number.MAX_SAFE_INTEGER ? null : elapsed,
      suspicious: attempt.suspicious,
      tabSwitchCount: attempt.tabSwitchCount,
      submittedAt: attempt.submittedAt ? new Date(attempt.submittedAt).toISOString() : null,
      eligibleByEquation: passes,
      rank,
      status,
      reason,
    };
  });
}

function compareAttempts(a: AttemptForSelection, b: AttemptForSelection) {
  const ratioOrder = compareRatiosDescending(a.score, a.total, b.score, b.total);
  if (ratioOrder !== 0) return ratioOrder;
  if (b.score !== a.score) return b.score - a.score;

  const aElapsed = safeElapsedMilliseconds(a.startedAt, a.submittedAt);
  const bElapsed = safeElapsedMilliseconds(b.startedAt, b.submittedAt);
  if (aElapsed !== bElapsed) return aElapsed - bElapsed;

  const aSubmitted = toTimestamp(a.submittedAt);
  const bSubmitted = toTimestamp(b.submittedAt);
  if (aSubmitted !== bSubmitted) return aSubmitted - bSubmitted;

  return a.id.localeCompare(b.id, "en-US");
}

function toTimestamp(value: Date | string | null | undefined) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

function clampInteger(value: unknown, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}
