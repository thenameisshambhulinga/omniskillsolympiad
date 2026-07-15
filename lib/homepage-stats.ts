import { UserRole } from "@prisma/client";

import { skillSchools } from "@/data/omni-ecosystem";
import { prisma } from "@/lib/prisma";

export const homepageDomainCount = new Set(
  skillSchools.flatMap((school) => school.domains),
).size;

export type HomepageStats = {
  activeStudents: number;
  colleges: number;
  competitions: number;
  domains: number;
  ecosystems: number;
  source: "database" | "fallback";
};

export const fallbackHomepageStats: HomepageStats = {
  activeStudents: 25_000,
  colleges: 150,
  competitions: 30,
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

    const competitionCount = quizzes + dailyChallenges;
    const databaseBacked =
      activeStudents > 0 ||
      collegeCount > 0 ||
      competitionCount > 0;

    return {
      activeStudents:
        activeStudents > 0
          ? activeStudents
          : fallbackHomepageStats.activeStudents,
      colleges:
        collegeCount > 0
          ? collegeCount
          : fallbackHomepageStats.colleges,
      competitions:
        competitionCount > 0
          ? competitionCount
          : fallbackHomepageStats.competitions,
      domains: homepageDomainCount,
      ecosystems: 1,
      source: databaseBacked ? "database" : "fallback",
    };
  } catch {
    return fallbackHomepageStats;
  }
}
