"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CircuitBoard,
  Cpu,
  Radio,
  Trophy,
} from "lucide-react";

type OsoCleanLandingPageProps = {
  posters: unknown[];
};

type AnnouncementItem = {
  id: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  imageUrl?: string;
  tag?: string;
};

const heroTitle = "India's Engineering Skills Competition Ecosystem";

const outcomeStats = [
  {
    label: "Daily Challenges",
    value: "Live",
    helper: "Continuous practice loop",
    trend: [14, 18, 16, 25, 22, 31, 35],
  },
  {
    label: "Skill Domains",
    value: "20+",
    helper: "Electronics to AI hardware",
    trend: [8, 10, 12, 14, 18, 20, 23],
  },
  {
    label: "Growth Stages",
    value: "7",
    helper: "From beginner to champion",
    trend: [4, 8, 12, 15, 19, 24, 30],
  },
  {
    label: "Competition Modes",
    value: "4",
    helper: "Daily, weekly, monthly, annual",
    trend: [10, 12, 15, 18, 20, 24, 28],
  },
];

const domains = [
  "Embedded Systems",
  "VLSI & Semiconductor",
  "PCB Design",
  "AI & Robotics",
  "IoT & Automation",
  "Product Engineering",
];

const vibgyorSteps = [
  {
    level: "Violet",
    title: "Foundation",
    description: "Electronics fundamentals, components and measurements.",
  },
  {
    level: "Indigo",
    title: "Circuit Builder",
    description: "Analog, digital logic, circuit behaviour and debugging.",
  },
  {
    level: "Blue",
    title: "Embedded",
    description: "Microcontrollers, GPIO, firmware and peripherals.",
  },
  {
    level: "Green",
    title: "Product",
    description: "PCB, assembly, testing and manufacturing awareness.",
  },
  {
    level: "Yellow",
    title: "IoT",
    description: "Sensors, connectivity, data flow and smart systems.",
  },
  {
    level: "Orange",
    title: "Automation",
    description: "Motor control, diagnostics and industrial integration.",
  },
  {
    level: "Red",
    title: "Innovation",
    description: "Research, sprints, industry challenges and championships.",
  },
];

const competitionCards = [
  {
    title: "Embedded Systems Sprint",
    provider: "Omni Skills Olympiad",
    deadline: "This Week",
    category: "Embedded",
    description:
      "Solve microcontroller, firmware and debugging missions designed for practical engineering growth.",
    prize: "Omni Score + Silicon Points",
  },
  {
    title: "PCB Innovation Challenge",
    provider: "OSO Hardware Arena",
    deadline: "This Month",
    category: "PCB Design",
    description:
      "Move from schematic thinking to board-level reasoning with structured design tasks.",
    prize: "Recognition + Ranking",
  },
  {
    title: "AI & Robotics Arena",
    provider: "OSO Competition Track",
    deadline: "Upcoming",
    category: "Robotics",
    description:
      "Attempt automation, sensors, control and intelligent systems challenges for future-ready skills.",
    prize: "Badge + Leaderboard Rank",
  },
];

export default function OsoCleanLandingPage({
  posters,
}: OsoCleanLandingPageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-950">
      <CleanHeroSection
        posters={posters}
        reduceMotion={Boolean(reduceMotion)}
      />
      <GrowthOutcomeDashboard reduceMotion={Boolean(reduceMotion)} />
      <DomainShowcase reduceMotion={Boolean(reduceMotion)} />
      <VibgyorPipeline reduceMotion={Boolean(reduceMotion)} />
      <CompetitionCalendar reduceMotion={Boolean(reduceMotion)} />
      <FinalCta reduceMotion={Boolean(reduceMotion)} />
    </div>
  );
}

