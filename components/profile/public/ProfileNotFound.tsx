"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, LayoutDashboard, Radar } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.055] p-8 text-center shadow-[0_34px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl" />

        <div className="relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-cyan-400/25 bg-cyan-400/10"
          >
            <Radar className="h-12 w-12 text-cyan-200" />
          </motion.div>

          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-200"
          >
            <AlertTriangle className="h-4 w-4" />
            Identity Signal Missing
          </motion.div>

          <h1 className="mt-6 text-4xl font-black text-white">
            Profile Not Found
          </h1>

          <p className="mt-5 text-sm leading-7 text-white/58">
            This engineering identity does not exist or is currently
            unavailable. Please verify the OMNI ID and try again.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-300 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              Return Dashboard
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
