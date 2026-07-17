import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  hasQuizExpired,
  MAX_TAB_SWITCHES_BEFORE_SUSPICIOUS,
  normalizeTabSwitchCount,
} from "@/lib/quiz/quiz-policy";
import {
  normalizeQuizAnswers,
  scoreQuizAnswers,
} from "@/lib/quiz/quiz-score-engine";
import { normalizeQuizAnswerArray, normalizeQuizId } from "@/lib/quiz/quiz-request";
import { guardMutationRequest } from "@/lib/server/route-hardening";
import { readJsonObject } from "@/lib/server/api-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "quiz-submit",
    limit: 30,
    maxBytes: 256 * 1024,
  });

  if (guarded) return guarded;

  const session = await getServerSession(authOptions);
  const userEmail =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await readJsonObject(request);

  if (parsed.response) {
    return parsed.response;
  }

  const body = parsed.data;
  const quizId = normalizeQuizId(body.quizId);
  const normalizedAnswers = normalizeQuizAnswers(
    normalizeQuizAnswerArray(body.answers),
  );
  const tabSwitchCount = normalizeTabSwitchCount(body.tabSwitchCount);
  const now = new Date();

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: {
        userId: user.id,
        quizId,
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

  if (!attempt) {
    return NextResponse.json(
      {
        error: "Start the protected test before submitting.",
      },
      {
        status: 409,
      },
    );
  }

  if (attempt.completed) {
    return NextResponse.json(
      {
        success: true,
        idempotentReplay: true,
        score: attempt.score,
        total: attempt.total,
        percentage: attempt.percentage,
        earnedPoints: attempt.suspicious ? 0 : Math.max(0, Math.min(100, Math.round(attempt.percentage))),
        suspicious: attempt.suspicious,
        redirectTo: `/quiz/selection-result/${quizId}`,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      category: true,
      isActive: true,
      questions: {
        select: {
          id: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          correctAnswer: true,
          points: true,
        },
      },
    },
  });

  if (!quiz || !quiz.isActive) {
    return NextResponse.json({ error: "Quiz unavailable." }, { status: 404 });
  }

  const expired = hasQuizExpired(attempt.expiresAt, now);
  const suspicious =
    expired || tabSwitchCount >= MAX_TAB_SWITCHES_BEFORE_SUSPICIOUS;

  const result = scoreQuizAnswers({
    questions: quiz.questions,
    answers: normalizedAnswers,
  });

  const earnedPoints = suspicious
    ? 0
    : Math.max(0, Math.min(100, Math.round(result.percentageBasisPoints / 100)));

  try {
    await prisma.$transaction(async (tx) => {
      const lock = await tx.quizAttempt.updateMany({
        where: {
          id: attempt.id,
          completed: false,
        },
        data: {
          score: result.score,
          total: result.total,
          percentage: result.percentage,
          completed: true,
          submittedAt: now,
          suspicious,
          tabSwitchCount,
          answersJson: JSON.stringify(
            Object.fromEntries(
              normalizedAnswers.map((answer) => [
                answer.questionId,
                answer.selectedAnswer,
              ]),
            ),
          ),
          selectionStatus: "PENDING",
          selectionRank: null,
          selectionEvaluatedAt: null,
        },
      });

      if (lock.count !== 1) {
        throw new Error("ATTEMPT_ALREADY_FINALIZED");
      }

      await tx.submission.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          score: result.score,
        },
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
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ATTEMPT_ALREADY_FINALIZED"
    ) {
      return NextResponse.json(
        {
          error: "Test already submitted.",
          redirectTo: `/quiz/selection-result/${quizId}`,
        },
        {
          status: 409,
        },
      );
    }

    throw error;
  }

  return NextResponse.json(
    {
      success: true,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      percentageBasisPoints: result.percentageBasisPoints,
      earnedPoints,
      expired,
      suspicious,
      redirectTo: `/quiz/selection-result/${quizId}`,
      meta: {
        answeredCount: result.answeredCount,
        unansweredCount: result.unansweredCount,
        duplicateAnswerCount: result.duplicateAnswerCount,
        unknownQuestionCount: result.unknownQuestionCount,
        invalidAnswerCount: result.invalidAnswerCount,
        tabSwitchCount,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
