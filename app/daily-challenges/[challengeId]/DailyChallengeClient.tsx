"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ChallengeSecurityOverlay from "@/components/daily-challenges/ChallengeSecurityOverlay";
import HoverScale from "@/components/motion/HoverScale";
import MotionWrapper from "@/components/motion/MotionWrapper";

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

  const isLowTime = timeLeft !== null && timeLeft <= 60 && !challengeEnded;
const initialDurationRef = useRef<number | null>(null);

useEffect(() => {
  if (timeLeft !== null && initialDurationRef.current === null) {
    initialDurationRef.current = Math.max(timeLeft, 1);
  }
}, [timeLeft]);

const timerProgress =
  timeLeft === null
    ? 100
    : Math.max(
        0,
        Math.min(100, (timeLeft / (initialDurationRef.current ?? timeLeft)) * 100),
      );
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-28 pt-6 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/14 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [1.04, 1, 1.04] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-36 top-24 h-[38rem] w-[38rem] rounded-full bg-purple-500/14 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.65, 0.3], x: [0, 22, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-500/12 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_35%,rgba(34,211,238,0.022))]" />

        {[
          "left-[8%] top-[18%]",
          "left-[78%] top-[28%]",
          "left-[52%] top-[12%]",
          "left-[18%] top-[72%]",
          "left-[88%] top-[76%]",
          "left-[42%] top-[86%]",
        ].map((position, index) => (
          <motion.span
            key={position}
            animate={{ opacity: [0.18, 0.75, 0.18], y: [0, -12, 0] }}
            transition={{
              duration: 3.6 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute h-1.5 w-1.5 rounded-full bg-cyan-200/60 shadow-[0_0_18px_rgba(103,232,249,0.8)]",
              position,
            )}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
        <MotionWrapper>
          <section className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6 md:rounded-[2.5rem] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] border border-white/5 md:rounded-[calc(2.5rem-1px)]" />
            <motion.div
              aria-hidden="true"
              animate={{ x: ["-35%", "135%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/80 to-transparent"
            />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl transition duration-700 group-hover:bg-cyan-400/20" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl transition duration-700 group-hover:bg-purple-500/20" />

            <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300 sm:text-sm">
                  Daily Engineering Challenge
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  {initialChallenge.title}
                </h1>

                {initialChallenge.description && (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
                    {initialChallenge.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                    Day {initialChallenge.dayNumber}
                  </span>

                  <span className="rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200 shadow-[0_0_24px_rgba(168,85,247,0.12)]">
                    {initialChallenge.questions.length} Questions
                  </span>
                </div>
              </div>

              <motion.div
                animate={
                  isLowTime
                    ? { scale: [1, 1.035, 1], opacity: [1, 0.92, 1] }
                    : { scale: 1, opacity: 1 }
                }
                transition={{
                  duration: 1,
                  repeat: isLowTime ? Infinity : 0,
                }}
                className={cn(
                  "relative mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-full border bg-white/[0.035] backdrop-blur-2xl sm:h-52 sm:w-52 lg:mx-0",
                  isLowTime
                    ? "border-red-300/45 shadow-[0_0_90px_rgba(248,113,113,0.3)]"
                    : "border-cyan-300/30 shadow-[0_0_90px_rgba(34,211,238,0.24)]",
                )}
                aria-live="polite"
              >
                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={cn(
                    "absolute inset-0 rounded-full border-t-2 border-r border-transparent",
                    isLowTime ? "border-t-red-300/70" : "border-t-cyan-300/70",
                  )}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-4 rounded-full border border-white/10"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${
                      isLowTime
                        ? "rgba(248,113,113,0.78)"
                        : "rgba(34,211,238,0.78)"
                    } ${timerProgress}%, rgba(255,255,255,0.08) 0)`,
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 9px))",
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 9px))",
                  }}
                />

                <div className="relative z-10 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
                    Time Remaining
                  </p>

                  <p
                    className={cn(
                      "mt-2 text-4xl font-black tabular-nums tracking-tight sm:text-5xl",
                      isLowTime ? "text-red-200" : "text-cyan-200",
                    )}
                  >
                    {formattedTime}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </MotionWrapper>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.5rem] border border-amber-400/25 bg-amber-400/10 p-4 shadow-[0_0_44px_rgba(251,191,36,0.1)] backdrop-blur-2xl"
          role="status"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-amber-200">
                Anti Violation Protection
              </p>

              <p className="mt-1 text-sm text-white/60">
                Fullscreen, focus, and tab activity are being monitored.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: MAX_VIOLATIONS }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2.5 w-8 rounded-full transition",
                    index < violations
                      ? "bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.65)]"
                      : "bg-white/10",
                  )}
                />
              ))}

              <div className="ml-2 text-2xl font-black text-amber-200">
                {violations}/{MAX_VIOLATIONS}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {challengeCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="rounded-[1.5rem] border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100 shadow-[0_0_44px_rgba(52,211,153,0.14)] backdrop-blur-2xl"
              role="status"
              aria-live="polite"
            >
              Challenge Completed Successfully
            </motion.div>
          )}

          {!challengeCompleted && attemptStarted && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 text-sm font-semibold text-cyan-100 shadow-[0_0_44px_rgba(34,211,238,0.12)] backdrop-blur-2xl"
              role="status"
            >
              Protected Assessment Mode Enabled
            </motion.div>
          )}

          {violations > 0 && violations < MAX_VIOLATIONS && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="rounded-[1.5rem] border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-100 shadow-[0_0_44px_rgba(248,113,113,0.14)] backdrop-blur-2xl"
              role="alert"
            >
              Warning: Leaving fullscreen or switching tabs may trigger
              automatic submission.
            </motion.div>
          )}

          {autoSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.85, repeat: Infinity }}
              className="rounded-[1.5rem] border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm font-bold text-amber-100 shadow-[0_0_44px_rgba(251,191,36,0.16)] backdrop-blur-2xl"
              role="alert"
            >
              Maximum violations reached. Auto submitting challenge...
            </motion.div>
          )}
        </AnimatePresence>

        <ChallengeSecurityOverlay violations={violations} />

        {challengeEnded && !challengeCompleted ? (
          <MotionWrapper>
            <section className="rounded-[2rem] border border-red-400/25 bg-red-400/10 p-6 text-center shadow-[0_0_70px_rgba(248,113,113,0.14)] backdrop-blur-2xl sm:p-8">
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Challenge Session Ended
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">
                Your challenge session has ended. Return to the challenge hub to
                continue.
              </p>

              <Link
                href="/daily-challenges"
                className="mt-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                Back to Challenges
              </Link>
            </section>
          </MotionWrapper>
        ) : (
          <>
            {!challengeCompleted && attemptStarted && (
              <section className="space-y-5">
                {initialChallenge.questions.map((question, questionIndex) => (
                  <motion.article
                    key={question.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3 }}
                    transition={{
                      duration: 0.45,
                      delay: questionIndex * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.36)] backdrop-blur-2xl transition duration-300 hover:border-cyan-400/25 sm:p-6 md:p-8"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_38%)] opacity-80 transition duration-500 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/15" />

                    <div className="relative z-10">
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                          Question {questionIndex + 1}
                        </span>

                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                          {questionIndex + 1}/
                          {initialChallenge.questions.length}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold leading-8 text-white sm:text-xl md:text-2xl">
                        {question.question}
                      </h2>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "A", value: question.optionA },
                          { label: "B", value: question.optionB },
                          { label: "C", value: question.optionC },
                          { label: "D", value: question.optionD },
                        ].map((option) => {
                          const isSelected =
                            selected[question.id] === option.value;

                          return (
                            <HoverScale key={option.label}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelect(question.id, option.value)
                                }
                                disabled={challengeEnded}
                                aria-pressed={isSelected}
                                className={cn(
                                  "group/answer relative flex min-h-16 w-full items-center gap-4 overflow-hidden rounded-[1.35rem] border p-4 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60",
                                  isSelected
                                    ? "border-cyan-300/60 bg-cyan-400/15 shadow-[0_0_44px_rgba(34,211,238,0.2)]"
                                    : "border-white/10 bg-black/25 shadow-[0_16px_60px_rgba(0,0,0,0.22)] hover:border-cyan-400/35 hover:bg-cyan-400/[0.06]",
                                )}
                              >
                                <div
                                  aria-hidden="true"
                                  className={cn(
                                    "pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover/answer:opacity-100",
                                    isSelected
                                      ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_45%)] opacity-100"
                                      : "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_45%)]",
                                  )}
                                />

                                <span
                                  className={cn(
                                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition",
                                    isSelected
                                      ? "border-cyan-300/70 bg-cyan-400/25 text-cyan-100"
                                      : "border-white/10 bg-white/[0.04] text-white/50 group-hover/answer:text-cyan-200",
                                  )}
                                >
                                  {option.label}
                                </span>

                                <span className="relative z-10 text-sm font-semibold leading-6 text-white/80 sm:text-base">
                                  {option.value}
                                </span>
                              </button>
                            </HoverScale>
                          );
                        })}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </section>
            )}

            <MotionWrapper>
              <footer className="sticky bottom-4 z-20 rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">
                      Submission Control
                    </p>

                    {result && (
                      <p className="mt-2 text-sm font-semibold text-cyan-200">
                        {result}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={
                      submitting ||
                      challengeCompleted ||
                      autoSubmittedRef.current ||
                      submitLockRef.current
                    }
                    className={cn(
                      "inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-sm font-black uppercase tracking-[0.18em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50",
                      submitting || challengeCompleted
                        ? "border-white/10 bg-white/[0.04] text-white/40"
                        : "border-cyan-400/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_44px_rgba(34,211,238,0.18)] hover:bg-cyan-400/25",
                    )}
                  >
                    {submitting ? "Submitting..." : "Submit Challenge"}
                  </button>
                </div>
              </footer>
            </MotionWrapper>
          </>
        )}
      </div>
    </main>
  );
}
