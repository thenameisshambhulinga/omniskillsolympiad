import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getQuizDurationMs,
  getRemainingMs,
  hasQuizExpired,
  isProtectedTestReady,
  PROTECTED_TEST_DURATION_MINUTES,
} from "@/lib/quiz/quiz-policy";
import { requireApiOnboardedUser } from "@/lib/server/api-auth";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseSavedAnswers(value: string | null) {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "quiz-start",
    limit: 40,
  });

  if (guarded) return guarded;

  const auth = await requireApiOnboardedUser();

  if (auth.response) {
    return auth.response;
  }

  const { user } = auth;

  let body: { quizId?: unknown };

  try {
    body = (await request.json()) as { quizId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const quizId = typeof body.quizId === "string" ? body.quizId.trim() : "";

  if (!quizId) {
    return NextResponse.json({ error: "quizId is required." }, { status: 400 });
  }

  const now = new Date();


  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      category: true,
      duration: true,
      isActive: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!quiz || !quiz.isActive) {
    return NextResponse.json({ error: "Quiz unavailable." }, { status: 404 });
  }

  if (!isProtectedTestReady(quiz._count.questions)) {
    return NextResponse.json(
      {
        error:
          "Protected test must contain 40 to 50 questions before students can start.",
      },
      { status: 400 },
    );
  }

  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: {
        userId: user.id,
        quizId: quiz.id,
      },
    },
    select: {
      id: true,
      completed: true,
      expiresAt: true,
      durationMinutes: true,
      answersJson: true,
      tabSwitchCount: true,
    },
  });

  if (existingAttempt?.completed) {
    return NextResponse.json(
      {
        error: "Test already submitted.",
        redirectTo: `/quiz/selection-result/${quiz.id}`,
      },
      { status: 409 },
    );
  }

  if (existingAttempt && hasQuizExpired(existingAttempt.expiresAt, now)) {
    await prisma.quizAttempt.update({
      where: {
        id: existingAttempt.id,
      },
      data: {
        completed: true,
        submittedAt: existingAttempt.expiresAt ?? now,
        suspicious: true,
        selectionStatus: "PENDING",
        selectionRank: null,
        selectionEvaluatedAt: null,
      },
    });

    return NextResponse.json(
      {
        error: "Test time expired.",
        redirectTo: `/quiz/selection-result/${quiz.id}`,
      },
      { status: 409 },
    );
  }

  if (existingAttempt?.expiresAt) {
    return NextResponse.json({
      success: true,
      attemptId: existingAttempt.id,
      resumed: true,
      expiresAt: existingAttempt.expiresAt.toISOString(),
      remainingMs: getRemainingMs(existingAttempt.expiresAt, now),
      durationMs: getQuizDurationMs(existingAttempt.durationMinutes),
      savedAnswers: parseSavedAnswers(existingAttempt.answersJson),
      tabSwitchCount: existingAttempt.tabSwitchCount,
      serverNow: now.toISOString(),
    });
  }

  const durationMinutes = quiz.duration || PROTECTED_TEST_DURATION_MINUTES;
  const durationMs = getQuizDurationMs(durationMinutes);
  const expiresAt = new Date(now.getTime() + durationMs);

  try {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        category: quiz.category,
        durationMinutes,
        startedAt: now,
        expiresAt,
        score: 0,
        total: 0,
        percentage: 0,
        completed: false,
        suspicious: false,
        tabSwitchCount: 0,
        answersJson: "{}",
        selectionStatus: "PENDING",
        selectionRank: null,
        selectionEvaluatedAt: null,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      resumed: false,
      expiresAt: expiresAt.toISOString(),
      remainingMs: durationMs,
      durationMs,
      savedAnswers: {},
      tabSwitchCount: 0,
      serverNow: now.toISOString(),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const attempt = await prisma.quizAttempt.findUnique({
        where: {
          userId_quizId: {
            userId: user.id,
            quizId: quiz.id,
          },
        },
        select: {
          id: true,
          expiresAt: true,
          durationMinutes: true,
          answersJson: true,
          tabSwitchCount: true,
        },
      });

      if (attempt?.expiresAt) {
        return NextResponse.json({
          success: true,
          attemptId: attempt.id,
          resumed: true,
          expiresAt: attempt.expiresAt.toISOString(),
          remainingMs: getRemainingMs(attempt.expiresAt, now),
          durationMs: getQuizDurationMs(attempt.durationMinutes),
          savedAnswers: parseSavedAnswers(attempt.answersJson),
          tabSwitchCount: attempt.tabSwitchCount,
          serverNow: now.toISOString(),
        });
      }
    }

    throw error;
  }
}
