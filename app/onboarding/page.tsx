import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import OnboardingClient from "@/app/onboarding/OnboardingClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createEmptyProfileImageState,
  type RegistrationFormData,
} from "@/types/onboarding";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type OnboardingPageProps = {
  searchParams?:
    | Promise<{
        edit?: string;
      }>
    | {
        edit?: string;
      };
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPassportEditMode = resolvedSearchParams.edit === "passport";

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(
      isPassportEditMode
        ? "/login?callbackUrl=/onboarding?edit=passport"
        : "/login?callbackUrl=/onboarding",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      role: true,
      isOnboarded: true,
      image: true,
      fullName: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      college: true,
      university: true,
      usn: true,
      course: true,
      branch: true,
      semester: true,
      state: true,
      district: true,
      pincode: true,
      bio: true,
      skills: true,
      careerInterests: true,
      omniId: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  /**
   * Critical rule:
   * Normal onboarding can still route admins to admin.
   * Passport edit mode must never push the user into /admin.
   */
  if (user.role === "ADMIN" && !isPassportEditMode) {
    redirect("/admin");
  }

  if (user.isOnboarded && !isPassportEditMode) {
    redirect("/");
  }

  const initialData: RegistrationFormData | undefined = isPassportEditMode
    ? {
        studentId: user.omniId ?? "",
        personal: {
          profileImage: {
            ...createEmptyProfileImageState(),
            previewUrl: user.image ?? "",
            fileName: user.image ? "Current profile image" : "",
            fileSize: 0,
            mimeType: user.image ? "image/*" : "",
            uploadProgress: user.image ? 100 : 0,
            isValid: Boolean(user.image),
            error: "",
          },
          fullName: user.fullName ?? "",
          email: user.email,
          phoneNumber: user.phone ?? "",
          dateOfBirth: user.dateOfBirth ?? "",
        },
        academic: {
          collegeName: user.college ?? "",
          university: user.university ?? "",
          usn: user.usn ?? "",
          course: user.course ?? "",
          branch: user.branch ?? "",
          semester: user.semester ?? "",
          state: user.state ?? "",
          district: user.district ?? "",
          pincode: user.pincode ?? "",
        },
        professional: {
          tagline: user.bio ?? "",
          technicalSkills: user.skills ?? [],
          linkedIn: "",
          github: "",
          portfolio: "",
          careerInterests: user.careerInterests ?? [],
        },
      }
    : undefined;

  return (
    <OnboardingClient
      editMode={isPassportEditMode}
      initialData={initialData}
    />
  );
}
