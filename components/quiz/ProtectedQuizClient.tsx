"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Loader2,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AUTOSAVE_INTERVAL_MS,
  MAX_TAB_SWITCHES_BEFORE_SUSPICIOUS,
} from "@/lib/quiz/quiz-policy";

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

type Quiz = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  questions: Question[];
};

type StartResponse = {
  success?: boolean;
  attemptId?: string;
  resumed?: boolean;
  remainingMs?: number;
  durationMs?: number;
  savedAnswers?: Record<string, string>;
  tabSwitchCount?: number;
  redirectTo?: string;
  error?: string;
};

type SubmitResponse = {
  success?: boolean;
  score?: number;
  total?: number;
  percentage?: number;
  redirectTo?: string;
  error?: string;
};

type ConfirmAction = "submit" | "exit" | null;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seedValue: string) {
  const output = [...items];
  let seed = hashString(seedValue) || 1;

  function nextRandom() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  for (let index = output.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
}

function joinClass(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ProtectedQuizClient({ quiz }: { quiz: Quiz }) {
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState("");
  const [durationMs, setDurationMs] = useState(quiz.duration * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [startLoading, setStartLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const submitLockRef = useRef(false);
  const finalizingRef = useRef(false);
  const answersRef = useRef<Record<string, string>>({});
  const tabSwitchCountRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    tabSwitchCountRef.current = tabSwitchCount;
  }, [tabSwitchCount]);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  const orderedQuestions = useMemo(() => {
    if (!attemptId) return quiz.questions;
    return seededShuffle(quiz.questions, `${quiz.id}:${attemptId}:questions`);
  }, [attemptId, quiz.id, quiz.questions]);

  const getOrderedOptions = useCallback(
    (question: Question) => {
      const options = [
        { label: "A", value: question.optionA },
        { label: "B", value: question.optionB },
        { label: "C", value: question.optionC },
        { label: "D", value: question.optionD },
      ];

      if (!attemptId) return options;

      return seededShuffle(
        options,
        `${quiz.id}:${attemptId}:${question.id}:options`,
      );
    },
    [attemptId, quiz.id],
  );

  const answeredCount = Object.keys(answers).length;
  const secondsLeft = Math.max(0, timeLeft ?? Math.ceil(durationMs / 1000));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = Math.max(
    0,
    Math.min(100, (secondsLeft / Math.max(1, durationMs / 1000)) * 100),
  );
  const lowTime = secondsLeft <= 120;

  function buildAnswerPayload() {
    return Object.entries(answersRef.current).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }),
    );
  }

  const autosave = useCallback(async () => {
    if (!started || submitting || !attemptId || finalizingRef.current) return;

    try {
      const response = await fetch("/api/quiz/autosave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: answersRef.current,
          tabSwitchCount: tabSwitchCountRef.current,
        }),
      });

      if (response.ok) {
        setLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch {
      // Keep exam uninterrupted during temporary network loss.
    }
  }, [attemptId, quiz.id, started, submitting]);

  const submitQuiz = useCallback(
    async (mode: "submit" | "exit" | "auto") => {
      if (submitLockRef.current) return;

      submitLockRef.current = true;
      finalizingRef.current = true;
      setSubmitting(true);
      setMessage("");

      try {
        const response = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId: quiz.id,
            answers: buildAnswerPayload(),
            tabSwitchCount: tabSwitchCountRef.current,
            finalAction: mode,
          }),
        });

        const data = (await response.json()) as SubmitResponse;

        if (!response.ok) {
          if (data.redirectTo) {
            window.location.href = data.redirectTo;
            return;
          }

          setMessage(data.error || "Submit failed.");
          submitLockRef.current = false;
          finalizingRef.current = false;
          setSubmitting(false);
          return;
        }

        window.location.href = `/quiz/selection-result/${quiz.id}`;
      } catch {
        setMessage(
          "Network interrupted. Do not close this page. Try final submit again.",
        );
        submitLockRef.current = false;
        finalizingRef.current = false;
        setSubmitting(false);
      }
    },
    [quiz.id],
  );

  const startQuiz = useCallback(async () => {
    if (startLoading) return;

    setStartLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizId: quiz.id }),
      });

      const data = (await response.json()) as StartResponse;

      if (!response.ok) {
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
          return;
        }

        setMessage(data.error || "Could not start test.");
        return;
      }

      const remainingMs = Math.max(0, Number(data.remainingMs ?? 0));
      const quizDurationMs = Math.max(
        1,
        Number(data.durationMs ?? quiz.duration * 60 * 1000),
      );

      setAttemptId(data.attemptId ?? "");
      setStarted(true);
      setDurationMs(quizDurationMs);
      setTimeLeft(Math.ceil(remainingMs / 1000));
      setAnswers(data.savedAnswers ?? {});
      setTabSwitchCount(Number(data.tabSwitchCount ?? 0));
      setLastSavedAt(data.resumed ? "Recovered saved answers" : "");
    } catch {
      setMessage("Could not start test. Check connection and try again.");
    } finally {
      setStartLoading(false);
    }
  }, [quiz.duration, quiz.id, startLoading]);

  useEffect(() => {
    if (!started || timeLeft === null) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous === null) return previous;

        if (previous <= 1) {
          window.clearInterval(timer);
          void submitQuiz("auto");
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, submitQuiz, timeLeft]);

  useEffect(() => {
    if (!started) return;

    const interval = window.setInterval(() => {
      void autosave();
    }, AUTOSAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [autosave, started]);

  useEffect(() => {
    if (!started) return;

    const handleVisibility = () => {
      if (document.hidden && !finalizingRef.current) {
        setTabSwitchCount((count) => count + 1);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!startedRef.current || finalizingRef.current || submitLockRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue =
        "Leaving will finalize your test attempt. You cannot reattempt.";
    };

    const handlePageHide = () => {
      if (!startedRef.current || finalizingRef.current || submitLockRef.current) {
        return;
      }

      finalizingRef.current = true;

      const payload = JSON.stringify({
        quizId: quiz.id,
        answers: buildAnswerPayload(),
        tabSwitchCount: tabSwitchCountRef.current,
        reason: "page_exit",
      });

      const blob = new Blob([payload], {
        type: "application/json",
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/quiz/abandon", blob);
      } else {
        void fetch("/api/quiz/abandon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
          keepalive: true,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [quiz.id, started]);

  if (!started) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <QuizBackground />

        <section className="relative z-10 mx-auto max-w-5xl rounded-[2.75rem] border border-white bg-white/78 p-6 text-center shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
            One-Time Protected Selection Test
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight text-[#6d6e6f] sm:text-5xl">
            {quiz.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-slate-600">
            Once you start, leaving, exiting, refreshing, or submitting will finalize your attempt. You cannot reattempt this test.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <InfoPill
              icon={<FileQuestion className="h-4 w-4" />}
              label={`${quiz.questions.length} Questions`}
            />
            <InfoPill
              icon={<Clock3 className="h-4 w-4" />}
              label={`${quiz.duration} Minutes`}
            />
            <InfoPill
              icon={<ShieldAlert className="h-4 w-4" />}
              label="One Attempt Only"
            />
          </div>

          {message ? (
            <p className="mx-auto mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void startQuiz()}
            disabled={startLoading}
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {startLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {startLoading ? "Preparing Test" : "Start Test"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <QuizBackground />

      <section className="relative z-10 mx-auto max-w-[1500px]">
        <div className="sticky top-4 z-30 mb-6 rounded-[2rem] border border-white bg-white/86 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <InfoPill
                  icon={<ShieldAlert className="h-4 w-4" />}
                  label="Do not leave page"
                />
                <InfoPill
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label={`Answered ${answeredCount}/${quiz.questions.length}`}
                />
                <InfoPill
                  icon={<AlertTriangle className="h-4 w-4" />}
                  label={`Focus Alerts ${tabSwitchCount}/${MAX_TAB_SWITCHES_BEFORE_SUSPICIOUS}`}
                />
              </div>

              <h1 className="mt-3 line-clamp-1 text-2xl font-black text-[#6d6e6f]">
                {quiz.title}
              </h1>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Time Remaining
              </p>
              <p
                className={joinClass(
                  "text-4xl font-black tabular-nums",
                  lowTime ? "text-red-600" : "text-blue-700",
                )}
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={joinClass(
                "h-full rounded-full transition-all",
                lowTime ? "bg-red-500" : "bg-blue-600",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {message ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {message}
          </div>
        ) : null}

        <div className="space-y-5">
          {orderedQuestions.map((question, index) => (
            <article
              key={question.id}
              className="rounded-[2rem] border border-white bg-white/78 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-6"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-700">
                Question {index + 1}
              </p>

              <h2 className="mt-3 text-xl font-black leading-8 text-slate-950 sm:text-2xl">
                {question.question}
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {getOrderedOptions(question).map((option) => {
                  const selected = answers[question.id] === option.value;

                  return (
                    <button
                      key={`${question.id}-${option.label}`}
                      type="button"
                      onClick={() => {
                        setAnswers((previous) => ({
                          ...previous,
                          [question.id]: option.value,
                        }));
                      }}
                      className={
                        selected
                          ? "rounded-2xl border border-blue-300 bg-blue-50 p-4 text-left font-bold leading-7 text-blue-800 shadow-[0_12px_34px_rgba(37,99,235,0.12)]"
                          : "rounded-2xl border border-slate-200 bg-white p-4 text-left font-bold leading-7 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                      }
                    >
                      <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {option.label}
                      </span>
                      {option.value}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <footer className="sticky bottom-4 z-30 mt-6 rounded-[2rem] border border-white bg-white/90 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-slate-700">
                Answered {answeredCount}/{quiz.questions.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {lastSavedAt
                  ? `Last saved: ${lastSavedAt}`
                  : "Leaving this page will finalize the attempt"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmAction("exit")}
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-red-700 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                Exit Test
              </button>

              <button
                type="button"
                onClick={() => setConfirmAction("submit")}
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_34px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Finalizing..." : "Submit Test"}
              </button>
            </div>
          </div>
        </footer>
      </section>

      {confirmAction ? (
        <ConfirmFinalActionModal
          action={confirmAction}
          answeredCount={answeredCount}
          totalCount={quiz.questions.length}
          submitting={submitting}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => void submitQuiz(confirmAction)}
        />
      ) : null}
    </main>
  );
}

function ConfirmFinalActionModal({
  action,
  answeredCount,
  totalCount,
  submitting,
  onCancel,
  onConfirm,
}: {
  action: Exclude<ConfirmAction, null>;
  answeredCount: number;
  totalCount: number;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isExit = action === "exit";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-[2rem] border border-white bg-white p-6 text-center shadow-[0_30px_100px_rgba(15,23,42,0.25)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-3xl font-black text-slate-950">
          {isExit ? "Exit and finalize test?" : "Submit final answers?"}
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-7 text-slate-600">
          {isExit
            ? "If you exit now, your current answers will be submitted as final. You cannot reattempt this test."
            : "Once submitted, this test will be locked forever. You cannot edit answers or reattempt."}
        </p>

        <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
          Answered {answeredCount}/{totalCount}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="min-h-12 flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-700 disabled:opacity-60"
          >
            Continue Test
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="min-h-12 flex-1 rounded-full bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-60"
          >
            {submitting
              ? "Finalizing..."
              : isExit
                ? "Yes, Exit & Submit"
                : "Yes, Submit Final"}
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-slate-600 shadow-sm">
      <span className="text-blue-700">{icon}</span>
      {label}
    </span>
  );
}

function QuizBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fbff_0%,#eef7ff_32%,#f8f7ff_68%,#ffffff_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_90%_16%,rgba(99,102,241,0.20),transparent_34%),radial-gradient(circle_at_54%_100%,rgba(168,85,247,0.15),transparent_38%)]" />
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 select-none text-center text-[clamp(4rem,10vw,11rem)] font-black uppercase leading-[0.88] tracking-[0.16em] text-slate-950/[0.030]">
        <span className="block">OMNI SKILLS</span>
        <span className="block">OLYMPIAD</span>
      </div>
    </div>
  );
}
