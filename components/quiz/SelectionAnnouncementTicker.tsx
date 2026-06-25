"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BellRing,
  Medal,
  PartyPopper,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SelectionStatus = "PENDING" | "SELECTED" | "WAITLISTED" | "REJECTED";

type Test = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: number;
  questionCount: number;
  completed: boolean;
  percentage: number | null;
  selectionStatus: SelectionStatus | null;
  selectionRank: number | null;
  resultAnnounced: boolean;
};

type ApiResponse = {
  ok?: boolean;
  tests?: Test[];
};

function getAction(test: Test) {
  if (test.completed && test.resultAnnounced) {
    return {
      href: `/quiz/selection-result/${test.id}`,
      label:
        test.selectionStatus === "SELECTED"
          ? "Result announced: selected 🎉"
          : `Result announced: ${test.selectionStatus}`,
      button: "View Result",
      icon: "result",
    };
  }

  if (test.completed) {
    return {
      href: `/quiz/selection-result/${test.id}`,
      label: "Test submitted · result waiting for admin evaluation",
      button: "Check Status",
      icon: "pending",
    };
  }

  return {
    href: `/quiz/${test.id}`,
    label: "Live one-time selection test is open",
    button: "Attend Now",
    icon: "live",
  };
}

export default function SelectionAnnouncementTicker() {
  const pathname = usePathname();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    (pathname.startsWith("/quiz/") &&
      !pathname.startsWith("/quiz/selection-result"));

  useEffect(() => {
    if (shouldHide) {
      setLoading(false);
      return;
    }

    let alive = true;

    async function loadTests() {
      try {
        const response = await fetch("/api/public/protected-tests", {
          cache: "no-store",
        });

        const data = (await response.json()) as ApiResponse;

        if (alive && response.ok && data.ok) {
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

    const interval = window.setInterval(() => {
      void loadTests();
    }, 30000);

    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, [shouldHide]);

  const prioritizedTests = useMemo(() => {
    return [...tests].sort((a, b) => {
      if (a.resultAnnounced !== b.resultAnnounced) {
        return a.resultAnnounced ? -1 : 1;
      }

      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      return a.title.localeCompare(b.title);
    });
  }, [tests]);

  if (shouldHide || loading || prioritizedTests.length === 0) {
    return null;
  }

  const primary = prioritizedTests[0];
  const primaryAction = getAction(primary);
  const marqueeItems = prioritizedTests.slice(0, 6);

  return (
    <section className="sticky top-0 z-[80] border-y border-blue-200/70 bg-white/95 shadow-[0_12px_35px_rgba(37,99,235,0.10)] backdrop-blur-2xl">
      <style>{`
        @keyframes osoSelectionTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes osoPulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.55); opacity: 0.45; }
        }
      `}</style>

      <div className="relative mx-auto flex max-w-[1800px] items-center gap-4 overflow-hidden px-3 py-2 sm:px-5">
        <div className="hidden shrink-0 items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] sm:inline-flex">
          {primary.resultAnnounced ? (
            <PartyPopper className="h-4 w-4" />
          ) : (
            <BellRing className="h-4 w-4" />
          )}
          {primary.resultAnnounced ? "Results Live" : "Test Live"}
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
          <div
            className="flex w-max items-center gap-8 whitespace-nowrap py-2"
            style={{ animation: "osoSelectionTicker 28s linear infinite" }}
          >
            {[...marqueeItems, ...marqueeItems].map((test, index) => {
              const action = getAction(test);

              return (
                <Link
                  key={`${test.id}-${index}`}
                  href={action.href}
                  className="group inline-flex items-center gap-3 px-2 text-sm font-black text-slate-800"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                    style={{ animation: "osoPulseDot 1.3s ease-in-out infinite" }}
                  />

                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-blue-700 shadow-sm">
                    {action.icon === "result" ? (
                      <Medal className="h-3.5 w-3.5" />
                    ) : action.icon === "pending" ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {action.label}
                  </span>

                  <span className="max-w-[420px] truncate">
                    {test.title}
                  </span>

                  <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">
                    {test.questionCount}Q · {test.duration}min · {test.category}
                  </span>

                  <ArrowRight className="h-4 w-4 text-blue-600 transition group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href={primaryAction.href}
          className="shrink-0 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5"
        >
          {primaryAction.button}
        </Link>
      </div>
    </section>
  );
}
