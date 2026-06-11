"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

import type { OnboardingStep } from "@/types/onboarding";

const compactStepLabels: Record<string, string> = {
  personal: "Identity & Photo",
  academic: "Education Details",
  professional: "Skills & Tagline",
  review: "Final Verification",
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
    <aside className="relative h-fit overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-2xl xl:sticky xl:top-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_34%)]"
      />

      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
          Onboarding
        </p>

        <h2 className="mt-2 text-xl font-black text-white">Profile Setup</h2>

        <div className="relative mt-8">
          <div className="absolute left-[19px] top-5 bottom-5 w-[2px] bg-white/10 rounded-full" />

          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: `${progressPercent}%`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-[19px] top-5 w-[2px] rounded-full bg-linear-to-b from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_20px_rgba(34,211,238,0.7)]"
          />

          <div className="space-y-1">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;

              const compactLabel = compactStepLabels[step.id] ?? step.title;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onStepSelect(index)}
                  className="group relative flex w-full items-center gap-4 rounded-2xl px-2 py-3 text-left transition"
                >
                  <div className="relative z-10 flex-shrink-0">
                    {isComplete ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                    ) : (
                      <div
                        className={
                          isActive
                            ? "relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/15 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.45)]"
                            : "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/45"
                        }
                      >
                        {index + 1}

                        {isActive && (
                          <motion.div
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.4, 0, 0.4],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-full border border-cyan-300/40"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={
                        isActive
                          ? "text-sm font-black text-white"
                          : "text-sm font-bold text-white/75"
                      }
                    >
                      {step.title}
                    </p>

                    <p className="mt-0.5 text-xs text-white/40">
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
