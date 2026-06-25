import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DailyQuestionPayload = {
  challengeId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  difficulty: string;
};

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeChoice(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeDifficulty(value: unknown) {
  const difficulty = cleanString(value, 20).toLowerCase();

  if (["easy", "medium", "hard"].includes(difficulty)) {
    return difficulty;
  }

  return "easy";
}

function parsePayload(body: Record<string, unknown>): DailyQuestionPayload {
  return {
    challengeId: cleanString(body.challengeId, 200),
    question: cleanString(body.question, 5000),
    optionA: cleanString(body.optionA, 1000),
    optionB: cleanString(body.optionB, 1000),
    optionC: cleanString(body.optionC, 1000),
    optionD: cleanString(body.optionD, 1000),
    correctAnswer: cleanString(body.correctAnswer, 1000),
    difficulty: normalizeDifficulty(body.difficulty),
  };
}

function invalidPayload(payload: DailyQuestionPayload) {
  if (!payload.challengeId) return "Challenge ID is required.";
  if (payload.question.length < 5) return "Question must be at least 5 characters.";

  if (!payload.optionA || !payload.optionB || !payload.optionC || !payload.optionD) {
    return "All four options are required.";
  }

  if (!payload.correctAnswer) return "Correct answer is required.";

  const normalizedOptions = [
    payload.optionA,
    payload.optionB,
    payload.optionC,
    payload.optionD,
  ].map(normalizeChoice);

  if (new Set(normalizedOptions).size !== 4) {
    return "All options must be unique.";
  }

  if (!normalizedOptions.includes(normalizeChoice(payload.correctAnswer))) {
    return "Correct answer must exactly match one of the options.";
  }

  return "";
}

async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return {
      contentType,
      body: (await request.json()) as Record<string, unknown>,
    };
  }

  const formData = await request.formData();

  return {
    contentType,
    body: Object.fromEntries(formData.entries()),
  };
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-daily-question",
    limit: 120,
    maxBytes: 768 * 1024,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { body, contentType } = await readBody(request);
    const payload = parsePayload(body);
    const error = invalidPayload(payload);

    if (error) {
      return jsonError(error, 400);
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: payload.challengeId,
      },
      select: {
        id: true,
      },
    });

    if (!challenge) {
      return jsonError("Challenge not found.", 404);
    }

    const duplicateQuestion = await prisma.dailyQuestion.findFirst({
      where: {
        challengeId: payload.challengeId,
        question: {
          equals: payload.question,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateQuestion) {
      return jsonError("A similar question already exists in this challenge.", 409);
    }

    const createdQuestion = await prisma.dailyQuestion.create({
      data: payload,
    });

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/admin/challenge/${payload.challengeId}`, request.url),
        {
          status: 303,
        },
      );
    }

    return jsonOk(
      {
        question: createdQuestion,
        createdBy: auth.user.email,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("ADMIN CREATE DAILY QUESTION ERROR:", error);
    return jsonError("Failed to create daily question.", 500);
  }
}
