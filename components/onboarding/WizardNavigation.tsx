"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

export default function WizardNavigation({
  isFirstStep,
  isLastStep,
  canGoNext,
  onBack,
  onNext,
  nextLabel,
}: {
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white/70 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-black shadow-[0_0_44px_rgba(34,211,238,0.2)] transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
