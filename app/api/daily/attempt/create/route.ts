//attempt/create/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const challenge = await prisma.dailyChallenge.create({
      data: {
        dayNumber: body.dayNumber,
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json({
      success: true,
      challenge,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create challenge",
      },
      {
        status: 500,
      },
    );
  }
}
