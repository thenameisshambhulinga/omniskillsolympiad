"use client";

import { CheckCircle2, Circle } from "lucide-react";

import type { ProfileCompletionItem } from "@/types/profile";

export default function ProfileCompletion({
  items,
}: {
  items: ProfileCompletionItem[];
}) {
  const completed = items.filter((item) => item.completed).length;
  const percent = Math.round((completed / Math.max(items.length, 1)) * 100);
  const circumference = 264;

  return (
    <section className="relative h-fit overflow-hidden rounded-[2.5rem] border border-purple-400/20 bg-purple-400/[0.06] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.22),transparent_35%)]"
      />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-300">
          Profile Completion
        </p>

        <div className="mt-6 flex items-center gap-6">
          <div className="relative h-28 w-28 shrink-0">
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
                stroke="url(#profileCompletionGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference - (circumference * percent) / 100
                }
              />
              <defs>
                <linearGradient
                  id="profileCompletionGradient"
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
              <span className="text-3xl font-black text-white">{percent}%</span>
            </div>
          </div>

          <div className="grid flex-1 gap-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Circle className="h-4 w-4 text-white/30" />
                )}
                <span className="text-sm font-semibold text-white/70">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
