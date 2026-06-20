import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreQuizAnswers } from "@/lib/quiz/quiz-score-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      quizId?: unknown;
      answers?: unknown;
    };

    const quizId = typeof body.quizId === "string" ? body.quizId.trim() : "";
    const answers = Array.isArray(body.answers) ? body.answers : null;

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: "Quiz ID and answers are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
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
      return NextResponse.json(
        { error: "Quiz unavailable." },
        { status: 404 },
      );
    }

    if (quiz.questions.length === 0) {
      return NextResponse.json(
        { error: "Quiz has no questions." },
        { status: 400 },
      );
    }

    const result = scoreQuizAnswers({
      questions: quiz.questions,
      answers,
    });

    const earnedPoints = Math.max(0, Math.min(100, Math.round(result.percentage)));

    await prisma.$transaction(async (tx) => {
      await tx.quizAttempt.create({
        data: {
          score: result.score,
          total: result.total,
          percentage: result.percentage,
          category: quiz.category,
          userId: user.id,
        },
      });

      await tx.submission.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          score: result.score,
        },
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
    });

    return NextResponse.json({
      success: true,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      earnedPoints,
      meta: {
        answeredCount: result.answeredCount,
        unansweredCount: result.unansweredCount,
        duplicateAnswerCount: result.duplicateAnswerCount,
        unknownQuestionCount: result.unknownQuestionCount,
        invalidAnswerCount: result.invalidAnswerCount,
      },
    });
  } catch (error) {
    console.error("SECURE QUIZ SUBMIT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit quiz." },
      { status: 500 },
    );
  }
}