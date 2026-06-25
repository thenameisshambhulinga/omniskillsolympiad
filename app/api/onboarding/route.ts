import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { generateOmniId } from "@/lib/omni-id";
import { prisma } from "@/lib/prisma";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_SKILLS = ["Embedded Systems", "ARM Programming", "PCB Design"];

function cleanString(value: unknown, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const clean = String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
  return clean || undefined;
}

function cleanStringArray(value: unknown, maxItems = 20, maxLength = 80) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((item) => cleanString(item, maxLength))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems);
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "onboarding-legacy",
    limit: 20,
    maxBytes: 512 * 1024,
  });

  if (guarded) return guarded;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return jsonError("Unauthorized", 401);
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      omniId: true,
      skills: true,
    },
  });

  if (!existingUser) {
    return jsonError("User not found.", 404);
  }

  const omniId = existingUser.omniId || (await generateOmniId());

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        fullName: cleanString(body.fullName, 120),
        college: cleanString(body.college, 180),
        branch: cleanString(body.branch, 120),
        year: cleanString(body.year, 40),
        bio: cleanString(body.bio, 280),
        skills: cleanStringArray(body.skills, 24, 80) ?? existingUser.skills,
        omniId,
        isOnboarded: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        omniId: true,
        isOnboarded: true,
      },
    });

    const existingProgress = await tx.skillProgress.findMany({
      where: {
        userId: updated.id,
      },
      select: {
        id: true,
      },
      take: 1,
    });

    if (existingProgress.length === 0) {
      await tx.skillProgress.createMany({
        data: DEFAULT_SKILLS.map((skill) => ({
          userId: updated.id,
          skill,
          progress: 0,
        })),
      });
    }

    await tx.seasonProgress.upsert({
      where: {
        userId: updated.id,
      },
      create: {
        userId: updated.id,
      },
      update: {},
    });

    return updated;
  });

  return jsonOk({
    user: updatedUser,
    redirectTo: "/onboarding/success",
  });
}
