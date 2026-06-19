"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";

import {
  ecosystemNavigation,
  portalNavigation,
  primaryNavigation,
} from "@/data/omni-ecosystem";
import ProfileDropdown from "@/components/profile/platform/ProfileDropdown";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function CompetitionNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-[0_10px_35px_rgba(15,23,42,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[92px] w-full max-w-[1600px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Go to Omni Skills Olympiad home"
            className="group inline-flex shrink-0 items-center rounded-2xl pl-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="relative flex h-[72px] w-[280px] items-center overflow-visible sm:w-[310px]">
              <Image
  src="/brand/omni-logo-new.jpeg"
  alt="Omni Skills Olympiad"
  width={2048}
  height={397}
  priority
  className="h-12 w-auto object-contain object-left transition duration-200 group-hover:scale-[1.02] sm:h-14 lg:h-16"
/>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Primary navigation"
          >
            {primaryNavigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? "bg-blue-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.18)]"
                      : "text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden h-12 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 shadow-inner shadow-white 2xl:flex">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search OMNI ecosystem..."
                className="w-60 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search Omni Skills Olympiad"
              />
            </div>

            <Link
              href="/login"
              className="hidden min-h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_38px_rgba(37,99,235,0.12)] lg:inline-flex"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                <GoogleIcon className="h-5 w-5" />
              </span>
              Login
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
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 xl:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="hidden border-t border-slate-100 bg-white/80 xl:block">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-8 py-2.5">
            <nav className="flex items-center gap-2" aria-label="Ecosystem navigation">
              {ecosystemNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav className="flex items-center gap-2" aria-label="Portal navigation">
              {portalNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
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
              className="fixed right-0 top-0 z-[80] flex h-full w-[390px] max-w-[92vw] flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Go to Omni Skills Olympiad home"
                  className="relative flex h-[66px] w-[250px] items-center overflow-visible pl-1"
                >
                  <Image
                    src="/brand/omni-logo-h.png"
                    alt="Omni Skills Olympiad"
                    width={1191}
                    height={843}
                    className="h-auto w-57.5 object-contain object-left"
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
                  placeholder="Search OMNI ecosystem..."
                  className="w-full bg-transparent text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  aria-label="Search Omni Skills Olympiad"
                />
              </div>

              <MobileGroup title="Main">
                {primaryNavigation.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      active={active}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </MobileLink>
                  );
                })}
              </MobileGroup>

              <MobileGroup title="Ecosystem">
                {ecosystemNavigation.map((item) => (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    active={pathname === item.href}
                    onClick={() => setMobileOpen(false)}
                    icon={<BookOpenCheck className="h-5 w-5" />}
                  >
                    {item.label}
                  </MobileLink>
                ))}
              </MobileGroup>

              <MobileGroup title="Portals">
                {portalNavigation.map((item) => (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    active={pathname === item.href}
                    onClick={() => setMobileOpen(false)}
                    icon={
                      item.label.includes("Industry") ? (
                        <Building2 className="h-5 w-5" />
                      ) : item.label.includes("Career") ? (
                        <BriefcaseBusiness className="h-5 w-5" />
                      ) : (
                        <UserRound className="h-5 w-5" />
                      )
                    }
                  >
                    {item.label}
                  </MobileLink>
                ))}
              </MobileGroup>

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

function MobileGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>

      <nav className="space-y-2">{children}</nav>
    </section>
  );
}

function MobileLink({
  href,
  active,
  onClick,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex min-h-13 items-center gap-3 rounded-2xl px-4 py-3 text-base font-black transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {icon ? icon : null}
      {children}
    </Link>
  );
}
