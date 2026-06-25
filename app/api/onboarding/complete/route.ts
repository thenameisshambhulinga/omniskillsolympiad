import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { generateOmniId } from "@/lib/omni-id";
import { prisma } from "@/lib/prisma";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_SKILLS = ["Embedded Systems", "ARM Programming", "PCB Design"];
const MAX_PROFILE_IMAGE_DATA_URL_LENGTH = 750_000;

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

function cleanProfileImage(value: unknown, fallback: string | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback;
  }

  const image = value.trim();

  if (image.length > MAX_PROFILE_IMAGE_DATA_URL_LENGTH) {
    return fallback;
  }

  if (
    image.startsWith("data:image/jpeg;base64,") ||
    image.startsWith("data:image/png;base64,") ||
    image.startsWith("data:image/webp;base64,") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return fallback;
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "onboarding-complete",
    limit: 20,
    maxBytes: 900 * 1024,
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

  const personal = objectOrEmpty(body.personal);
  const academic = objectOrEmpty(body.academic);
  const professional = objectOrEmpty(body.professional);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return jsonError("User not found", 404);
  }

  const omniId = user.omniId || (await generateOmniId());

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        omniId,
        isOnboarded: true,
        fullName: cleanString(personal.fullName, 120) ?? user.fullName,
        phone: cleanString(personal.phoneNumber, 30) ?? user.phone,
        dateOfBirth: cleanString(personal.dateOfBirth, 30) ?? user.dateOfBirth,
        image: cleanProfileImage(personal.profileImageDataUrl, user.image),
        college: cleanString(academic.collegeName, 180) ?? user.college,
        university: cleanString(academic.university, 180) ?? user.university,
        usn: cleanString(academic.usn, 80) ?? user.usn,
        course: cleanString(academic.course, 80) ?? user.course,
        branch: cleanString(academic.branch, 120) ?? user.branch,
        semester: cleanString(academic.semester, 40) ?? user.semester,
        state: cleanString(academic.state, 100) ?? user.state,
        district: cleanString(academic.district, 100) ?? user.district,
        pincode: cleanString(academic.pincode, 20) ?? user.pincode,
        bio: cleanString(professional.tagline, 280) ?? user.bio,
        skills:
          cleanStringArray(professional.technicalSkills, 24, 80) ?? user.skills,
        careerInterests:
          cleanStringArray(professional.careerInterests, 24, 80) ??
          user.careerInterests,
      },
      select: {
        id: true,
        omniId: true,
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
    redirectTo: "/onboarding/success",
    omniId: updatedUser.omniId,
  });
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}
