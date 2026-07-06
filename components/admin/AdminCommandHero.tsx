"use client";

import Link from "next/link";
import { ArrowRight, Radio, ShieldCheck, Sparkles } from "lucide-react";

import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoStatusPill from "@/components/oso/OsoStatusPill";

type AdminCommandHeroProps = {
  totalUsers: number;
  onboardedUsers: number;
  totalChallenges: number;
  livePosters: number;
};

export default function AdminCommandHero({
  totalUsers,
  onboardedUsers,
  totalChallenges,
  livePosters,
}: AdminCommandHeroProps) {
  return (
    <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
        <div>
          <div className="flex flex-wrap gap-3">
            <OsoStatusPill
              label="Admin Verified"
              tone="emerald"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
            />
            <OsoStatusPill
              label="Unified Control"
              tone="blue"
              icon={<Radio className="h-3.5 w-3.5" />}
            />
            <OsoStatusPill
              label="Production Mode"
              tone="yellow"
              icon={<Sparkles className="h-3.5 w-3.5" />}
            />
          </div>

          <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Manage OSO from one{" "}
            <span className="text-blue-600">clean command center.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
            Control challenges, announcement posters, competitions and platform
            visibility from a focused admin hub without touching the existing
            backend workflows.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/manage-challenges"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Manage Challenges
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/announcements"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              Publish Poster
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Platform Snapshot
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <HeroMiniMetric label="Users" value={totalUsers} />
            <HeroMiniMetric label="Onboarded" value={onboardedUsers} />
            <HeroMiniMetric label="Challenges" value={totalChallenges} />
            <HeroMiniMetric label="Live Posters" value={livePosters} />
          </div>
        </div>
      </div>
    </OsoGlassSurface>
  );
}

function HeroMiniMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}