import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  FileQuestion,
  Gauge,
  Radio,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type ChallengeHeaderProps = {
  challenge: {
    id: string;
    dayNumber: number;
    title: string;
    description: string | null;
    isPublished: boolean;
    createdAt: Date;
    _count: {
      questions: number;
      attempts: number;
    };
  };
  canPublish: boolean;
  readinessPercent: number;
};

export default function ChallengeHeader({
  challenge,
  canPublish,
  readinessPercent,
}: ChallengeHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/82 p-6 shadow-[0_26px_84px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className={
          challenge.isPublished
            ? "absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-400"
            : "absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500"
        }
      />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[1fr_360px] xl:items-center">
        <div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-blue-700">
              Day {challenge.dayNumber}
            </span>

            <span
              className={
                challenge.isPublished
                  ? "inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-emerald-700"
                  : "inline-flex min-h-10 items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-yellow-700"
              }
            >
              {challenge.isPublished ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              {challenge.isPublished ? "Live Published" : "Draft Mode"}
            </span>
          </div>

          <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {challenge.title}
          </h1>

          <p className="mt-5 max-w-4xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
            {challenge.description?.trim() ||
              "No description added yet. Add a clear mission description before publishing."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <InfoChip
              icon={<FileQuestion className="h-4 w-4" />}
              label={`${challenge._count.questions} Questions`}
            />

            <InfoChip
              icon={<Radio className="h-4 w-4" />}
              label={`${challenge._count.attempts} Attempts`}
            />

            <InfoChip
              icon={<CalendarDays className="h-4 w-4" />}
              label={new Date(challenge.createdAt).toLocaleDateString()}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <form action="/api/admin/publish-challenge" method="post">
              <input type="hidden" name="challengeId" value={challenge.id} />
              <input
                type="hidden"
                name="action"
                value={challenge.isPublished ? "unpublish" : "publish"}
              />

              <button
                type="submit"
                disabled={!challenge.isPublished && !canPublish}
                className={
                  challenge.isPublished
                    ? "inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-yellow-200 bg-yellow-50 px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-yellow-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-yellow-100 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                    : "inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                }
              >
                {challenge.isPublished ? (
                  <ToggleLeft className="h-5 w-5" />
                ) : (
                  <ToggleRight className="h-5 w-5" />
                )}
                {challenge.isPublished ? "Unpublish" : "Publish Now"}
              </button>
            </form>

            <Link
              href={`/daily-challenges/${challenge.id}`}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              Student Preview
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/86 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
              <Gauge className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.06em] text-slate-500">
                Readiness
              </p>
              <p className="oso-heading text-3xl font-black text-slate-950">
                {readinessPercent}%
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={
                readinessPercent >= 85
                  ? "h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  : readinessPercent >= 60
                    ? "h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    : "h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
              }
              style={{
                width: `${readinessPercent}%`,
              }}
            />
          </div>

          <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
            {challenge.isPublished
              ? "This challenge is live. Students can access it from the daily challenge flow."
              : canPublish
                ? "This challenge is ready to publish after final admin review."
                : "Add at least one question to unlock publishing."}
          </p>
        </div>
      </div>
    </section>
  );
}

function InfoChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-slate-600 shadow-sm">
      <span className="text-blue-700">{icon}</span>
      {label}
    </span>
  );
}