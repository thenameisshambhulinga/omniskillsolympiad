import Link from "next/link";
import { LockKeyhole, ShieldAlert } from "lucide-react";

export default function AccessRestrictedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-red-400/20 bg-white/[0.045] p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.16),transparent_38%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.12),transparent_38%)]" />

        <div className="relative z-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-red-400/25 bg-red-400/10">
            <ShieldAlert className="h-10 w-10 text-red-200" />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-red-300">
            Access Restricted
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Admin permission required
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/55">
            This area belongs to the SIMS Skillathon admin command system. Your
            account is authenticated, but it does not have admin authority.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-cyan-200"
            >
              Go Home
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white/70 transition hover:bg-white/[0.08]"
            >
              <LockKeyhole className="h-4 w-4" />
              Switch Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}