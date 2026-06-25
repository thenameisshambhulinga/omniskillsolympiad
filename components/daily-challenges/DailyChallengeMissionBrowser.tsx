"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Home,
  LockKeyhole,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type DailyChallengeStatus =
  | "completed"
  | "in-progress"
  | "expired"
  | "unattempted";

export type DailyChallengeMission = {
  id: string;
  dayNumber: number;
  title: string;
  description: string | null;
  createdAt: string;
  questionCount: number;
  attemptCount: number;
  status: DailyChallengeStatus;
  score: number | null;
  total: number | null;
  percentage: number | null;
  submittedAt: string | null;
  expiresAt: string | null;
};

type DayFilter = "all" | "0-25" | "26-50" | "51-75" | "76-100" | "100+";
type StatusFilter = "all" | "unattempted" | "completed" | "in-progress";

type DailyChallengeMissionBrowserProps = {
  challenges: DailyChallengeMission[];
  databaseOnline: boolean;
};

const PAGE_SIZE = 10;

const dayFilters: Array<{
  id: DayFilter;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "0-25", label: "Day 0-25" },
  { id: "26-50", label: "Day 26-50" },
  { id: "51-75", label: "Day 51-75" },
  { id: "76-100", label: "Day 76-100" },
  { id: "100+", label: "Day 100+" },
];

const statusFilters: Array<{
  id: StatusFilter;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "unattempted", label: "Yet to take" },
  { id: "in-progress", label: "Resume" },
  { id: "completed", label: "Completed" },
];

