import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Flame,
  GraduationCap,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

type MissionPriority = "critical" | "high" | "medium" | "growth";

type DashboardSmartMissionPlannerProps = {
  profileCompletion: number;
  completedChallenges: number;
  totalChallenges: number;
  siliconPoints: number;
  accuracy: number;
  streak: number;
  skillsCount: number;
  careerInterestsCount: number;
  nationalRank: number;
  currentStage: string;
  currentTier: string;
};

type MissionItem = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  priority: MissionPriority;
  icon: ReactNode;
  progress: number;
  progressLabel: string;
};

const priorityStyles: Record<
  MissionPriority,
  {
    badge: string;
    surface: string;
    border: string;
    icon: string;
    progress: string;
    glow: string;
    label: string;
  }
> = {
  critical: {
    badge: "border-red-200 bg-red-50 text-red-700",
    surface: "bg-red-50/72",
    border: "border-red-200/90",
    icon: "border-red-200 bg-red-100 text-red-700",
    progress: "from-red-500 via-rose-500 to-orange-400",
    glow: "bg-red-300/40",
    label: "Critical",
  },
  high: {
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    surface: "bg-orange-50/72",
    border: "border-orange-200/90",
    icon: "border-orange-200 bg-orange-100 text-orange-700",
    progress: "from-orange-500 via-amber-500 to-yellow-400",
    glow: "bg-orange-300/40",
    label: "High Priority",
  },
  medium: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    surface: "bg-blue-50/72",
    border: "border-blue-200/90",
    icon: "border-blue-200 bg-blue-100 text-blue-700",
    progress: "from-blue-600 via-sky-500 to-cyan-400",
    glow: "bg-blue-300/40",
    label: "Recommended",
  },
  growth: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    surface: "bg-emerald-50/72",
    border: "border-emerald-200/90",
    icon: "border-emerald-200 bg-emerald-100 text-emerald-700",
    progress: "from-emerald-600 via-green-500 to-teal-400",
    glow: "bg-emerald-300/40",
    label: "Growth",
  },
};

