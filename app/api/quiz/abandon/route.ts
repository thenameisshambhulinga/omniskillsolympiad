import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeQuizAnswers, scoreQuizAnswers } from "@/lib/quiz/quiz-score-engine";
import { normalizeTabSwitchCount } from "@/lib/quiz/quiz-policy";
import { normalizeQuizAnswerArray, normalizeQuizId } from "@/lib/quiz/quiz-request";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "quiz-abandon",
    limit: 30,
    maxBytes: 256 * 1024,
  });

  if (guarded) return guarded;

  const session = await getServerSession(authOptions);

  const userEmail =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  if (!userEmail) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    quizId?: unknown;
    answers?: unknown;
    tabSwitchCount?: unknown;
    reason?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const quizId = normalizeQuizId(body.quizId);

  if (!quizId) {
    return NextResponse.json({ ok: false, error: "quizId is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
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
    },
  });

  if (!attempt || attempt.completed) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
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

  if (!quiz) {
    return NextResponse.json({ ok: false, error: "Quiz not found." }, { status: 404 });
  }

  const normalizedAnswers = normalizeQuizAnswers(
    normalizeQuizAnswerArray(body.answers),
  );
  const tabSwitchCount = normalizeTabSwitchCount(body.tabSwitchCount);

  const result = scoreQuizAnswers({
    questions: quiz.questions,
    answers: normalizedAnswers,
  });

  const now = new Date();

  const lock = await prisma.quizAttempt.updateMany({
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
      suspicious: true,
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

  return NextResponse.json({
    ok: true,
    abandoned: lock.count === 1,
    redirectTo: `/quiz/selection-result/${quizId}`,
  });
}
