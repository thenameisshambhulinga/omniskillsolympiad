import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { publicDailyChallengeWhere } from "@/lib/daily-challenge/public-challenge-visibility";
import { requireApiUser } from "@/lib/server/api-auth";
import {
  apiError,
  apiOk,
  cleanString,
  readJsonObject,
} from "@/lib/server/api-response";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CHALLENGE_DURATION_MINUTES = 2;

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "daily-start",
    limit: 45,
  });

  if (guarded) return guarded;

  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const { user } = auth;

    if (user.seasonProgress?.eliminated) {
      return apiError(
        "You are eliminated from this season.",
        403,
        "SEASON_ELIMINATED",
      );
    }

    if (user.seasonProgress?.championBlocked) {
      return apiError(
        "Previous champions cannot compete again.",
        403,
        "CHAMPION_BLOCKED",
      );
    }

    const parsed = await readJsonObject(request);

    if (parsed.response) {
      return parsed.response;
    }

    const challengeId = cleanString(parsed.data.challengeId, 200);

    if (!challengeId) {
      return apiError("Challenge ID is required.", 400, "CHALLENGE_ID_REQUIRED");
    }

    const challenge = await prisma.dailyChallenge.findFirst({
      where: {
        id: challengeId,
        ...publicDailyChallengeWhere,
      },
      select: {
        id: true,
        dayNumber: true,
        title: true,
        isPublished: true,
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!challenge) {
      return apiError(
        "Challenge is not available for students yet.",
        404,
        "CHALLENGE_NOT_AVAILABLE",
      );
    }

    const existingAttempt = await prisma.dailyAttempt.findUnique({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId,
        },
      },
      select: {
        id: true,
        completed: true,
        score: true,
        total: true,
        percentage: true,
        expiresAt: true,
        submittedAt: true,
      },
    });

    if (existingAttempt?.completed) {
      return apiError("Challenge already completed", 409, "ALREADY_COMPLETED", {
        score: existingAttempt.score,
        total: existingAttempt.total,
        percentage: existingAttempt.percentage,
        submittedAt: existingAttempt.submittedAt,
      });
    }

    const now = new Date();

    if (existingAttempt?.expiresAt) {
      const remainingMs = existingAttempt.expiresAt.getTime() - now.getTime();

      if (remainingMs > 0) {
        return apiOk({
          attemptId: existingAttempt.id,
          resumed: true,
          expiresAt: existingAttempt.expiresAt,
          remainingMs,
          durationMs: CHALLENGE_DURATION_MINUTES * 60 * 1000,
          serverNow: now.toISOString(),
        });
      }

      return apiError(
        "Challenge time expired",
        403,
        "ATTEMPT_EXPIRED",
        {
          attemptId: existingAttempt.id,
          expiresAt: existingAttempt.expiresAt,
        },
      );
    }

    const expiresAt = new Date(
      now.getTime() + CHALLENGE_DURATION_MINUTES * 60 * 1000,
    );

    try {
      const newAttempt = await prisma.dailyAttempt.create({
        data: {
          userId: user.id,
          challengeId,
          challengeDay: challenge.dayNumber,
          score: 0,
          total: challenge.questions.length,
          percentage: 0,
          completed: false,
          expiresAt,
        },
        select: {
          id: true,
        },
      });

      return apiOk({
        attemptId: newAttempt.id,
        resumed: false,
        expiresAt,
        remainingMs: Math.max(0, expiresAt.getTime() - Date.now()),
        durationMs: CHALLENGE_DURATION_MINUTES * 60 * 1000,
        serverNow: now.toISOString(),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const activeAttempt = await prisma.dailyAttempt.findUnique({
          where: {
            userId_challengeId: {
              userId: user.id,
              challengeId,
            },
          },
          select: {
            id: true,
            completed: true,
            expiresAt: true,
          },
        });

        if (activeAttempt?.completed) {
          return apiError(
            "Challenge already completed",
            409,
            "ALREADY_COMPLETED",
          );
        }

        if (activeAttempt?.expiresAt) {
          return apiOk({
            attemptId: activeAttempt.id,
            resumed: true,
            expiresAt: activeAttempt.expiresAt,
            remainingMs: Math.max(
              0,
              activeAttempt.expiresAt.getTime() - Date.now(),
            ),
            durationMs: CHALLENGE_DURATION_MINUTES * 60 * 1000,
            serverNow: new Date().toISOString(),
          });
        }
      }

      throw error;
    }
  } catch (error) {
    console.error("DAILY START ERROR:", error);

    return apiError(
      "Failed to start challenge.",
      500,
      "DAILY_START_FAILED",
    );
  }
}