"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CircuitBoard,
  GraduationCap,
  Hammer,
  Medal,
  Route,
  Trophy,
} from "lucide-react";

type JourneyStep = {
  label: string;
  description: string;
};

type OmniJourneySupportStripProps = {
  steps: readonly JourneyStep[];
  activeIndex: number;
};

const icons = [
  BookOpenCheck,
  Hammer,
  Trophy,
  Medal,
  Award,
  CircuitBoard,
  GraduationCap,
  BriefcaseBusiness,
  Route,
];

export default function OmniJourneySupportStrip({
  steps,
  activeIndex,
}: OmniJourneySupportStripProps) {
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(Math.max(activeIndex, 0), steps.length - 1),
  );

  const selectedStep = steps[selectedIndex] ?? steps[0];

  const selectedIcon = useMemo(() => {
    const Icon = icons[selectedIndex] ?? Route;
    return <Icon className="h-5 w-5" />;
  }, [selectedIndex]);

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.10),transparent_28%),radial-gradient(circle_at_55%_100%,rgba(250,204,21,0.12),transparent_34%)]"
        />

        <div className="relative z-10">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-9">
            {steps.map((step, index) => {
              const Icon = icons[index] ?? Route;
              const active = index <= activeIndex;
              const selected = index === selectedIndex;

              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onFocus={() => setSelectedIndex(index)}
                  className={`group relative min-h-[84px] overflow-hidden rounded-[1.2rem] border px-3 py-3 text-left transition duration-200 [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    selected
                      ? "border-blue-300 bg-blue-600 text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
                      : active
                        ? "border-blue-200 bg-blue-50 text-blue-800 hover:-translate-y-0.5 hover:border-blue-300"
                        : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-slate-300"
                  }`}
                  aria-label={`${step.label}: ${step.description}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-3 left-2 w-px ${
                      selected ? "bg-white/35" : "bg-blue-200"
                    }`}
                  />

                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                        selected
                          ? "border-white/30 bg-white/15 text-white"
                          : active
                            ? "border-blue-200 bg-white text-blue-700"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="text-xs font-black uppercase tracking-[0.08em]">
                      {step.label}
                    </span>
                  </span>

                  <span
                    className={`relative z-10 mt-2 block text-[10px] font-black uppercase tracking-[0.14em] ${
                      selected ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {active ? "Supported" : "Upcoming"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 rounded-[1.5rem] border border-blue-200 bg-blue-50/90 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-700 shadow-sm">
              {selectedIcon}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                {selectedStep.label}
              </p>

              <p className="mt-2 text-sm font-semibold leading-7 text-slate-700 sm:text-base">
                {selectedStep.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
