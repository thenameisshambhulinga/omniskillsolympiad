import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Gauge,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

export type OsoCompetitionSprintCardData = {
  title: string;
  category: string;
  deadline: string;
  description: string;
  participants: string;
  difficulty: string;
  href: string;
  accent: "blue" | "yellow" | "emerald";
  metrics: {
    label: string;
    value: string;
    percent: number;
  }[];
};

type OsoCompetitionSprintCardProps = {
  item: OsoCompetitionSprintCardData;
};

export default function OsoCompetitionSprintCard({
  item,
}: OsoCompetitionSprintCardProps) {
  const accentClass =
    item.accent === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : item.accent === "yellow"
        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <article className="group relative isolate flex h-full min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_78px_rgba(15,23,42,0.1)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
      >
        <OsoIllustrationAsset
          src={OSO_ILLUSTRATIONS.postCardPattern}
          alt="OSO abstract technology card pattern"
          decorative
          blend
          imageClassName="h-full w-full object-cover"
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${accentClass}`}
          >
            <Trophy className="h-3.5 w-3.5" />
            {item.category}
          </span>

          <h3 className="oso-heading mt-5 text-2xl font-black leading-tight text-slate-950">
            {item.title}
          </h3>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-visible rounded-2xl bg-transparent">
          <OsoIllustrationAsset
            src={OSO_ILLUSTRATIONS.winnerCup}
            alt="Winner cup"
            decorative
            blend
            imageClassName="h-16 w-16 object-contain"
          />
        </div>
      </div>

      <p className="relative z-10 mt-4 text-base font-medium leading-8 text-slate-600">
        {item.description}
      </p>

      <div className="relative z-10 mt-6 grid gap-3">
        {item.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </p>
              <p className="text-sm font-black text-slate-950">
                {metric.value}
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500 group-hover:bg-blue-700"
                style={{ width: `${clampPercent(metric.percent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
        <SignalPill
          icon={<CalendarDays className="h-4 w-4" />}
          label="Deadline"
          value={item.deadline}
        />
        <SignalPill
          icon={<Users className="h-4 w-4" />}
          label="Active"
          value={item.participants}
        />
        <SignalPill
          icon={<Gauge className="h-4 w-4" />}
          label="Level"
          value={item.difficulty}
        />
      </div>

      <div className="relative z-10 mt-auto pt-7">
        <Link
          href={item.href}
          className="group/link inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          View Challenge
          <ArrowRight className="h-4 w-4 transition group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

function SignalPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/78 px-3 py-3 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 text-blue-700">{icon}</div>

      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}