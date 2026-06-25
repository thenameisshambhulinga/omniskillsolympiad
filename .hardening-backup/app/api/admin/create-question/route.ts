import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OptionKey = "A" | "B" | "C" | "D";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    const quizId = cleanString(body.quizId, 200);
    const question = cleanString(body.question, 5000);
    const optionA = cleanString(body.optionA, 1000);
    const optionB = cleanString(body.optionB, 1000);
    const optionC = cleanString(body.optionC, 1000);
    const optionD = cleanString(body.optionD, 1000);
    const rawCorrectAnswer = cleanString(body.correctAnswer, 1000);
    const points = normalizePoints(body.points);

    if (!quizId) {
      return NextResponse.json({ error: "quizId is required." }, { status: 400 });
    }

    if (question.length < 5) {
      return NextResponse.json(
        { error: "Question must be at least 5 characters." },
        { status: 400 },
      );
    }

    if (!optionA || !optionB || !optionC || !optionD) {
      return NextResponse.json(
        { error: "All options A-D are required." },
        { status: 400 },
      );
    }

    if (!rawCorrectAnswer) {
      return NextResponse.json(
        { error: "correctAnswer is required." },
        { status: 400 },
      );
    }

    const options = {
      A: optionA,
      B: optionB,
      C: optionC,
      D: optionD,
    } satisfies Record<OptionKey, string>;

    const normalizedOptions = Object.values(options).map(normalizeChoice);

    if (new Set(normalizedOptions).size !== 4) {
      return NextResponse.json(
        { error: "Duplicate options are not allowed." },
        { status: 400 },
      );
    }

    const correctAnswer = resolveCorrectAnswer(rawCorrectAnswer, options);

    if (!correctAnswer) {
      return NextResponse.json(
        { error: "Correct answer must be A/B/C/D or exactly match one option." },
        { status: 400 },
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        id: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const questionRecord = await tx.question.create({
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

      await tx.quiz.update({
        where: {
          id: quizId,
        },
        data: {
          totalPoints: {
            increment: questionRecord.points,
          },
        },
      });

      return questionRecord;
    });

    return NextResponse.json({
      success: true,
      question: created,
    });
  } catch (error) {
    console.error("ADMIN CREATE QUIZ QUESTION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create question." },
      { status: 500 },
    );
  }
}

function resolveCorrectAnswer(
  value: string,
  options: Record<OptionKey, string>,
): string | null {
  const normalizedValue = normalizeChoice(value);
  const upperValue = value.trim().toUpperCase();

  if (isOptionKey(upperValue)) {
    return options[upperValue];
  }

  const matchedOption = Object.values(options).find(
    (option) => normalizeChoice(option) === normalizedValue,
  );

  return matchedOption ?? null;
}

function isOptionKey(value: string): value is OptionKey {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
}

function normalizeChoice(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizePoints(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.min(100, Math.round(parsed)));
}