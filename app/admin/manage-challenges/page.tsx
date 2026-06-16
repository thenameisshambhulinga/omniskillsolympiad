import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircuitBoard,
  Clock3,
  Eye,
  FileQuestion,
  Plus,
  Radio,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";

import AdminChallengeLibraryToolbar from "@/components/admin/challenges/AdminChallengeLibraryToolbar";
import OsoActionTile from "@/components/oso/OsoActionTile";
import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoProgressBar from "@/components/oso/OsoProgressBar";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type ManageChallengesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ManageChallengesPage({
  searchParams,
}: ManageChallengesPageProps) {
  const params = await searchParams;

  const query = getParam(params, "q");
  const day = getParam(params, "day");
  const status = getParam(params, "status") || "all";
  const limitParam = getParam(params, "limit") || "20";
  const pageParam = getParam(params, "page") || "1";

  const page = clampNumber(Number(pageParam), 1, 999999);
  const limit = clampNumber(Number(limitParam), 10, 50);
  const skip = (page - 1) * limit;

  const dayNumber = Number(day);
  const hasDayFilter = Number.isFinite(dayNumber) && dayNumber > 0;

  const where = {
    ...(query
      ? {
          title: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(hasDayFilter
      ? {
          dayNumber,
        }
      : {}),
    ...(status === "published"
      ? {
          isPublished: true,
        }
      : status === "draft"
        ? {
            isPublished: false,
          }
        : {}),
  };

  const [
    totalChallenges,
    publishedChallenges,
    totalAttempts,
    matchingChallenges,
    challenges,
  ] = await prisma.$transaction([
    prisma.dailyChallenge.count(),
    prisma.dailyChallenge.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.dailyAttempt.count(),
    prisma.dailyChallenge.count({
      where,
    }),
    prisma.dailyChallenge.findMany({
      where,
      select: {
        id: true,
        title: true,
        dayNumber: true,
        isPublished: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: {
        dayNumber: "asc",
      },
      skip,
      take: limit,
    }),
  ]);

  const draftChallenges = totalChallenges - publishedChallenges;

  const totalQuestionsOnPage = challenges.reduce(
    (sum, challenge) => sum + challenge._count.questions,
    0,
  );

  const publishPercent =
    totalChallenges > 0
      ? Math.round((publishedChallenges / totalChallenges) * 100)
      : 0;

  const totalPages = Math.max(1, Math.ceil(matchingChallenges / limit));

  const currentQuery = buildQueryString({
    q: query,
    day,
    status,
    limit: String(limit),
  });

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-8">
      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <OsoStatusPill
                label="Daily Challenge Control"
                tone="blue"
                icon={<CircuitBoard className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label={`${publishedChallenges} Published`}
                tone="emerald"
                icon={<Radio className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label={`${draftChallenges} Drafts`}
                tone="yellow"
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
              />
            </div>

            <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Control any challenge instantly,{" "}
              <span className="text-blue-600">even with 1000+ days.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
              Use instant day jump, title search, status filtering and paginated
              rows instead of scrolling through the entire challenge library.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/create-daily-challenge"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Create Challenge
                <Plus className="h-4 w-4 transition group-hover:rotate-90" />
              </Link>

              <Link
                href="/admin"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Back to Command Center
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Publish Health
            </p>

            <p className="oso-heading mt-3 text-5xl font-black text-slate-950">
              {publishPercent}%
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              {publishedChallenges} of {totalChallenges} challenges are
              published.
            </p>

            <OsoProgressBar
              value={publishPercent}
              tone={publishPercent >= 60 ? "emerald" : "blue"}
              className="mt-5"
            />
          </div>
        </div>
      </OsoGlassSurface>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <OsoMetricTile
          icon={<CircuitBoard className="h-5 w-5" />}
          label="Challenges"
          value={totalChallenges}
          helper="Total daily missions"
          tone="blue"
        />

        <OsoMetricTile
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Published"
          value={publishedChallenges}
          helper="Visible to students"
          tone="emerald"
        />

        <OsoMetricTile
          icon={<ToggleLeft className="h-5 w-5" />}
          label="Drafts"
          value={draftChallenges}
          helper="Hidden from students"
          tone="yellow"
        />

        <OsoMetricTile
          icon={<FileQuestion className="h-5 w-5" />}
          label="Page Questions"
          value={totalQuestionsOnPage}
          helper="Questions in current view"
          tone="cyan"
        />

        <OsoMetricTile
          icon={<Users className="h-5 w-5" />}
          label="Attempts"
          value={totalAttempts}
          helper="Total student activity"
          tone="slate"
        />
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Scalable Challenge Library"
          title="Find the exact day. No endless scrolling."
          description={`${matchingChallenges} matching challenge${
            matchingChallenges === 1 ? "" : "s"
          }. Showing ${challenges.length} on this page.`}
          icon={<CalendarDays className="h-5 w-5" />}
          action={
            <Link
              href="/admin/create-daily-challenge"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              New Challenge
              <Plus className="h-4 w-4 transition group-hover:rotate-90" />
            </Link>
          }
        />

        <div className="mt-8">
          <AdminChallengeLibraryToolbar
            query={query}
            day={day}
            status={status}
            pageSize={String(limit)}
          />
        </div>

        <div className="mt-8 grid gap-3">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <ChallengeControlRow
                key={challenge.id}
                id={challenge.id}
                dayNumber={challenge.dayNumber}
                title={challenge.title}
                isPublished={Boolean(challenge.isPublished)}
                questionCount={challenge._count.questions}
                attemptCount={challenge._count.attempts}
                createdAt={challenge.createdAt}
              />
            ))
          ) : (
            <EmptyChallengeState />
          )}
        </div>

        <PaginationControl
          page={page}
          totalPages={totalPages}
          baseQuery={currentQuery}
        />
      </OsoGlassSurface>

      <section className="grid gap-5 lg:grid-cols-3">
        <OsoActionTile
          href="/admin/create-daily-challenge"
          icon={<Plus className="h-5 w-5" />}
          title="Create Challenge"
          description="Start a new daily mission with day number, title and publish flow."
          meta="Quick Action"
          tone="blue"
        />

        <OsoActionTile
          href="/admin"
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Admin Command Center"
          description="Return to the unified admin overview for posters and competition controls."
          meta="Navigation"
          tone="emerald"
        />

        <OsoActionTile
          href="/daily-challenges"
          icon={<Eye className="h-5 w-5" />}
          title="Student View"
          description="Preview the public daily challenge experience from the learner side."
          meta="Preview"
          tone="yellow"
        />
      </section>
    </div>
  );
}

