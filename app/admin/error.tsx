"use client";

import Link from "next/link";
import { DatabaseZap, RefreshCcw, ShieldAlert } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  console.error("ADMIN ROUTE ERROR:", error);

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-12 text-white">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-red-400/20 bg-white/[0.05] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/25 bg-red-400/10 text-red-200">
          <DatabaseZap className="h-7 w-7" />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.12em] text-red-200">
          Admin safe boundary
        </p>

        <h1 className="mt-3 text-4xl font-black leading-tight">
          Admin page failed safely.
        </h1>

        <p className="mt-4 text-base font-semibold leading-8 text-white/60">
          A server-side admin operation failed, most likely because the database
          became unreachable. The error was contained here instead of crashing
          the whole platform.
        </p>

        <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-5 py-4 text-sm font-bold leading-7 text-yellow-100">
          <div className="flex gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0" />
            <p>
              Open /api/health/db to verify database status. If DB is online,
              retry this admin page.
            </p>
          </div>
        </div>

        {error.digest ? (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/55">
            Error digest: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.04em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>

          <Link
            href="/api/health/db"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-black uppercase tracking-[0.04em] text-white/80 transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:text-blue-100"
          >
            Check DB Health
          </Link>
        </div>
      </section>
    </main>
  );
}