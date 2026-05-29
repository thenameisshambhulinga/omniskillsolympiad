import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      title,
      description,
      category,
      difficulty,
      duration,
    }: {
      title?: string;
      description?: string | null;
      category?: string;
      difficulty?: string;
      duration?: number;
    } = body ?? {};

    if (!title || !category || !difficulty || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const created = await prisma.quiz.create({
      data: {
        title,
        description: description ?? null,
        category,
        difficulty,
        duration: Number(duration),
        // Ensure backwards compatibility with existing schema usage
        totalPoints: 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, quiz: created });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 },
    );
  }
}
