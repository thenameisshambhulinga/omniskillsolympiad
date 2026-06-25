import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    quizId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();

  const { quizId } = await context.params;

  let body: {
    isActive?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
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

  if (typeof body.isActive !== "boolean") {
    return NextResponse.json(
      {
        ok: false,
        error: "isActive must be boolean.",
      },
      {
        status: 400,
      },
    );
  }

  const quiz = await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      isActive: body.isActive,
    },
    select: {
      id: true,
      title: true,
      isActive: true,
    },
  });

  return NextResponse.json({
    ok: true,
    quiz,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  await requireAdmin();

  const { quizId } = await context.params;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      _count: {
        select: {
          attempts: true,
          submissions: true,
        },
      },
    },
  });

  if (!quiz) {
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

  if (quiz._count.attempts > 0 || quiz._count.submissions > 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Cannot delete this test because attempts/submissions already exist. Deactivate it instead.",
      },
      {
        status: 409,
      },
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.question.deleteMany({
      where: {
        quizId,
      },
    });

    await tx.quiz.delete({
      where: {
        id: quizId,
      },
    });
  });

  return NextResponse.json({
    ok: true,
  });
}
