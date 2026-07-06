"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Layers3,
  PlayCircle,
  Radio,
  Trophy,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionProgressBar,
  CompetitionStatusPill,
} from "@/components/competition/CompetitionGlassPanel";
import type { CompetitionLiveArena } from "@/lib/competition/competition-live-arena";

type OsoCompetitionLiveArenaProps = {
  arenas: CompetitionLiveArena[];
};

export default function OsoCompetitionLiveArena({
  arenas,
}: OsoCompetitionLiveArenaProps) {
  const featuredArena =
    arenas.find((arena) => arena.status === "IN_PROGRESS") ??
    arenas.find((arena) => arena.status === "READY") ??
    arenas[0] ??
    null;

  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <Radio className="h-4 w-4" />
            Live Competition Arenas
          </div>

          <h2 className="oso-heading mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Actual published challenges, not fake event cards.
          </h2>

          <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
            This section reads from the same published daily challenge source
            that students see. If admin publishes a valid challenge with
            questions, it appears here and on Daily-Challenges.
          </p>
        </div>

        <Link
          href="/daily-challenges"
          className="group inline-flex w-fit min-h-13 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Open Daily-Challenges
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>

      {featuredArena ? (
        <section className="mt-8 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="relative isolate overflow-hidden rounded-[1.85rem] border border-blue-200 bg-blue-50/80 p-6 shadow-[0_20px_58px_rgba(37,99,235,0.12)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.18),transparent_34%)]"
            />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                  Recommended Next
                </p>

                <h3 className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950">
                  Day {featuredArena.dayNumber}: {featuredArena.title}
                </h3>
              </div>

              <CompetitionStatusPill
                label={featuredArena.statusLabel}
                tone={featuredArena.statusTone}
              />
            </div>

            <p className="mt-4 text-sm font-semibold leading-7 text-slate-700">
              {featuredArena.insight}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ArenaSignal
                icon={<BrainCircuit className="h-4 w-4" />}
                label="Difficulty"
                value={featuredArena.difficultyLabel}
              />

              <ArenaSignal
                icon={<Layers3 className="h-4 w-4" />}
                label="Questions"
                value={featuredArena.questionCount}
              />

              <ArenaSignal
                icon={<Trophy className="h-4 w-4" />}
                label="Score"
                value={featuredArena.scoreLabel}
              />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                <span>Arena progress</span>
                <span>{featuredArena.progressPercent}%</span>
              </div>

              <CompetitionProgressBar
                value={featuredArena.progressPercent}
                tone={featuredArena.statusTone}
              />
            </div>

            <Link
              href={featuredArena.href}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              {featuredArena.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.article>

          <div className="grid gap-4 md:grid-cols-2">
            {arenas.slice(0, 4).map((arena, index) => (
              <ArenaMiniCard key={arena.id} arena={arena} index={index} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white/76 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
            <Clock3 className="h-6 w-6" />
          </div>

          <h3 className="oso-heading mt-4 text-2xl font-black text-slate-950">
            No live daily arena yet.
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
            Once admin publishes a daily challenge with at least one question,
            it will appear here automatically.
          </p>
        </section>
      )}
    </CompetitionGlassPanel>
  );
}

function ArenaMiniCard({
  arena,
  index,
}: {
  arena: CompetitionLiveArena;
  index: number;
}) {
  const Icon =
    arena.status === "COMPLETED"
      ? CheckCircle2
      : arena.status === "IN_PROGRESS"
        ? Clock3
        : PlayCircle;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.34,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group rounded-[1.65rem] border border-slate-200 bg-white/86 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_64px_rgba(15,23,42,0.09)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </div>

        <CompetitionStatusPill label={arena.statusLabel} tone={arena.statusTone} />
      </div>

      <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
        Day {arena.dayNumber}
      </p>

      <h3 className="oso-heading mt-2 line-clamp-2 text-xl font-black leading-tight text-slate-950">
        {arena.title}
      </h3>

      <p className="mt-3 line-clamp-2 text-sm font-semibold leading-7 text-slate-600">
        {arena.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <SmallPill icon={<Layers3 className="h-3.5 w-3.5" />} label={`${arena.questionCount} Qs`} />
        <SmallPill icon={<BrainCircuit className="h-3.5 w-3.5" />} label={arena.difficultyLabel} />
        <SmallPill icon={<CalendarDays className="h-3.5 w-3.5" />} label={arena.updatedLabel} />
      </div>

      <div className="mt-5">
        <CompetitionProgressBar
          value={arena.progressPercent}
          tone={arena.statusTone}
        />
      </div>

      <Link
        href={arena.href}
        className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition group-hover:text-blue-700"
      >
        {arena.primaryCta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}

function ArenaSignal({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/80 bg-white/78 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-blue-700">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.16em]">
          {label}
        </p>
      </div>

      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function SmallPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">
      {icon}
      {label}
    </span>
  );
}