function CleanHeroSection({
  posters,
  reduceMotion,
}: {
  posters: unknown[];
  reduceMotion: boolean;
}) {
  const visiblePosters = normalizePosters(posters).slice(0, 2);

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="oso-container py-14 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              <Radio className="h-4 w-4" />
              Engineering Skills League
            </div>

            <TypewriterHeading reduceMotion={reduceMotion} />

            <p className="mt-6 max-w-4xl text-[21px] font-medium leading-10 text-slate-700">
              Learn, practice, compete, get ranked and build an industry-ready
              engineering identity through structured challenges, Omni Score,
              Silicon Points and national-level recognition.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {["Learn", "Practice", "Compete", "Innovate", "Get Ranked"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-[13px] font-black uppercase tracking-[0.16em] text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-[15px] font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition duration-200 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-[0_24px_48px_rgba(37,99,235,0.28)] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Register as Student
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/competition"
                className="group inline-flex min-h-16 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-8 py-4 text-[15px] font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:text-blue-700 hover:shadow-[0_20px_44px_rgba(15,23,42,0.1)] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Explore Competitions
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-[2rem] border border-slate-200 bg-[#f8f9fa] p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                  Live Poster Board
                </p>
                <h2 className="oso-heading mt-1 text-3xl font-black">
                  Skillathon Updates
                </h2>
              </div>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                Active
              </span>
            </div>

            <div className="grid gap-4">
              {visiblePosters.length > 0 ? (
                visiblePosters.map((poster) => (
                  <AnnouncementCard key={poster.id} poster={poster} />
                ))
              ) : (
                <AnnouncementCard poster={createFallbackAnnouncement()} />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TypewriterHeading({ reduceMotion }: { reduceMotion: boolean }) {
  const [visibleCount, setVisibleCount] = useState(
    reduceMotion ? heroTitle.length : 0,
  );

  useEffect(() => {
    if (reduceMotion) {
      setVisibleCount(heroTitle.length);
      return;
    }

    setVisibleCount(0);

    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= heroTitle.length) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 34);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const visibleTitle = useMemo(
    () => heroTitle.slice(0, visibleCount),
    [visibleCount],
  );

  return (
    <h1
      className="oso-heading mt-7 min-h-[13rem] max-w-6xl text-[4.4rem] font-black leading-[0.98] text-[#1a202c] sm:text-[5.1rem] lg:text-[5.7rem] xl:text-[6.2rem]"
      aria-label={heroTitle}
    >
      <span aria-hidden="true">{visibleTitle}</span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[0.82em] w-[5px] translate-y-2 animate-pulse rounded-full bg-blue-600"
      />
    </h1>
  );
}

function AnnouncementCard({ poster }: { poster: AnnouncementItem }) {
  return (
    <Link
      href={poster.ctaHref}
      className="group grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)] active:translate-y-0 sm:grid-cols-[220px_1fr]"
    >
      <div className="relative min-h-[190px] bg-slate-100">
        {poster.imageUrl ? (
          <Image
            src={poster.imageUrl}
            alt={poster.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-[190px] items-center justify-center bg-blue-50">
            <Trophy className="h-11 w-11 text-blue-600" />
          </div>
        )}
      </div>

      <div className="flex flex-col p-6">
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-600">
          {poster.tag ?? "Announcement"}
        </span>

        <h3 className="oso-heading mt-4 text-2xl font-black text-slate-950">
          {poster.title}
        </h3>

        <p className="mt-2 text-base font-medium leading-7 text-slate-600">
          {poster.description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-base font-black text-blue-700">
          {poster.ctaLabel}
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function GrowthOutcomeDashboard({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="oso-section bg-[#f8f9fa]">
      <div className="oso-container">
        <SectionHeader
          eyebrow="Growth Outcome"
          title="A measurable engineering growth dashboard."
          description="OSO presents progress as a clean outcome system: participation, skill coverage, challenge activity and readiness signals."
        />

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        >
          <div className="grid divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">
            {outcomeStats.map((item) => (
              <div key={item.label} className="p-6">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>

                <div className="mt-5 flex items-end justify-between gap-5">
                  <p className="oso-heading text-4xl font-black text-slate-950">
                    {item.value}
                  </p>

                  <Sparkline points={item.trend} />
                </div>

                <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                  {item.helper}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <DashboardLine
                icon={<BookOpenCheck className="h-5 w-5" />}
                title="Daily challenge flow"
                description="Students return daily to complete short engineering missions."
              />
              <DashboardLine
                icon={<BadgeCheck className="h-5 w-5" />}
                title="Score + recognition"
                description="Omni Score and Silicon Points convert effort into visible growth."
              />
              <DashboardLine
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                title="Career readiness"
                description="Progress can later power portfolios, badges and industry visibility."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DomainShowcase({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="oso-section bg-white">
      <div className="oso-container">
        <SectionHeader
          eyebrow="Engineering Domains"
          title="One platform for electronics and deep-tech skill growth."
          description="The OSO ecosystem keeps technical tracks discoverable through clean, direct domain cards."
        />

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {domains.map((domain, index) => (
            <div key={domain} className="oso-card oso-card-hover rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  {index % 2 === 0 ? (
                    <Cpu className="h-5 w-5" />
                  ) : (
                    <CircuitBoard className="h-5 w-5" />
                  )}
                </span>

                <ArrowRight className="h-5 w-5 text-slate-300" />
              </div>

              <h3 className="oso-heading mt-6 text-2xl font-black">
                {domain}
              </h3>

              <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                Structured missions, competitions and measurable learning
                progress for future-ready engineering skills.
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function VibgyorPipeline({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="oso-section bg-[#f8f9fa]">
      <div className="oso-container">
        <SectionHeader
          eyebrow="VIBGYOR Framework"
          title="A clean step-by-step engineering progression pipeline."
          description="The VIBGYOR skill framework is presented as an elegant horizontal growth pathway."
        />

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-10 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        >
          <div className="flex min-w-[980px] items-stretch">
            {vibgyorSteps.map((step, index) => (
              <div key={step.level} className="relative flex-1 px-3 py-4">
                <div className="absolute left-0 right-0 top-9 h-px bg-slate-200" />

                <div className="relative z-10">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-black text-blue-700">
                    {index + 1}
                  </div>

                  <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    {step.level}
                  </p>

                  <h3 className="oso-heading mt-2 text-xl font-black">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CompetitionCalendar({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="oso-section bg-white">
      <div className="oso-container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Competition Calendar"
            title="Upcoming skill missions and engineering challenges."
            description="Competition cards are designed like global challenge platforms: clear category, deadline, summary, eligibility and action."
          />

          <Link
            href="/competition"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-10 grid gap-5 lg:grid-cols-3"
        >
          {competitionCards.map((card) => (
            <article
              key={card.title}
              className="oso-card oso-card-hover flex min-h-[360px] flex-col rounded-[1.75rem] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                  {card.category}
                </span>

                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>

              <h3 className="oso-heading mt-6 text-2xl font-black">
                {card.title}
              </h3>

              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {card.provider}
              </p>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Deadline
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {card.deadline}
                </p>
              </div>

              <p className="mt-5 flex-1 text-base font-medium leading-7 text-slate-600">
                {card.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  Global
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  Open to students
                </span>
              </div>

              <p className="mt-5 text-sm font-black text-slate-800">
                Prize summary: {card.prize}
              </p>

              <Link
                href="/competition"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                View details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCta({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="bg-[#f8f9fa] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] bg-[#1a202c] px-6 py-12 text-white shadow-[0_22px_70px_rgba(15,23,42,0.16)] sm:px-10 lg:px-14"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Learn. Build. Compete. Innovate. Lead.
            </p>

            <h2 className="oso-heading mt-4 max-w-4xl text-4xl font-black text-white sm:text-5xl">
              Turn engineering skills into visible opportunities.
            </h2>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-300">
              Join OSO to practice daily, compete nationally, earn recognition
              and build a stronger engineering identity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/competition"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
        {eyebrow}
      </p>

      <h2 className="oso-heading mt-4 text-4xl font-black leading-tight text-[#1a202c] sm:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;

  const polylinePoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 96;
      const y = 36 - ((point - min) / span) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 96 40"
      className="h-10 w-24"
      role="img"
      aria-label="Progress trend"
    >
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="#0f62fe"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardLine({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        {icon}
      </span>

      <div>
        <h3 className="oso-heading text-xl font-black">{title}</h3>
        <p className="mt-1 text-base font-medium leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function normalizePosters(posters: unknown[]): AnnouncementItem[] {
  return posters
    .map((poster, index) => normalizePoster(poster, index))
    .filter((poster): poster is AnnouncementItem => poster !== null);
}

function normalizePoster(poster: unknown, index: number): AnnouncementItem | null {
  if (!isRecord(poster)) {
    return null;
  }

  const title =
    getString(poster.title) ??
    getString(poster.name) ??
    getString(poster.heading) ??
    "Omni Skills Olympiad";

  const description =
    getString(poster.description) ??
    getString(poster.subtitle) ??
    getString(poster.summary) ??
    "Explore competitions, announcements and skill development opportunities.";

  const ctaHref =
    getString(poster.ctaHref) ??
    getString(poster.href) ??
    getString(poster.link) ??
    getString(poster.actionUrl) ??
    "/competition";

  const ctaLabel =
    getString(poster.ctaLabel) ??
    getString(poster.buttonLabel) ??
    getString(poster.actionLabel) ??
    "Explore";

  const imageUrl =
    getString(poster.imageUrl) ??
    getString(poster.image) ??
    getString(poster.posterUrl) ??
    getString(poster.coverImage) ??
    undefined;

  const tag =
    getString(poster.tag) ??
    getString(poster.category) ??
    getString(poster.type) ??
    "Silicon Skillathon";

  return {
    id: getString(poster.id) ?? `announcement-${index}`,
    title,
    description,
    ctaHref,
    ctaLabel,
    imageUrl,
    tag,
  };
}

function createFallbackAnnouncement(): AnnouncementItem {
  return {
    id: "fallback-announcement",
    title: "Omni Skills Olympiad",
    description:
      "Announcements published from the admin poster board will appear here.",
    ctaHref: "/competition",
    ctaLabel: "Explore",
    tag: "Silicon Skillathon",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}