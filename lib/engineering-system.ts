export function calculateOmniScore({
  averageAccuracy,
  consistencyScore,
  completedDays,
  totalPoints,
}: {
  averageAccuracy: number;
  consistencyScore: number;
  completedDays: number;
  totalPoints: number;
}) {
  const completionWeight = Math.min(100, (completedDays / 30) * 100);

  const omniScore =
    averageAccuracy * 0.4 +
    consistencyScore * 0.25 +
    completionWeight * 0.15 +
    Math.min(100, totalPoints / 10) * 0.2;

  return Number(omniScore.toFixed(2));
}

export function determineEngineeringTier(score: number) {
  if (score >= 95) {
    return {
      tier: "Grandmaster Engineer",
      level: "LEVEL 7",
      badge: "⚡",
    };
  }

  if (score >= 85) {
    return {
      tier: "Elite Engineer",
      level: "LEVEL 6",
      badge: "🚀",
    };
  }

  if (score >= 75) {
    return {
      tier: "Advanced Engineer",
      level: "LEVEL 5",
      badge: "🔥",
    };
  }

  if (score >= 60) {
    return {
      tier: "Professional Engineer",
      level: "LEVEL 4",
      badge: "💠",
    };
  }

  if (score >= 45) {
    return {
      tier: "Competitive Engineer",
      level: "LEVEL 3",
      badge: "🛡️",
    };
  }

  if (score >= 30) {
    return {
      tier: "Emerging Engineer",
      level: "LEVEL 2",
      badge: "✨",
    };
  }

  return {
    tier: "Foundation Engineer",
    level: "LEVEL 1",
    badge: "📘",
  };
}

export function calculateProtectedStreak({
  currentStreak,
  completedDays,
}: {
  currentStreak: number;
  completedDays: number;
}) {
  const protectedCycles = Math.floor(completedDays / 7);

  return {
    protectedStreak: protectedCycles,
    currentStreak,
  };
}
