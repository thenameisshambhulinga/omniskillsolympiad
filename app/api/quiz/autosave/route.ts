import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasQuizExpired, normalizeTabSwitchCount } from "@/lib/quiz/quiz-policy";
import { normalizeQuizAnswerMap, normalizeQuizId } from "@/lib/quiz/quiz-request";
import { requireApiOnboardedUser } from "@/lib/server/api-auth";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "quiz-autosave",
    limit: 120,
    maxBytes: 256 * 1024,
  });

  if (guarded) return guarded;

  const auth = await requireApiOnboardedUser();

  if (auth.response) {
    return auth.response;
  }

  const { user } = auth;

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

  const quizId = normalizeQuizId(body.quizId);

  if (!quizId) {
    return NextResponse.json({ error: "quizId is required." }, { status: 400 });
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

  const answers = normalizeQuizAnswerMap(body.answers);
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