export default function DailyChallengeMissionBrowser({
  challenges,
  databaseOnline,
}: DailyChallengeMissionBrowserProps) {
  const [query, setQuery] = useState("");
  const [dayFilter, setDayFilter] = useState<DayFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const featuredMission = useMemo(() => {
    const inProgress = challenges
      .filter((challenge) => challenge.status === "in-progress")
      .sort(sortLatestFirst)[0];

    if (inProgress) {
      return inProgress;
    }

    const latestUnattempted = challenges
      .filter((challenge) => challenge.status === "unattempted")
      .sort(sortLatestFirst)[0];

    if (latestUnattempted) {
      return latestUnattempted;
    }

    return challenges
      .filter((challenge) => challenge.status === "completed")
      .sort(sortLatestFirst)[0];
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return challenges.filter((challenge) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        challenge.title.toLowerCase().includes(normalizedQuery) ||
        String(challenge.dayNumber).includes(normalizedQuery) ||
        (challenge.description ?? "").toLowerCase().includes(normalizedQuery);

      const matchesDay = isWithinDayFilter(challenge.dayNumber, dayFilter);

      const matchesStatus =
        statusFilter === "all" || challenge.status === statusFilter;

      return matchesSearch && matchesDay && matchesStatus;
    });
  }, [challenges, dayFilter, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleChallenges = filteredChallenges.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const completedCount = challenges.filter(
    (challenge) => challenge.status === "completed",
  ).length;

  const pendingCount = challenges.filter(
    (challenge) =>
      challenge.status === "unattempted" || challenge.status === "in-progress",
  ).length;

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateDayFilter(value: DayFilter) {
    setDayFilter(value);
    setPage(1);
  }

  function updateStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9fa] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <ChallengeListingBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <MissionRhythmTopBar />

        {!databaseOnline ? <DatabaseNotice /> : null}

        {featuredMission ? (
          <FeaturedMissionCard mission={featuredMission} />
        ) : null}

        <section className="rounded-[2rem] border border-white bg-white/84 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-blue-700">
                Published Daily Challenges
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#6d6e6f] sm:text-4xl">
                Challenge Library
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                {completedCount} completed, {pendingCount} yet to finish. You
                can relaunch unfinished missions or view performance for
                completed ones.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block w-full sm:w-[380px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Search day, title, description..."
                  className="min-h-12 w-full rounded-full border border-slate-200 bg-white px-12 text-sm font-bold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.06em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {dayFilters.map((filter) => {
              const active = filter.id === dayFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => updateDayFilter(filter.id)}
                  className={cn(
                    "min-w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.05em] transition",
                    active
                      ? "border-blue-500 bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.20)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusFilters.map((filter) => {
              const active = filter.id === statusFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => updateStatusFilter(filter.id)}
                  className={cn(
                    "min-w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.05em] transition",
                    active
                      ? "border-emerald-500 bg-emerald-600 text-white shadow-[0_12px_28px_rgba(16,185,129,0.20)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-600">
              Showing{" "}
              <span className="font-black text-slate-950">
                {visibleChallenges.length}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-950">
                {filteredChallenges.length}
              </span>{" "}
              missions
            </p>

            <PaginationControls
              page={safePage}
              totalPages={totalPages}
              onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            />
          </div>

          <div className="mt-5">
            {visibleChallenges.length > 0 ? (
              <div className="grid gap-3">
                {visibleChallenges.map((challenge, index) => (
                  <ChallengeListRow
                    key={challenge.id}
                    challenge={challenge}
                    index={startIndex + index}
                  />
                ))}
              </div>
            ) : (
              <EmptyChallengeState hasSearch={query.trim().length > 0} />
            )}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex justify-center">
              <PaginationControls
                page={safePage}
                totalPages={totalPages}
                onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
                onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function FeaturedMissionCard({ mission }: { mission: DailyChallengeMission }) {
  const isCompleted = mission.status === "completed";
  const isResume = mission.status === "in-progress";

  return (
    <section className="relative overflow-hidden rounded-[2.35rem] border border-white bg-white/86 p-5 shadow-[0_26px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(37,99,235,0.14),transparent_34%),radial-gradient(circle_at_92%_18%,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_82%_90%,rgba(168,85,247,0.11),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-400 via-purple-400 to-yellow-300" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-blue-700">
              <Sparkles className="h-4 w-4" />
              {isCompleted
                ? "Latest Completed Mission"
                : isResume
                  ? "Resume Current Mission"
                  : "Latest Yet To Take"}
            </span>

            <StatusBadge status={mission.status} />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.1em] text-blue-700">
            Day {mission.dayNumber}
          </p>

          <h2 className="mt-2 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {mission.title}
          </h2>

          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
            {mission.description?.trim() ||
              "Published mission ready for protected assessment."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <FeatureStat
              icon={<BrainCircuit className="h-4 w-4" />}
              label="Questions"
              value={String(mission.questionCount)}
            />

            <FeatureStat
              icon={<Zap className="h-4 w-4" />}
              label="Attempts"
              value={String(mission.attemptCount)}
            />

            {isCompleted ? (
              <FeatureStat
                icon={<Trophy className="h-4 w-4" />}
                label="Score"
                value={`${mission.score ?? 0}/${mission.total ?? 0}`}
              />
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
            {isCompleted ? (
              <BadgeCheck className="h-6 w-6" />
            ) : isResume ? (
              <RotateCcw className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </div>

          <h3 className="mt-4 text-2xl font-black text-slate-950">
            {isCompleted
              ? "Performance available"
              : isResume
                ? "Continue before expiry"
                : "Ready to launch"}
          </h3>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {isCompleted
              ? `Accuracy ${mission.percentage ?? 0}%. You can reopen this challenge report anytime.`
              : isResume
                ? "Your previous session is still active. Resume and submit before time ends."
                : "Start this mission in protected mode. One official attempt is allowed."}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {isCompleted ? (
              <Link
                href={`/daily-challenges/result?challengeId=${mission.id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_34px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                <Eye className="h-4 w-4" />
                View Report
              </Link>
            ) : (
              <Link
                href={`/daily-challenges/${mission.id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                {isResume ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isResume ? "Resume Mission" : "Launch Mission"}
              </Link>
            )}

            <Link
              href="/dashboard"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.06em] text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionRhythmTopBar() {
  return (
    <section className="rounded-[2rem] border border-white bg-white/86 p-5 shadow-[0_20px_64px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[280px_1fr] xl:items-center">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
            <Target className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-2xl font-black text-slate-950">
            Mission rhythm
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            Quick rules before launching protected mode.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <MiniRule
            icon={<LockKeyhole className="h-4 w-4" />}
            title="One official attempt"
            text="Completed attempts cannot be restarted."
            tone="blue"
          />
          <MiniRule
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Server scoring"
            text="Backend validates final score."
            tone="emerald"
          />
          <MiniRule
            icon={<Sparkles className="h-4 w-4" />}
            title="Instant report"
            text="Result opens after submission."
            tone="purple"
          />
        </div>
      </div>
    </section>
  );
}

function ChallengeListRow({
  challenge,
  index,
}: {
  challenge: DailyChallengeMission;
  index: number;
}) {
  const tone = getRowTone(index);
  const isCompleted = challenge.status === "completed";
  const isResume = challenge.status === "in-progress";
  const isExpired = challenge.status === "expired";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border bg-white/78 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(15,23,42,0.09)]",
        isCompleted ? "border-emerald-200 bg-emerald-50/58" : tone.border,
        isExpired ? "opacity-70" : "",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1.5",
          isCompleted ? "bg-gradient-to-b from-emerald-600 to-cyan-400" : tone.bar,
        )}
      />

      <div className="grid gap-4 lg:grid-cols-[120px_1fr_170px_170px_180px] lg:items-center">
        <div>
          <p
            className={cn(
              "text-xs font-black uppercase tracking-[0.08em]",
              isCompleted ? "text-emerald-700" : tone.text,
            )}
          >
            Day {challenge.dayNumber}
          </p>

          <div className="mt-2">
            <StatusBadge status={challenge.status} />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-xl font-black text-slate-950">
            {challenge.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-600">
            {challenge.description?.trim() ||
              "Published mission ready for protected assessment."}
          </p>
        </div>

        <RowStat
          icon={<BrainCircuit className="h-4 w-4" />}
          label="Questions"
          value={String(challenge.questionCount)}
        />

        <RowStat
          icon={isCompleted ? <Trophy className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          label={isCompleted ? "Accuracy" : "Attempts"}
          value={isCompleted ? `${challenge.percentage ?? 0}%` : String(challenge.attemptCount)}
        />

        <div className="flex justify-start lg:justify-end">
          {isCompleted ? (
            <Link
              href={`/daily-challenges/result?challengeId=${challenge.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              <Eye className="h-4 w-4" />
              View Report
            </Link>
          ) : (
            <Link
              href={`/daily-challenges/${challenge.id}`}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.06em] shadow-sm transition hover:-translate-y-0.5",
                isExpired
                  ? "border-red-200 bg-red-50 text-red-700"
                  : isResume
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50",
              )}
            >
              {isResume ? <RotateCcw className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              {isExpired ? "Review" : isResume ? "Resume" : "Launch"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: DailyChallengeStatus }) {
  const config =
    status === "completed"
      ? {
          label: "Completed",
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        }
      : status === "in-progress"
        ? {
            label: "Resume",
            className: "border-yellow-200 bg-yellow-50 text-yellow-700",
          }
        : status === "expired"
          ? {
              label: "Expired",
              className: "border-red-200 bg-red-50 text-red-700",
            }
          : {
              label: "Yet to take",
              className: "border-blue-200 bg-blue-50 text-blue-700",
            };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function FeatureStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white/82 px-4 py-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.06em] text-slate-400">
          {label}
        </p>
        <p className="text-lg font-black leading-none text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function RowStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-700">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.06em] text-slate-400">
          {label}
        </p>
        <p className="text-lg font-black leading-none text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-35"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="px-3 text-xs font-black uppercase tracking-[0.06em] text-slate-600">
        Page {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-35"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function MiniRule({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: "blue" | "emerald" | "purple";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-purple-200 bg-purple-50 text-purple-700";

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white/82 p-4">
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          toneClass,
        )}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function EmptyChallengeState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/82 px-6 py-12 text-center">
      <CalendarDays className="mx-auto h-10 w-10 text-blue-600" />

      <h3 className="mt-5 text-2xl font-black text-slate-950">
        {hasSearch ? "No matching missions found" : "No published missions yet"}
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-600">
        {hasSearch
          ? "Try another keyword or switch the day/status filter."
          : "Publish a daily challenge from the admin control center. Real published missions will appear here automatically."}
      </p>
    </div>
  );
}

function DatabaseNotice() {
  return (
    <section className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-7 text-red-700">
      Database is temporarily unavailable. Challenge cards are hidden instead of
      showing fake data.
    </section>
  );
}

function ChallengeListingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(37,99,235,0.11),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.10),transparent_36%)]" />
      <div className="absolute left-8 top-28 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="absolute right-10 top-64 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />
    </div>
  );
}

function getRowTone(index: number) {
  const tones = [
    {
      border: "border-blue-200",
      text: "text-blue-700",
      bar: "bg-gradient-to-b from-blue-600 to-cyan-400",
    },
    {
      border: "border-purple-200",
      text: "text-purple-700",
      bar: "bg-gradient-to-b from-purple-600 to-fuchsia-400",
    },
    {
      border: "border-emerald-200",
      text: "text-emerald-700",
      bar: "bg-gradient-to-b from-emerald-600 to-cyan-400",
    },
    {
      border: "border-yellow-200",
      text: "text-yellow-700",
      bar: "bg-gradient-to-b from-yellow-400 to-orange-500",
    },
  ];

  return tones[index % tones.length];
}

function isWithinDayFilter(dayNumber: number, filter: DayFilter) {
  if (filter === "all") return true;
  if (filter === "0-25") return dayNumber >= 0 && dayNumber <= 25;
  if (filter === "26-50") return dayNumber >= 26 && dayNumber <= 50;
  if (filter === "51-75") return dayNumber >= 51 && dayNumber <= 75;
  if (filter === "76-100") return dayNumber >= 76 && dayNumber <= 100;

  return dayNumber > 100;
}

function sortLatestFirst(
  first: DailyChallengeMission,
  second: DailyChallengeMission,
) {
  if (second.dayNumber !== first.dayNumber) {
    return second.dayNumber - first.dayNumber;
  }

  return (
    new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}