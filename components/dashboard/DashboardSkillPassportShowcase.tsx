import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Code2,
  FileCheck2,
  GraduationCap,
  Layers3,
  Medal,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

type DashboardSkillPassportShowcaseProps = {
  studentName?: string | null;
  omniId?: string | null;
  branch?: string | null;
  college?: string | null;
  omniScore?: number;
  siliconPoints?: number;
  skillRankLabel?: string;
  portfolioReadiness?: number;
  careerReadiness?: number;
  worldSkillsReadiness?: number;
};

const badgeToneMap = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

const trackToneMap = {
  blue: {
    text: "text-blue-700",
    border: "border-blue-200",
    bg: "bg-blue-50",
    progress: "from-blue-600 via-sky-500 to-cyan-400",
    glow: "bg-blue-300/35",
  },
  green: {
    text: "text-emerald-700",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    progress: "from-emerald-600 via-green-500 to-teal-400",
    glow: "bg-emerald-300/35",
  },
  yellow: {
    text: "text-yellow-700",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    progress: "from-yellow-400 via-amber-400 to-orange-400",
    glow: "bg-yellow-300/45",
  },
};

export default function DashboardSkillPassportShowcase({
  studentName,
  omniId,
  branch,
  college,
  omniScore = 0,
  siliconPoints = 0,
  skillRankLabel = "Growing",
  portfolioReadiness = 72,
  careerReadiness = 64,
  worldSkillsReadiness = 48,
}: DashboardSkillPassportShowcaseProps) {
  const safeName = studentName?.trim() || "OMNI Student";
  const safeOmniId = omniId?.trim() || "OMNI Pending";
  const safeBranch = branch?.trim() || "Engineering";
  const safeCollege = college?.trim() || "OMNI Campus";

  const passportMetrics = [
    {
      label: "OMNI Score",
      value: String(Math.max(0, Math.round(omniScore))),
      helper: "Skill strength index",
    },
    {
      label: "Silicon Points",
      value: formatNumber(siliconPoints),
      helper: "Earned from challenges",
    },
    {
      label: "Skill Rank",
      value: skillRankLabel,
      helper: "Across active learners",
    },
  ];

  const readinessTracks = [
    {
      title: "Portfolio Readiness",
      value: clampPercent(portfolioReadiness),
      description: "Projects, challenge proof, badges and verified skill signals.",
      icon: <FileCheck2 className="h-5 w-5" />,
      tone: "blue" as const,
    },
    {
      title: "Career Readiness",
      value: clampPercent(careerReadiness),
      description: "Skill consistency, problem-solving and interview-facing proof.",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      tone: "green" as const,
    },
    {
      title: "WorldSkills Readiness",
      value: clampPercent(worldSkillsReadiness),
      description: "Competition discipline, domain maturity and national pathway fit.",
      icon: <Trophy className="h-5 w-5" />,
      tone: "yellow" as const,
    },
  ];

  const passportBadges = [
    { label: "Embedded Builder", tone: "blue" as const },
    { label: "PCB Explorer", tone: "green" as const },
    { label: "IoT Practitioner", tone: "yellow" as const },
    { label: "Arena Performer", tone: "violet" as const },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/78 p-5 shadow-[0_26px_84px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-7 lg:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.15),transparent_36%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-emerald-500 via-yellow-400 to-violet-600"
      />

      <div className="relative z-10 grid gap-7 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            OMNI Skill Passport
          </div>

          <h2 className="oso-heading mt-5 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            Your verified engineering identity is getting stronger.
          </h2>

          <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-slate-600">
            Track your score, challenge proof, badges, portfolio readiness,
            career readiness and WorldSkills pathway from one dashboard space.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/profile"
              className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Open Full Passport
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/daily-challenges"
              className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white/88 px-6 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              Build More Proof
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-blue-300/20 via-emerald-300/18 to-yellow-300/20 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/86 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,255,255,0.20))]"
            />

            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-300/30 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/28 blur-3xl"
            />

            <div className="relative z-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-200 bg-blue-50 text-blue-700 shadow-[0_12px_30px_rgba(37,99,235,0.14)]">
                    <GraduationCap className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                      {safeOmniId}
                    </p>

                    <h3 className="oso-heading mt-1 text-2xl font-black text-slate-950">
                      {safeName}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {safeBranch} · {safeCollege}
                    </p>
                  </div>
                </div>

                <div className="inline-flex w-fit rounded-full border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-yellow-700">
                  <Medal className="mr-1.5 h-4 w-4" />
                  Active
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {passportMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm backdrop-blur-xl"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      {metric.label}
                    </p>

                    <p className="mt-2 text-2xl font-black text-slate-950">
                      {metric.value}
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                      {metric.helper}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/78 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-blue-700" />

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    Earned Skill Badges
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {passportBadges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-sm ${badgeToneMap[badge.tone]}`}
                    >
                      <Star className="h-3.5 w-3.5" />
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {readinessTracks.map((track) => (
                  <ReadinessCard key={track.title} track={track} />
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PassportSignal
                  icon={<Code2 className="h-4 w-4" />}
                  label="Projects"
                  value="Portfolio Proof"
                />
                <PassportSignal
                  icon={<Layers3 className="h-4 w-4" />}
                  label="Levels"
                  value="Campus → Global"
                />
                <PassportSignal
                  icon={<Rocket className="h-4 w-4" />}
                  label="Growth"
                  value="Learn → Lead"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReadinessCard({
  track,
}: {
  track: {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    tone: "blue" | "green" | "yellow";
  };
}) {
  const tone = trackToneMap[track.tone];

  return (
    <article
      className={`relative overflow-hidden rounded-[1.35rem] border ${tone.border} ${tone.bg} p-4 shadow-sm backdrop-blur-xl`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${tone.glow} blur-3xl`}
      />

      <div className="relative z-10 grid gap-4 sm:grid-cols-[1fr_120px] sm:items-center">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-white/75 ${tone.border} ${tone.text}`}
          >
            {track.icon}
          </div>

          <div>
            <h4 className="font-black text-slate-950">{track.title}</h4>

            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              {track.description}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`text-xs font-black ${tone.text}`}>
              {track.value}%
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Ready
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tone.progress}`}
              style={{ width: `${track.value}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function PassportSignal({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-blue-200 bg-blue-50/80 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 text-blue-700">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.16em]">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Math.max(0, Math.round(value)).toLocaleString("en-IN");
}