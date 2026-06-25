import { getServerSession } from "next-auth";

import DailyChallengeMissionBrowser, {
  type DailyChallengeMission,
  type DailyChallengeStatus,
} from "@/components/daily-challenges/DailyChallengeMissionBrowser";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withDatabaseResult } from "@/lib/server/database-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function DailyChallengesPage() {
  const session = await getServerSession(authOptions);
  const userEmail =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  const challengeResult = await withDatabaseResult({
    label: "DailyChallengesPage.getPublishedChallengesWithAttemptState",
    action: async () => {
      const user = userEmail
        ? await prisma.user.findUnique({
            where: {
              email: userEmail,
            },
            select: {
              id: true,
            },
          })
        : null;

      const challenges = await prisma.dailyChallenge.findMany({
        where: {
          isPublished: true,
        },
        orderBy: [
          {
            dayNumber: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          dayNumber: true,
          title: true,
          description: true,
          createdAt: true,
          attempts: user
            ? {
                where: {
                  userId: user.id,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
                select: {
                  completed: true,
                  score: true,
                  total: true,
                  percentage: true,
                  submittedAt: true,
                  expiresAt: true,
                  createdAt: true,
                },
              }
            : false,
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      });

      const now = new Date();

      return challenges.map((challenge) => {
        const attempt = "attempts" in challenge ? challenge.attempts[0] : null;

        const status = getChallengeStatus({
          completed: attempt?.completed ?? false,
          expiresAt: attempt?.expiresAt ?? null,
          now,
        });

        return {
          id: challenge.id,
          dayNumber: challenge.dayNumber,
          title: challenge.title,
          description: challenge.description,
          createdAt: challenge.createdAt.toISOString(),
          questionCount: challenge._count.questions,
          attemptCount: challenge._count.attempts,
          status,
          score: attempt?.score ?? null,
          total: attempt?.total ?? null,
          percentage:
            typeof attempt?.percentage === "number"
              ? Math.round(attempt.percentage)
              : null,
          submittedAt: attempt?.submittedAt?.toISOString() ?? null,
          expiresAt: attempt?.expiresAt?.toISOString() ?? null,
        } satisfies DailyChallengeMission;
      });
    },
  });

  return (
    <DailyChallengeMissionBrowser
      challenges={challengeResult.ok ? challengeResult.data : []}
      databaseOnline={challengeResult.ok}
    />
  );
}

function getChallengeStatus({
  completed,
  expiresAt,
  now,
}: {
  completed: boolean;
  expiresAt: Date | null;
  now: Date;
}): DailyChallengeStatus {
  if (completed) {
    return "completed";
  }

  if (expiresAt && expiresAt.getTime() > now.getTime()) {
    return "in-progress";
  }

  if (expiresAt && expiresAt.getTime() <= now.getTime()) {
    return "expired";
  }

  return "unattempted";
}