import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { classifyInfrastructureError } from "@/lib/server/connectivity-errors";
import { logInfrastructureWarning } from "@/lib/server/rate-limited-log";
import {
  MAX_PROTECTED_TEST_QUESTIONS,
  MIN_PROTECTED_TEST_QUESTIONS,
} from "@/lib/quiz/quiz-policy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {

      const session = await getServerSession(authOptions);

      const user = session?.user?.email
        ? await prisma.user.findUnique({
            where: {
              email: session.user.email,
            },
            select: {
              id: true,
            },
          })
        : null;

      const quizzes = await prisma.quiz.findMany({
        where: {
          isActive: true,
          duration: 30,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          duration: true,
          totalPoints: true,
          isSelectionTest: true,
          _count: {
            select: {
              questions: true,
              submissions: true,
            },
          },
        },
      });

      const quizIds = quizzes.map((quiz) => quiz.id);

      const attempts = user
        ? await prisma.quizAttempt.findMany({
            where: {
              userId: user.id,
              quizId: {
                in: quizIds,
              },
            },
            select: {
              quizId: true,
              completed: true,
              percentage: true,
              selectionStatus: true,
              selectionRank: true,
              selectionEvaluatedAt: true,
            },
          })
        : [];

      const attemptMap = new Map(
        attempts
          .filter((attempt) => attempt.quizId)
          .map((attempt) => [attempt.quizId as string, attempt]),
      );

      const tests = quizzes
        .filter(
          (quiz) =>
            quiz._count.questions >= MIN_PROTECTED_TEST_QUESTIONS &&
            quiz._count.questions <= MAX_PROTECTED_TEST_QUESTIONS,
        )
        .map((quiz) => {
          const attempt = attemptMap.get(quiz.id);

          return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            difficulty: quiz.difficulty,
            duration: quiz.duration,
            totalPoints: quiz.totalPoints,
            questionCount: quiz._count.questions,
            submissionCount: quiz._count.submissions,
            completed: attempt?.completed ?? false,
            percentage: attempt?.percentage ?? null,
            selectionStatus: attempt?.selectionStatus ?? null,
            selectionRank: attempt?.selectionRank ?? null,
            resultAnnounced:
              Boolean(attempt?.selectionEvaluatedAt) &&
              attempt?.selectionStatus !== "PENDING",
          };
        });

      return NextResponse.json(
        {
          ok: true,
          tests,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
  } catch (error) {
    const failure = classifyInfrastructureError(error);
    logInfrastructureWarning(
      `protected-tests:${failure}`,
      "Protected tests temporarily unavailable.",
      { failure },
    );

    return NextResponse.json(
      {
        ok: false,
        tests: [],
        code: failure,
        message: "Protected tests are temporarily unavailable. Please try again shortly.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
