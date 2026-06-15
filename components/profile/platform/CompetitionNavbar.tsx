"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BrainCircuit,
  Cpu,
  LayoutDashboard,
  Menu,
  Search,
  Trophy,
  X,
} from "lucide-react";

import ProfileDropdown from "@/components/profile/platform/ProfileDropdown";

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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Go to Omni Skills Olympiad home"
            className="group inline-flex shrink-0 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="relative h-[58px] w-[222px] overflow-hidden">
              <Image
                src="/brand/omni-logo-h.png"
                alt="Omni Skills Olympiad"
                width={1191}
                height={843}
                priority
                className="absolute left-1/2 top-1/2 w-[240px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain brightness-0 transition duration-200 group-hover:scale-[1.02]"
              />
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 xl:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search OSO..."
                className="w-48 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <ProfileDropdown />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-slate-950/35 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed right-0 top-0 z-[80] flex h-full w-[340px] max-w-[88vw] flex-col border-l border-slate-200 bg-white p-5 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="relative h-[54px] w-[205px] overflow-hidden">
                  <Image
                    src="/brand/omni-logo-h.png"
                    alt="Omni Skills Olympiad"
                    width={1191}
                    height={843}
                    className="absolute left-1/2 top-1/2 w-[220px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain brightness-0"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition hover:bg-slate-50"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-2" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}