export default function DashboardSmartMissionPlanner({
  profileCompletion,
  completedChallenges,
  totalChallenges,
  siliconPoints,
  accuracy,
  streak,
  skillsCount,
  careerInterestsCount,
  nationalRank,
  currentStage,
  currentTier,
}: DashboardSmartMissionPlannerProps) {
  const missions = buildSmartMissions({
    profileCompletion,
    completedChallenges,
    totalChallenges,
    siliconPoints,
    accuracy,
    streak,
    skillsCount,
    careerInterestsCount,
  });

  const primaryMission = missions[0];
  const secondaryMissions = missions.slice(1, 4);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/78 p-5 shadow-[0_26px_84px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-7 lg:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.14),transparent_36%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-emerald-500 via-yellow-400 to-orange-500"
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.04em] text-blue-700">
              <BrainCircuit className="h-4 w-4" />
              Smart Mission Planner
            </div>

            <h2 className="oso-heading mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">
              Your next best moves are ready.
            </h2>

            <p className="mt-3 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              This planner converts your dashboard signals into clear next
              actions for practice, portfolio, ranking and career readiness.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            <PlannerStat label="Rank" value={`#${nationalRank}`} />
            <PlannerStat label="Stage" value={currentStage} />
            <PlannerStat label="Tier" value={currentTier} />
          </div>
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <PrimaryMissionCard mission={primaryMission} />

          <div className="grid gap-4">
            {secondaryMissions.map((mission) => (
              <CompactMissionCard key={mission.title} mission={mission} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrimaryMissionCard({ mission }: { mission: MissionItem }) {
  const style = priorityStyles[mission.priority];

  return (
    <article
      className={`relative isolate overflow-hidden rounded-[2rem] border ${style.border} ${style.surface} p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-6`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-20 -top-20 h-56 w-56 rounded-full ${style.glow} blur-3xl`}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0.22))]"
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${style.icon}`}
            >
              {mission.icon}
            </div>

            <div>
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.04em] ${style.badge}`}
              >
                {style.label}
              </span>

              <h3 className="oso-heading mt-3 text-2xl font-black leading-tight sm:text-3xl">
                {mission.title}
              </h3>
            </div>
          </div>
        </div>

        <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
          {mission.description}
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.04em] text-slate-500">
            <span>{mission.progressLabel}</span>
            <span>{mission.progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${style.progress}`}
              style={{ width: `${mission.progress}%` }}
            />
          </div>
        </div>

        <Link
          href={mission.href}
          className="mt-7 inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-blue-300/40 bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 px-7 py-4 text-sm font-black uppercase tracking-[0.035em] text-white shadow-[0_18px_42px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(37,99,235,0.30),0_0_34px_rgba(34,211,238,0.22)]"
        >
          {mission.actionLabel}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </article>
  );
}

function CompactMissionCard({ mission }: { mission: MissionItem }) {
  const style = priorityStyles[mission.priority];

  return (
    <article
      className={`relative isolate overflow-hidden rounded-[1.65rem] border ${style.border} ${style.surface} p-4 shadow-sm backdrop-blur-2xl`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-14 -top-14 h-36 w-36 rounded-full ${style.glow} blur-3xl`}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.64),rgba(255,255,255,0.22))]"
      />

      <div className="relative z-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${style.icon}`}
          >
            {mission.icon}
          </div>

          <div className="min-w-0">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.04em] ${style.badge}`}
            >
              {style.label}
            </span>

            <h3 className="oso-heading mt-2 text-lg font-black leading-tight">
              {mission.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">
              {mission.description}
            </p>
          </div>
        </div>

        <Link
          href={mission.href}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/86 px-4 py-2.5 text-xs font-black uppercase tracking-[0.035em] text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
        >
          Open
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>
    </article>
  );
}

function PlannerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/82 p-3 text-center shadow-sm backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.04em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function buildSmartMissions({
  profileCompletion,
  completedChallenges,
  totalChallenges,
  siliconPoints,
  accuracy,
  streak,
  skillsCount,
  careerInterestsCount,
}: {
  profileCompletion: number;
  completedChallenges: number;
  totalChallenges: number;
  siliconPoints: number;
  accuracy: number;
  streak: number;
  skillsCount: number;
  careerInterestsCount: number;
}): MissionItem[] {
  const missions: MissionItem[] = [];

  if (profileCompletion < 75) {
    missions.push({
      title: "Complete your Skill Passport",
      description:
        "Your profile is the proof layer for skills, rankings, badges and career readiness. Add missing academic details, skills, bio and career interests.",
      href: "/profile",
      actionLabel: "Complete Passport",
      priority: "critical",
      icon: <ClipboardList className="h-5 w-5" />,
      progress: profileCompletion,
      progressLabel: "Profile completion",
    });
  }

  if (completedChallenges < 5) {
    missions.push({
      title: "Build your first challenge streak",
      description:
        "Complete at least 5 daily challenges to activate stronger OMNI score, consistency, ranking and dashboard insights.",
      href: "/daily-challenges",
      actionLabel: "Start Challenge",
      priority: completedChallenges === 0 ? "critical" : "high",
      icon: <Flame className="h-5 w-5" />,
      progress: Math.min(100, Math.round((completedChallenges / 5) * 100)),
      progressLabel: `${completedChallenges}/5 challenge target`,
    });
  }

  if (accuracy < 70 && completedChallenges > 0) {
    missions.push({
      title: "Improve accuracy before ranking push",
      description:
        "Your next growth boost should come from cleaner answers, better revision and fewer mistakes in technical challenge attempts.",
      href: "/daily-challenges",
      actionLabel: "Practice Again",
      priority: "high",
      icon: <Target className="h-5 w-5" />,
      progress: accuracy,
      progressLabel: "Accuracy score",
    });
  }

  if (skillsCount < 3) {
    missions.push({
      title: "Add at least 3 verified skills",
      description:
        "Skills make your passport more meaningful for mentors, institutions and industry-facing opportunities.",
      href: "/profile",
      actionLabel: "Add Skills",
      priority: "medium",
      icon: <BookOpenCheck className="h-5 w-5" />,
      progress: Math.min(100, Math.round((skillsCount / 3) * 100)),
      progressLabel: `${skillsCount}/3 skill target`,
    });
  }

  if (careerInterestsCount === 0) {
    missions.push({
      title: "Choose your career direction",
      description:
        "Add career interests so OMNI can guide you toward better internships, placements, competitions and domain pathways.",
      href: "/profile",
      actionLabel: "Add Career Interests",
      priority: "medium",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      progress: 0,
      progressLabel: "Career direction",
    });
  }

  if (siliconPoints < 1000) {
    missions.push({
      title: "Push toward 1000 Silicon Points",
      description:
        "Silicon Points improve visibility across ranks, VIBGYOR stages and future recognition layers.",
      href: "/daily-challenges",
      actionLabel: "Earn Points",
      priority: "growth",
      icon: <Rocket className="h-5 w-5" />,
      progress: Math.min(100, Math.round((siliconPoints / 1000) * 100)),
      progressLabel: `${siliconPoints}/1000 points`,
    });
  }

  if (streak < 7) {
    missions.push({
      title: "Build a 7-day discipline streak",
      description:
        "A protected streak shows consistency and helps build reliable engineering practice habits.",
      href: "/daily-challenges",
      actionLabel: "Continue Streak",
      priority: "growth",
      icon: <Sparkles className="h-5 w-5" />,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
      progressLabel: `${streak}/7 day streak`,
    });
  }

  missions.push({
    title: "Explore competition pathways",
    description:
      "Move beyond daily practice into challenge arenas, leaderboards and recognition-driven competition tracks.",
    href: "/competition",
    actionLabel: "Open Competitions",
    priority: "growth",
    icon: <Trophy className="h-5 w-5" />,
    progress: totalChallenges > 0
      ? Math.min(100, Math.round((completedChallenges / totalChallenges) * 100))
      : 0,
    progressLabel: "Challenge coverage",
  });

  missions.push({
    title: "Check WorldSkills direction",
    description:
      "Understand the path from institution level to state, national and international skill recognition.",
    href: "/worldskills",
    actionLabel: "View WorldSkills",
    priority: "growth",
    icon: <GraduationCap className="h-5 w-5" />,
    progress: Math.min(100, Math.round((siliconPoints / 2000) * 100)),
    progressLabel: "WorldSkills readiness",
  });

  return missions
    .sort((a, b) => getPriorityScore(a.priority) - getPriorityScore(b.priority))
    .slice(0, 4);
}

function getPriorityScore(priority: MissionPriority) {
  const scores: Record<MissionPriority, number> = {
    critical: 1,
    high: 2,
    medium: 3,
    growth: 4,
  };

  return scores[priority];
}