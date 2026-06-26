import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { generateOmniId } from "@/lib/omni-id";
import { normalizeOnboardingPayload } from "@/lib/onboarding/normalize-registration";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        omniId: true,
        image: true,
        isOnboarded: true,
        skills: true,
        careerInterests: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const normalized = normalizeOnboardingPayload(body, {
      fallbackEmail: user.email,
      hasExistingImage: Boolean(user.image),
    });

    if (!normalized.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required passport fields.",
          fieldErrors: normalized.fieldErrors,
        },
        { status: 400 },
      );
    }

    const wasAlreadyOnboarded = user.isOnboarded;
    const omniId = user.omniId || (await generateOmniId());
    const payload = normalized.data;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const savedUser = await tx.user.update({
        where: {
          email: user.email,
        },
        data: {
          omniId,
          isOnboarded: true,

          fullName: payload.personal.fullName,
          phone: payload.personal.phoneNumber,
          dateOfBirth: payload.personal.dateOfBirth,
          image: payload.personal.profileImageDataUrl || user.image,

          college: payload.academic.collegeName,
          university: payload.academic.university,
          usn: payload.academic.usn,
          course: payload.academic.course,
          branch: payload.academic.branch,
          semester: payload.academic.semester,
          state: payload.academic.state,
          district: payload.academic.district,
          pincode: payload.academic.pincode,

          bio: payload.professional.tagline,
          skills: payload.professional.technicalSkills,
          careerInterests: payload.professional.careerInterests,
        },
        select: {
          id: true,
          fullName: true,
          omniId: true,
          isOnboarded: true,
        },
      });

      const existingSkillProgressCount = await tx.skillProgress.count({
        where: {
          userId: user.id,
        },
      });

      if (existingSkillProgressCount === 0) {
        const skillSeeds =
          payload.professional.technicalSkills.length > 0
            ? payload.professional.technicalSkills.slice(0, 5)
            : ["Embedded Systems", "ARM Programming", "PCB Design"];

        await tx.skillProgress.createMany({
          data: skillSeeds.map((skill) => ({
            userId: user.id,
            skill,
            progress: 0,
          })),
        });
      }

      await tx.seasonProgress.upsert({
        where: {
          userId: user.id,
        },
        create: {
          userId: user.id,
        },
        update: {},
      });

      await tx.activity.create({
        data: {
          userId: user.id,
          type: wasAlreadyOnboarded
            ? "PASSPORT_UPDATED"
            : "ONBOARDING_COMPLETED",
          title: wasAlreadyOnboarded
            ? "Skill Passport updated"
            : "Engineering identity activated",
          description: wasAlreadyOnboarded
            ? "Student profile, skills, academic identity or career direction was updated."
            : "OMNI ID generated and student passport foundation completed.",
          points: 0,
        },
      });

      return savedUser;
    });

    return NextResponse.json({
      success: true,
      redirectTo: wasAlreadyOnboarded
        ? "/profile?updated=passport#passport-overview"
        : "/onboarding/success",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[ONBOARDING_COMPLETE]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save passport right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
