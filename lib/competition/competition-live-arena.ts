export type CompetitionArenaStatus = "READY" | "IN_PROGRESS" | "COMPLETED";

export type CompetitionArenaTone =
  | "blue"
  | "cyan"
  | "emerald"
  | "yellow"
  | "slate"
  | "rose";

export type CompetitionLiveArena = {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  href: string;
  questionCount: number;
  attemptCount: number;
  difficultyLabel: string;
  status: CompetitionArenaStatus;
  statusLabel: string;
  statusTone: CompetitionArenaTone;
  progressPercent: number;
  scoreLabel: string;
  updatedLabel: string;
  primaryCta: string;
  insight: string;
};

type LiveChallengeAttempt = {
  completed: boolean;
  percentage: number;
  score: number;
  total: number;
  createdAt: Date | string;
  submittedAt: Date | string | null;
  expiresAt?: Date | string | null;
};

type LiveChallengeRecord = {
  id: string;
  dayNumber: number;
  title: string;
  description: string | null;
  createdAt: Date | string;
  questions: Array<{
    difficulty: string;
  }>;
  attempts: LiveChallengeAttempt[];
  _count?: {
    attempts: number;
  };
};

export function buildCompetitionLiveArena(
  challenge: LiveChallengeRecord,
): CompetitionLiveArena {
  const attempt = challenge.attempts[0] ?? null;
  const questionCount = challenge.questions.length;
  const completed = attempt?.completed === true;
  const inProgress = Boolean(attempt) && !completed;

  const status: CompetitionArenaStatus = completed
    ? "COMPLETED"
    : inProgress
      ? "IN_PROGRESS"
      : "READY";

  const progressPercent = completed
    ? clampPercent(attempt?.percentage ?? 0)
    : inProgress
      ? 45
      : 0;

  return {
    id: challenge.id,
    dayNumber: challenge.dayNumber,
    title: challenge.title.trim() || `Daily Challenge ${challenge.dayNumber}`,
    description:
      challenge.description?.trim() ||
      "A live engineering mission that contributes to your competition journey.",
    href: `/daily-challenges/${challenge.id}`,
    questionCount,
    attemptCount: challenge._count?.attempts ?? 0,
    difficultyLabel: buildDifficultyLabel(
      challenge.questions.map((question) => question.difficulty),
    ),
    status,
    statusLabel: getStatusLabel(status),
    statusTone: getStatusTone(status),
    progressPercent,
    scoreLabel: completed
      ? `${Math.round(attempt?.percentage ?? 0)}%`
      : `${questionCount} question${questionCount === 1 ? "" : "s"}`,
    updatedLabel: `Published ${formatShortDate(challenge.createdAt)}`,
    primaryCta: completed
      ? "Open Summary"
      : inProgress
        ? "Resume Mission"
        : "Start Mission",
    insight: getArenaInsight({
      status,
      percentage: attempt?.percentage ?? null,
      questionCount,
    }),
  };
}

export function getRecommendedLiveArena(arenas: CompetitionLiveArena[]) {
  return (
    arenas.find((arena) => arena.status === "IN_PROGRESS") ??
    arenas.find((arena) => arena.status === "READY") ??
    arenas[0] ??
    null
  );
}

export function getCompetitionMomentumLabel({
  readinessScore,
  liveArenaCount,
}: {
  readinessScore: number;
  liveArenaCount: number;
}) {
  if (liveArenaCount === 0) {
    return "Waiting for live arena";
  }

  if (readinessScore >= 80) {
    return "High readiness";
  }

  if (readinessScore >= 55) {
    return "Competition building";
  }

  return "Practice mode";
}

function getStatusLabel(status: CompetitionArenaStatus) {
  if (status === "COMPLETED") return "Completed";
  if (status === "IN_PROGRESS") return "Resume";
  return "Live";
}

function getStatusTone(status: CompetitionArenaStatus): CompetitionArenaTone {
  if (status === "COMPLETED") return "emerald";
  if (status === "IN_PROGRESS") return "yellow";
  return "blue";
}

function getArenaInsight({
  status,
  percentage,
  questionCount,
}: {
  status: CompetitionArenaStatus;
  percentage: number | null;
  questionCount: number;
}) {
  if (status === "COMPLETED") {
    return `Completed with ${Math.round(percentage ?? 0)}%. Use leaderboard to compare your standing.`;
  }

  if (status === "IN_PROGRESS") {
    return "You already started this mission. Resume it before opening another daily challenge.";
  }

  return `Fresh live arena with ${questionCount} question${
    questionCount === 1 ? "" : "s"
  }. Attempt it to create today’s ranking signal.`;
}

function buildDifficultyLabel(difficulties: string[]) {
  const normalized = difficulties
    .map((difficulty) => difficulty.trim().toLowerCase())
    .filter(Boolean);

  if (normalized.length === 0) {
    return "Mixed";
  }

  const counts = new Map<string, number>();

  for (const difficulty of normalized) {
    counts.set(difficulty, (counts.get(difficulty) ?? 0) + 1);
  }

  const [topDifficulty] = [...counts.entries()].sort(
    (first, second) => second[1] - first[1],
  )[0];

  return toTitleCase(topDifficulty);
}

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatShortDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}
