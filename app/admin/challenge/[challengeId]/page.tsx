import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  Layers3,
  Radio,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import ChallengeHeader from "./ChallengeHeader";
import QuestionForm from "./QuestionForm";
import QuestionLibrary from "./QuestionLibrary";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type ChallengePageProps = {
  params: Promise<{
    challengeId: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ChallengePage({
  params,
  searchParams,
}: ChallengePageProps) {
  const { challengeId } = await params;
  const resolvedSearchParams = await searchParams;

  const status = getParam(resolvedSearchParams, "status");

  const challenge = await prisma.dailyChallenge.findUnique({
    where: {
      id: challengeId,
    },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      isPublished: true,
      createdAt: true,
      questions: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          correctAnswer: true,
          difficulty: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  const canPublish = challenge._count.questions > 0;
  const readinessPercent = getReadinessPercent({
    hasTitle: challenge.title.trim().length > 0,
    hasDescription: Boolean(challenge.description?.trim()),
    questionCount: challenge._count.questions,
    isPublished: challenge.isPublished,
  });

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/manage-challenges"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.06em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Challenge Library
        </Link>

        <div className="flex flex-wrap gap-2">
          <ControlPill
            label={challenge.isPublished ? "Published" : "Draft"}
            tone={challenge.isPublished ? "emerald" : "yellow"}
            icon={
              challenge.isPublished ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )
            }
          />

          <ControlPill
            label={`${challenge._count.questions} Questions`}
            tone="blue"
            icon={<FileQuestion className="h-4 w-4" />}
          />

          <ControlPill
            label={`${challenge._count.attempts} Attempts`}
            tone="slate"
            icon={<Radio className="h-4 w-4" />}
          />
        </div>
      </div>

      {status ? <StatusNotice status={status} /> : null}

      <ChallengeHeader
        challenge={challenge}
        canPublish={canPublish}
        readinessPercent={readinessPercent}
      />

      <section className="grid gap-5 xl:grid-cols-4">
        <WorkflowCard
          step="01"
          title="Create"
          description="Title, day number and description are ready."
          active
          complete={challenge.title.trim().length > 0}
        />

        <WorkflowCard
          step="02"
          title="Add Questions"
          description="At least one validated question is required before publishing."
          active={!challenge.isPublished}
          complete={challenge._count.questions > 0}
        />

        <WorkflowCard
          step="03"
          title="Publish"
          description="Make the challenge visible to students only after validation."
          active={!challenge.isPublished && canPublish}
          complete={challenge.isPublished}
        />

        <WorkflowCard
          step="04"
          title="Monitor"
          description="Track attempts and performance after students start solving."
          active={challenge.isPublished}
          complete={challenge._count.attempts > 0}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <QuestionForm challengeId={challenge.id} />

        <div className="grid gap-5">
          <ControlChecklist
            hasTitle={challenge.title.trim().length > 0}
            hasDescription={Boolean(challenge.description?.trim())}
            hasQuestions={challenge._count.questions > 0}
            isPublished={challenge.isPublished}
          />

          <QuickControlPanel
            challengeId={challenge.id}
            isPublished={challenge.isPublished}
            canPublish={canPublish}
          />
        </div>
      </section>

      <QuestionLibrary challengeId={challenge.id} questions={challenge.questions} />
    </div>
  );
}

function QuickControlPanel({
  challengeId,
  isPublished,
  canPublish,
}: {
  challengeId: string;
  isPublished: boolean;
  canPublish: boolean;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
          <Layers3 className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.06em] text-blue-700">
            Publish Control
          </p>

          <h2 className="oso-heading mt-1 text-2xl font-black text-slate-950">
            Student visibility switch
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Draft challenges stay hidden. Published challenges become available
            in the student daily challenge flow.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <form action="/api/admin/publish-challenge" method="post">
          <input type="hidden" name="challengeId" value={challengeId} />
          <input
            type="hidden"
            name="action"
            value={isPublished ? "unpublish" : "publish"}
          />

          <button
            type="submit"
            disabled={!isPublished && !canPublish}
            className={
              isPublished
                ? "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-6 py-3 text-xs font-black uppercase tracking-[0.06em] text-yellow-800 transition hover:-translate-y-0.5 hover:bg-yellow-100 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                : "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-xs font-black uppercase tracking-[0.06em] text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-100 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            }
          >
            {isPublished ? (
              <ToggleLeft className="h-4 w-4" />
            ) : (
              <ToggleRight className="h-4 w-4" />
            )}
            {isPublished ? "Unpublish Challenge" : "Publish Challenge"}
          </button>
        </form>

        <Link
          href={`/daily-challenges/${challengeId}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.06em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
        >
          Open Student View
        </Link>
      </div>

      {!canPublish && !isPublished ? (
        <p className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold leading-6 text-yellow-800">
          Add at least one validated question before publishing.
        </p>
      ) : null}
    </section>
  );
}

function ControlChecklist({
  hasTitle,
  hasDescription,
  hasQuestions,
  isPublished,
}: {
  hasTitle: boolean;
  hasDescription: boolean;
  hasQuestions: boolean;
  isPublished: boolean;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.06em] text-emerald-700">
            Validation Checklist
          </p>

          <h2 className="oso-heading mt-1 text-2xl font-black text-slate-950">
            Publish readiness
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <ChecklistItem label="Challenge title added" done={hasTitle} />
        <ChecklistItem label="Description added" done={hasDescription} />
        <ChecklistItem label="At least one question added" done={hasQuestions} />
        <ChecklistItem label="Visibility reviewed" done={isPublished} optional />
      </div>
    </section>
  );
}

function ChecklistItem({
  label,
  done,
  optional = false,
}: {
  label: string;
  done: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-black text-slate-700">{label}</span>

      <span
        className={
          done
            ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-emerald-700"
            : optional
              ? "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-slate-500"
              : "inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-yellow-700"
        }
      >
        {done ? "Ready" : optional ? "Optional" : "Pending"}
      </span>
    </div>
  );
}

function WorkflowCard({
  step,
  title,
  description,
  active,
  complete,
}: {
  step: string;
  title: string;
  description: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <article
      className={
        complete
          ? "rounded-[1.6rem] border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm"
          : active
            ? "rounded-[1.6rem] border border-blue-200 bg-blue-50/80 p-5 shadow-sm"
            : "rounded-[1.6rem] border border-slate-200 bg-white/78 p-5 shadow-sm"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={
            complete
              ? "text-xs font-black uppercase tracking-[0.08em] text-emerald-700"
              : active
                ? "text-xs font-black uppercase tracking-[0.08em] text-blue-700"
                : "text-xs font-black uppercase tracking-[0.08em] text-slate-400"
          }
        >
          Step {step}
        </span>

        {complete ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : null}
      </div>

      <h3 className="oso-heading mt-3 text-xl font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function ControlPill({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "blue" | "emerald" | "yellow" | "slate";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : tone === "yellow"
          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
          : "border-slate-200 bg-white text-slate-600";

  return (
    <span
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.06em] shadow-sm ${toneClass}`}
    >
      {icon}
      {label}
    </span>
  );
}

function StatusNotice({ status }: { status: string }) {
  const messageMap: Record<string, { title: string; tone: "success" | "warn" }> =
    {
      published: {
        title: "Challenge published successfully. Students can now access it.",
        tone: "success",
      },
      unpublished: {
        title: "Challenge moved back to draft. Students can no longer access it.",
        tone: "warn",
      },
      "publish-needs-question": {
        title: "Add at least one question before publishing this challenge.",
        tone: "warn",
      },
      "invalid-request": {
        title: "Invalid publish request. Please try again.",
        tone: "warn",
      },
    };

  const notice = messageMap[status];

  if (!notice) {
    return null;
  }

  return (
    <div
      className={
        notice.tone === "success"
          ? "rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800"
          : "rounded-[1.35rem] border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm font-black text-yellow-800"
      }
    >
      {notice.title}
    </div>
  );
}

function getReadinessPercent({
  hasTitle,
  hasDescription,
  questionCount,
  isPublished,
}: {
  hasTitle: boolean;
  hasDescription: boolean;
  questionCount: number;
  isPublished: boolean;
}) {
  let score = 0;

  if (hasTitle) score += 25;
  if (hasDescription) score += 25;
  if (questionCount > 0) score += 35;
  if (isPublished) score += 15;

  return Math.min(100, score);
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