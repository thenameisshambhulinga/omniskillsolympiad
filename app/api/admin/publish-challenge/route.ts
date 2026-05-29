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

    let challengeId: string | undefined;
    let action: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      challengeId = body.challengeId;
      action = body.action;
    } else {
      const form = await req.formData();
      challengeId = form.get("challengeId") as string | undefined;
      action = form.get("action") as string | undefined;
    }

    if (!challengeId || !action)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const isPublish = action === "publish";

    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: { isPublished: isPublish },
    });

    if (!contentType.includes("application/json")) {
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
