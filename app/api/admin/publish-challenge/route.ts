import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getStudentDailyChallengePath } from "@/lib/daily-challenge/public-challenge-visibility";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest } from "@/lib/server/route-hardening";

type PublishAction = "publish" | "unpublish";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-publish-daily-challenge",
    limit: 80,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const { challengeId, action } = await readPublishPayload(request, contentType);

    if (!challengeId || !isPublishAction(action)) {
      return handleResponse({
        contentType,
        request,
        challengeId,
        status: 400,
        json: {
          success: false,
          ok: false,
          error: "Challenge ID and valid action are required.",
        },
        redirectStatus: "invalid-request",
      });
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },
      select: {
        id: true,
        dayNumber: true,
        title: true,
        isPublished: true,
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!challenge) {
      return handleResponse({
        contentType,
        request,
        challengeId,
        status: 404,
        json: {
          success: false,
          ok: false,
          error: "Challenge not found.",
        },
        redirectStatus: "not-found",
      });
    }

    const isPublishing = action === "publish";

    if (isPublishing && challenge.questions.length === 0) {
      return handleResponse({
        contentType,
        request,
        challengeId,
        status: 400,
        json: {
          success: false,
          ok: false,
          error: "Add at least one question before publishing.",
        },
        redirectStatus: "publish-needs-question",
      });
    }

    const updatedChallenge = await prisma.dailyChallenge.update({
      where: {
        id: challengeId,
      },
      data: {
        isPublished: isPublishing,
      },
      select: {
        id: true,
        dayNumber: true,
        title: true,
        isPublished: true,
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    revalidateChallengeVisibility(challengeId);

    const studentPath = getStudentDailyChallengePath(challengeId);
    const studentVisible =
      updatedChallenge.isPublished && updatedChallenge._count.questions > 0;

    return handleResponse({
      contentType,
      request,
      challengeId,
      status: 200,
      json: {
        success: true,
        ok: true,
        challenge: updatedChallenge,
        updatedBy: auth.user.email,
        studentVisible,
        studentPath,
        message: studentVisible
          ? "Challenge is now live in Daily-Challenges."
          : "Challenge visibility was updated.",
      },
      redirectStatus: isPublishing
        ? studentVisible
          ? "published-visible"
          : "published"
        : "unpublished",
    });
  } catch (error) {
    console.error("PUBLISH DAILY CHALLENGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: "Failed to update challenge publish status.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

async function readPublishPayload(request: Request, contentType: string) {
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      challengeId?: unknown;
      action?: unknown;
    };

    return {
      challengeId: typeof body.challengeId === "string" ? body.challengeId.trim() : "",
      action: typeof body.action === "string" ? body.action.trim() : "",
    };
  }

  const form = await request.formData();
  const challengeIdValue = form.get("challengeId");
  const actionValue = form.get("action");

  return {
    challengeId:
      typeof challengeIdValue === "string" ? challengeIdValue.trim() : "",
    action: typeof actionValue === "string" ? actionValue.trim() : "",
  };
}

function isPublishAction(value: string): value is PublishAction {
  return value === "publish" || value === "unpublish";
}

function revalidateChallengeVisibility(challengeId: string) {
  const paths = [
    "/daily-challenges",
    "/daily-quizzes",
    getStudentDailyChallengePath(challengeId),
    "/admin/manage-challenges",
    `/admin/challenge/${challengeId}`,
    "/dashboard",
  ];

  for (const path of paths) {
    revalidatePath(path);
  }
}

function handleResponse({
  contentType,
  request,
  challengeId,
  status,
  json,
  redirectStatus,
}: {
  contentType: string;
  request: Request;
  challengeId: string;
  status: number;
  json: Record<string, unknown>;
  redirectStatus: string;
}) {
  if (contentType.includes("application/json")) {
    return NextResponse.json(json, {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const targetPath = challengeId
    ? `/admin/challenge/${challengeId}?status=${encodeURIComponent(redirectStatus)}`
    : `/admin/manage-challenges?status=${encodeURIComponent(redirectStatus)}`;

  return NextResponse.redirect(new URL(targetPath, request.url), {
    status: 303,
  });
}