function ChallengeControlRow({
  id,
  dayNumber,
  title,
  isPublished,
  questionCount,
  attemptCount,
  createdAt,
}: {
  id: string;
  dayNumber: number;
  title: string;
  isPublished: boolean;
  questionCount: number;
  attemptCount: number;
  createdAt: Date;
}) {
  return (
    <article className="grid gap-4 rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30 lg:grid-cols-[90px_1fr_auto] lg:items-center">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center text-blue-700">
        <p className="text-[10px] font-black uppercase tracking-[0.16em]">
          Day
        </p>
        <p className="mt-1 text-2xl font-black">{dayNumber}</p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <OsoStatusPill
            label={isPublished ? "Published" : "Draft"}
            tone={isPublished ? "emerald" : "yellow"}
            icon={
              isPublished ? (
                <ToggleRight className="h-3.5 w-3.5" />
              ) : (
                <ToggleLeft className="h-3.5 w-3.5" />
              )
            }
          />

          <MiniInfo
            icon={<FileQuestion className="h-4 w-4" />}
            label={`${questionCount} Questions`}
          />

          <MiniInfo
            icon={<Users className="h-4 w-4" />}
            label={`${attemptCount} Attempts`}
          />
        </div>

        <h2 className="oso-heading mt-3 line-clamp-1 text-xl font-black leading-tight text-slate-950">
          {title}
        </h2>

        <MiniInfo
          icon={<Clock3 className="h-4 w-4" />}
          label={new Date(createdAt).toLocaleString()}
          className="mt-3"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
        <Link
          href={`/admin/challenge/${id}`}
          className="group/open inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Open
          <ArrowRight className="h-4 w-4 transition group-hover/open:translate-x-1" />
        </Link>

        <form action="/api/admin/publish-challenge" method="post">
          <input type="hidden" name="challengeId" value={id} />
          <input
            type="hidden"
            name="action"
            value={isPublished ? "unpublish" : "publish"}
          />

          <button
            type="submit"
            className={
              isPublished
                ? "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-yellow-800 transition hover:-translate-y-0.5 hover:bg-yellow-100 sm:w-auto"
                : "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-100 sm:w-auto"
            }
          >
            {isPublished ? (
              <ToggleLeft className="h-4 w-4" />
            ) : (
              <ToggleRight className="h-4 w-4" />
            )}
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>
    </article>
  );
}

function PaginationControl({
  page,
  totalPages,
  baseQuery,
}: {
  page: number;
  totalPages: number;
  baseQuery: string;
}) {
  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white/78 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-black text-slate-600">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-3">
        <Link
          href={`/admin/manage-challenges?${baseQuery}&page=${previousPage}`}
          aria-disabled={page <= 1}
          className={
            page <= 1
              ? "pointer-events-none inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400"
              : "inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          }
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Link>

        <Link
          href={`/admin/manage-challenges?${baseQuery}&page=${nextPage}`}
          aria-disabled={page >= totalPages}
          className={
            page >= totalPages
              ? "pointer-events-none inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400"
              : "inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          }
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function MiniInfo({
  icon,
  label,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 ${className}`}
    >
      <span className="text-blue-700">{icon}</span>
      {label}
    </span>
  );
}

function EmptyChallengeState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
        <CircuitBoard className="h-6 w-6" />
      </div>

      <h3 className="oso-heading mt-5 text-2xl font-black text-slate-950">
        No matching challenges found.
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-7 text-slate-600">
        Try clearing the day, title, or status filter.
      </p>

      <Link
        href="/admin/manage-challenges"
        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        Clear Filters
      </Link>
    </div>
  );
}

function getParam(
  params: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = params?.[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, Math.floor(value)));
}

function buildQueryString(values: Record<string, string>) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (!value || value === "all") return;
    params.set(key, value);
  });

  return params.toString();
}