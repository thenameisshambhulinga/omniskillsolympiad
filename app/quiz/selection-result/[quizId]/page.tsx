import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Clock3, Medal, PartyPopper, ShieldCheck } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function SelectionResultPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { quizId } = await params;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: {
        userId: user.id,
        quizId,
      },
    },
    select: {
      score: true,
      total: true,
      percentage: true,
      completed: true,
      suspicious: true,
      tabSwitchCount: true,
      selectionStatus: true,
      selectionRank: true,
      selectionEvaluatedAt: true,
      quiz: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!attempt || !attempt.completed) {
    return (
      <ResultShell tone="pending">
        <h1 className="text-4xl font-black text-slate-950">No submitted attempt found</h1>
        <p className="mt-4 text-sm font-semibold text-slate-600">
          Attend and submit the test before checking the selection result.
        </p>
        <BackLinks />
      </ResultShell>
    );
  }

  const status = attempt.selectionStatus;
  const selected = status === "SELECTED";
  const waitlisted = status === "WAITLISTED";
  const rejected = status === "REJECTED";
  const pending = status === "PENDING";

  return (
    <ResultShell tone={selected ? "selected" : waitlisted ? "waitlisted" : rejected ? "rejected" : "pending"}>
      {selected ? <Confetti /> : null}

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white bg-white/70 text-blue-700 shadow-lg">
        {selected ? <PartyPopper className="h-10 w-10 text-emerald-600" /> : <Medal className="h-10 w-10" />}
      </div>

      <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
        Selection Result
      </p>

      <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
        {selected
          ? "Congratulations! You are selected 🎉"
          : waitlisted
            ? "You are waitlisted"
            : rejected
              ? "Not selected this time"
              : "Result under evaluation"}
      </h1>

      <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
        {attempt.quiz?.title || "Protected Selection Test"}
      </p>

      <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-4">
        <Metric label="Score" value={`${attempt.score}/${attempt.total}`} />
        <Metric label="Percentage" value={`${attempt.percentage}%`} />
        <Metric label="Rank" value={attempt.selectionRank ? `#${attempt.selectionRank}` : "-"} />
        <Metric label="Alerts" value={String(attempt.tabSwitchCount)} />
      </div>

      <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/70 bg-white/70 p-5 text-sm font-bold leading-7 text-slate-700">
        {pending ? (
          <span>
            Admin has not evaluated this test yet. Once the filtration equation is applied, your final status will appear here.
          </span>
        ) : selected ? (
          <span>
            You passed the admin filtration equation and can move forward to the next program.
          </span>
        ) : waitlisted ? (
          <span>
            You satisfied the basic criteria but are outside the current shortlist limit.
          </span>
        ) : (
          <span>
            You did not satisfy the current filtration equation. Keep improving — this is not the end.
          </span>
        )}
      </div>

      {attempt.selectionEvaluatedAt ? (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
          <Clock3 className="h-4 w-4" />
          Evaluated on {new Date(attempt.selectionEvaluatedAt).toLocaleString()}
        </p>
      ) : null}

      <BackLinks />
    </ResultShell>
  );
}

function ResultShell({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "selected" | "waitlisted" | "rejected" | "pending";
}) {
  const bg =
    tone === "selected"
      ? "from-emerald-50 via-cyan-50 to-white"
      : tone === "waitlisted"
        ? "from-amber-50 via-white to-cyan-50"
        : tone === "rejected"
          ? "from-red-50 via-white to-slate-50"
          : "from-blue-50 via-white to-slate-50";

  return (
    <main className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${bg} px-6 py-10 text-center text-slate-950`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.20),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.18),transparent_30%)]" />

      <section className="relative z-10 mx-auto max-w-5xl rounded-[3rem] border border-white bg-white/70 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-12">
        {children}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function BackLinks() {
  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <Link
        href="/quiz"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Tests
      </Link>

      <Link
        href="/dashboard"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
      >
        <ShieldCheck className="h-4 w-4" />
        Dashboard
      </Link>
    </div>
  );
}

function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 26 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-3 w-2 rounded-sm bg-emerald-400"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 19) % 75}%`,
            transform: `rotate(${index * 23}deg)`,
            opacity: 0.72,
          }}
        />
      ))}
    </div>
  );
}
