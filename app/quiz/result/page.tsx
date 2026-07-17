import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

type QuizResultPageProps = {
  searchParams?: Promise<{ quizId?: string }>;
};

export default async function QuizResultPage({ searchParams }: QuizResultPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const params = await searchParams;
  const quizId = typeof params?.quizId === "string" ? params.quizId.trim() : "";

  if (!SAFE_ID_PATTERN.test(quizId)) {
    redirect("/quiz");
  }

  redirect(`/quiz/selection-result/${encodeURIComponent(quizId)}`);
}
