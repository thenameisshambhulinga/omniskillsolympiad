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

    const { score, total, category } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const percentage = total === 0 ? 0 : (score / total) * 100;

    await prisma.quizAttempt.create({
      data: {
        score,
        total,
        percentage,
        category,
        userId: user.id,
      },
    });

    const earnedPoints = Math.round(percentage);

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        siliconPoints: {
          increment: earnedPoints,
        },

        streak: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      earnedPoints,
      percentage,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
