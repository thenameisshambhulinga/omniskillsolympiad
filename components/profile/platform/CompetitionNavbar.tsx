"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
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

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export default function CompetitionNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function syncAuthState() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          setAuthStatus("unauthenticated");
          return;
        }

        const session = (await response.json()) as {
          user?: { email?: string | null } | null;
        };

        setAuthStatus(session?.user?.email ? "authenticated" : "unauthenticated");
      } catch {
        if (!controller.signal.aborted) {
          setAuthStatus("unauthenticated");
        }
      }
    }

    syncAuthState();

    return () => controller.abort();
  }, []);

  const isAuthenticated = authStatus === "authenticated";
  const canShowLogin = authStatus === "unauthenticated";

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/94 shadow-[0_10px_40px_rgba(15,23,42,0.045)] backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[76px] w-full max-w-[1660px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Go to Omni Skills Olympiad home"
            className="group flex shrink-0 items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="relative flex h-[52px] w-[230px] items-center overflow-visible sm:w-[250px] lg:w-[270px]">
              <Image
                src="/brand/omni-logo-new.jpeg"
                alt="Omni Skills Olympiad"
                width={2048}
                height={397}
                priority
                className="h-11 w-auto object-contain object-left transition duration-200 group-hover:scale-[1.012] sm:h-12"
              />
            </div>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center xl:flex"
            aria-label="Primary navigation"
          >
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/85 p-1 shadow-inner shadow-white">
              {primaryNavigation.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`oso-header-control inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-extrabold capitalize transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      active
                        ? "oso-soft-active border-blue-200 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden h-12 min-w-[300px] items-center gap-3 rounded-full border border-slate-200 bg-white px-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] 2xl:flex">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search OMNI ecosystem..."
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                aria-label="Search Omni Skills Olympiad"
              />
            </div>

            {canShowLogin ? (
              <Link
                href="/login"
                className="hidden min-h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_38px_rgba(37,99,235,0.12)] lg:inline-flex"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <GoogleIcon className="h-5 w-5" />
                </span>
                Login
              </Link>
            ) : null}

            {isAuthenticated ? <ProfileDropdown /> : null}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 xl:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="hidden border-t border-slate-100 bg-white/88 xl:block">
          <div className="mx-auto flex min-h-[54px] max-w-[1660px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
            <nav
              className="flex min-w-0 items-center gap-1.5"
              aria-label="Ecosystem navigation"
            >
              {ecosystemNavigation.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`oso-header-control rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                      active
                        ? "oso-soft-active border-blue-200 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <PortalSwitchboard pathname={pathname} />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-[170] bg-slate-950/35 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed right-0 top-0 z-[180] flex h-full w-[400px] max-w-[92vw] flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl"
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
                  className="relative flex h-[58px] w-[250px] items-center overflow-visible"
                >
                  <Image
                    src="/brand/omni-logo-new.jpeg"
                    alt="Omni Skills Olympiad"
                    width={2048}
                    height={397}
                    className="h-12 w-auto object-contain object-left"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-800 transition hover:bg-slate-50"
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
                  className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  aria-label="Search Omni Skills Olympiad"
                />
              </div>

              {canShowLogin ? (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mb-5 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-extrabold text-slate-950 transition hover:border-blue-300 hover:bg-slate-50"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Login with Google
                </Link>
              ) : null}

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
                      icon={<Sparkles className="h-5 w-5" />}
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

              <MobileGroup title="Portal Switchboard">
                {portalNavigation.map((item) => {
                  const meta = getPortalMeta(item.label);

                  return (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      active={pathname === item.href}
                      onClick={() => setMobileOpen(false)}
                      icon={meta.mobileIcon}
                    >
                      {meta.label}
                    </MobileLink>
                  );
                })}
              </MobileGroup>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function PortalSwitchboard({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Portal switchboard"
      className="relative flex shrink-0 items-center gap-2 rounded-[1.35rem] border border-slate-200 bg-white/90 p-1.5 shadow-[0_14px_36px_rgba(15,23,42,0.07)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Portals
        </span>
      </div>

      <div className="h-7 w-px bg-slate-200" />

      <div className="flex items-center gap-1">
        {portalNavigation.map((item) => {
          const meta = getPortalMeta(item.label);
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={meta.title}
              className={`group relative inline-flex min-h-10 items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] transition duration-200 ${
                active
                  ? meta.activeClass
                  : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-xl border ${
                  active ? meta.iconClass : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {meta.icon}
              </span>

              <span>{meta.label}</span>

              <ArrowRight className="h-3.5 w-3.5 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function getPortalMeta(label: string): {
  label: string;
  title: string;
  icon: ReactNode;
  mobileIcon: ReactNode;
  activeClass: string;
  iconClass: string;
} {
  const normalized = label.toLowerCase();

  if (normalized.includes("mentor")) {
    return {
      label: "Mentor",
      title: "Mentor Portal",
      icon: <UserRound className="h-3.5 w-3.5" />,
      mobileIcon: <UserRound className="h-5 w-5" />,
      activeClass:
        "border-violet-200 bg-violet-50 text-violet-700 shadow-sm",
      iconClass: "border-violet-200 bg-white text-violet-700",
    };
  }

  if (normalized.includes("industry")) {
    return {
      label: "Industry",
      title: "Industry Portal",
      icon: <Building2 className="h-3.5 w-3.5" />,
      mobileIcon: <Building2 className="h-5 w-5" />,
      activeClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm",
      iconClass: "border-emerald-200 bg-white text-emerald-700",
    };
  }

  if (normalized.includes("admin")) {
    return {
      label: "Admin",
      title: "Admin Portal",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      mobileIcon: <ShieldCheck className="h-5 w-5" />,
      activeClass:
        "border-rose-200 bg-rose-50 text-rose-700 shadow-sm",
      iconClass: "border-rose-200 bg-white text-rose-700",
    };
  }

  return {
    label: "Student",
    title: "Student Portal",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    mobileIcon: <GraduationCap className="h-5 w-5" />,
    activeClass:
      "border-blue-200 bg-blue-50 text-blue-700 shadow-sm",
    iconClass: "border-blue-200 bg-white text-blue-700",
  };
}

function MobileGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-5">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
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
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex min-h-13 items-center gap-3 rounded-2xl border px-4 py-3 text-base font-extrabold transition ${
        active
          ? "oso-soft-active border-blue-200 bg-blue-50 text-blue-700"
          : "border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {icon ? icon : null}
      {children}
    </Link>
  );
}
