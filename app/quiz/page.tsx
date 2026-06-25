import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import StudentProtectedTestsPanel from "@/components/quiz/StudentProtectedTestsPanel";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function QuizLibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] rounded-[2.75rem] border border-white bg-white/80 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
          Applicant Test Center
        </p>

        <h1 className="mt-4 text-4xl font-black text-[#6d6e6f] sm:text-5xl">
          Attend your active one-time selection test.
        </h1>

        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          These tests are controlled by admin. You can attend once, and your result will be evaluated by the filtration equation.
        </p>
      </div>

      <StudentProtectedTestsPanel variant="full" />
    </main>
  );
}
