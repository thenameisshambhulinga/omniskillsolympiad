import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { validateProtectedQuizImport } from "@/lib/quiz/quiz-import-validator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  await requireAdmin();

  const quizzes = await prisma.quiz.findMany({
    where: {
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
      isActive: true,
      totalPoints: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          submissions: true,
          attempts: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      ok: true,
      quizzes: quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
        isActive: quiz.isActive,
        totalPoints: quiz.totalPoints,
        createdAt: quiz.createdAt.toISOString(),
        questionCount: quiz._count.questions,
        submissionCount: quiz._count.submissions,
        attemptCount: quiz._count.attempts,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  const validation = validateProtectedQuizImport({
    title: body.title,
    description: body.description,
    category: body.category,
    difficulty: body.difficulty,
    duration: body.duration,
    isActive: body.isActive,
    questionsJson: body.questionsJson,
  });

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: validation.error,
      },
      {
        status: 400,
      },
    );
  }

  const createdQuiz = await prisma.$transaction(async (tx) => {
    const quiz = await tx.quiz.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        category: validation.data.category,
        difficulty: validation.data.difficulty,
        duration: validation.data.duration,
        isActive: validation.data.isActive,
        totalPoints: validation.data.questions.reduce(
          (sum, question) => sum + question.points,
          0,
        ),
      },
      select: {
        id: true,
        title: true,
        duration: true,
      },
    });

    await tx.question.createMany({
      data: validation.data.questions.map((question) => ({
        quizId: quiz.id,
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctAnswer: question.correctAnswer,
        points: question.points,
      })),
    });

    return quiz;
  });

  return NextResponse.json(
    {
      ok: true,
      quiz: createdQuiz,
      questionCount: validation.data.questions.length,
      createdBy: admin.email,
    },
    {
      status: 201,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
