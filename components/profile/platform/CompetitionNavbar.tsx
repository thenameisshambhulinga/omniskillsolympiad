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
  UserRound,
  X,
} from "lucide-react";

import ProfileDropdown from "@/components/profile/platform/ProfileDropdown";
import GoogleIcon from "@/components/ui/GoogleIcon";

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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-[0_10px_35px_rgba(15,23,42,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-[96px] w-full max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Go to Omni Skills Olympiad home"
            className="group inline-flex shrink-0 items-center rounded-2xl pl-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="relative flex h-[78px] w-[332px] items-center overflow-visible">
              <Image
                src="/brand/omni-logo-h.png"
                alt="Omni Skills Olympiad"
                width={1191}
                height={843}
                priority
                className="h-auto w-[300px] object-contain object-left brightness-0 transition duration-200 group-hover:scale-[1.02]"
              />
            </div>
          </Link>

          <nav
            className="hidden items-center gap-2 lg:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 py-3 text-[15px] font-black outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? "bg-blue-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.18)]"
                      : "text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden h-14 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 shadow-inner shadow-white xl:flex">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search OSO..."
                className="w-64 bg-transparent text-[16px] tracking-[0.01em]font-bold text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search Omni Skills Olympiad"
              />
            </div>

            <Link
              href="/login"
              className="hidden min-h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-base tracking-[0.01em]font-black text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_38px_rgba(37,99,235,0.12)] lg:inline-flex"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                <GoogleIcon className="h-5 w-5" />
              </span>
              <span>Login</span>
            </Link>

            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>

            <div className="lg:hidden">
              <ProfileDropdown />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
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
              className="fixed right-0 top-0 z-[80] flex h-full w-[360px] max-w-[90vw] flex-col border-l border-slate-200 bg-white p-5 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Go to Omni Skills Olympiad home"
                  className="relative flex h-[66px] w-[260px] items-center overflow-visible pl-1"
                >
                  <Image
                    src="/brand/omni-logo-h.png"
                    alt="Omni Skills Olympiad"
                    width={1191}
                    height={843}
                    className="h-auto w-[238px] object-contain object-left brightness-0"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition hover:bg-slate-50"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search OSO..."
                  className="w-full bg-transparent text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  aria-label="Search Omni Skills Olympiad"
                />
              </div>

              <nav className="space-y-2" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 text-base font-black transition ${
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

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-black text-slate-950 transition hover:border-blue-300 hover:bg-slate-50"
              >
                <GoogleIcon className="h-5 w-5" />
                Login with Google
              </Link>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}