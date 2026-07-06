export interface EngineeringTierResult {
  level: string;
  tier: string;
  badgeColor: string;
}

export function calculateEngineeringTier(
  omniScore: number,
): EngineeringTierResult {
  if (omniScore >= 1500) {
    return {
      level: "Elite Engineer",
      tier: "Titanium",
      badgeColor: "from-yellow-400 to-orange-500",
    };
  }

  if (omniScore >= 900) {
    return {
      level: "Level 5",
      tier: "Diamond",
      badgeColor: "from-cyan-400 to-blue-500",
    };
  }

  if (omniScore >= 500) {
    return {
      level: "Level 4",
      tier: "Platinum",
      badgeColor: "from-purple-400 to-pink-500",
    };
  }

  if (omniScore >= 250) {
    return {
      level: "Level 3",
      tier: "Gold",
      badgeColor: "from-yellow-300 to-yellow-500",
    };
  }

  if (omniScore >= 100) {
    return {
      level: "Level 2",
      tier: "Silver",
      badgeColor: "from-gray-300 to-gray-500",
    };
  }

  return {
    level: "Level 1",
    tier: "Bronze",
    badgeColor: "from-orange-400 to-orange-700",
  };
}
