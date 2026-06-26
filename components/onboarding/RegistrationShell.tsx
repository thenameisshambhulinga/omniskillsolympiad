"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GaugeCircle,
  Home,
  LockKeyhole,
  PenSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
  const isEditMode = title.toLowerCase().includes("edit");

  return (
    <section className="w-full">
      <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.075)] backdrop-blur-xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-violet-500" />

        <div className="p-4 sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Passport Upgrade Studio
            </div>

            {isEditMode ? <InlineExitDock /> : null}
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div>
              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-slate-700 sm:text-4xl lg:text-[2.9rem]">
                {title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
                {subtitle}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <CompactSignalCard
                  label="Identity"
                  value={isEditMode ? "Editable" : "Protected"}
                  icon={<PenSquare className="h-4 w-4" />}
                />
                <CompactSignalCard
                  label="Passport"
                  value="Skill Proof"
                  icon={<LockKeyhole className="h-4 w-4" />}
                />
                <CompactSignalCard
                  label="Readiness"
                  value={`${completionPercent}%`}
                  icon={<GaugeCircle className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.35rem] border border-sky-200 bg-sky-50/80 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-blue-200 bg-white text-blue-600 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">
                      Secure edit
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                      Student profile only. Admin controls stay hidden.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-violet-200 bg-violet-50/80 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-700">
                      Completion
                    </p>
                    <p className="mt-1 text-3xl font-black text-slate-900">
                      {completionPercent}%
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {completedSteps} of 4 steps
                    </p>
                  </div>

                  <div className="grid h-16 w-16 place-items-center rounded-full border-[7px] border-violet-100 border-r-cyan-400 border-t-blue-500">
                    <GaugeCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEditMode ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-xs font-semibold leading-5 text-emerald-800 sm:text-sm">
                  Passport edit mode updates only your own student profile. Admin controls are not exposed.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function CompactSignalCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

function InlineExitDock() {
  return (
    <Link
      href="/dashboard"
      className="group inline-flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-sky-50"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-violet-500 text-white shadow-sm">
        <Home className="h-4 w-4" />
      </span>

      <span className="text-left">
        <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
          Exit edit mode
        </span>
        <span className="block text-xs font-bold text-slate-700">
          Back to dashboard
        </span>
      </span>

      <ArrowLeft className="h-4 w-4 text-slate-400 transition group-hover:-translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );
}
