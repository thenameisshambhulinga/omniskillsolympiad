"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircuitBoard,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  Swords,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

import LogoutButton from "@/components/LogoutButton";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Create Challenge",
    href: "/admin/create-daily-challenge",
    icon: PlusCircle,
  },
  {
    label: "Manage Challenges",
    href: "/admin/manage-challenges",
    icon: CircuitBoard,
  },
  {
    label: "Leaderboard Analytics",
    href: "/daily-leaderboard",
    icon: Trophy,
  },
  {
    label: "Competition Control",
    href: "/admin/competition",
    icon: Swords,
  },
];

export default function AdminSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-[0_0_34px_rgba(34,211,238,0.1)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-slate-950/55 text-lg font-black text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
                A
              </div>

              <div>
                <p className="font-black text-white">Administrator</p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Enterprise Control
                </p>
              </div>
            </div>

           
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Verified
          </div>
        </div>
        

        <nav aria-label="Admin navigation" className="mt-6 space-y-2">
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-3 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.14)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                      : "group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-transparent px-4 py-3 text-white/62 transition hover:border-white/10 hover:bg-white/[0.055] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                  }
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-active-indicator"
                      className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]"
                    />
                  )}

                  <span
                    className={
                      isActive
                        ? "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
                        : "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/45 transition group-hover:text-cyan-200"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="relative z-10 text-sm font-bold">
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.span
                      aria-hidden="true"
                      animate={{ opacity: [0.3, 0.75, 0.3] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.2),transparent_55%)]"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
           <LogoutButton />
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-purple-400/20 bg-purple-400/10 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-purple-400/25 bg-purple-400/10 p-2.5">
              <BarChart3 className="h-5 w-5 text-purple-200" />
            </div>

            <div>
              <p className="text-sm font-black text-white">Command Sync</p>

              <p className="mt-1 text-xs text-white/45">
                Admin network online
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{ x: ["-20%", "0%", "-20%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-3/4 rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_24px_rgba(34,211,238,0.32)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}