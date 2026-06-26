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
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(37,99,235,0.18)] transition hover:brightness-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
