import Link from "next/link";
import {
  ArrowRight,
  ChevronUp,
  CircleDot,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type BenchmarkScoreRow = {
  label: string;
  value: string;
  percent: number;
  iconLabel?: string;
};

export type OsoBenchmarkCardProps = {
  title: string;
  organizer: string;
  description: string;
  category: string;
  taskLabel: string;
  href: string;
  actionLabel?: string;
  rankCount?: number;
  imageUrl?: string;
  logoIcon?: LucideIcon;
  scoreRows?: BenchmarkScoreRow[];
  badges?: string[];
};

const DEFAULT_SCORE_ROWS: BenchmarkScoreRow[] = [
  {
    label: "Omni Score",
    value: "82%",
    percent: 82,
    iconLabel: "O",
  },
  {
    label: "Skill Accuracy",
    value: "74%",
    percent: 74,
    iconLabel: "S",
  },
  {
    label: "Progress Index",
    value: "68%",
    percent: 68,
    iconLabel: "P",
  },
];

const DEFAULT_BADGES = ["Global", "Open to students"];

export default function OsoBenchmarkCard({
  title,
  organizer,
  description,
  category,
  taskLabel,
  href,
  actionLabel = "View details",
  rankCount = 24,
  imageUrl,
  logoIcon: LogoIcon = Trophy,
  scoreRows = DEFAULT_SCORE_ROWS,
  badges = DEFAULT_BADGES,
}: OsoBenchmarkCardProps) {
  const normalizedRows = normalizeScoreRows(scoreRows);
  const normalizedBadges = normalizeBadges(badges);
  const safeRankCount = normalizeRankCount(rankCount);

  return (
    <article className="group flex h-full min-h-[420px] flex-col overflow-hidden rounded-[1.65rem] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <Link
        href={href}
        className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        aria-label={`${actionLabel}: ${title}`}
      >
        <header className="relative flex min-h-[186px] flex-col border-b border-slate-200 p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <h3 className="oso-heading text-[1.65rem] font-black leading-tight text-slate-950">
                {title}
              </h3>

              <p className="mt-4 text-base font-semibold text-slate-700">
                {organizer}
              </p>
            </div>

            <div className="relative flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[5px] border-slate-900 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.14)]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <LogoIcon
                  className="h-8 w-8 text-blue-600"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          <p className="mt-4 max-w-[92%] text-base font-medium leading-7 text-slate-600">
            {description}
          </p>

          <p className="mt-4 text-base font-semibold text-slate-800">
            {category} <span className="text-slate-500">({taskLabel})</span>
          </p>
        </header>

        <section className="border-b border-slate-200 p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Current top 3
          </p>

          <div className="mt-5 space-y-4">
            {normalizedRows.map((row, index) => (
              <ScoreRow key={`${row.label}-${index}`} row={row} />
            ))}
          </div>
        </section>

        <section className="flex flex-1 flex-col justify-between gap-5 p-6">
          <div className="flex flex-wrap gap-2">
            {normalizedBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-700"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex overflow-hidden rounded-full border border-slate-300 bg-white text-slate-950">
              <span className="inline-flex h-9 w-10 items-center justify-center border-r border-slate-300">
                <ChevronUp
                  className="h-4 w-4 fill-slate-950 text-slate-950"
                  aria-hidden="true"
                />
              </span>

              <span className="inline-flex h-9 min-w-14 items-center justify-center px-3 text-lg font-black">
                {safeRankCount}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-black text-blue-700 transition group-hover:gap-3">
              {actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </section>
      </Link>
    </article>
  );
}

function ScoreRow({ row }: { row: BenchmarkScoreRow }) {
  const safePercent = clampPercent(row.percent);

  return (
    <div className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-slate-900">
        {row.iconLabel ? (
          row.iconLabel
        ) : (
          <CircleDot className="h-4 w-4 text-blue-600" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-slate-800">
            {row.label}
          </p>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500 group-hover:bg-blue-600"
            style={{ width: `${safePercent}%` }}
          />
        </div>
      </div>

      <span className="text-base font-black text-slate-950">{row.value}</span>
    </div>
  );
}

function normalizeScoreRows(rows: BenchmarkScoreRow[]): BenchmarkScoreRow[] {
  const validRows = rows
    .filter((row) => row.label.trim().length > 0)
    .map((row) => ({
      label: row.label.trim(),
      value: row.value.trim().length > 0 ? row.value.trim() : `${row.percent}%`,
      percent: clampPercent(row.percent),
      iconLabel: normalizeIconLabel(row.iconLabel),
    }))
    .slice(0, 3);

  if (validRows.length === 0) {
    return DEFAULT_SCORE_ROWS;
  }

  return validRows;
}

function normalizeBadges(badges: string[]): string[] {
  const validBadges = badges
    .map((badge) => badge.trim())
    .filter((badge) => badge.length > 0)
    .slice(0, 4);

  if (validBadges.length === 0) {
    return DEFAULT_BADGES;
  }

  return validBadges;
}

function normalizeRankCount(rankCount: number): number {
  if (!Number.isFinite(rankCount)) {
    return 24;
  }

  return Math.max(0, Math.round(rankCount));
}

function normalizeIconLabel(iconLabel: string | undefined): string | undefined {
  if (!iconLabel) {
    return undefined;
  }

  const trimmed = iconLabel.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  return trimmed.slice(0, 2).toUpperCase();
}

function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(percent)));
}