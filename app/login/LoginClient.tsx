"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Cpu,
  Eye,
  Flame,
  Layers3,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PosterAnnouncement } from "@/components/landing/PosterAnnouncementCarousel";
import { cn } from "@/lib/utils";

type LoginClientProps = {
  posters: PosterAnnouncement[];
};

const ecosystemCards = [
  {
    title: "Daily Missions",
    text: "Solve protected engineering challenges every day.",
    icon: <Target className="h-5 w-5" />,
    tone: "cyan",
  },
  {
    title: "Skill Passport",
    text: "Build a verified profile of your strengths.",
    icon: <BadgeCheck className="h-5 w-5" />,
    tone: "emerald",
  },
  {
    title: "OMNI Levels",
    text: "Progress from campus league to global pathway.",
    icon: <Layers3 className="h-5 w-5" />,
    tone: "purple",
  },
];

const ecosystemPills = [
  "Campus League",
  "District League",
  "State League",
  "National League",
  "Global Pathway",
];

const loginSteps = ["Explore", "Authenticate", "Compete"];

export default function LoginClient({ posters }: LoginClientProps) {
  const publishedPosters = useMemo(() => {
    return posters.filter((poster) => poster.imageUrl && poster.title);
  }, [posters]);

  const [activePosterIndex, setActivePosterIndex] = useState(0);
  const [selectedPoster, setSelectedPoster] =
    useState<PosterAnnouncement | null>(null);

  useEffect(() => {
    if (publishedPosters.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActivePosterIndex((current) => (current + 1) % publishedPosters.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [publishedPosters.length]);

  const activePoster = publishedPosters[activePosterIndex] ?? publishedPosters[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05091f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <LoginBackground />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1680px] items-center gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#071331]/88 p-6 shadow-[0_38px_140px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(168,85,247,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />

          <div className="relative z-10 flex min-h-full flex-col gap-7">
            <BrandMark />

            {activePoster ? (
              <LivePosterHero
                poster={activePoster}
                posters={publishedPosters}
                activeIndex={activePosterIndex}
                onSelect={setActivePosterIndex}
                onOpen={setSelectedPoster}
              />
            ) : (
              <EmptyPosterHero />
            )}

            <div className="grid flex-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
                  <Rocket className="h-4 w-4" />
                  Engineering Skill Ecosystem
                </div>

                <h1 className="mt-6 max-w-2xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
                  Build. Solve.
                  <span className="block bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Rise through OMNI.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/62">
                  Join daily missions, grow your Skill Passport, climb OMNI
                  levels, and compete through campus, district, state, national,
                  and global pathways.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {ecosystemPills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-white/64"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <MiniEcosystemCard
                    icon={<Trophy className="h-5 w-5" />}
                    title="Competitions"
                    text="Engineering olympiads and skill battles."
                    tone="yellow"
                  />
                  <MiniEcosystemCard
                    icon={<BarChart3 className="h-5 w-5" />}
                    title="Leaderboards"
                    text="Rank, recognition, and growth signals."
                    tone="cyan"
                  />
                  <MiniEcosystemCard
                    icon={<Flame className="h-5 w-5" />}
                    title="Streaks"
                    text="Protected consistency tracking."
                    tone="purple"
                  />
                </div>
              </div>

              <div className="relative hidden min-h-[430px] lg:block">
                <HologramCore />

                {ecosystemCards.map((mission, index) => (
                  <FloatingEcosystemCard
                    key={mission.title}
                    mission={mission}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.75rem] border border-white bg-white p-6 text-slate-950 shadow-[0_38px_140px_rgba(76,29,149,0.22),0_0_60px_rgba(59,130,246,0.15)] sm:p-8 lg:p-10 xl:min-h-[calc(100vh-5rem)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(59,130,246,0.11),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(168,85,247,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,250,252,0.78))]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-200/45 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

          <div className="relative z-10 flex min-h-full flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Secure Access
            </div>

            <h2 className="mt-8 max-w-2xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Continue to Omni Skills Olympiad
            </h2>

            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600">
              Explore published announcements, authenticate with Google, and
              enter your engineering competition workspace.
            </p>

            <LoginStepTrack />

            <button
              type="button"
             onClick={() =>
  signIn("google", {
    callbackUrl: getSafeLoginCallbackUrl(),
  })
}
              className="group/google relative mt-9 inline-flex min-h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_18px_54px_rgba(15,23,42,0.10)] outline-none transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_22px_70px_rgba(37,99,235,0.16)] focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              <span className="absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(90deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] opacity-0 transition duration-500 group-hover/google:opacity-12" />
              <span className="absolute inset-[1px] rounded-[1.25rem] bg-white" />

              <GoogleIcon />

              <span className="relative z-10">Continue with Google</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition group-hover/google:translate-x-1" />
            </button>

            <div className="mt-7 grid gap-3">
              <AccessBenefit
                icon={<LockKeyhole className="h-5 w-5" />}
                title="Secure Authentication"
                text="Protected by Google’s advanced security."
                tone="blue"
              />
              <AccessBenefit
                icon={<Zap className="h-5 w-5" />}
                title="One-click Sign In"
                text="Fast, simple, and seamless access."
                tone="cyan"
              />
              <AccessBenefit
                icon={<BadgeCheck className="h-5 w-5" />}
                title="Verified Student Access"
                text="Exclusive workspace for verified participants."
                tone="purple"
              />
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              Your data is safe and will never be shared.
            </p>
          </div>
        </section>
      </div>

      <PosterPreviewModal
        poster={selectedPoster}
        onClose={() => setSelectedPoster(null)}
      />
    </main>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.6rem] border border-cyan-300/25 bg-white shadow-[0_0_55px_rgba(34,211,238,0.18)]">
        <img
          src="/brand/omni-logo-new.jpeg"
          alt="Omni Skills Olympiad"
          className="h-full w-full object-contain p-2"
        />
      </div>

      <div>
        <p className="text-2xl font-black uppercase tracking-[0.28em] text-white">
          Omni Skills
        </p>
        <p className="text-2xl font-black uppercase tracking-[0.28em] text-white">
          Olympiad
        </p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Build • Solve • Lead
        </p>
      </div>
    </div>
  );
}

function LivePosterHero({
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
  onOpen: (poster: PosterAnnouncement) => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-white/[0.06] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100">
          <Sparkles className="h-4 w-4" />
          Live Poster Board
        </div>

        <div className="flex items-center gap-2">
          {posters.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show poster ${index + 1}`}
              onClick={() => onSelect(index)}
              className={
                index === activeIndex
                  ? "h-2.5 w-8 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                  : "h-2.5 w-2.5 rounded-full bg-white/20 transition hover:bg-white/50"
              }
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(poster)}
        className="group/poster relative block min-h-[21rem] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <AnimatePresence mode="wait">
          <motion.article
            key={poster.id}
            initial={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={poster.mobileImageUrl || poster.imageUrl}
              alt={poster.title}
              className="h-full w-full object-cover transition duration-700 group-hover/poster:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/15" />

            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/80 backdrop-blur-xl">
              <Eye className="h-3.5 w-3.5" />
              Open Poster
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <PosterBadge>{safeText(poster.status, "Live")}</PosterBadge>
                <PosterBadge>{safeText(poster.category, "Announcement")}</PosterBadge>
              </div>

              <h2 className="max-w-3xl text-3xl font-black text-white sm:text-4xl">
                {poster.title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/66">
                {safeText(
                  poster.subtitle,
                  "Open this poster to view the complete announcement.",
                )}
              </p>
            </div>
          </motion.article>
        </AnimatePresence>
      </button>
    </section>
  );
}

function EmptyPosterHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="grid gap-5 sm:grid-cols-[100px_1fr_auto] sm:items-center">
        <div className="grid h-20 w-20 place-items-center rounded-[1.5rem] border border-purple-300/25 bg-purple-400/10 text-purple-100 shadow-[0_0_44px_rgba(168,85,247,0.18)]">
          <CalendarDays className="h-9 w-9" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">
            Live Poster Board
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            No Live Posters Yet
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/56">
            Admin can publish posters from Announcement Center. No manual or
            mock poster data is shown here.
          </p>
        </div>

        <Link
          href="/admin/announcements"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_16px_44px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5"
        >
          Announcement Center
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function PosterPreviewModal({
  poster,
  onClose,
}: {
  poster: PosterAnnouncement | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {poster ? (
        <motion.div
          key="poster-preview-modal"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/82 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-[0_34px_120px_rgba(0,0,0,0.45)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-black/65"
              aria-label="Close poster preview"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[1.08fr_0.92fr]">
              <div className="min-h-[420px] bg-slate-950">
                <img
                  src={poster.mobileImageUrl || poster.imageUrl}
                  alt={poster.title}
                  className="h-full min-h-[420px] w-full object-contain"
                />
              </div>

              <div className="bg-white p-6 text-slate-950 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-blue-700">
                    {safeText(poster.status, "Live")}
                  </span>
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-purple-700">
                    {safeText(poster.category, "Announcement")}
                  </span>
                </div>

                <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950">
                  {poster.title}
                </h2>

                <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
                  {safeText(
                    poster.subtitle,
                    "This poster has been published by the admin announcement center.",
                  )}
                </p>

                <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    OSO Ecosystem
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ecosystemPills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={poster.ctaHref || "/"}
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
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

function MiniEcosystemCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: "yellow" | "cyan" | "purple";
}) {
  const toneClass =
    tone === "yellow"
      ? "text-yellow-200 border-yellow-300/20 bg-yellow-300/8"
      : tone === "cyan"
        ? "text-cyan-200 border-cyan-300/20 bg-cyan-300/8"
        : "text-purple-200 border-purple-300/20 bg-purple-300/8";

  return (
    <div
      className={cn(
        "rounded-[1.35rem] border p-4 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl",
        toneClass,
      )}
    >
      <div>{icon}</div>
      <h3 className="mt-3 text-sm font-black text-white">{title}</h3>
      <p className="mt-2 text-xs font-semibold leading-5 text-white/54">
        {text}
      </p>
    </div>
  );
}

function HologramCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute h-[25rem] w-[25rem] rounded-full border border-cyan-300/10"
      />

      <motion.div
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute h-[19rem] w-[19rem] rounded-full border border-purple-300/14"
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-64 w-28"
        >
          <div className="absolute inset-x-0 top-0 mx-auto h-64 w-28 bg-gradient-to-b from-cyan-200 via-blue-400 to-purple-500 opacity-90 shadow-[0_0_90px_rgba(34,211,238,0.45)] [clip-path:polygon(50%_0%,92%_38%,72%_100%,28%_100%,8%_38%)]" />
          <div className="absolute inset-x-0 top-3 mx-auto h-56 w-16 bg-white/25 blur-sm [clip-path:polygon(50%_0%,92%_38%,72%_100%,28%_100%,8%_38%)]" />
        </motion.div>

        <div className="-mt-4 h-8 w-72 rounded-full bg-cyan-300/25 blur-xl" />
        <div className="-mt-5 h-16 w-80 rounded-[50%] border border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_70px_rgba(34,211,238,0.24)]" />
      </div>
    </div>
  );
}

function FloatingEcosystemCard({
  mission,
  index,
}: {
  mission: {
    title: string;
    text: string;
    icon: ReactNode;
    tone: string;
  };
  index: number;
}) {
  const positions = [
    "right-10 top-16",
    "right-0 top-48",
    "right-16 bottom-16",
  ];

  const toneClass =
    mission.tone === "cyan"
      ? "border-cyan-300/20 bg-cyan-300/8 text-cyan-200"
      : mission.tone === "emerald"
        ? "border-emerald-300/20 bg-emerald-300/8 text-emerald-200"
        : "border-purple-300/20 bg-purple-300/8 text-purple-200";

  return (
    <motion.div
      initial={{ opacity: 0, x: 28, y: 12 }}
      animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: 0.2 + index * 0.12 },
        x: { duration: 0.5, delay: 0.2 + index * 0.12 },
        y: {
          duration: 4 + index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={cn(
        "absolute w-64 rounded-2xl border p-4 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-2xl",
        positions[index],
        toneClass,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/8">
          {mission.icon}
        </div>

        <div>
          <p className="text-sm font-black text-white">{mission.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-white/50">
            {mission.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PosterBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/75">
      {children}
    </span>
  );
}

function LoginStepTrack() {
  return (
    <div className="relative mt-9">
      <div className="absolute left-8 right-8 top-5 h-px bg-gradient-to-r from-blue-400 via-slate-200 to-slate-200" />

      <div className="relative flex items-start justify-between">
        {loginSteps.map((step, index) => {
          const active = index === 0;

          return (
            <div key={step} className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-full border bg-white shadow-sm",
                  active
                    ? "border-blue-300 text-blue-700 shadow-[0_0_30px_rgba(59,130,246,0.22)]"
                    : "border-slate-200 text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full",
                    active ? "bg-blue-600" : "bg-slate-300",
                  )}
                />

                {active ? (
                  <span className="absolute inset-0 rounded-full border border-blue-300/50 animate-ping" />
                ) : null}
              </div>

              <span
                className={cn(
                  "text-center text-[10px] font-black uppercase tracking-[0.1em]",
                  active ? "text-blue-700" : "text-slate-400",
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccessBenefit({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: "blue" | "cyan" | "purple";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-700"
      : tone === "cyan"
        ? "border-cyan-100 bg-cyan-50 text-cyan-700"
        : "border-purple-100 bg-purple-50 text-purple-700";

  return (
    <div className="flex items-center gap-4 rounded-[1.35rem] border border-slate-100 bg-slate-50/80 px-4 py-4 shadow-sm">
      <div
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-2xl border",
          toneClass,
        )}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="relative z-10 h-5 w-5"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function LoginBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_93%_22%,rgba(168,85,247,0.22),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.14),transparent_38%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(90deg,rgba(34,197,94,0.32),rgba(250,204,21,0.24),rgba(236,72,153,0.28),rgba(59,130,246,0.32))] blur-3xl" />
      <div className="absolute -right-28 bottom-12 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -left-28 top-16 h-96 w-96 rounded-full bg-cyan-500/14 blur-3xl" />
    </div>
  );
}

function safeText(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}
function getSafeLoginCallbackUrl() {
  if (typeof window === "undefined") {
    return "/auth/continue";
  }

  const params = new URLSearchParams(window.location.search);
  const callbackUrl = params.get("callbackUrl");

  if (!callbackUrl) {
    return "/auth/continue";
  }

  try {
    const parsedUrl = new URL(callbackUrl, window.location.origin);

    if (parsedUrl.origin !== window.location.origin) {
      return "/auth/continue";
    }

    const protectedAdminRoutes = ["/admin/announcements"];

    if (protectedAdminRoutes.includes(parsedUrl.pathname)) {
      return "/auth/continue";
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return "/auth/continue";
  }
}