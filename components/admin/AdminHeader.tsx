"use client";

import type { ReactNode } from "react";
import { Menu, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 px-2 pt-2 sm:px-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/82 px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_34%)]"
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open admin navigation"
              onClick={onOpenSidebar}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
                OSO Admin
              </p>

              <h1 className="mt-1 truncate text-xl font-black text-slate-950 sm:text-2xl">
                Unified Operations Center
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <StatusPill
              icon={<Radio className="h-4 w-4" />}
              label="System"
              value="Online"
              tone="blue"
            />

            <StatusPill
              icon={<Sparkles className="h-4 w-4" />}
              label="Control"
              value="Unified"
              tone="yellow"
            />

            <StatusPill
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Access"
              value="Admin Only"
              tone="emerald"
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Admin
            </span>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

function StatusPill({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "blue" | "yellow" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "yellow"
        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-2 ${toneClass}`}
    >
      {icon}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">
          {label}
        </p>
        <p className="text-sm font-black">{value}</p>
      </div>
    </motion.div>
  );
}