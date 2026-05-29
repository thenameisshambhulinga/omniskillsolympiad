import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("CREATE DAILY CHALLENGE BODY:", body);

    if (!body.dayNumber || !body.title || !body.description) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    const challenge = await prisma.dailyChallenge.create({
      data: {
        dayNumber: Number(body.dayNumber),
        title: body.title,
        description: body.description,
      },
    });

    console.log("DAILY CHALLENGE CREATED:", challenge);

    return NextResponse.json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error("DAILY CHALLENGE CREATE ERROR:", error);

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
