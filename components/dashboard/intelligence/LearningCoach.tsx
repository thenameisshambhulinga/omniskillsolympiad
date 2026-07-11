"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "silicon-skillathon-learning-coach-dismissed";

const slides = [
  {
    title: "What are Silicon Points?",
    copy: "Silicon Points measure your challenge consistency, participation, and competition activity.",
  },
  {
    title: "How Rankings Work",
    copy: "Your points, accuracy, streaks, and competition performance influence your leaderboard position.",
  },
  {
    title: "How To Reach Top 100",
    copy: "Complete daily challenges, maintain streaks, improve accuracy, and participate in competitions.",
  },
];

export default function LearningCoach() {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const openTimer = window.setTimeout(() => {
      setOpen(!window.localStorage.getItem(STORAGE_KEY));
    }, 0);

    return () => window.clearTimeout(openTimer);
  }, []);

  const current = useMemo(() => slides[slide], [slide]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-[32px] border border-cyan-400/20 bg-slate-950/95 p-5 text-white shadow-[0_28px_80px_rgba(6,182,212,0.18)] backdrop-blur-2xl md:bottom-6 md:right-6 md:left-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
              Learning Coach
            </p>
            <h3 className="mt-1 text-xl font-black">Dashboard Intelligence</h3>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10"
            aria-label="Dismiss learning coach"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <motion.div
          key={current.title}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 rounded-[24px] border border-white/10 bg-white/4 p-4"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/70">
            Slide {slide + 1} / 3
          </p>
          <h4 className="mt-2 text-lg font-black text-white">
            {current.title}
          </h4>
          <p className="mt-2 text-sm text-white/75">{current.copy}</p>
        </motion.div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {slides.map((item, index) => (
              <span
                key={item.title}
                className={`h-2 w-2 rounded-full ${index === slide ? "bg-cyan-300" : "bg-white/15"}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))
              }
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setSlide((prev) => (prev + 1) % slides.length)}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100"
            >
              Next
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined")
              localStorage.setItem(STORAGE_KEY, "1");
            setOpen(false);
          }}
          className="mt-4 w-full rounded-full border border-purple-400/20 bg-purple-400/8 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-400/12"
        >
          Dismiss forever
        </button>
      </motion.section>
    </AnimatePresence>
  );
}

