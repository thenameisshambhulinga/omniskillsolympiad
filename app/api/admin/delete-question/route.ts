import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanString(value: unknown, maxLength = 200) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      contentType,
      questionId: cleanString(body.questionId),
      challengeId: cleanString(body.challengeId),
    };
  }

  const form = await request.formData();

  return {
    contentType,
    questionId: cleanString(form.get("questionId")),
    challengeId: cleanString(form.get("challengeId")),
  };
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-delete-daily-question",
    limit: 80,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { contentType, questionId, challengeId } = await readPayload(request);

    if (!questionId || !challengeId) {
      return jsonError("Missing questionId or challengeId.", 400);
    }

    const question = await prisma.dailyQuestion.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        challengeId: true,
      },
    });

    if (!question) {
      return jsonError("Question not found.", 404);
    }

    if (question.challengeId !== challengeId) {
      return jsonError("Question does not belong to the supplied challenge.", 409);
    }

    await prisma.dailyQuestion.delete({
      where: {
        id: questionId,
      },
    });

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL(`/admin/challenge/${challengeId}`, request.url), {
        status: 303,
      });
    }

    return jsonOk({
      deletedBy: auth.user.email,
    });
  } catch (error) {
    console.error("ADMIN DELETE DAILY QUESTION ERROR:", error);
    return jsonError("Failed to delete question.", 500);
  }
}
