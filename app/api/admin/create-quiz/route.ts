import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanText(value: unknown, maxLength = 200) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeDuration(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(1, Math.min(180, Math.round(parsed)));
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-quiz",
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

  const title = cleanText(body.title, 180);
  const description = cleanText(body.description, 1200) || null;
  const category = cleanText(body.category, 120);
  const difficulty = cleanText(body.difficulty, 60).toLowerCase();
  const duration = normalizeDuration(body.duration);

  if (!title || !category || !difficulty || !duration) {
    return jsonError("Title, category, difficulty and duration are required.", 400);
  }

  const created = await prisma.quiz.create({
    data: {
      title,
      description,
      category,
      difficulty,
      duration,
      totalPoints: 0,
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      duration: true,
      totalPoints: true,
      isActive: true,
      createdAt: true,
    },
  });

  return jsonOk(
    {
      quiz: {
        ...created,
        createdAt: created.createdAt.toISOString(),
      },
      createdBy: auth.user.email,
    },
    {
      status: 201,
    },
  );
}
