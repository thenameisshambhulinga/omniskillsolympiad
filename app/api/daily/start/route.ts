import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

const CHALLENGE_DURATION_MINUTES = 2;

export async function POST(req: Request) {
  try {
    // SESSION VALIDATION
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // BODY VALIDATION
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        {
          status: 400,
        },
      );
    }

    // Normalize to expected payload shape: { challengeId: string }
    const challengeId =
      typeof body === "object" &&
      body !== null &&
      "challengeId" in body &&
      typeof (body as any).challengeId === "string"
        ? (body as any).challengeId.trim()
        : "";

    if (!challengeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge ID required",
        },
        {
          status: 400,
        },
      );
    }

    // USER FETCH
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        seasonProgress: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // ELIMINATION CHECK
    if (user.seasonProgress?.eliminated) {
      return NextResponse.json(
        {
          success: false,
          error: "You are eliminated from this season",
        },
        {
          status: 403,
        },
      );
    }

    // CHALLENGE FETCH
    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },
      include: {
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge not found",
        },
        {
          status: 404,
        },
      );
    }

    // PUBLISHED CHECK
    if (!challenge.isPublished) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge is not published",
        },
        {
          status: 403,
        },
      );
    }

    // EMPTY CHALLENGE CHECK
    if (!challenge.questions || challenge.questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge has no questions",
        },
        {
          status: 400,
        },
      );
    }

    // EXISTING ATTEMPT
    const existingAttempt = await prisma.dailyAttempt.findFirst({
      where: {
        userId: user.id,
        challengeId,
      },
    });

    // ALREADY COMPLETED
    if (existingAttempt?.completed) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge already completed",
        },
        {
          status: 400,
        },
      );
    }

    // EXPIRED SESSION BLOCK
    if (
      existingAttempt &&
      existingAttempt.expiresAt &&
      new Date() > new Date(existingAttempt.expiresAt)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Challenge time expired",
        },
        {
          status: 403,
        },
      );
    }

    // RESUME ACTIVE SESSION
    if (
      existingAttempt &&
      existingAttempt.expiresAt &&
      new Date() < new Date(existingAttempt.expiresAt)
    ) {
      return NextResponse.json({
        success: true,
        resumed: true,
        attemptId: existingAttempt.id,
        expiresAt: existingAttempt.expiresAt,
        remainingMs: new Date(existingAttempt.expiresAt).getTime() - Date.now(),
      });
    }

    // CREATE NEW SESSION
    const expiresAt = new Date(
      Date.now() + CHALLENGE_DURATION_MINUTES * 60 * 1000,
    );

    const newAttempt = await prisma.dailyAttempt.create({
      data: {
        userId: user.id,
        challengeId,
        challengeDay: challenge.dayNumber,
        score: 0,
        total: challenge.questions.length,
        percentage: 0,
        completed: false,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      resumed: false,
      attemptId: newAttempt.id,
      expiresAt: newAttempt.expiresAt,
      remainingMs: newAttempt.expiresAt
        ? new Date(newAttempt.expiresAt).getTime() - Date.now()
        : 0,
    });
  } catch (error) {
    console.error("DAILY START ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to start challenge",
      },
      {
        status: 500,
      },
    );
  }
}
