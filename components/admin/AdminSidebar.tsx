"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircuitBoard,
  Crown,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Swords,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

import LogoutButton from "@/components/LogoutButton";

type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  match: string[];
  description: string;
};

const navItems: AdminNavItem[] = [
  {
    label: "Command Center",
    href: "/admin",
    icon: LayoutDashboard,
    match: ["/admin"],
    description: "Unified admin overview",
  },
  {
    label: "Daily Challenge Control",
    href: "/admin/manage-challenges",
    icon: CircuitBoard,
    match: [
      "/admin/manage-challenges",
      "/admin/create-daily-challenge",
      "/admin/challenge",
    ],
    description: "Create, publish and manage daily missions",
  },
  {
    label: "Competition Control",
    href: "/admin/competition",
    icon: Swords,
    match: ["/admin/competition", "/competition-control"],
    description: "Offline event and evaluation control",
  },
  {
    label: "Poster Publisher",
    href: "/admin/announcements",
    icon: Megaphone,
    match: ["/admin/announcements"],
    description: "Landing and login poster operations",
  },
  {
    label: "Leaderboard View",
    href: "/daily-leaderboard",
    icon: Trophy,
    match: ["/daily-leaderboard"],
    description: "Public ranking intelligence",
  },
];

function isNavActive(pathname: string, item: AdminNavItem) {
  if (item.href === "/admin") {
    return pathname === "/admin";
  }

  return item.match.some(
    (pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`),
  );
}

export default function AdminSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-slate-200/90 bg-white/78 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_34%)]"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="rounded-[1.75rem] border border-blue-200 bg-blue-50/70 p-4 shadow-[0_12px_34px_rgba(37,99,235,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-700 shadow-sm">
              <Crown className="h-6 w-6" />
            </div>

            <div>
              <p className="font-black text-slate-950">Administrator</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Command Authority
              </p>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Verified
          </div>
        </div>

        <nav aria-label="Admin navigation" className="mt-6 space-y-2">
          {navItems.map((item, index) => {
            const isActive = isNavActive(pathname, item);
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
                      ? "group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-blue-200 bg-blue-600 px-4 py-3 text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      : "group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-transparent px-4 py-3 text-slate-600 transition hover:border-slate-200 hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  }
                >
                  {isActive ? (
                    <motion.span
                      layoutId="admin-active-indicator"
                      className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-white"
                    />
                  ) : null}

                  <span
                    className={
                      isActive
                        ? "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white"
                        : "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition group-hover:border-blue-200 group-hover:text-blue-700"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="relative z-10 min-w-0">
                    <span className="block text-sm font-black">
                      {item.label}
                    </span>
                    <span
                      className={
                        isActive
                          ? "mt-1 block text-[11px] font-semibold leading-5 text-white/76"
                          : "mt-1 block text-[11px] font-semibold leading-5 text-slate-400"
                      }
                    >
                      {item.description}
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}

          <div className="pt-2">
            <LogoutButton />
          </div>
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-yellow-200 bg-yellow-50/80 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-yellow-200 bg-white p-2.5 text-yellow-700">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">Command Sync</p>
              <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                One admin space. Zero duplicate control.
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <motion.div
              animate={{ x: ["-20%", "0%", "-20%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}