import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const homepageDomainCount = 12;

export type HomepageStats = {
  activeStudents: number;
  colleges: number;
  competitions: number;
  domains: number;
  ecosystems: number;
  source: "database" | "fallback";
};

export const fallbackHomepageStats: HomepageStats = {
  activeStudents: 0,
  colleges: 0,
  competitions: 0,
  domains: homepageDomainCount,
  ecosystems: 1,
  source: "fallback",
};

export async function getHomepageStats(): Promise<HomepageStats> {
  try {
    const [
      onboardedStudents,
      allStudents,
      studentColleges,
      quizzes,
      dailyChallenges,
    ] = await prisma.$transaction([
      prisma.user.count({
        where: {
          role: UserRole.STUDENT,
          isOnboarded: true,
        },
      }),

      prisma.user.count({
        where: {
          role: UserRole.STUDENT,
        },
      }),

      prisma.user.findMany({
        where: {
          role: UserRole.STUDENT,
          college: {
            not: null,
          },
        },
        select: {
          college: true,
        },
        distinct: ["college"],
      }),

      prisma.quiz.count(),
      prisma.dailyChallenge.count(),
    ]);

    const activeStudents =
      onboardedStudents > 0 ? onboardedStudents : allStudents;

    const collegeCount = studentColleges.filter(
      (record) => record.college?.trim(),
    ).length;

    return {
      activeStudents,
      colleges: collegeCount,
      competitions: quizzes + dailyChallenges,
      domains: homepageDomainCount,
      ecosystems: 1,
      source: "database",
    };
  } catch {
    return fallbackHomepageStats;
  }
}