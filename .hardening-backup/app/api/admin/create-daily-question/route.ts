import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let body: any;

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();

      body = Object.fromEntries(formData.entries());
    }

    const {
      challengeId,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      difficulty,
    } = body;

    if (
      !challengeId ||
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !correctAnswer
    ) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        {
          error: "Challenge not found",
        },
        {
          status: 404,
        },
      );
    }

    const options = [
      optionA.trim(),
      optionB.trim(),
      optionC.trim(),
      optionD.trim(),
    ];

    const normalizedOptions = options.map((o) => o.toLowerCase().trim());

    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();

    /*
      VALIDATION 1
      Correct answer MUST exist in options
    */

    if (!normalizedOptions.includes(normalizedCorrectAnswer)) {
      return NextResponse.json(
        {
          error: "Correct answer must exactly match one of the options",
        },
        {
          status: 400,
        },
      );
    }

    /*
      VALIDATION 2
      Prevent duplicate options
    */

    const uniqueOptions = new Set(normalizedOptions);

    if (uniqueOptions.size !== 4) {
      return NextResponse.json(
        {
          error: "All options must be unique",
        },
        {
          status: 400,
        },
      );
    }

    /*
      VALIDATION 3
      Prevent duplicate question in same challenge
    */

    const duplicateQuestion = await prisma.dailyQuestion.findFirst({
      where: {
        challengeId,
        question: {
          equals: question.trim(),
          mode: "insensitive",
        },
      },
    });

    if (duplicateQuestion) {
      return NextResponse.json(
        {
          error: "A similar question already exists in this challenge",
        },
        {
          status: 400,
        },
      );
    }

    /*
      CREATE QUESTION
    */

    const createdQuestion = await prisma.dailyQuestion.create({
      data: {
        challengeId,
        question: question.trim(),

        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),

        correctAnswer: correctAnswer.trim(),

        difficulty: difficulty?.toLowerCase() || "easy",
      },
    });

    /*
      FORM SUBMISSION FLOW
    */

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/admin/challenge/${challengeId}`, req.url),
      );
    }

    return NextResponse.json({
      success: true,
      question: createdQuestion,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
