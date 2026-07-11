"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Home,
  LockKeyhole,
  Play,
  ShieldAlert,
  ShieldCheck,
  Timer,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import ChallengeSecurityOverlay from "@/components/daily-challenges/ChallengeSecurityOverlay";
import HoverScale from "@/components/motion/HoverScale";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  dayNumber: number;
  questions: Question[];
};

type DailyAttemptResponse = {
  score?: number;
  total?: number;
  error?: string;
  remainingMs?: number;
};



const MAX_VIOLATIONS = 5;
const PERFORMANCE_CELEBRATION_VIDEO_SRC = "/videos/performance-celebration.mp4";

let performanceVideoPreloaded = false;

function preloadPerformanceCelebrationVideo() {
  if (typeof document === "undefined" || performanceVideoPreloaded) {
    return;
  }

  performanceVideoPreloaded = true;

  const existingPreload = document.querySelector(
    'link[data-oso-celebration-video="true"]',
  );

  if (!existingPreload) {
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "video";
    preloadLink.href = PERFORMANCE_CELEBRATION_VIDEO_SRC;
    preloadLink.setAttribute("data-oso-celebration-video", "true");
    document.head.appendChild(preloadLink);
  }

  const video = document.createElement("video");
  video.src = PERFORMANCE_CELEBRATION_VIDEO_SRC;
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.style.position = "fixed";
  video.style.width = "1px";
  video.style.height = "1px";
  video.style.opacity = "0";
  video.style.pointerEvents = "none";
  video.style.left = "-9999px";
  video.style.top = "-9999px";

  document.body.appendChild(video);
  video.load();

  window.setTimeout(() => {
    video.remove();
  }, 15000);
}

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
  const [startupInProgress, setStartupInProgress] = useState(false);
  const [startupMessage, setStartupMessage] = useState("");

  const selectedRef = useRef<Record<string, string>>({});
  const submitLockRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const lastViolationTimestampRef = useRef(0);
  const [initialDurationSeconds, setInitialDurationSeconds] = useState<number | null>(null);
  const fullscreenEnabledRef = useRef(false);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    preloadPerformanceCelebrationVideo();
  }, []);

  useEffect(() => {
    if (!attemptStarted || challengeEnded || challengeCompleted) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [attemptStarted, challengeCompleted, challengeEnded]);

  const formattedTime = useMemo(() => {
    const safeTime = Math.max(timeLeft ?? 0, 0);
    const mins = Math.floor(safeTime / 60);
    const secs = safeTime % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const exitFullscreenSafely = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Browser may block exit during route transitions. Silent fallback is intentional.
    }
  }, []);

  const handleSelect = useCallback(
    (questionId: string, option: string) => {
      if (challengeEnded || challengeCompleted || submitting) {
        return;
      }

      setSelected((prev) => ({
        ...prev,
        [questionId]: option,
      }));
    },
    [challengeCompleted, challengeEnded, submitting],
  );

  const handleSubmit = useCallback(
    async (autoSubmit = false) => {
      if (
        challengeEnded ||
        challengeCompleted ||
        hasSubmittedRef.current ||
        submitLockRef.current
      ) {
        return;
      }

      if (submitting) {
        return;
      }

      const currentSelected = selectedRef.current;

      if (Object.keys(currentSelected).length === 0 && !autoSubmit) {
        setResult("Answer at least one question before submitting.");
        return;
      }

      submitLockRef.current = true;
      hasSubmittedRef.current = true;

      setSubmitting(true);

      if (autoSubmit) {
        setAutoSubmitting(true);
      }

      try {
        const answers = Object.entries(currentSelected).map(
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
            tabSwitchCount: violations,
          }),
        });

        const data = (await response.json()) as DailyAttemptResponse;

        if (!response.ok) {
          const errorMessage =
            data.error ||
            (autoSubmit
              ? "Auto submission could not be completed."
              : "Submission failed. Please try again.");

          setResult(errorMessage);

          if (autoSubmit) {
            setChallengeEnded(true);
            setAttemptStarted(false);
            await exitFullscreenSafely();
            return;
          }

          hasSubmittedRef.current = false;
          submitLockRef.current = false;
          return;
        }

        const score = typeof data.score === "number" ? data.score : 0;
        const total = typeof data.total === "number" ? data.total : 0;

        setChallengeEnded(true);
        setAttemptStarted(false);
        setResult(`Score: ${score}/${total}`);

        preloadPerformanceCelebrationVideo();
        await exitFullscreenSafely();

        window.setTimeout(() => {
          const query = new URLSearchParams({
            challengeId: initialChallenge.id,
            score: String(score),
            total: String(total),
            celebrate: "1",
          });

          window.location.href = `/daily-challenges/result?${query.toString()}`;
        }, 850);
      } catch {
        setResult(
          autoSubmit
            ? "Auto submission failed because the network was interrupted."
            : "Submission failed. Check connection and try again.",
        );

        if (autoSubmit) {
          setChallengeEnded(true);
          setAttemptStarted(false);
          await exitFullscreenSafely();
          return;
        }

        hasSubmittedRef.current = false;
        submitLockRef.current = false;
      } finally {
        setSubmitting(false);
        setAutoSubmitting(false);
      }
    },
    [
      challengeCompleted,
      challengeEnded,
      exitFullscreenSafely,
      initialChallenge.id,
      submitting,
    ],
  );

  const recordViolation = useCallback(() => {
    if (challengeEnded || challengeCompleted || !attemptStarted) {
      return;
    }

    const now = Date.now();

    if (now - lastViolationTimestampRef.current < 900) {
      return;
    }

    lastViolationTimestampRef.current = now;

    setViolations((prev) => {
      const next = Math.min(MAX_VIOLATIONS, prev + 1);

      if (next >= MAX_VIOLATIONS && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        window.setTimeout(() => {
          void handleSubmit(true);
        }, 0);
      }

      return next;
    });
  }, [attemptStarted, challengeCompleted, challengeEnded, handleSubmit]);

  const startProtectedAssessment = useCallback(async () => {
    if (startupInProgress || hasStartedRef.current) {
      return;
    }

    setStartupInProgress(true);
    setStartupMessage("");
    preloadPerformanceCelebrationVideo();

    try {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
          fullscreenEnabledRef.current = true;
        } catch {
          fullscreenEnabledRef.current = false;
          setStartupMessage(
            "Fullscreen could not be enabled by the browser. Continue carefully; focus monitoring is still active.",
          );
        }
      } else {
        fullscreenEnabledRef.current = true;
      }

      const response = await fetch("/api/daily/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: initialChallenge.id,
        }),
      });

      const data = (await response.json()) as DailyAttemptResponse;

      if (!response.ok) {
        if (data?.error === "Challenge already completed") {
          setChallengeCompleted(true);
          setChallengeEnded(true);
          setAttemptStarted(false);
          setResult(data.error);
          return;
        }

        throw new Error(data?.error || "Failed to start challenge");
      }

      hasStartedRef.current = true;
      setAttemptStarted(true);

      if (typeof data.remainingMs === "number") {
        const seconds = Math.max(0, Math.ceil(data.remainingMs / 1000));
        setInitialDurationSeconds(Math.max(seconds, 1));
        setTimeLeft(seconds);
      }
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Challenge startup failed",
      );
    } finally {
      setStartupInProgress(false);
    }
  }, [initialChallenge.id, startupInProgress]);

  useEffect(() => {
    if (!attemptStarted || challengeEnded || timeLeft === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) {
          return prev;
        }

        if (prev <= 1) {
          window.clearInterval(interval);

          if (!autoSubmittedRef.current) {
            autoSubmittedRef.current = true;
            void handleSubmit(true);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [attemptStarted, challengeEnded, handleSubmit, timeLeft]);

  useEffect(() => {
    if (!attemptStarted || challengeEnded || challengeCompleted) {
      return;
    }

    const handleFullscreenChange = () => {
      if (fullscreenEnabledRef.current && !document.fullscreenElement) {
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [attemptStarted, challengeCompleted, challengeEnded, recordViolation]);

  const isLowTime = timeLeft !== null && timeLeft <= 60 && !challengeEnded;

  const timerProgress =
    timeLeft === null
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            (timeLeft /
              (initialDurationSeconds ?? Math.max(timeLeft, 1))) *
              100,
          ),
        );

  const answeredCount = Object.keys(selected).length;
  const totalQuestions = initialChallenge.questions.length;

  if (challengeCompleted) {
    return (
      <ChallengeCompletedScreen
        title={initialChallenge.title}
        dayNumber={initialChallenge.dayNumber}
        questionCount={totalQuestions}
        message={result || "Challenge already completed."}
      />
    );
  }

  return (
    <main className="fixed inset-0 overflow-y-auto bg-slate-950 text-white">
      <div className="relative min-h-full overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <ChallengeBackground />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
          <TopAssessmentBar />

          <MotionWrapper>
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6 md:rounded-[2.5rem] md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%)]" />
              <div className="pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] border border-white/5 md:rounded-[calc(2.5rem-1px)]" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_230px] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 sm:text-sm">
                    Daily Engineering Challenge
                  </p>

                  <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                    {initialChallenge.title}
                  </h1>

                  {initialChallenge.description ? (
                    <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/62 sm:text-base">
                      {initialChallenge.description}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <InfoPill tone="cyan">
                      Day {initialChallenge.dayNumber}
                    </InfoPill>

                    <InfoPill tone="purple">
                      {totalQuestions} Questions
                    </InfoPill>

                    <InfoPill tone="emerald">
                      {answeredCount}/{totalQuestions} Answered
                    </InfoPill>
                  </div>
                </div>

                <TimerRing
                  formattedTime={formattedTime}
                  timerProgress={timerProgress}
                  isLowTime={isLowTime}
                />
              </div>
            </section>
          </MotionWrapper>

          {!attemptStarted && !challengeEnded ? (
            <ProtectedStartScreen
              startupInProgress={startupInProgress}
              startupMessage={startupMessage}
              result={result}
              onStart={startProtectedAssessment}
            />
          ) : null}

          {attemptStarted ? (
            <>
              <SecurityStatusCard violations={violations} />

              <AnimatePresence>
                <motion.div
                  key="protected-assessment-enabled"
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  className="rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 text-sm font-semibold text-cyan-100 shadow-[0_0_44px_rgba(34,211,238,0.12)] backdrop-blur-2xl"
                  role="status"
                >
                  Protected Assessment Mode Enabled
                </motion.div>

                {violations > 0 && violations < MAX_VIOLATIONS ? (
                  <motion.div
                    key="protected-assessment-warning"
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    className="rounded-[1.5rem] border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-100 shadow-[0_0_44px_rgba(248,113,113,0.14)] backdrop-blur-2xl"
                    role="alert"
                  >
                    Warning: Leaving fullscreen or switching tabs may trigger
                    automatic submission.
                  </motion.div>
                ) : null}

                {autoSubmitting ? (
                  <motion.div
                    key="protected-assessment-auto-submit"
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                    className="rounded-[1.5rem] border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm font-bold text-amber-100 shadow-[0_0_44px_rgba(251,191,36,0.16)] backdrop-blur-2xl"
                    role="alert"
                  >
                    Maximum violations reached. Auto submitting challenge...
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <ChallengeSecurityOverlay violations={violations} />
            </>
          ) : null}

          {challengeEnded ? (
            <SubmissionRedirectState result={result} />
          ) : attemptStarted ? (
            <>
              <QuestionStack
                questions={initialChallenge.questions}
                selected={selected}
                onSelect={handleSelect}
                challengeEnded={challengeEnded}
              />

              <SubmissionDock
                result={result}
                answeredCount={answeredCount}
                totalQuestions={totalQuestions}
                submitting={submitting}                disabled={submitting || challengeCompleted}
                onSubmit={() => void handleSubmit()}
              />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ProtectedStartScreen({
  startupInProgress,
  startupMessage,
  result,
  onStart,
}: {
  startupInProgress: boolean;
  startupMessage: string;
  result: string;
  onStart: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-white/[0.055] p-6 text-center shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_36%)]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200 shadow-[0_0_50px_rgba(34,211,238,0.18)]">
          <LockKeyhole className="h-7 w-7" />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
          Protected Start Required
        </p>

        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Start when you are ready.
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-white/62">
          Click the button to start timer, fullscreen protection and focus
          monitoring. This avoids browser fullscreen permission errors.
        </p>

        {startupMessage ? (
          <div className="mx-auto mt-5 flex max-w-2xl items-start gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-4 py-3 text-left text-sm font-semibold leading-6 text-yellow-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{startupMessage}</span>
          </div>
        ) : null}

        {result ? (
          <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
            {result}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onStart}
          disabled={startupInProgress}
          className="mt-7 inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-cyan-300/25 bg-cyan-300 px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_18px_54px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {startupInProgress ? (
            <>
              <Timer className="h-4 w-4 animate-spin" />
              Preparing
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Protected Assessment
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function ChallengeCompletedScreen({
  title,
  dayNumber,
  questionCount,
  message,
}: {
  title: string;
  dayNumber: number;
  questionCount: number;
  message: string;
}) {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-slate-950 text-white">
      <div className="relative min-h-full overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <ChallengeBackground />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-emerald-300/20 bg-white/[0.055] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_85%_25%,rgba(34,211,238,0.16),transparent_34%)]" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_220px] lg:items-center">
              <div>
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 text-emerald-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                  Challenge Completed
                </p>

                <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  This mission is already submitted.
                </h1>

                <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-white/64">
                  {message} You can return to the challenge hub or go back home
                  from here.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <InfoPill tone="cyan">Day {dayNumber}</InfoPill>
                  <InfoPill tone="purple">{questionCount} Questions</InfoPill>
                  <InfoPill tone="emerald">Synced</InfoPill>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/daily-challenges"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/12 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.12)] transition hover:-translate-y-0.5 hover:bg-cyan-400/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Challenges
                  </Link>

                  <Link
                    href="/"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white/86 transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:text-blue-100"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 shadow-[0_0_90px_rgba(16,185,129,0.22)]">
                <div className="absolute inset-4 rounded-full border border-white/10" />
                <CheckCircle2 className="relative z-10 h-20 w-20 text-emerald-200" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function TopAssessmentBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
            Protected Assessment
          </p>
          <p className="text-xs font-semibold text-white/45">
            Timer and tab-focus monitoring enabled
          </p>
        </div>
      </div>

      <Link
        href="/daily-challenges"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white/75 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:text-cyan-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Challenge Hub
      </Link>
    </div>
  );
}

function TimerRing({
  formattedTime,
  timerProgress,
  isLowTime,
}: {
  formattedTime: string;
  timerProgress: number;
  isLowTime: boolean;
}) {
  return (
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
          "absolute inset-0 rounded-full border-r border-t-2 border-transparent",
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
            isLowTime ? "rgba(248,113,113,0.78)" : "rgba(34,211,238,0.78)"
          } ${timerProgress}%, rgba(255,255,255,0.08) 0)`,
          mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 9px))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 9px))",
        }}
      />

      <div className="relative z-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
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
  );
}

function SecurityStatusCard({ violations }: { violations: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.5rem] border border-amber-400/25 bg-amber-400/10 p-4 shadow-[0_0_44px_rgba(251,191,36,0.1)] backdrop-blur-2xl"
      role="status"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-amber-200">
            Anti Violation Protection
          </p>

          <p className="mt-1 text-sm font-semibold text-white/60">
            Fullscreen, focus, and tab activity are being monitored.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: MAX_VIOLATIONS }).map((_, index) => (
            <span
              key={`security-meter-${index}`}
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
  );
}

function SubmissionRedirectState({ result }: { result: string }) {
  return (
    <section className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 p-8 text-center shadow-[0_0_70px_rgba(16,185,129,0.14)] backdrop-blur-2xl">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-200" />

      <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">
        Challenge submitted successfully
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-white/62">
        {result || "Your response has been recorded."} Preparing your victory
        moment and performance report...
      </p>

      <div className="mx-auto mt-6 h-2 max-w-sm overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
        />
      </div>
    </section>
  );
}

function QuestionStack({
  questions,
  selected,
  onSelect,
  challengeEnded,
}: {
  questions: Question[];
  selected: Record<string, string>;
  onSelect: (questionId: string, option: string) => void;
  challengeEnded: boolean;
}) {
  return (
    <section className="space-y-5">
      {questions.map((question, questionIndex) => {
        const questionKey = question.id || `question-${questionIndex}`;

        return (
          <motion.article
            key={questionKey}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{
              duration: 0.35,
              delay: questionIndex * 0.035,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_24px_86px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition duration-300 hover:border-cyan-400/25 sm:p-6 md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)] opacity-80" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/8 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-200">
                  Question {questionIndex + 1}
                </span>

                <span className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
                  {questionIndex + 1}/{questions.length}
                </span>
              </div>

              <h2 className="text-lg font-black leading-8 text-white sm:text-xl md:text-2xl">
                {question.question}
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "A", value: question.optionA },
                  { label: "B", value: question.optionB },
                  { label: "C", value: question.optionC },
                  { label: "D", value: question.optionD },
                ].map((option) => {
                  const isSelected = selected[question.id] === option.value;

                  return (
                    <HoverScale
                      key={`${questionKey}-${option.label}`}
                      hoverScale={1.012}
                      lift={2}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(question.id, option.value)}
                        disabled={challengeEnded}
                        aria-pressed={isSelected}
                        className={cn(
                          "group/answer relative flex min-h-16 w-full items-center gap-4 overflow-hidden rounded-[1.35rem] border p-4 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60",
                          isSelected
                            ? "border-cyan-300/60 bg-cyan-400/15 shadow-[0_0_44px_rgba(34,211,238,0.2)]"
                            : "border-white/10 bg-black/22 shadow-[0_14px_44px_rgba(0,0,0,0.18)] hover:border-cyan-400/35 hover:bg-cyan-400/[0.06]",
                        )}
                      >
                        <div
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover/answer:opacity-100",
                            isSelected
                              ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_45%)] opacity-100"
                              : "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_45%)]",
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
        );
      })}
    </section>
  );
}

function SubmissionDock({
  result,
  answeredCount,
  totalQuestions,
  submitting,
  disabled,
  onSubmit,
}: {
  result: string;
  answeredCount: number;
  totalQuestions: number;
  submitting: boolean;
  disabled: boolean;
  onSubmit: () => void;
}) {
  return (
    <MotionWrapper>
      <footer className="sticky bottom-4 z-20 rounded-[2rem] border border-white/10 bg-slate-950/88 p-4 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-white/40">
              Submission Control
            </p>

            <p className="mt-2 text-sm font-semibold text-white/58">
              Answered {answeredCount}/{totalQuestions}
            </p>

            {result ? (
              <p className="mt-2 text-sm font-semibold text-cyan-200">
                {result}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled}
            className={cn(
              "inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-sm font-black uppercase tracking-[0.1em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50",
              submitting
                ? "border-white/10 bg-white/[0.04] text-white/40"
                : "border-cyan-400/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_44px_rgba(34,211,238,0.18)] hover:bg-cyan-400/25",
            )}
          >
            {submitting ? "Submitting..." : "Submit Challenge"}
          </button>
        </div>
      </footer>
    </MotionWrapper>
  );
}

function InfoPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "cyan" | "purple" | "emerald";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
      : tone === "purple"
        ? "border-purple-400/25 bg-purple-400/10 text-purple-200"
        : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";

  return (
    <span
      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.1em] shadow-[0_0_24px_rgba(34,211,238,0.08)] ${toneClass}`}
    >
      {children}
    </span>
  );
}

function ChallengeBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.12),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.10),transparent_35%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:76px_76px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_74%)]" />

      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-center text-[clamp(3.5rem,9vw,9rem)] font-black uppercase leading-[0.88] tracking-[0.16em] text-white/[0.035]">
        <span className="block">OMNI SKILLS</span>
        <span className="block">OLYMPIAD</span>
      </div>

      <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -right-36 top-24 h-[38rem] w-[38rem] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-500/8 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.028),transparent_35%,rgba(34,211,238,0.018))]" />
    </div>
  );
}
