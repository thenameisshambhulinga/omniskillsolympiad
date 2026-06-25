"use client";

import type { ReactNode } from "react";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

export default function RegistrationShell({
  children,
  title,
  subtitle,
  completionPercent,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  completionPercent: number;
}) {
  const completedSteps = Math.round((completionPercent / 100) * 4);

  return (
    <section className="w-full">
      <div className="mb-6 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-5 pt-12 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7 sm:pt-12 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-200">
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-cyan-400/25 bg-cyan-400/[0.06] p-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10">
                  <LockKeyhole className="h-7 w-7 text-cyan-200" />
                </div>

                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">
                  OMNI ID
                </p>

                <p className="mt-4 text-lg font-black tracking-wide text-white">
                  Hidden Until Registration
                </p>

                <p className="mt-3 max-w-52 text-sm leading-6 text-white/45">
                  Your official OMNI ID is generated and revealed only after
                  successful onboarding.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-purple-400/20 bg-purple-400/[0.06] p-5">
              <div className="flex flex-col items-center text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-purple-300">
                  Completion
                </p>

                <div className="relative mt-5 h-28 w-28">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
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
                  {completedSteps} of 4 steps completed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-200" />
            <p className="text-sm font-semibold leading-6 text-white/55">
              Identity privacy is protected during registration. OMNI ID is not
              disclosed before final verification.
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}