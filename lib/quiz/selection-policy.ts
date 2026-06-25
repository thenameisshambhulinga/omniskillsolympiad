export type SelectionStatus = "PENDING" | "SELECTED" | "WAITLISTED" | "REJECTED";

export type SelectionSettings = {
  minimumPercentage: number;
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
  submittedAt: Date | string | null;
  user: {
    id: string;
    email: string | null;
  };
};

export type SelectionRow = {
  attemptId: string;
  userId: string;
  email: string;
  score: number;
  total: number;
  percentage: number;
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
  const minimumPercentage = clampNumber(input.minimumPercentage, 0, 100, 60);
  const maxTabSwitches = clampNumber(input.maxTabSwitches, 0, 999, 4);
  const requireNonSuspicious =
    typeof input.requireNonSuspicious === "boolean"
      ? input.requireNonSuspicious
      : true;

  const rawLimit = Number(input.shortlistLimit);
  const shortlistLimit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.round(rawLimit) : null;

  return {
    minimumPercentage,
    maxTabSwitches,
    requireNonSuspicious,
    shortlistLimit,
  };
}

export function buildSelectionEquation(settings: SelectionSettings) {
  return `percentage >= ${settings.minimumPercentage} AND tabSwitchCount <= ${settings.maxTabSwitches} ${
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
  const sorted = [...attempts].sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;

    const aTime = a.submittedAt
      ? new Date(a.submittedAt).getTime()
      : Number.MAX_SAFE_INTEGER;

    const bTime = b.submittedAt
      ? new Date(b.submittedAt).getTime()
      : Number.MAX_SAFE_INTEGER;

    return aTime - bTime;
  });

  let rankCounter = 0;

  return sorted.map((attempt) => {
    const passes =
      attempt.percentage >= settings.minimumPercentage &&
      attempt.tabSwitchCount <= settings.maxTabSwitches &&
      (!settings.requireNonSuspicious || !attempt.suspicious);

    let rank: number | null = null;
    let status: SelectionStatus = "REJECTED";
    let reason = "Did not satisfy filtration equation.";

    if (passes) {
      rankCounter += 1;
      rank = rankCounter;

      if (settings.shortlistLimit && rank > settings.shortlistLimit) {
        status = "WAITLISTED";
        reason = "Eligible but outside shortlist limit.";
      } else {
        status = "SELECTED";
        reason = "Passed filtration equation.";
      }
    }

    return {
      attemptId: attempt.id,
      userId: attempt.user.id,
      email: attempt.user.email ?? "unknown",
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      suspicious: attempt.suspicious,
      tabSwitchCount: attempt.tabSwitchCount,
      submittedAt: attempt.submittedAt
        ? new Date(attempt.submittedAt).toISOString()
        : null,
      eligibleByEquation: passes,
      rank,
      status,
      reason,
    };
  });
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.max(min, Math.min(max, Number(parsed.toFixed(2))));
}
