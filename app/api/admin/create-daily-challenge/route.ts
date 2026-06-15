import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function cleanNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

async function getAdminUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function POST(request: Request) {
  try {
    const { response } = await getAdminUser();

    if (response) {
      return response;
    }

    const body = await request.json();

    const dayNumber = cleanNumber(body.dayNumber);
    const title = cleanText(body.title);
    const description = cleanText(body.description);

    if (!dayNumber || dayNumber < 1 || !title || !description) {
      return NextResponse.json(
        {
          error: "Day number, title and description are required.",
        },
        {
          status: 400,
        },
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

    return NextResponse.json({
      success: true,
      challenge: {
        ...challenge,
        createdAt: challenge.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("CREATE DAILY CHALLENGE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create daily challenge.",
      },
      {
        status: 500,
      },
    );
  }
}