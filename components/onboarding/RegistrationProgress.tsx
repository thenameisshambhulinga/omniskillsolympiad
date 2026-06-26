"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

import type { OnboardingStep } from "@/types/onboarding";

const compactStepLabels: Record<string, string> = {
  personal: "Identity & Photo",
  academic: "Education Details",
  professional: "Skills & Links",
  review: "Final Review",
};

export default function RegistrationProgress({
  steps,
  currentStepIndex,
  onStepSelect,
}: {
  steps: OnboardingStep[];
  currentStepIndex: number;
  onStepSelect: (stepIndex: number) => void;
}) {
  const progressPercent =
    steps.length <= 1 ? 0 : (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <aside className="relative h-fit overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/88 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl xl:sticky xl:top-8">
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-500">
              Passport Flow
            </p>
            <h2 className="mt-2 text-[1.7rem] font-black tracking-tight text-slate-800">
              Profile Setup
            </h2>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
            {Math.round(progressPercent)}%
          </div>
        </div>

        <div className="mt-5 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500"
            />
          </div>
        </div>

        <div className="relative mt-6">
          <div className="absolute left-[19px] top-8 bottom-8 w-[2px] rounded-full bg-slate-200" />

          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progressPercent}%` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[19px] top-8 w-[2px] rounded-full bg-gradient-to-b from-blue-600 via-cyan-400 to-violet-500"
          />

          <div className="space-y-3">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              const compactLabel = compactStepLabels[step.id] ?? step.title;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onStepSelect(index)}
                  className={`group relative flex w-full items-center gap-4 rounded-[1.55rem] border p-3 text-left transition ${
                    isActive
                      ? "border-sky-200 bg-sky-50 shadow-[0_12px_30px_rgba(56,189,248,0.1)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="relative z-10 shrink-0">
                    {isComplete ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_0_6px_rgba(16,185,129,0.12)]">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                    ) : (
                      <div
                        className={
                          isActive
                            ? "relative flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 bg-white font-black text-sky-700 shadow-[0_0_0_6px_rgba(56,189,248,0.1)]"
                            : "flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white font-black text-slate-500"
                        }
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className={isActive ? "text-sm font-black text-slate-900" : "text-sm font-bold text-slate-700"}>
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      {compactLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
