import { calculateOmniScore } from "@/lib/engineering-system";
import {
  basisPointsToPercentage,
  percentageToBasisPoints,
  weightedAverageBasisPoints,
} from "@/lib/math/exact-metrics";
import { prisma } from "@/lib/prisma";
import { publicDailyChallengeWhere } from "@/lib/daily-challenge/public-challenge-visibility";
import {
  scoreDailyAnswers,
  type DailyScoringQuestion,
} from "@/lib/daily-challenge/daily-score-engine";
import { requireApiOnboardedUser } from "@/lib/server/api-auth";
import {
  apiError,
  apiOk,
  cleanString,
  readJsonObject,
} from "@/lib/server/api-response";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POINTS_PER_CORRECT_ANSWER = 10;
const SUBMISSION_GRACE_MS = 5000;
const MAX_DAILY_SECURITY_VIOLATIONS = 5;

function normalizeSecurityCount(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(50, Math.round(parsed)));
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "daily-submit",
    limit: 35,
  });

  if (guarded) return guarded;

  try {
    const auth = await requireApiOnboardedUser();

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
    const answers = Array.isArray(parsed.data.answers) ? parsed.data.answers : null;
    const tabSwitchCount = normalizeSecurityCount(parsed.data.tabSwitchCount);

    if (!challengeId || !answers) {
      return apiError(
        "Challenge ID and answers are required.",
        400,
        "INVALID_PAYLOAD",
      );
    }

    const challenge = await prisma.dailyChallenge.findFirst({
      where: {
        id: challengeId,
        ...publicDailyChallengeWhere,
      },
      select: {
        id: true,
        dayNumber: true,
        isPublished: true,
        questions: {
          select: {
            id: true,
            correctAnswer: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
          },
        },
      },
    });

    if (!challenge) {
      return apiError("Challenge unavailable.", 404, "CHALLENGE_UNAVAILABLE");
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
        expiresAt: true,
        score: true,
        total: true,
        percentage: true,
        suspicious: true,
      },
    });

    if (!existingAttempt) {
      return apiError(
        "Challenge session not started.",
        400,
        "SESSION_NOT_STARTED",
      );
    }

    if (existingAttempt.completed) {
      return apiOk({
        idempotentReplay: true,
        score: existingAttempt.score,
        total: existingAttempt.total,
        percentage: existingAttempt.percentage,
        earnedPoints: existingAttempt.suspicious
          ? 0
          : existingAttempt.score * POINTS_PER_CORRECT_ANSWER,
        suspicious: existingAttempt.suspicious,
      });
    }

    if (!existingAttempt.expiresAt) {
      return apiError(
        "Challenge expiration missing.",
        400,
        "MISSING_EXPIRATION",
      );
    }

    const now = new Date();
    const expiresAt = new Date(existingAttempt.expiresAt);
    const latestAllowedSubmission = new Date(
      expiresAt.getTime() + SUBMISSION_GRACE_MS,
    );
    const expired = now > latestAllowedSubmission;
    const suspicious = tabSwitchCount >= MAX_DAILY_SECURITY_VIOLATIONS;

    if (expired) {
      return apiError("Challenge time expired.", 400, "TIME_EXPIRED");
    }

    const scoreResult = scoreDailyAnswers({
      questions: challenge.questions satisfies DailyScoringQuestion[],
      answers,
    });

    const earnedPoints = suspicious
      ? 0
      : scoreResult.score * POINTS_PER_CORRECT_ANSWER;

    await prisma.$transaction(async (tx) => {
      const finalizedAttempt = await tx.dailyAttempt.updateMany({
        where: {
          id: existingAttempt.id,
          completed: false,
        },
        data: {
          score: scoreResult.score,
          total: scoreResult.total,
          percentage: scoreResult.percentage,
          completed: true,
          submittedAt: now,
          suspicious,
          tabSwitchCount,
        },
      });

      if (finalizedAttempt.count !== 1) {
        throw new Error("ATTEMPT_ALREADY_FINALIZED");
      }

      const currentProgress = await tx.seasonProgress.findUnique({
        where: {
          userId: user.id,
        },
      });

      const previousCompletedDays = currentProgress?.completedDays ?? 0;
      const previousAccuracy = currentProgress?.averageAccuracy ?? 0;
      const previousConsistency = currentProgress?.consistencyScore ?? 100;
      const previousTotalPoints = currentProgress?.totalPoints ?? 0;
      const completedDays = previousCompletedDays + 1;
      const averageAccuracyBasisPoints = weightedAverageBasisPoints({
        previousAverageBasisPoints: percentageToBasisPoints(previousAccuracy),
        previousCount: previousCompletedDays,
        nextBasisPoints: scoreResult.percentageBasisPoints,
      });
      const averageAccuracy = basisPointsToPercentage(averageAccuracyBasisPoints);
      const consistencyScore = suspicious
        ? Math.max(0, previousConsistency - 3)
        : Math.min(100, previousConsistency + 0.5);
      const totalPoints = previousTotalPoints + earnedPoints;
      const omniScore = calculateOmniScore({
        averageAccuracy,
        consistencyScore,
        completedDays,
        totalPoints,
      });

      if (!suspicious) {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            siliconPoints: {
              increment: earnedPoints,
            },
            streak: {
              increment: 1,
            },
          },
        });
      }

      if (!currentProgress) {
        await tx.seasonProgress.create({
          data: {
            userId: user.id,
            currentDay: challenge.dayNumber + 1,
            completedDays,
            consistencyScore,
            averageAccuracy: Number(averageAccuracy.toFixed(2)),
            weightedRankScore: omniScore,
            totalPoints,
          },
        });

        return;
      }

      await tx.seasonProgress.update({
        where: {
          userId: user.id,
        },
        data: {
          currentDay: Math.max(
            currentProgress.currentDay,
            challenge.dayNumber + 1,
          ),
          completedDays,
          consistencyScore,
          averageAccuracy: Number(averageAccuracy.toFixed(2)),
          weightedRankScore: omniScore,
          totalPoints,
        },
      });
    });

    return apiOk({
      score: scoreResult.score,
      total: scoreResult.total,
      percentage: scoreResult.percentage,
      percentageBasisPoints: scoreResult.percentageBasisPoints,
      earnedPoints,
      suspicious,
      meta: {
        answeredCount: scoreResult.answeredCount,
        unansweredCount: scoreResult.unansweredCount,
        duplicateAnswerCount: scoreResult.duplicateAnswerCount,
        unknownQuestionCount: scoreResult.unknownQuestionCount,
        invalidAnswerCount: scoreResult.invalidAnswerCount,
        tabSwitchCount,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ATTEMPT_ALREADY_FINALIZED"
    ) {
      return apiError(
        "Challenge already submitted.",
        409,
        "ALREADY_SUBMITTED",
      );
    }

    console.error("DAILY ATTEMPT SUBMIT ERROR:", error);

    return apiError(
      "Failed to submit challenge.",
      500,
      "DAILY_ATTEMPT_SUBMIT_FAILED",
    );
  }
}
