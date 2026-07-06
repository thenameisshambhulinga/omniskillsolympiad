export interface RankingScope {
  nationalRank?: number;
  stateRank?: number;
  collegeRank?: number;
}

export function getRankingLabel(rank?: number): string {
  if (!rank) {
    return "--";
  }

  if (rank === 1) {
    return "#1";
  }

  return `#${rank}`;
}
