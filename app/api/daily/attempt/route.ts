import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { evaluateStreak } from "@/lib/streak-system";

import {
  calculateOmniScore,
  determineEngineeringTier,
  calculateProtectedStreak,
} from "@/lib/engineering-system";

export async function POST(req: Request) {
  try {
    // SESSION VALIDATION

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // REQUEST BODY

    const body = await req.json();

    const {
      challengeId,
      answers,
    }: {
      challengeId: string;

      answers: {
        questionId: string;
        selectedAnswer: string;
      }[];
    } = body;

    // PAYLOAD VALIDATION

    if (!challengeId || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
        },
        {
          status: 400,
        },
      );
    }

    // USER VALIDATION

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },

      include: {
        seasonProgress: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // ELIMINATION CHECK

    if (user.seasonProgress?.eliminated) {
      return NextResponse.json(
        {
          success: false,
          error: "You are eliminated from this season",
        },
        {
          status: 403,
        },
      );
    }

    // CHAMPION BLOCK CHECK

    if (user.seasonProgress?.championBlocked) {
      return NextResponse.json(
        {
          success: false,
          error: "Previous champions cannot compete again",
        },
        {
          status: 403,
        },
      );
    }

    // CHALLENGE VALIDATION

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },

      include: {
        questions: true,
      },
    });

    if (!challenge || !challenge.isPublished) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge unavailable",
        },
        {
          status: 404,
        },
      );
    }

    // ATTEMPT SESSION VALIDATION

    const existingAttempt = await prisma.dailyAttempt.findFirst({
      where: {
        userId: user.id,
        challengeId,
      },
    });

    if (!existingAttempt) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge session not started",
        },
        {
          status: 400,
        },
      );
    }

    // DUPLICATE SUBMISSION BLOCK

    if (existingAttempt.completed) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge already submitted",
        },
        {
          status: 400,
        },
      );
    }

    // NULL TIMER SAFETY

    if (!existingAttempt.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge expiration missing",
        },
        {
          status: 400,
        },
      );
    }

    // TIMER EXPIRATION VALIDATION

    const isExpired =
      new Date().getTime() > new Date(existingAttempt.expiresAt).getTime();

    if (isExpired) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge time expired",
        },
        {
          status: 400,
        },
      );
    }

    // QUESTION MAP

    const questionMap = new Map(
      challenge.questions.map((question) => [question.id, question]),
    );

    // SCORE CALCULATION

    let score = 0;

    for (const answer of answers) {
      if (!answer?.questionId || !answer?.selectedAnswer) {
        continue;
      }

      const officialQuestion = questionMap.get(answer.questionId);

      if (!officialQuestion) {
        continue;
      }

      const normalizedSelected = answer.selectedAnswer.trim().toLowerCase();

      const normalizedCorrect = officialQuestion.correctAnswer
        .trim()
        .toLowerCase();

      if (normalizedSelected === normalizedCorrect) {
        score += 1;
      }
    }

    // FINAL METRICS

    const total = challenge.questions.length;

    const percentage =
      total === 0 ? 0 : Number(((score / total) * 100).toFixed(2));

    // DATABASE TRANSACTION

    await prisma.$transaction(async (tx) => {
      // UPDATE ATTEMPT

      await tx.dailyAttempt.update({
        where: {
          id: existingAttempt.id,
        },

        data: {
          score,
          total,
          percentage,

          completed: true,

          submittedAt: new Date(),
        },
      });

      // EVALUATE STREAK (using null for lastCompletedAt as it's not tracked in current schema)

      // EVALUATE STREAK

      const streakResult = evaluateStreak({
        currentStreak: user.streak || 0,
        lastCompletedAt: null,
      });

      // EXISTING PROGRESS

      const progress = user.seasonProgress;

      // DEFAULT VALUES IF NO PROGRESS EXISTS

      const existingCompletedDays = progress?.completedDays || 0;

      const existingAccuracy = progress?.averageAccuracy || 0;

      const existingConsistency = progress?.consistencyScore || 100;

      const existingPoints = progress?.totalPoints || 0;

      // UPDATED METRICS

      const newCompletedDays = existingCompletedDays + 1;

      const newAverageAccuracy =
        (existingAccuracy * existingCompletedDays + percentage) /
        newCompletedDays;

      const updatedConsistency = Math.min(100, existingConsistency + 0.5);

      // OMNI SCORE

      const omniScore = calculateOmniScore({
        averageAccuracy: newAverageAccuracy,
        consistencyScore: updatedConsistency,
        completedDays: newCompletedDays,
        totalPoints: existingPoints + score * 10,
      });

      // ENGINEERING TIER

      const engineeringTierResult = determineEngineeringTier(omniScore);

      // PROTECTED STREAK

      const protectedStreakData = calculateProtectedStreak({
        currentStreak: streakResult.streak + 1,
        completedDays: newCompletedDays,
      });

      // UPDATE USER

      await tx.user.update({
        where: {
          id: user.id,
        },

        data: {
          siliconPoints: {
            increment: score * 10,
          },

          streak:
            protectedStreakData.protectedStreak > 0
              ? streakResult.streak + 1
              : streakResult.reset
                ? 1
                : streakResult.streak + 1,

          bio: engineeringTierResult.tier,
        },
      });

      // CREATE SEASON PROGRESS

      if (!progress) {
        await tx.seasonProgress.create({
          data: {
            userId: user.id,

            currentDay: challenge.dayNumber + 1,

            completedDays: newCompletedDays,

            consistencyScore: updatedConsistency,

            averageAccuracy: Number(newAverageAccuracy.toFixed(2)),

            weightedRankScore: omniScore,

            totalPoints: score * 10,

            protectedStreak: protectedStreakData.protectedStreak > 0,
          },
        });
      } else {
        // UPDATE EXISTING PROGRESS

        await tx.seasonProgress.update({
          where: {
            userId: user.id,
          },

          data: {
            currentDay: Math.max(progress.currentDay, challenge.dayNumber + 1),

            completedDays: newCompletedDays,

            consistencyScore: updatedConsistency,

            averageAccuracy: Number(newAverageAccuracy.toFixed(2)),

            weightedRankScore: omniScore,

            totalPoints: {
              increment: score * 10,
            },

            protectedStreak: protectedStreakData.protectedStreak > 0,
          },
        });
      }
    });
    // SUCCESS RESPONSE

    return NextResponse.json({
      success: true,

      score,
      total,
      percentage,
    });
  } catch (error) {
    console.error("DAILY ATTEMPT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit challenge",
      },
      {
        status: 500,
      },
    );
  }
}
