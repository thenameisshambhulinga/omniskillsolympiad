"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Cpu,
  Layers3,
  Microchip,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionSectionHeading,
  CompetitionStatusPill,
} from "@/components/competition/CompetitionGlassPanel";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

const events = [
  {
    label: "Today",
    title: "Electronics Challenge",
    description: "A focused daily mission to keep students returning and improving.",
    href: "/daily-challenges",
    status: "Live",
    tone: "blue" as const,
    icon: Cpu,
  },
  {
    label: "Next Week",
    title: "Embedded Systems Sprint",
    description: "Microcontroller, firmware and debugging-focused skill sprint.",
    href: "/daily-challenges",
    status: "Sprint",
    tone: "emerald" as const,
    icon: Microchip,
  },
  {
    label: "This Month",
    title: "PCB Design Championship",
    description: "Hardware design, schematic thinking and board-level reasoning.",
    href: "/competition",
    status: "Monthly",
    tone: "yellow" as const,
    icon: Layers3,
  },
  {
    label: "Upcoming",
    title: "AI & Robotics Arena",
    description: "Automation, sensors, machine vision and intelligent systems.",
    href: "/competition",
    status: "Upcoming",
    tone: "blue" as const,
    icon: Bot,
  },
];

export default function OsoCompetitionCalendar() {
  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <CompetitionSectionHeading
          eyebrow="Competition Calendar"
          title="What should I compete in next?"
          description="The document asks for urgency and clarity here. So this section shows only the next visible competition opportunities — not a crowded event dashboard."
          icon={<CalendarDays className="h-5 w-5" />}
        />

        <Link
          href="/daily-challenges"
          className="group inline-flex w-fit min-h-13 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Attempt Today
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {events.map((event, index) => {
          const Icon = event.icon;

          return (
            <motion.article
              key={event.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.36,
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative isolate flex min-h-[280px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_62px_rgba(15,23,42,0.085)]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13]"
              >
                <OsoIllustrationAsset
                  src={OSO_ILLUSTRATIONS.postCardPattern}
                  alt="Abstract OSO card pattern"
                  decorative
                  blend
                  imageClassName="h-full w-full object-cover"
                  className="h-full w-full"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex h-12 w-12 items-center justify-center overflow-visible">
                  <OsoIllustrationAsset
                    src={OSO_ILLUSTRATIONS.winnerCup}
                    alt="Winner cup"
                    decorative
                    blend
                    imageClassName="h-12 w-12 object-contain"
                  />
                </div>
              </div>

              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                {event.label}
              </p>

              <h3 className="oso-heading mt-2 text-xl font-black leading-tight text-slate-950">
                {event.title}
              </h3>

              <p className="mt-3 flex-1 text-sm font-medium leading-7 text-slate-600">
                {event.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <CompetitionStatusPill label={event.status} tone={event.tone} />

                <Link
                  href={event.href}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition group-hover:text-blue-700"
                >
                  Open
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </CompetitionGlassPanel>
  );
}