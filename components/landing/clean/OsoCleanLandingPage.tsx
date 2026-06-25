"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import OsoVibgyorSpectrum from "@/components/landing/clean/OsoVibgyorSpectrum";
import OsoTopPerformersCarousel, {
  type TopPerformerItem,
} from "@/components/landing/clean/OsoTopPerformersCarousel";

import OsoEcosystemOverview from "@/components/landing/clean/OsoEcosystemOverview";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CircuitBoard,
  Cpu,
  Radio,
} from "lucide-react";

import OsoBenchmarkCard, {
  type BenchmarkScoreRow,
} from "@/components/landing/clean/OsoBenchmarkCard";
import OsoLivePosterBoard, {
  type LivePosterItem,
} from "@/components/landing/clean/OsoLivePosterBoard";
import OsoSummitJourneyBand from "@/components/landing/clean/OsoSummitJourneyBand";
import LoopTypewriter from "@/components/ui/LoopTypewriter";
import KaggleInspiredWrapper from "@/components/landing/clean/KaggleInspiredWrapper";
import OsoExploreSection from "@/components/landing/clean/OsoExploreSection";
import OsoBenchmarkEnvironmentSection from "@/components/landing/clean/OsoBenchmarkEnvironmentSection";


type OsoCleanLandingPageProps = {
  posters: unknown[];
  topPerformers: TopPerformerItem[];
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

type CompetitionCard = {
  title: string;
  provider: string;
  deadline: string;
  category: string;
  imageUrl?: string;
  description: string;
  prize: string;
  rankCount: number;
  scoreRows: BenchmarkScoreRow[];
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

const competitionCards: CompetitionCard[] = [
  {
    title: "Embedded Systems Sprint",
    provider: "Omni Skills Olympiad",
    deadline: "This Week",
    category: "Embedded",
    imageUrl: "/illustrations/oso/benchmark-environment.png",
    description:
      "Solve microcontroller, firmware and debugging missions designed for practical engineering growth.",
    prize: "Omni Score + Silicon Points",
    rankCount: 42,
    scoreRows: [
      { label: "Firmware Logic", value: "84%", percent: 84, iconLabel: "F" },
      { label: "Debug Accuracy", value: "76%", percent: 76, iconLabel: "D" },
      { label: "Circuit Reasoning", value: "69%", percent: 69, iconLabel: "C" },
    ],
  },
  {
    title: "PCB Innovation Challenge",
    provider: "OSO Hardware Arena",
    deadline: "This Month",
    category: "PCB Design",
    imageUrl: "/illustrations/oso/competitions-winner.png",
    description:
      "Move from schematic thinking to board-level reasoning with structured design tasks.",
    prize: "Recognition + Ranking",
    rankCount: 31,
    scoreRows: [
      { label: "Layout Quality", value: "81%", percent: 81, iconLabel: "L" },
      { label: "Signal Flow", value: "72%", percent: 72, iconLabel: "S" },
      { label: "Design Rules", value: "66%", percent: 66, iconLabel: "D" },
    ],
  },
  {
    title: "AI & Robotics Arena",
    provider: "OSO Competition Track",
    deadline: "Upcoming",
    category: "Robotics",
    imageUrl: "/illustrations/oso/laptop-exploerer.png",
    description:
      "Attempt automation, sensors, control and intelligent systems challenges for future-ready skills.",
    prize: "Badge + Leaderboard Rank",
    rankCount: 58,
    scoreRows: [
      { label: "Automation", value: "79%", percent: 79, iconLabel: "A" },
      { label: "Sensor Logic", value: "73%", percent: 73, iconLabel: "S" },
      { label: "Control Flow", value: "67%", percent: 67, iconLabel: "C" },
    ],
  },
];
export default function OsoCleanLandingPage({
  posters,
  topPerformers = [],
}: OsoCleanLandingPageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-950">
      <CleanHeroSection
  posters={posters}
  reduceMotion={Boolean(reduceMotion)}
/>
<OsoExploreSection reduceMotion={Boolean(reduceMotion)} />
<OsoEcosystemOverview />
<OsoVibgyorSpectrum />
<GrowthOutcomeDashboard reduceMotion={Boolean(reduceMotion)} />
<DomainShowcase reduceMotion={Boolean(reduceMotion)} />

<OsoBenchmarkEnvironmentSection reduceMotion={Boolean(reduceMotion)} />
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
  const heroPosters = normalizePosters(posters).slice(0, 4);

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="oso-container py-14 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              <Radio className="h-4 w-4" />
              Engineering Skills League
            </div>

            <TypewriterHeading />

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
            className="lg:pt-4"
          >
            <OsoLivePosterBoard posters={heroPosters} />
          </motion.div>
        </div>

        <OsoSummitJourneyBand />
      </div>
    </section>
  );
}
function TypewriterHeading() {
  return (
    <h1
      className="oso-heading mt-7 min-h-42 max-w-6xl text-[3.45rem] font-black leading-[1.03] text-[#1a202c] sm:text-[4.15rem] lg:text-[4.65rem] xl:text-[5.05rem]"
      aria-label={heroTitle}
    >
      <LoopTypewriter
        text={heroTitle}
        speedMs={34}
        deleteSpeedMs={18}
        pauseMs={2200}
        startDelayMs={300}
      />
    </h1>
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

        <KaggleInspiredWrapper className="mt-10">
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
        </KaggleInspiredWrapper>
      </div>
    </section>
  );
}

function VibgyorPipeline({ reduceMotion }: { reduceMotion: boolean }) {
  const [activeLevel, setActiveLevel] = useState(vibgyorSteps[0]?.level ?? "");

  return (
    <section className="oso-section bg-[#f8f9fa]">
      <div className="oso-container">
        <div className="oso-glass-premium rounded-[2.5rem] p-6 sm:p-8 lg:p-10">
          <SectionHeader
            eyebrow="VIBGYOR Skill Framework"
            title="A clean step-by-step engineering progression pipeline."
            description="Move from fundamentals to innovation through a single-line skill track. Tap any stage to reveal more technical meaning without cluttering the layout."
          />

          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <div className="oso-horizontal-track">
              {vibgyorSteps.map((step, index) => {
                const active = activeLevel === step.level;

                return (
                  <button
                    key={step.level}
                    type="button"
                    onClick={() =>
                      setActiveLevel((current) =>
                        current === step.level ? "" : step.level,
                      )
                    }
                    className="oso-magic-card min-h-[300px] min-w-[260px] p-5 text-left sm:min-w-[295px]"
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-white shadow-lg ${getVibgyorDotClass(
                        step.level,
                      )}`}
                    >
                      {index + 1}
                    </div>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      {step.level}
                    </p>

                    <h3 className="oso-heading mt-2 text-2xl font-black">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                      {step.description}
                    </p>

                    <div
                      className={`grid transition-all duration-300 ${
                        active
                          ? "mt-5 grid-rows-[1fr] opacity-100"
                          : "mt-0 grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-[1.25rem] border border-white/70 bg-white/70 p-4 text-sm font-semibold leading-7 text-slate-600 shadow-sm backdrop-blur-xl">
                          <p className="font-black text-slate-800">
                            More Info
                          </p>
                          <p className="mt-2">
                            This stage contributes to OMNI ranking, Skill
                            Passport growth, Silicon Points and future
                            competition-readiness signals.
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                      {active ? "Hide Info" : "More Info"}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function getVibgyorDotClass(level: string) {
  if (level === "Violet") return "bg-violet-600";
  if (level === "Indigo") return "bg-indigo-600";
  if (level === "Blue") return "bg-blue-600";
  if (level === "Green") return "bg-emerald-600";
  if (level === "Yellow") return "bg-yellow-500";
  if (level === "Orange") return "bg-orange-500";
  if (level === "Red") return "bg-red-600";
  return "bg-blue-600";
}

function CompetitionCalendar({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="oso-section bg-white">
      <div className="oso-container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Competition Calendar"
            title="Upcoming skill missions and engineering challenges."
            description="Competition cards are designed like global benchmark platforms: clear title, category, current top signals, eligibility and action."
          />

          <Link
            href="/competition"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
          
        <KaggleInspiredWrapper className="mt-10">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-10 grid gap-5 lg:grid-cols-3"
        >
          {competitionCards.map((card) => (
            <OsoBenchmarkCard
  key={card.title}
  title={card.title}
  organizer={card.provider}
  description={card.description}
  category={card.category}
  taskLabel={card.deadline}
  href="/competition"
  actionLabel="View details"
  rankCount={card.rankCount}
  imageUrl={card.imageUrl}
  scoreRows={card.scoreRows}
  badges={["Global", "Open to students", card.prize]}
  logoIcon={CalendarDays}
/>
          ))}
        </motion.div>
    
        </KaggleInspiredWrapper>
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

function normalizePosters(posters: unknown[]): LivePosterItem[] {
  return posters
    .map((poster, index) => normalizePoster(poster, index))
    .filter((poster): poster is AnnouncementItem => poster !== null)
    .map<LivePosterItem>((poster) => ({
      id: poster.id,
      title: poster.title,
      description: poster.description,
      ctaHref: poster.ctaHref,
      ctaLabel: poster.ctaLabel,
      imageUrl: poster.imageUrl,
      tag: poster.tag,
    }));
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
    getString(poster.mobileImageUrl) ??
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