"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Eye,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PosterAnnouncement } from "@/components/landing/PosterAnnouncementCarousel";
import { cn } from "@/lib/utils";

type LoginClientProps = {
  posters: PosterAnnouncement[];
  callbackUrl: string;
};

export default function LoginClient({ posters, callbackUrl }: LoginClientProps) {
  const publishedPosters = useMemo(() => {
    return posters.filter((poster) => poster.imageUrl && poster.title).slice(0, 24);
  }, [posters]);

  const [activePosterIndex, setActivePosterIndex] = useState(0);
  const [selectedPosterIndex, setSelectedPosterIndex] = useState<number | null>(null);

  useEffect(() => {
    if (publishedPosters.length <= 1 || selectedPosterIndex !== null) {
      return;
    }

    const timer = window.setInterval(() => {
      setActivePosterIndex((current) => (current + 1) % publishedPosters.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [publishedPosters.length, selectedPosterIndex]);

  const activePoster = publishedPosters[activePosterIndex] ?? null;

  return (
    <main className="relative min-h-screen bg-[linear-gradient(135deg,#edf4ff_0%,#f8fbff_44%,#f7f1ff_100%)] p-3 text-slate-950 sm:p-4 lg:h-[100dvh] lg:overflow-hidden lg:p-5">
      <LoginBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-4 lg:h-full lg:grid-cols-[0.92fr_1.08fr] xl:gap-5">
        <section className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.8rem] border border-slate-200/90 bg-white/96 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:min-h-0 lg:justify-center lg:p-10 xl:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_88%_84%,rgba(168,85,247,0.08),transparent_28%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[560px]">
            <BrandMark />

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" />
              Omni Skills Olympiad
            </div>

            <h1 className="mt-6 max-w-[11ch] text-[2.5rem] font-black leading-[1.02] tracking-tight text-slate-900 sm:text-[3rem] lg:text-[3.55rem] xl:text-[4rem]">
              Build skills. Prove capability. Compete globally.
            </h1>

            <p className="mt-5 max-w-[50ch] text-sm font-medium leading-6 text-slate-600 sm:text-[15px] sm:leading-7 lg:text-base lg:leading-7">
              Access live announcements and continue securely into the OSO competition workspace with your verified Google account.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                "Live announcements",
                "Verified access",
                "Competition workspace",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid min-h-[680px] gap-4 lg:min-h-0 lg:grid-rows-[minmax(0,1.2fr)_minmax(0,0.8fr)] xl:gap-5">
          <div className="min-h-0 rounded-[1.8rem] border border-slate-200 bg-white/96 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5">
            {activePoster ? (
              <PosterBoardCard
                poster={activePoster}
                posters={publishedPosters}
                activeIndex={activePosterIndex}
                onSelect={setActivePosterIndex}
                onOpen={(index) => setSelectedPosterIndex(index)}
              />
            ) : (
              <EmptyPosterHero />
            )}
          </div>

          <div className="flex min-h-0 flex-col justify-center rounded-[1.8rem] border border-slate-200 bg-white/96 p-6 shadow-[0_24px_70px_rgba(76,29,149,0.08)] backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 sm:text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure access
            </div>

            <h2 className="mt-4 text-[1.9rem] font-black leading-tight tracking-tight text-slate-900 sm:text-[2.15rem] lg:text-[2.35rem]">
              Continue to Omni Skills Olympiad
            </h2>

            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
              Sign in with Google to enter your verified competition workspace.
            </p>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="group/google relative mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-[1rem] border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-950 shadow-[0_12px_34px_rgba(15,23,42,0.08)] outline-none transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_18px_42px_rgba(37,99,235,0.14)] focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              <span className="absolute inset-0 rounded-[1rem] bg-[linear-gradient(90deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] opacity-0 transition duration-500 group-hover/google:opacity-10" />
              <span className="absolute inset-[1px] rounded-[0.95rem] bg-white" />

              <GoogleIcon />
              <span className="relative z-10">Continue with Google</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition group-hover/google:translate-x-1" />
            </button>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500">
              <span>Protected sign-in</span>
              <span>One-click access</span>
              <span>Verified workspace</span>
            </div>
          </div>
        </section>
      </div>

      <PosterGalleryModal
        posters={publishedPosters}
        activeIndex={selectedPosterIndex}
        onSelect={setSelectedPosterIndex}
        onClose={() => setSelectedPosterIndex(null)}
      />
    </main>
  );
}

function BrandMark() {
  return (
    <div className="flex justify-start">
      <div className="rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <img
          src="/brand/omni-logo-new.jpeg"
          alt="Omni Skills Olympiad"
          className="h-12 w-auto object-contain sm:h-14 lg:h-16"
        />
      </div>
    </div>
  );
}

function PosterBoardCard({
  poster,
  posters,
  activeIndex,
  onSelect,
  onOpen,
}: {
  poster: PosterAnnouncement;
  posters: PosterAnnouncement[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onOpen: (index: number) => void;
}) {
  const total = posters.length;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-[1.45rem] border border-slate-200 bg-slate-50/85 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 sm:text-[11px]">
          <Eye className="h-3.5 w-3.5" />
          Live poster board
        </div>

        <div className="flex items-center gap-2 text-sm font-black text-slate-600">
          <button
            type="button"
            aria-label="Show previous poster"
            onClick={() => onSelect((activeIndex - 1 + total) % total)}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[3rem] text-center text-xs uppercase tracking-[0.12em] text-slate-500">
            {activeIndex + 1}/{total}
          </span>
          <button
            type="button"
            aria-label="Show next poster"
            onClick={() => onSelect((activeIndex + 1) % total)}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(activeIndex)}
        className="group/poster flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <AnimatePresence mode="wait">
          <motion.article
            key={poster.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="flex h-full min-h-0 flex-col"
          >
            <div className="relative flex min-h-[190px] flex-1 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef3ff_100%)] p-3 sm:min-h-[230px] lg:min-h-0">
              <img
                src={poster.mobileImageUrl || poster.imageUrl}
                alt={poster.title}
                className="max-h-full w-full object-contain transition duration-500 group-hover/poster:scale-[1.01]"
              />
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                <PosterBadge>{safeText(poster.status, "Live")}</PosterBadge>
                <PosterBadge>{safeText(poster.category, "Announcement")}</PosterBadge>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black leading-tight text-slate-900 sm:text-xl">
                    {poster.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
                    {safeText(
                      poster.subtitle,
                      "Open this poster to view the complete announcement.",
                    )}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-700">
                  <Eye className="h-4 w-4" />
                  Open poster
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </button>
    </div>
  );
}

function EmptyPosterHero() {
  return (
    <section className="flex h-full flex-col justify-center rounded-[1.45rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
      <div className="grid gap-5 sm:grid-cols-[88px_1fr_auto] sm:items-center">
        <div className="grid h-20 w-20 place-items-center rounded-[1.2rem] border border-purple-200 bg-purple-50 text-purple-700">
          <CalendarDays className="h-8 w-8" />
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Live poster board</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">No live posters yet</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Published announcements will appear here as soon as they go live.
          </p>
        </div>

        <Link
          href="/admin/announcements"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Announcement center
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function PosterGalleryModal({
  posters,
  activeIndex,
  onSelect,
  onClose,
}: {
  posters: PosterAnnouncement[];
  activeIndex: number | null;
  onSelect: (index: number | null) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        onSelect(((activeIndex ?? 0) + 1) % posters.length);
      }

      if (event.key === "ArrowLeft") {
        onSelect(((activeIndex ?? 0) - 1 + posters.length) % posters.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, onClose, onSelect, posters.length]);

  const poster = activeIndex === null ? null : posters[activeIndex] ?? null;

  return (
    <AnimatePresence>
      {poster ? (
        <motion.div
          key="poster-gallery-modal"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/78 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.8rem] border border-white/15 bg-white shadow-[0_34px_120px_rgba(0,0,0,0.4)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:scale-105 hover:border-blue-300"
              aria-label="Close poster preview"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[92vh] min-h-0 flex-1 overflow-hidden lg:grid-cols-[1.06fr_0.94fr]">
              <div className="flex min-h-[420px] items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#eef3ff_100%)] p-5">
                <img
                  src={poster.mobileImageUrl || poster.imageUrl}
                  alt={poster.title}
                  className="max-h-[76vh] w-full object-contain"
                />
              </div>

              <div className="flex min-h-0 flex-col bg-white p-6 text-slate-950 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-blue-700">
                      {safeText(poster.status, "Live")}
                    </span>
                    <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-purple-700">
                      {safeText(poster.category, "Announcement")}
                    </span>
                  </div>

                  <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Poster {(activeIndex ?? 0) + 1} of {posters.length}
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-[2rem]">
                  {poster.title}
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-[15px]">
                  {safeText(
                    poster.subtitle,
                    "This poster has been published by the OSO announcement center.",
                  )}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(((activeIndex ?? 0) - 1 + posters.length) % posters.length)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(((activeIndex ?? 0) + 1) % posters.length)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Browse announcements</p>
                  <div className="mt-4 grid max-h-[220px] grid-cols-4 gap-3 overflow-y-auto pr-1 sm:grid-cols-5">
                    {posters.map((item, index) => {
                      const active = index === activeIndex;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelect(index)}
                          className={cn(
                            "overflow-hidden rounded-xl border bg-white p-1 transition",
                            active
                              ? "border-blue-400 ring-2 ring-blue-100"
                              : "border-slate-200 hover:border-blue-200",
                          )}
                          aria-label={`Show poster ${index + 1}`}
                        >
                          <img
                            src={item.mobileImageUrl || item.imageUrl}
                            alt={item.title}
                            className="h-20 w-full rounded-lg object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Link
                  href={poster.ctaHref || "/"}
                  className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  {safeText(poster.ctaLabel, "Continue")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PosterBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
      {children}
    </span>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="relative z-10 h-5 w-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

function LoginBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_93%_22%,rgba(168,85,247,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.08),transparent_36%)]" />
      <div className="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
    </div>
  );
}

function safeText(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}
