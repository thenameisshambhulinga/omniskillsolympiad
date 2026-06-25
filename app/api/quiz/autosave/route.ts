import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasQuizExpired, normalizeTabSwitchCount } from "@/lib/quiz/quiz-policy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function normalizeAnswersMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const answers: Record<string, string> = {};

  Object.entries(value as Record<string, unknown>).forEach(
    ([questionId, answer]) => {
      if (typeof questionId !== "string" || typeof answer !== "string") {
        return;
      }

      const cleanQuestionId = questionId.trim();
      const cleanAnswer = answer.trim();

      if (!cleanQuestionId || !cleanAnswer) {
        return;
      }

      answers[cleanQuestionId] = cleanAnswer;
    },
  );

  return answers;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  const userEmail =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    quizId?: unknown;
    answers?: unknown;
    tabSwitchCount?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const quizId = typeof body.quizId === "string" ? body.quizId.trim() : "";

  if (!quizId) {
    return NextResponse.json({ error: "quizId is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: {
        userId: user.id,
        quizId,
      },
    },
    select: {
      id: true,
      completed: true,
      expiresAt: true,
    },
  });

  if (!attempt) {
    return NextResponse.json(
      { error: "Start the protected test before autosave." },
      { status: 409 },
    );
  }

  if (attempt.completed) {
    return NextResponse.json({ success: true, ignored: true });
  }

  const now = new Date();

  if (hasQuizExpired(attempt.expiresAt, now)) {
    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        completed: true,
        submittedAt: attempt.expiresAt ?? now,
        suspicious: true,
      },
    });

    return NextResponse.json(
      { error: "Test time expired." },
      { status: 409 },
    );
  }

  const answers = normalizeAnswersMap(body.answers);
  const tabSwitchCount = normalizeTabSwitchCount(body.tabSwitchCount);

  await prisma.quizAttempt.update({
    where: { id: attempt.id },
    data: {
      answersJson: JSON.stringify(answers),
      tabSwitchCount,
      suspicious: tabSwitchCount >= 5,
    },
  });

  return NextResponse.json({
    success: true,
    savedAt: now.toISOString(),
  });
}
