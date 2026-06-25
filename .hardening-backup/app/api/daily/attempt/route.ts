import { calculateOmniScore } from "@/lib/engineering-system";
import { prisma } from "@/lib/prisma";
import {
  scoreDailyAnswers,
  type DailyScoringQuestion,
} from "@/lib/daily-challenge/daily-score-engine";
import { requireApiUser } from "@/lib/server/api-auth";
import {
  apiError,
  apiOk,
  cleanString,
  readJsonObject,
} from "@/lib/server/api-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POINTS_PER_CORRECT_ANSWER = 10;
const SUBMISSION_GRACE_MS = 5000;

export async function POST(request: Request) {
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
    const answers = Array.isArray(parsed.data.answers)
      ? parsed.data.answers
      : null;

    if (!challengeId || !answers) {
      return apiError(
        "Challenge ID and answers are required.",
        400,
        "INVALID_PAYLOAD",
      );
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
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

    if (!challenge || !challenge.isPublished) {
      return apiError("Challenge unavailable.", 404, "CHALLENGE_UNAVAILABLE");
    }

    if (challenge.questions.length === 0) {
      return apiError(
        "Challenge has no questions.",
        400,
        "EMPTY_CHALLENGE",
      );
    }

    const existingAttempt = await prisma.dailyAttempt.findFirst({
      where: {
        userId: user.id,
        challengeId,
      },
      select: {
        id: true,
        completed: true,
        expiresAt: true,
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
      return apiError(
        "Challenge already submitted.",
        409,
        "ALREADY_SUBMITTED",
      );
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

    if (now > latestAllowedSubmission) {
      return apiError("Challenge time expired.", 400, "TIME_EXPIRED");
    }

    const scoreResult = scoreDailyAnswers({
      questions: challenge.questions satisfies DailyScoringQuestion[],
      answers,
    });

    const earnedPoints = scoreResult.score * POINTS_PER_CORRECT_ANSWER;

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

      const averageAccuracy =
        (previousAccuracy * previousCompletedDays + scoreResult.percentage) /
        completedDays;

      const consistencyScore = Math.min(100, previousConsistency + 0.5);

      const totalPoints = previousTotalPoints + earnedPoints;

      const omniScore = calculateOmniScore({
        averageAccuracy,
        consistencyScore,
        completedDays,
        totalPoints,
      });

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
      earnedPoints,
      meta: {
        answeredCount: scoreResult.answeredCount,
        unansweredCount: scoreResult.unansweredCount,
        duplicateAnswerCount: scoreResult.duplicateAnswerCount,
        unknownQuestionCount: scoreResult.unknownQuestionCount,
        invalidAnswerCount: scoreResult.invalidAnswerCount,
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