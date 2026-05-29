"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  Trophy,
  BrainCircuit,
  Cpu,
  Search,
  Menu,
  X,
} from "lucide-react";

import ProfileDropdown from "@/components/platform/ProfileDropdown";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Challenges",
    href: "/daily-challenges",
    icon: BrainCircuit,
  },
  {
    label: "Leaderboard",
    href: "/daily-leaderboard",
    icon: Trophy,
  },
  {
    label: "Competition",
    href: "/competition",
    icon: Cpu,
  },
];

export default function CompetitionNavbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-4 py-5 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[32px] border border-white/10 bg-black/30 px-4 py-4 shadow-2xl backdrop-blur-3xl md:px-6">
          {/* LEFT */}
          <Link href="/dashboard" className="group flex items-center">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-xl transition duration-300 hover:border-cyan-400/40">
              <Image
                src="/sims-logo.png"
                alt="SIMS Logo"
                width={190}
                height={60}
                priority
                className="h-auto w-auto object-contain"
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2 overflow-hidden rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500/30"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {!active && (
                    <div className="absolute inset-0 scale-0 rounded-2xl bg-white/10 transition duration-300 group-hover:scale-100" />
                  )}

                  <Icon className="relative z-10 h-4 w-4" />

                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:flex">
              <Search className="h-4 w-4 text-white/40" />

              <input
                type="text"
                placeholder="Search ecosystem..."
                className="bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>

            <ProfileDropdown />

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[320px] flex-col border-l border-white/10 bg-black/95 p-6 backdrop-blur-3xl"
            >
              {/* TOP */}
              <div className="mb-10 flex items-center justify-between">
                <Image
                  src="/sims-logo.png"
                  alt="SIMS Logo"
                  width={150}
                  height={50}
                  className="h-auto w-auto"
                />

                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* NAV ITEMS */}
              <div className="flex flex-col gap-3">
                {navItems.map((item) => {
                  const active = pathname === item.href;

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-5 py-4 transition ${
                        active
                          ? "bg-cyan-400 text-black"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />

                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
