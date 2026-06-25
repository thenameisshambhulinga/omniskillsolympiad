import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanNumber(value: unknown) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return Math.max(1, Math.min(365, Math.round(numberValue)));
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-daily-challenge",
    limit: 40,
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

  const dayNumber = cleanNumber(body.dayNumber);
  const title = cleanText(body.title, 180);
  const description = cleanText(body.description, 1500);

  if (!dayNumber || !title || !description) {
    return jsonError("Day number, title and description are required.", 400);
  }

  const existing = await prisma.dailyChallenge.findFirst({
    where: {
      dayNumber,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (existing) {
    return jsonError(
      `Day ${dayNumber} already exists as '${existing.title}'. Edit that challenge instead of creating a duplicate.`,
      409,
    );
  }

  const challenge = await prisma.dailyChallenge.create({
    data: {
      dayNumber,
      title,
      description,
      isPublished: Boolean(body.isPublished),
    },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      isPublished: true,
      createdAt: true,
    },
  });

  return jsonOk(
    {
      challenge: {
        ...challenge,
        createdAt: challenge.createdAt.toISOString(),
      },
      createdBy: auth.user.email,
    },
    {
      status: 201,
    },
  );
}
