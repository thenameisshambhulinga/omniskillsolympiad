import type { Prisma } from "@prisma/client";

export const publicDailyChallengeWhere = {
  isPublished: true,
  questions: {
    some: {},
  },
} satisfies Prisma.DailyChallengeWhereInput;

export const studentDailyChallengeOrderBy = [
  {
    dayNumber: "desc",
  },
  {
    createdAt: "desc",
  },
] satisfies Prisma.DailyChallengeOrderByWithRelationInput[];

export function getStudentDailyChallengePath(challengeId: string) {
  return `/daily-challenges/${challengeId}`;
}
