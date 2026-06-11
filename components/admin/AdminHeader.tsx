"use client";

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
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 px-4 py-4 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:px-5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_34%)]"
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open admin navigation"
              onClick={onOpenSidebar}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Enterprise Command Network
              </p>

              <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
                Admin Operations Center
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <StatusPill
              icon={<Radio className="h-4 w-4" />}
              label="System Status"
              value="Online"
              tone="cyan"
            />

            <StatusPill
              icon={<Sparkles className="h-4 w-4" />}
              label="Competition"
              value="Live"
              tone="purple"
            />

            <StatusPill
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Security"
              value="Verified"
              tone="emerald"
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              Live
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
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "purple" | "emerald";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
      : tone === "purple"
        ? "border-purple-400/25 bg-purple-400/10 text-purple-200"
        : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";

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
