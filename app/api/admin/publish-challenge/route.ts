import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PublishAction = "publish" | "unpublish";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const contentType = req.headers.get("content-type") || "";

    let challengeId = "";
    let action = "";

    if (contentType.includes("application/json")) {
      const body = (await req.json()) as {
        challengeId?: unknown;
        action?: unknown;
      };

      challengeId = typeof body.challengeId === "string" ? body.challengeId : "";
      action = typeof body.action === "string" ? body.action : "";
    } else {
      const form = await req.formData();

      const challengeIdValue = form.get("challengeId");
      const actionValue = form.get("action");

      challengeId =
        typeof challengeIdValue === "string" ? challengeIdValue.trim() : "";
      action = typeof actionValue === "string" ? actionValue.trim() : "";
    }

    if (!challengeId || !isPublishAction(action)) {
      return handleResponse({
        contentType,
        req,
        challengeId,
        status: 400,
        json: {
          success: false,
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
        req,
        challengeId,
        status: 404,
        json: {
          success: false,
          error: "Challenge not found.",
        },
        redirectStatus: "not-found",
      });
    }

    const isPublishing = action === "publish";

    if (isPublishing && challenge.questions.length === 0) {
      return handleResponse({
        contentType,
        req,
        challengeId,
        status: 400,
        json: {
          success: false,
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
        isPublished: true,
      },
    });

    return handleResponse({
      contentType,
      req,
      challengeId,
      status: 200,
      json: {
        success: true,
        challenge: updatedChallenge,
      },
      redirectStatus: isPublishing ? "published" : "unpublished",
    });
  } catch (error) {
    console.error("PUBLISH DAILY CHALLENGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update challenge publish status.",
      },
      {
        status: 500,
      },
    );
  }
}

function isPublishAction(value: string): value is PublishAction {
  return value === "publish" || value === "unpublish";
}

function handleResponse({
  contentType,
  req,
  challengeId,
  status,
  json,
  redirectStatus,
}: {
  contentType: string;
  req: Request;
  challengeId: string;
  status: number;
  json: Record<string, unknown>;
  redirectStatus: string;
}) {
  if (contentType.includes("application/json")) {
    return NextResponse.json(json, {
      status,
    });
  }

  const targetPath = challengeId
    ? `/admin/challenge/${challengeId}?status=${encodeURIComponent(
        redirectStatus,
      )}`
    : `/admin/manage-challenges?status=${encodeURIComponent(redirectStatus)}`;

  return NextResponse.redirect(new URL(targetPath, req.url), {
    status: 303,
  });
}