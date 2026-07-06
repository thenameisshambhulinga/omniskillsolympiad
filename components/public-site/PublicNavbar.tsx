"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { publicNavigation } from "@/data/public-site";

const observedSections = publicNavigation.map((item) => item.href.slice(1));

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = observedSections
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.08, 0.2, 0.45],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [mobileOpen]);

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[220] -translate-y-24 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white outline-none transition focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-[140] border-b border-slate-200/80 bg-white/90 shadow-[0_10px_34px_rgba(15,23,42,0.045)] backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[74px] w-full max-w-[1660px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            aria-label="OMNI Skills Olympiad public website home"
            className="flex min-w-0 shrink items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            <Image
              src="/brand/omni-logo-new.jpeg"
              alt="OMNI Skills Olympiad"
              width={2635}
              height={512}
              priority
              sizes="(max-width: 640px) 150px, 210px"
              className="h-auto w-[150px] object-contain sm:w-[190px] lg:w-[210px]"
            />
          </a>

          <nav
            aria-label="Public website navigation"
            className="ml-auto hidden items-center gap-1 xl:flex"
          >
            {publicNavigation.map((item) => {
              const sectionId = item.href.slice(1);
              const active = activeSection === sectionId;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "location" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 ${
                    active
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-4">
            <Link
              href="/auth/continue"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1959d1] px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(25,89,209,0.2)] outline-none transition hover:-translate-y-0.5 hover:bg-[#1248b3] focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:px-5"
            >
              <span className="sm:hidden">Enter</span>
              <span className="hidden sm:inline">Enter OSO</span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open public navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="oso-public-mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close public navigation menu"
              className="fixed inset-0 z-[170] cursor-default bg-slate-950/38 backdrop-blur-sm"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <motion.aside
              ref={dialogRef}
              id="oso-public-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Public navigation"
              onKeyDown={handleDialogKeyDown}
              className="fixed right-0 top-0 z-[180] flex h-dvh w-[390px] max-w-[92vw] flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl sm:p-7"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <a
                  href="#home"
                  onClick={closeMenu}
                  className="min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  <Image
                    src="/brand/omni-logo-new.jpeg"
                    alt="OMNI Skills Olympiad"
                    width={2635}
                    height={512}
                    className="h-auto w-[190px] object-contain"
                  />
                </a>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col" aria-label="Mobile public navigation">
                {publicNavigation.map((item, index) => {
                  const sectionId = item.href.slice(1);
                  const active = activeSection === sectionId;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "location" : undefined}
                      className={`group flex min-h-14 items-center justify-between border-b border-slate-100 px-2 py-3 text-base font-bold outline-none transition focus-visible:bg-blue-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 ${
                        active ? "text-blue-800" : "text-slate-700 hover:text-slate-950"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 text-xs font-black text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  );
                })}
              </nav>

              <div className="mt-auto pt-8">
                <div className="rounded-3xl bg-[#0b1730] p-6 text-white">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-200">
                    Existing OSO application
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-white">
                    Ready to participate?
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-6 text-white/70">
                    Continue through the established login, onboarding, and role-protected platform flow.
                  </p>
                  <Link
                    href="/auth/continue"
                    onClick={closeMenu}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#0b1730] outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-200"
                  >
                    Enter OSO platform
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
