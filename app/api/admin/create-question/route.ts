import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OptionKey = "A" | "B" | "C" | "D";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-question",
    limit: 80,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const quizId = cleanString(body.quizId, 200);
  const question = cleanString(body.question, 5000);
  const optionA = cleanString(body.optionA, 1000);
  const optionB = cleanString(body.optionB, 1000);
  const optionC = cleanString(body.optionC, 1000);
  const optionD = cleanString(body.optionD, 1000);
  const rawCorrectAnswer = cleanString(body.correctAnswer, 1000);
  const points = normalizePoints(body.points);

  if (!quizId) {
    return jsonError("quizId is required.", 400);
  }

  if (question.length < 5) {
    return jsonError("Question must be at least 5 characters.", 400);
  }

  if (!optionA || !optionB || !optionC || !optionD) {
    return jsonError("All options A-D are required.", 400);
  }

  if (!rawCorrectAnswer) {
    return jsonError("correctAnswer is required.", 400);
  }

  const options = {
    A: optionA,
    B: optionB,
    C: optionC,
    D: optionD,
  } satisfies Record<OptionKey, string>;

  const normalizedOptions = Object.values(options).map(normalizeChoice);

  if (new Set(normalizedOptions).size !== 4) {
    return jsonError("Duplicate options are not allowed.", 400);
  }

  const correctAnswer = resolveCorrectAnswer(rawCorrectAnswer, options);

  if (!correctAnswer) {
    return jsonError("Correct answer must be A/B/C/D or exactly match one option.", 400);
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
    return jsonError("Quiz not found.", 404);
  }

  const duplicateQuestion = await prisma.question.findFirst({
    where: {
      quizId,
      question: {
        equals: question,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateQuestion) {
    return jsonError("A similar question already exists in this quiz.", 409);
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

  return jsonOk(
    {
      question: created,
      createdBy: auth.user.email,
    },
    {
      status: 201,
    },
  );
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

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
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
