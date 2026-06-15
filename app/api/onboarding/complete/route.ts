import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { generateOmniId } from "@/lib/omni-id";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  }

  const omniId = user.omniId || (await generateOmniId());

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      omniId,
      isOnboarded: true,

      fullName: body.personal?.fullName ?? user.fullName,
      phone: body.personal?.phoneNumber ?? user.phone,
      dateOfBirth: body.personal?.dateOfBirth ?? user.dateOfBirth,
      image: body.personal?.profileImageDataUrl ?? user.image,

      college: body.academic?.collegeName ?? user.college,
      university: body.academic?.university ?? user.university,
      usn: body.academic?.usn ?? user.usn,
      course: body.academic?.course ?? user.course,
      branch: body.academic?.branch ?? user.branch,
      semester: body.academic?.semester ?? user.semester,
      state: body.academic?.state ?? user.state,
      district: body.academic?.district ?? user.district,
      pincode: body.academic?.pincode ?? user.pincode,

      bio: body.professional?.tagline ?? user.bio,
      skills: body.professional?.technicalSkills ?? user.skills,
      careerInterests:
        body.professional?.careerInterests ?? user.careerInterests,
    },
  });

 return NextResponse.json({
  success: true,
  redirectTo: "/onboarding/success",
});
}