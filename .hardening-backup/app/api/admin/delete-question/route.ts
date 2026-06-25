import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user || (user as any).role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    let questionId: string | undefined;
    let challengeId: string | undefined;
    const ct = req.headers.get("content-type") || "";

    if (ct.includes("application/json")) {
      const body = await req.json();
      questionId = body.questionId;
      challengeId = body.challengeId;
    } else {
      const form = await req.formData();
      questionId = form.get("questionId") as string | undefined;
      challengeId = form.get("challengeId") as string | undefined;
    }

    if (!questionId || !challengeId)
      return NextResponse.json(
        { error: "Missing questionId or challengeId" },
        { status: 400 },
      );

    await prisma.dailyQuestion.delete({ where: { id: questionId } });

    if (!ct.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/admin/challenge/${challengeId}`, req.url),
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
