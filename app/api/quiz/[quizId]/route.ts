import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: {
    params: Promise<{
      quizId: string;
    }>;
  },
) {
  try {
    const { quizId } = await context.params;

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
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
        questions: {
          select: {
            id: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            points: true,
          },
        },
      },
    });

    if (!quiz || !quiz.isActive) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("PUBLIC QUIZ FETCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch quiz." },
      { status: 500 },
    );
  }
}