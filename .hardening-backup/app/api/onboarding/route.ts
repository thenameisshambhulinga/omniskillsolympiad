import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },

      data: {
        fullName: body.fullName,
        college: body.college,
        branch: body.branch,
        year: body.year,
        bio: body.bio,
        skills: body.skills,

        isOnboarded: true,
      },
    });

    const existingProgress = await prisma.skillProgress.findMany({
      where: {
        userId: updatedUser.id,
      },
    });

    if (existingProgress.length === 0) {
      await prisma.skillProgress.createMany({
        data: [
          {
            userId: updatedUser.id,
            skill: "Embedded Systems",
            progress: 0,
          },

          {
            userId: updatedUser.id,
            skill: "ARM Programming",
            progress: 0,
          },

          {
            userId: updatedUser.id,
            skill: "PCB Design",
            progress: 0,
          },
        ],
      });
    }

    const existingSeason = await prisma.seasonProgress.findUnique({
      where: {
        userId: updatedUser.id,
      },
    });

    if (!existingSeason) {
      await prisma.seasonProgress.create({
        data: {
          userId: updatedUser.id,
        },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
