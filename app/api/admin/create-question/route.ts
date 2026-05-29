import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const quizId = body.quizId?.trim();

    const question = body.question?.trim();

    const optionA = body.optionA?.trim();
    const optionB = body.optionB?.trim();
    const optionC = body.optionC?.trim();
    const optionD = body.optionD?.trim();

    const correctAnswer = body.correctAnswer?.trim();

    const points = typeof body.points === "number" ? body.points : 1;

    // REQUIRED FIELD VALIDATION

    if (!quizId) {
      return NextResponse.json(
        {
          error: "quizId is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!question) {
      return NextResponse.json(
        {
          error: "question is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!optionA || !optionB || !optionC || !optionD) {
      return NextResponse.json(
        {
          error: "All options (A-D) are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!correctAnswer) {
      return NextResponse.json(
        {
          error: "correctAnswer is required",
        },
        {
          status: 400,
        },
      );
    }

    // OPTION NORMALIZATION

    const options = [
      optionA.toLowerCase(),
      optionB.toLowerCase(),
      optionC.toLowerCase(),
      optionD.toLowerCase(),
    ];

    // DUPLICATE OPTION VALIDATION

    const uniqueOptions = new Set(options);

    if (uniqueOptions.size !== 4) {
      return NextResponse.json(
        {
          error: "Duplicate options are not allowed",
        },
        {
          status: 400,
        },
      );
    }

    // CORRECT ANSWER VALIDATION

    const normalizedCorrectAnswer = correctAnswer.toLowerCase();

    if (!options.includes(normalizedCorrectAnswer)) {
      return NextResponse.json(
        {
          error: "Correct answer must exactly match one option",
        },
        {
          status: 400,
        },
      );
    }

    // ENSURE QUIZ EXISTS

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },

      select: {
        id: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        {
          error: "Quiz not found",
        },
        {
          status: 404,
        },
      );
    }

    // CREATE QUESTION

    const created = await prisma.question.create({
      data: {
        quizId,

        question,

        optionA,
        optionB,
        optionC,
        optionD,

        correctAnswer,

        points,
      },
    });

    // UPDATE QUIZ TOTAL POINTS

    await prisma.quiz.update({
      where: {
        id: quizId,
      },

      data: {
        totalPoints: {
          increment: created.points,
        },
      },
    });

    return NextResponse.json({
      success: true,
      question: created,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create question",
      },
      {
        status: 500,
      },
    );
  }
}
