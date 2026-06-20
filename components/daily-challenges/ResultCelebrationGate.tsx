"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FastForward, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const CELEBRATION_VIDEO_SRC = "/videos/performance-celebration.mp4";
const INTRO_DURATION_MS = 3000;

type ResultCelebrationGateProps = {
  children: ReactNode;
  playIntro: boolean;
};

export default function ResultCelebrationGate({
  children,
  playIntro,
}: ResultCelebrationGateProps) {
  const [showIntro, setShowIntro] = useState(playIntro);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setShowIntro(playIntro);
  }, [playIntro]);

  useEffect(() => {
    if (!showIntro) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [showIntro]);

  return (
    <>
      <div
        className={
          showIntro
            ? "pointer-events-none opacity-0"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        {children}
      </div>

      <AnimatePresence>
        {showIntro ? (
          <motion.section
            key="result-celebration-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950 text-white"
          >
            <video
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                videoReady && !videoFailed ? "opacity-95" : "opacity-0"
              }`}
              src={CELEBRATION_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.38),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(168,85,247,0.36),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(250,204,21,0.24),transparent_36%)]"
            />

            <motion.div
              aria-hidden="true"
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.45, 0.78, 0.45],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-3xl"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/18 via-slate-950/34 to-slate-950/78" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-3xl rounded-[2.5rem] border border-white/15 bg-white/[0.08] p-8 text-center shadow-[0_34px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-cyan-300/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_50px_rgba(34,211,238,0.32)]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                  Victory Moment
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Challenge submitted.
                  <span className="block bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Building your report.
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-7 text-white/66 sm:text-base">
                  Your protected attempt has been recorded. Performance score,
                  accuracy, Silicon Points and integrity signals are being
                  prepared.
                </p>

                <div className="mx-auto mt-8 h-2 max-w-md overflow-hidden rounded-full bg-white/12">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: INTRO_DURATION_MS / 1000,
                      ease: "easeInOut",
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
                  />
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  {videoFailed
                    ? "Celebration fallback active"
                    : videoReady
                      ? "Celebration playing"
                      : "Preparing celebration"}
                </div>

                <button
                  type="button"
                  onClick={() => setShowIntro(false)}
                  className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-5 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white/75 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  <FastForward className="h-4 w-4" />
                  Skip Intro
                </button>
              </motion.div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}