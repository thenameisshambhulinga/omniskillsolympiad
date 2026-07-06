import Link from "next/link";
import { DatabaseZap, RefreshCcw, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DatabaseUnavailablePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-12 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-700">
          <DatabaseZap className="h-7 w-7" />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.08em] text-red-700">
          Database unavailable
        </p>

        <h1 className="oso-heading mt-3 text-4xl font-black leading-tight text-slate-950">
          The platform is running, but the database is not reachable.
        </h1>

        <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
          Your admin code is protected now. This page appears instead of a
          runtime crash when Prisma cannot connect to Supabase.
        </p>

        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm font-bold leading-7 text-yellow-800">
          <div className="flex gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0" />
            <p>
              Check whether your Supabase project is active, your DATABASE_URL
              is correct, your password is URL-encoded, and the pooler host is
              reachable from your network.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.04em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry Admin
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.04em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}