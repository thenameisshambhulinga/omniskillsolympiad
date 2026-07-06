export type RankableUser = {
  id: string;
  state: string | null;
  college: string | null;
  siliconPoints: number;
  seasonProgress?: {
    weightedRankScore: number;
  } | null;
};

export type RankSnapshot = {
  nationalRank: string;
  stateRank: string;
  collegeRank: string;
};

function getRankScore(user: RankableUser) {
  return user.seasonProgress?.weightedRankScore ?? user.siliconPoints ?? 0;
}

function calculateRank(users: RankableUser[], userId: string) {
  const sorted = [...users].sort((a, b) => getRankScore(b) - getRankScore(a));
  const index = sorted.findIndex((user) => user.id === userId);
  return `#${index >= 0 ? index + 1 : 1}`;
}

export function getRankSnapshot({
  currentUser,
  users,
}: {
  currentUser: RankableUser;
  users: RankableUser[];
}): RankSnapshot {
  const stateUsers = currentUser.state
    ? users.filter((user) => user.state === currentUser.state)
    : [currentUser];

  const collegeUsers = currentUser.college
    ? users.filter((user) => user.college === currentUser.college)
    : [currentUser];

  return {
    nationalRank: calculateRank(users, currentUser.id),
    stateRank: calculateRank(
      stateUsers.length ? stateUsers : [currentUser],
      currentUser.id,
    ),
    collegeRank: calculateRank(
      collegeUsers.length ? collegeUsers : [currentUser],
      currentUser.id,
    ),
  };
}
