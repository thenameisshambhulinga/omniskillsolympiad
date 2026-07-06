import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Home,
  Radar,
  Search,
  ShieldAlert,
  Trophy,
} from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f9fa] px-5 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_84%_20%,rgba(124,58,237,0.10),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(250,204,21,0.16),transparent_34%)]"
      />

      <section className="relative z-10 grid w-full max-w-6xl gap-8 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/82 p-6 shadow-[0_28px_86px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-violet-600 via-blue-600 via-emerald-500 via-yellow-400 to-red-500"
        />

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <ShieldAlert className="h-4 w-4" />
            Route Not Found
          </div>

          <h1 className="oso-heading mt-6 text-7xl font-black leading-none text-slate-950 sm:text-8xl">
            404
          </h1>

          <h2 className="oso-heading mt-5 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            This page is outside the OMNI skill arena.
          </h2>

          <p className="mt-5 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            The page you are trying to open does not exist, moved, or is not
            available yet. Continue your engineering journey from a valid OMNI
            destination.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Home className="h-5 w-5" />
              Go Home
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/daily-challenges"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              <Search className="h-5 w-5" />
              Daily Challenges
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <MiniRoutePill icon={<Radar className="h-4 w-4" />} label="Search Valid Routes" />
            <MiniRoutePill icon={<Trophy className="h-4 w-4" />} label="Continue Competing" />
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/illustrations/oso/laptop-exploerer.png"
            alt="Student exploring the OMNI engineering ecosystem"
            width={900}
            height={700}
            priority
            className="h-auto w-full max-w-[560px] object-contain drop-shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
          />
        </div>
      </section>
    </main>
  );
}

function MiniRoutePill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-blue-700">
      {icon}
      {label}
    </span>
  );
}