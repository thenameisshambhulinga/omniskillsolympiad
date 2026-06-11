"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";

export default function RegistrationShell({
  children,
  title,
  subtitle,
  studentId,
  completionPercent,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  studentId: string;
  completionPercent: number;
}) {
  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/4.5 p-5 pt-12 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7 lg:pt-16"
      >
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Registration Foundation
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto lg:justify-end">
            <div className="shrink-0 rounded-[1.75rem] border border-cyan-400/25 bg-cyan-400/6 p-5 min-w-55">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10">
                  <Cpu className="h-7 w-7 text-cyan-200" />
                </div>

                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">
                  OMNI ID
                </p>

                <p className="mt-4 whitespace-nowrap text-3xl font-black tracking-wide text-white">
                  {studentId}
                </p>

                <p className="mt-3 text-sm text-white/45">
                  Your unique engineering identity
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-[1.75rem] border border-purple-400/20 bg-purple-400/6 p-5 min-w-55">
              <div className="flex flex-col items-center text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-purple-300">
                  Completion
                </p>

                <div className="relative mt-5 h-28 w-28">
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#completionGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * completionPercent) / 100}
                    />

                    <defs>
                      <linearGradient
                        id="completionGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#67E8F9" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-white">
                      {completionPercent}%
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-white/45">
                  {Math.round((completionPercent / 100) * 4)} of 4 steps
                  completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {children}
    </section>
  );
}
