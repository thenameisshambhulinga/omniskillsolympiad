"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ChallengeSecurityOverlay from "@/components/daily-challenges/ChallengeSecurityOverlay";

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

const MAX_VIOLATIONS = 5;

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  dayNumber: number;
  questions: Question[];
};

export default function DailyChallengeClient({
  initialChallenge,
}: {
  initialChallenge: Challenge;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [attemptStarted, setAttemptStarted] = useState(false);

  const [challengeEnded, setChallengeEnded] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState("");
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const [violations, setViolations] = useState(0);

  const submitLockRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const lastViolationTimestampRef = useRef(0);

  // START / RESUME SESSION
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const initializeChallenge = async () => {
      try {
        const response = await fetch("/api/daily/start", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            challengeId: initialChallenge.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data?.error === "Challenge already completed") {
            setChallengeCompleted(true);
            setChallengeEnded(true);
            setResult(data.error);
            return;
          }

          throw new Error(data?.error || "Failed to start challenge");
        }

        setAttemptStarted(true);

        if (typeof data.remainingMs === "number") {
          setTimeLeft(Math.max(0, Math.ceil(data.remainingMs / 1000)));
        }
      } catch (error) {
        console.error(error);

        setResult(
          error instanceof Error ? error.message : "Challenge startup failed",
        );
      }
    };

    initializeChallenge();
  }, []);

  // TIMER
  useEffect(() => {
    if (!attemptStarted || challengeEnded || timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);

          handleSubmit(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptStarted, challengeEnded, timeLeft]);

  // FULLSCREEN + TAB SWITCH DETECTION
  useEffect(() => {
    const shouldRecordViolation = () => {
      const now = Date.now();
      if (now - lastViolationTimestampRef.current < 800) {
        return false;
      }

      lastViolationTimestampRef.current = now;
      return true;
    };

    const handleAutoSubmit = async () => {
      setAutoSubmitting(true);
      await handleSubmit(true);
    };

    const recordViolation = () => {
      if (challengeEnded) return;
      if (!shouldRecordViolation()) return;

      setViolations((prev) => {
        const next = Math.min(MAX_VIOLATIONS, prev + 1);

        if (next >= MAX_VIOLATIONS && !autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          handleAutoSubmit();
        }

        return next;
      });
    };

    const activateFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation();
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        recordViolation();
      }
    };

    const handleBlur = () => {
      if (!document.hidden) {
        recordViolation();
      }
    };

    activateFullscreen();

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [challengeEnded]);

  const formattedTime = useMemo(() => {
    const safeTime = Math.max(timeLeft || 0, 0);
    const mins = Math.floor(safeTime / 60);

    const secs = safeTime % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const handleSelect = (questionId: string, option: string) => {
    if (challengeEnded) return;

    setSelected((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (
      challengeEnded ||
      challengeCompleted ||
      hasSubmittedRef.current ||
      submitLockRef.current
    ) {
      return;
    }

    if (submitting) return;

    if (autoSubmittedRef.current && !autoSubmit) return;

    if (Object.keys(selected).length === 0 && !autoSubmit) {
      setResult("Answer at least one question");
      return;
    }

    submitLockRef.current = true;
    hasSubmittedRef.current = true;

    setSubmitting(true);

    try {
      const answers = Object.entries(selected).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        }),
      );

      const response = await fetch("/api/daily/attempt", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          challengeId: initialChallenge.id,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        hasSubmittedRef.current = false;
        submitLockRef.current = false;

        setResult(data.error || "Submission failed");

        return;
      }

      if (autoSubmit) {
        autoSubmittedRef.current = true;
      }

      setChallengeEnded(true);

      setAttemptStarted(false);

      setResult(`Score: ${data.score}/${data.total}`);

      setTimeout(() => {
        window.location.href = `/daily-challenges/result?score=${data.score}&total=${data.total}`;
      }, 1500);
    } catch (error) {
      console.error(error);

      hasSubmittedRef.current = false;
      submitLockRef.current = false;

      setResult("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-0 text-white">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-6 rounded-[32px] border border-white/10 bg-white/3 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                Day {initialChallenge.dayNumber}
              </p>

              <h1 className="mt-4 text-5xl font-black">
                {initialChallenge.title}
              </h1>

              <p className="mt-5 text-white/60">
                {initialChallenge.description}
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-8 py-6 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Time Remaining
              </p>

              <h2 className="mt-3 text-5xl font-black text-cyan-300">
                {formattedTime}
              </h2>
            </div>
          </div>
        </div>

        {/* VIOLATION BAR */}
        <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-yellow-300">
                Anti Violation Protection
              </p>

              <p className="mt-1 text-sm text-white/60">
                Tab switching is monitored.
              </p>
            </div>

            <div className="text-2xl font-black text-yellow-300">
              {violations}/5
            </div>
          </div>
        </div>

        {challengeCompleted && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Challenge Completed Successfully
          </div>
        )}

        {!challengeCompleted && attemptStarted && (
          <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            Protected Assessment Mode Enabled
          </div>
        )}

        {violations > 0 && violations < MAX_VIOLATIONS && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Warning: Leaving fullscreen or switching tabs may trigger automatic
            submission.
          </div>
        )}

        {autoSubmitting && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Maximum violations reached. Auto submitting challenge...
          </div>
        )}

        <ChallengeSecurityOverlay violations={violations} />
        {/* EXPIRED BANNER (render only when attempt ended but not completed) */}
        {challengeEnded && !challengeCompleted && (
          <>
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Challenge session expired. Please return to the challenges page.
            </div>

            <Link
              href="/daily-challenges"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Return To Challenges
            </Link>
          </>
        )}

        {/* QUESTIONS */}
        {initialChallenge.questions.length === 0 ? (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Questions could not be loaded properly.
          </div>
        ) : attemptStarted || challengeCompleted ? (
          <div className="space-y-6">
            {initialChallenge.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-[32px] border border-white/10 bg-white/3 p-8"
              >
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 font-black text-cyan-300">
                    {index + 1}
                  </div>

                  <h2 className="text-2xl font-bold">{question.question}</h2>
                </div>

                <div className="grid gap-5">
                  {[
                    question.optionA,
                    question.optionB,
                    question.optionC,
                    question.optionD,
                  ].map((option) => {
                    const active = selected[question.id] === option;

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(question.id, option)}
                        disabled={challengeEnded}
                        className={`rounded-2xl border p-5 text-left transition ${
                          active
                            ? "border-cyan-400 bg-cyan-500/10"
                            : "border-white/10 bg-black/40 hover:border-cyan-400/30"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-white/6 bg-white/2 px-6 py-12 text-center text-sm text-white/60">
            Loading challenge...
          </div>
        )}

        {/* FOOTER - only show when attempt is active or challenge already completed */}
        {(attemptStarted || challengeCompleted) && (
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => handleSubmit()}
              disabled={
                submitting ||
                challengeCompleted ||
                autoSubmittedRef.current ||
                submitLockRef.current
              }
              className={cn(
                "rounded-2xl bg-cyan-400 px-8 py-5 text-lg font-black text-black transition hover:scale-[1.02]",
                (submitting ||
                  challengeCompleted ||
                  autoSubmittedRef.current ||
                  submitLockRef.current) &&
                  "cursor-not-allowed opacity-60 hover:scale-100",
              )}
            >
              {challengeCompleted
                ? "Challenge Completed"
                : submitting
                  ? "Submitting..."
                  : "Submit Challenge"}
            </button>

            {result && !challengeCompleted && (
              <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-4 text-lg">
                {result}
              </div>
            )}

            {challengeCompleted && (
              <Link
                href="/daily-challenges"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Back To Challenges
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
