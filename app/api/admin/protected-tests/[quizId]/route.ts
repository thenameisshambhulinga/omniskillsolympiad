import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { readJsonObjectWithLimit } from "@/lib/security/request-guard";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ quizId: string }> };

function cleanId(value: string) {
  return value.trim().slice(0, 128);
}

export async function PATCH(request: Request, context: RouteContext) {
  const guarded = guardMutationRequest(request, { key: "admin-protected-test-update", limit: 40, maxBytes: 16 * 1024 });
  if (guarded) return guarded;

  const auth = await requireApiAdmin();
  if (auth.response) return auth.response;

  const quizId = cleanId((await context.params).quizId);
  if (!quizId) return jsonError("Quiz ID is required.", 400);

  const parsed = await readJsonObjectWithLimit(request, 16 * 1024);
  if (parsed.response) return parsed.response;
  if (typeof parsed.data.isActive !== "boolean") return jsonError("isActive must be boolean.", 400);

  try {
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: { isActive: parsed.data.isActive },
      select: { id: true, title: true, isActive: true },
    });
    return jsonOk({ quiz, updatedBy: auth.user.email });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return jsonError("Quiz not found.", 404);
    console.error("[ADMIN_PROTECTED_TEST_UPDATE]", error);
    return jsonError("Unable to update protected test.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guarded = guardMutationRequest(request, { key: "admin-protected-test-delete", limit: 12, maxBytes: 0 });
  if (guarded) return guarded;

  const auth = await requireApiAdmin();
  if (auth.response) return auth.response;

  const quizId = cleanId((await context.params).quizId);
  if (!quizId) return jsonError("Quiz ID is required.", 400);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true, _count: { select: { attempts: true, submissions: true } } },
  });
  if (!quiz) return jsonError("Quiz not found.", 404);
  if (quiz._count.attempts > 0 || quiz._count.submissions > 0) {
    return jsonError("Cannot delete this test because attempts or submissions exist. Deactivate it instead.", 409);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.question.deleteMany({ where: { quizId } });
      await tx.quiz.delete({ where: { id: quizId } });
    });
    return jsonOk({ deleted: true, deletedBy: auth.user.email });
  } catch (error) {
    console.error("[ADMIN_PROTECTED_TEST_DELETE]", error);
    return jsonError("Unable to delete protected test.", 500);
  }
}
