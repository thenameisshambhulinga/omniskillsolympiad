"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FileQuestion,
  Loader2,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

type ProtectedTest = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration: number;
  totalPoints: number;
  questionCount: number;
  attemptCount: number;
  submissionCount: number;
};

type ApiResponse = {
  ok?: boolean;
  tests?: ProtectedTest[];
  error?: string;
};

export default function ProtectedTestsShowcase({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const [tests, setTests] = useState<ProtectedTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadTests() {
      try {
        const response = await fetch("/api/public/protected-tests", {
          cache: "no-store",
        });

        const data = (await response.json()) as ApiResponse;

        if (!alive) return;

        if (response.ok && data.ok) {
          setTests(data.tests ?? []);
        }
      } catch {
        if (alive) {
          setTests([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    void loadTests();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto my-8 max-w-[1400px] rounded-[2rem] border border-white bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.12em] text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading protected tests
        </div>
      </section>
    );
  }

  if (tests.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto my-8 max-w-[1400px] rounded-[2.5rem] border border-white bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            Active One-Time Selection Tests
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#6d6e6f] sm:text-4xl">
            Available protected tests
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
            Attend only once. Your result will be evaluated using the admin filtration equation.
          </p>
        </div>

        <Link
          href="/quiz"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-50"
        >
          View all tests
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        className={
          variant === "compact"
            ? "mt-6 grid gap-4 lg:grid-cols-2"
            : "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        }
      >
        {tests.slice(0, variant === "compact" ? 2 : 6).map((test) => (
          <article
            key={test.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
          >
            <div className="flex flex-wrap gap-2">
              <Badge label={test.category} />
              <Badge label={test.difficulty} />
            </div>

            <h3 className="mt-4 line-clamp-2 text-xl font-black leading-7 text-slate-950">
              {test.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">
              {test.description || "Protected one-time OSO selection assessment."}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <MiniStat
                icon={<FileQuestion className="h-4 w-4" />}
                value={String(test.questionCount)}
                label="Questions"
              />
              <MiniStat
                icon={<Clock3 className="h-4 w-4" />}
                value={`${test.duration}`}
                label="Minutes"
              />
              <MiniStat
                icon={<Users className="h-4 w-4" />}
                value={String(test.submissionCount)}
                label="Submitted"
              />
            </div>

            <Link
              href={`/quiz/${test.id}`}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Trophy className="h-4 w-4" />
              Attend Test
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700">
      {label}
    </span>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-1 text-blue-700">{icon}</div>
      <p className="mt-2 text-base font-black text-slate-950">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
