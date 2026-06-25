import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  buildSelectionEquation,
  buildSelectionRows,
  normalizeSelectionSettings,
} from "@/lib/quiz/selection-policy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    quizId: string;
  }>;
};

async function getSelectionSnapshot(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      title: true,
      isSelectionTest: true,
      selectionMinimumPercentage: true,
      selectionMaxTabSwitches: true,
      selectionRequireNonSuspicious: true,
      selectionShortlistLimit: true,
    },
  });

  if (!quiz) {
    return null;
  }

  const settings = {
    minimumPercentage: quiz.selectionMinimumPercentage,
    maxTabSwitches: quiz.selectionMaxTabSwitches,
    requireNonSuspicious: quiz.selectionRequireNonSuspicious,
    shortlistLimit: quiz.selectionShortlistLimit,
  };

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      quizId,
      completed: true,
    },
    orderBy: [
      {
        percentage: "desc",
      },
      {
        submittedAt: "asc",
      },
    ],
    select: {
      id: true,
      score: true,
      total: true,
      percentage: true,
      suspicious: true,
      tabSwitchCount: true,
      submittedAt: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  const rows = buildSelectionRows({
    attempts,
    settings,
  });

  return {
    quiz,
    settings,
    equation: buildSelectionEquation(settings),
    rows,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  await requireAdmin();

  const { quizId } = await context.params;
  const snapshot = await getSelectionSnapshot(quizId);

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        error: "Quiz not found.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      ...snapshot,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();

  const { quizId } = await context.params;

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

  const settings = normalizeSelectionSettings({
    minimumPercentage: body.minimumPercentage,
    maxTabSwitches: body.maxTabSwitches,
    requireNonSuspicious: body.requireNonSuspicious,
    shortlistLimit: body.shortlistLimit,
  });

  await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      isSelectionTest: true,
      selectionMinimumPercentage: settings.minimumPercentage,
      selectionMaxTabSwitches: settings.maxTabSwitches,
      selectionRequireNonSuspicious: settings.requireNonSuspicious,
      selectionShortlistLimit: settings.shortlistLimit,
    },
  });

  const snapshot = await getSelectionSnapshot(quizId);

  return NextResponse.json({
    ok: true,
    ...snapshot,
  });
}

export async function POST(_request: Request, context: RouteContext) {
  await requireAdmin();

  const { quizId } = await context.params;
  const snapshot = await getSelectionSnapshot(quizId);

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        error: "Quiz not found.",
      },
      {
        status: 404,
      },
    );
  }

  const evaluatedAt = new Date();

  await prisma.$transaction(
    snapshot.rows.map((row) =>
      prisma.quizAttempt.update({
        where: {
          id: row.attemptId,
        },
        data: {
          selectionStatus: row.status,
          selectionRank: row.rank,
          selectionEvaluatedAt: evaluatedAt,
        },
      }),
    ),
  );

  const refreshed = await getSelectionSnapshot(quizId);

  return NextResponse.json({
    ok: true,
    evaluatedAt: evaluatedAt.toISOString(),
    ...refreshed,
  });
}
