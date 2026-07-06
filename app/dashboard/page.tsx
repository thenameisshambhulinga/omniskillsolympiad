import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircuitBoard,
  ExternalLink,
  Flame,
  GraduationCap,
  Layers3,
  LineChart,
  Medal,
  Route,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import DashboardSmartMissionPlanner from "@/components/dashboard/DashboardSmartMissionPlanner";
import CompetitionBridgeShowcase from "@/components/dashboard/CompetitionBridgeShowcase";
import OmniJourneySupportStrip from "@/components/dashboard/OmniJourneySupportStrip";
import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoPageShell from "@/components/oso/OsoPageShell";
import OsoProgressBar from "@/components/oso/OsoProgressBar";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";
import OfflineState from "@/components/system/OfflineState";

import { authOptions } from "@/lib/auth";
import { calculateOmniScore } from "@/lib/engineering-system";
import { prisma } from "@/lib/prisma";
import { getTierProgress, getVibgyorProgress } from "@/lib/profile/tier-engine";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const journeySupportSteps = [
  {
    label: "Learn",
    description:
      "Students build fundamentals through the upcoming LMS layer before entering hands-on and competition stages.",
  },
  {
    label: "Practice",
    description:
      "Students convert concepts into applied skill through lab practice, guided exercises and hands-on setups.",
  },
  {
    label: "Compete",
    description:
      "Students participate in OMNI events and challenge arenas to prove readiness under real performance pressure.",
  },
  {
    label: "Rank",
    description:
      "Scores, streak, consistency and competition outcomes become measurable ranking visibility.",
  },
  {
    label: "Get Recognized",
    description:
      "Badges, achievements and selection signals turn performance into visible engineering recognition.",
  },
  {
    label: "Build Portfolio",
    description:
      "Skills, profile proof, challenge results and readiness tracks come together in the Skill Passport.",
  },
  {
    label: "Get Internships",
    description:
      "Once readiness grows, OMNI can guide students toward internship-facing opportunities and proof-based discovery.",
  },
  {
    label: "Get Hired",
    description:
      "The ecosystem supports placement readiness with proof, consistency, skill depth and competition confidence.",
  },
  {
    label: "Become a Leader",
    description:
      "Advanced students can represent institutions, mentor peers and grow into leadership-facing engineering roles.",
  },
] as const;

const bridgePlatforms = [
  {
    title: "WorldSkills Global",
    label: "International Skill Stage",
    href: "https://worldskills.org/",
    description:
      "Global skills movement and competition pathway for excellence across technical and vocational domains.",
    tone: "blue",
  },
  {
    title: "IndiaSkills / WorldSkills India",
    label: "National Skill Gateway",
    href: "https://www.worldskillsindia.co.in/",
    description:
      "India-facing skill competition pathway where young talent can grow toward state, national and global representation.",
    tone: "emerald",
  },
  {
    title: "Kaggle Competitions",
    label: "AI Competition Model",
    href: "https://www.kaggle.com/competitions",
    description:
      "Reference-style competition discovery experience for data, AI and hackathon-like performance challenges.",
    tone: "cyan",
  },
] as const;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      image: true,
      omniId: true,
      college: true,
      state: true,
      district: true,
      branch: true,
      semester: true,
      year: true,
      siliconPoints: true,
      streak: true,
      isOnboarded: true,
      skills: true,
      careerInterests: true,
      bio: true,
      createdAt: true,
      seasonProgress: {
        select: {
          totalPoints: true,
          weightedRankScore: true,
          averageAccuracy: true,
          completedDays: true,
          consistencyScore: true,
        },
      },
      dailyAttempts: {
        where: {
          completed: true,
        },
        select: {
          id: true,
          score: true,
          total: true,
          percentage: true,
          challengeDay: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          points: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <OsoPageShell>
        <OfflineState />
      </OsoPageShell>
    );
  }

  if (!user.isOnboarded) {
    redirect("/onboarding");
  }

  const siliconPoints = Math.max(
    user.siliconPoints ?? 0,
    user.seasonProgress?.totalPoints ?? 0,
    Math.round(user.seasonProgress?.weightedRankScore ?? 0),
  );

  const [
    totalChallenges,
    usersAboveNational,
    usersAboveDistrict,
    usersAboveState,
    usersAboveCollege,
  ] = await prisma.$transaction([
    prisma.dailyChallenge.count(),
    prisma.user.count({
      where: {
        siliconPoints: {
          gt: siliconPoints,
        },
      },
    }),
    prisma.user.count({
      where: {
        district: user.district || undefined,
        state: user.state || undefined,
        siliconPoints: {
          gt: siliconPoints,
        },
      },
    }),
    prisma.user.count({
      where: {
        state: user.state || undefined,
        siliconPoints: {
          gt: siliconPoints,
        },
      },
    }),
    prisma.user.count({
      where: {
        college: user.college || undefined,
        siliconPoints: {
          gt: siliconPoints,
        },
      },
    }),
  ]);

  const completedChallenges = user.dailyAttempts.length;

  const totalCorrectAnswers = user.dailyAttempts.reduce(
    (sum, attempt) => sum + attempt.score,
    0,
  );

  const totalQuestionsAttempted = user.dailyAttempts.reduce(
    (sum, attempt) => sum + attempt.total,
    0,
  );

  const averageAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : Math.round(user.seasonProgress?.averageAccuracy ?? 0);

  const omniScore = calculateOmniScore({
    averageAccuracy,
    consistencyScore:
      user.seasonProgress?.consistencyScore ?? completedChallenges,
    completedDays: user.seasonProgress?.completedDays ?? completedChallenges,
    totalPoints: siliconPoints,
  });

  const tierProgress = getTierProgress(siliconPoints);
  const vibgyorProgress = getVibgyorProgress(siliconPoints);

  const nationalRank = usersAboveNational + 1;
  const districtRank = user.district ? usersAboveDistrict + 1 : null;
  const stateRank = user.state ? usersAboveState + 1 : null;
  const collegeRank = user.college ? usersAboveCollege + 1 : null;

  const profileCompletion = getProfileCompletion({
    image: user.image,
    omniId: user.omniId,
    college: user.college,
    branch: user.branch,
    skills: user.skills,
    bio: user.bio,
    careerInterests: user.careerInterests,
  });

  const currentGrowthIndex = getGrowthIndex({
    completedChallenges,
    siliconPoints,
    skillsCount: user.skills.length,
    accuracy: averageAccuracy,
  });

  const nextAction = getNextAction({
    completedChallenges,
    skillsCount: user.skills.length,
    careerInterestsCount: user.careerInterests.length,
    profileCompletion,
  });

  const portfolioReadiness = getPortfolioReadiness({
    profileCompletion,
    completedChallenges,
    siliconPoints,
    skillsCount: user.skills.length,
  });

  const careerReadiness = getCareerReadiness({
    averageAccuracy,
    omniScore,
    careerInterestsCount: user.careerInterests.length,
  });

  const worldSkillsReadiness = getWorldSkillsReadiness({
    completedChallenges,
    streak: user.streak ?? 0,
    averageAccuracy,
    siliconPoints,
  });

  const weeklyStreakCount = Math.floor((user.streak ?? 0) / 7);

  const passportActionLabel =
    profileCompletion >= 100 ? "Edit Passport" : "Complete Passport";

  return (
    <OsoPageShell>
      <OsoGlassSurface hover={false} className="p-5 sm:p-7 lg:p-9">
        <div className="flex flex-wrap gap-3">
          <OsoStatusPill label="Student Growth Dashboard" tone="blue" />
          <OsoStatusPill label={tierProgress.currentTier} tone="emerald" />
          <OsoStatusPill
            label={`${vibgyorProgress.currentStage} Stage`}
            tone="yellow"
          />
        </div>

        <div className="mt-6 grid gap-7">
          <div>
            <h1 className="oso-heading max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Welcome back,{" "}
              <span className="text-blue-600">
                {user.fullName || "Engineer"}
              </span>
            </h1>

            <p className="mt-5 max-w-4xl text-lg font-medium leading-9 text-slate-600">
              Your dashboard is now arranged in a simple one-by-one flow:
              passport proof, performance signals, rankings, planner, journey
              support and competition bridges.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/daily-challenges"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Today&apos;s Challenge
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/profile#passport-overview"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                View Passport
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/onboarding?edit=passport"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-900 bg-slate-950 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {passportActionLabel}
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/86 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-6 lg:p-7">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.11),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.11),transparent_26%),radial-gradient(circle_at_58%_105%,rgba(250,204,21,0.16),transparent_34%)]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-emerald-500 via-yellow-400 to-violet-600"
            />

            <div className="relative z-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                  <CircuitBoard className="h-4 w-4" />
                  Unified Skill Passport
                </div>

                <h2 className="oso-heading mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                  Your engineering proof is taking shape.
                </h2>

                <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-slate-600">
                  OMNI ID, profile completion, readiness, skill signals and
                  academic identity are now connected in one digestible
                  snapshot.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <HighlightIdentity
                    label="College / Institute"
                    value={user.college || "Add college in passport"}
                  />
                  <HighlightIdentity
                    label="Branch"
                    value={user.branch || "Add branch in passport"}
                  />
                </div>

                <div className="mt-5 rounded-[1.35rem] border border-yellow-200 bg-yellow-50/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-800">
                    Current Focus
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-yellow-900">
                    {nextAction}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniSignal
                    icon={<Zap className="h-4 w-4" />}
                    label="OMNI Score"
                    value={omniScore}
                    helper="Overall growth signal"
                  />
                  <MiniSignal
                    icon={<Medal className="h-4 w-4" />}
                    label="Silicon Points"
                    value={formatNumber(siliconPoints)}
                    helper="Competition momentum"
                  />
                  <MiniSignal
                    icon={<Layers3 className="h-4 w-4" />}
                    label="Current Stage"
                    value={vibgyorProgress.currentStage}
                    helper={
                      vibgyorProgress.pointsToNextStage !== null
                        ? `${vibgyorProgress.pointsToNextStage} pts to ${vibgyorProgress.nextStage}`
                        : "Highest stage reached"
                    }
                  />
                  <MiniSignal
                    icon={<Target className="h-4 w-4" />}
                    label="Engineering Tier"
                    value={tierProgress.currentTier}
                    helper="Capability band"
                  />
                </div>

                <PassportTrack
                  title="Profile Completion"
                  value={profileCompletion}
                  description="Academic details, bio, skills and interests"
                  tone={
                    profileCompletion >= 80
                      ? "emerald"
                      : profileCompletion >= 60
                        ? "yellow"
                        : "blue"
                  }
                />

                <PassportTrack
                  title="Portfolio Readiness"
                  value={portfolioReadiness}
                  description="Challenge proof, skills and portfolio signal strength"
                  tone="blue"
                />

                <PassportTrack
                  title="Career Readiness"
                  value={careerReadiness}
                  description="Direction, consistency and interview-facing preparedness"
                  tone="emerald"
                />

                <PassportTrack
                  title="WorldSkills Readiness"
                  value={worldSkillsReadiness}
                  description="Competition maturity and broader pathway potential"
                  tone="yellow"
                />
              </div>
            </div>
          </div>
        </div>
      </OsoGlassSurface>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <OsoMetricTile
          icon={<Flame className="h-5 w-5" />}
          label="Weekly Streak"
          value={weeklyStreakCount}
          helper="1 streak = 7 consecutive active days. Streaks improve level and rank progression."
          tone="yellow"
        />

        <OsoMetricTile
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Challenges"
          value={`${completedChallenges}/${totalChallenges}`}
          helper="Completed daily missions"
          tone="emerald"
        />

        <OsoMetricTile
          icon={<Target className="h-5 w-5" />}
          label="Accuracy"
          value={`${averageAccuracy}%`}
          helper={`${totalCorrectAnswers}/${totalQuestionsAttempted} correct`}
          tone="cyan"
        />
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Ranking"
          title="All your ranking visibility, in one place."
          description="National, zone/district, state and institute rank signals are centralized here so ranking is easy to understand and never repeated elsewhere on the dashboard."
          icon={<LineChart className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <EnhancedRankBox
            label="Institute Rank"
            value={collegeRank ? `#${collegeRank}` : "Pending"}
            helper={
              collegeRank
                ? "College / institute position"
                : "Add college to unlock institute rank"
            }
          />
          <EnhancedRankBox
            label="Zone / District Rank"
            value={districtRank ? `#${districtRank}` : "Pending"}
            helper={
              districtRank
                ? "Local competitive standing"
                : "Add district to unlock zone rank"
            }
          />

          <EnhancedRankBox
            label="State Rank"
            value={stateRank ? `#${stateRank}` : "Pending"}
            helper={
              stateRank
                ? "State-level visibility"
                : "Add state to unlock state rank"
            }
          />
          <EnhancedRankBox
            label="National Rank"
            value={`#${nationalRank}`}
            helper="India-wide position"
          />
        </div>
      </OsoGlassSurface>

      <DashboardSmartMissionPlanner
        completedChallenges={completedChallenges}
        totalChallenges={totalChallenges}
        siliconPoints={siliconPoints}
        skillsCount={user.skills.length}
        careerInterestsCount={user.careerInterests.length}
      />

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Growth Loop"
          title="OMNI journey support required."
          description="The journey is shown as compact electronics-inspired nodes instead of bulky repeated cards. Hover or click any node to understand the support layer."
          icon={<Route className="h-5 w-5" />}
        />

        <OmniJourneySupportStrip
          steps={journeySupportSteps}
          activeIndex={currentGrowthIndex}
        />
      </OsoGlassSurface>
      <CompetitionBridgeShowcase />

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Recent Activity"
          title="Your latest engineering timeline."
          description="Each completed activity becomes part of your growth history."
          icon={<CalendarDays className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-3">
          {user.activities.length > 0 ? (
            user.activities.map((activity, index) => (
              <article
                key={activity.id}
                className="grid gap-3 rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm backdrop-blur-xl sm:grid-cols-[80px_1fr_auto] sm:items-center"
              >
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-center text-blue-700">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]">
                    Log
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {activity.type}
                  </p>
                  <h3 className="mt-1 font-black text-slate-950">
                    {activity.title}
                  </h3>
                  {activity.description ? (
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                      {activity.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>

                {activity.points > 0 ? (
                  <OsoStatusPill label={`+${activity.points} XP`} tone="blue" />
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-blue-600" />
              <p className="mt-3 font-black text-slate-700">No activity yet.</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Complete challenges to start building your engineering timeline.
              </p>
            </div>
          )}
        </div>
      </OsoGlassSurface>
    </OsoPageShell>
  );
}

function HighlightIdentity({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-blue-200 bg-blue-50/86 p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
        {label}
      </p>
      <p className="mt-2 text-lg font-black leading-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function MiniSignal({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/78 p-4">
      <div className="flex items-center gap-2 text-blue-700">{icon}</div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
      {helper ? (
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function PassportTrack({
  title,
  value,
  description,
  tone,
}: {
  title: string;
  value: number;
  description: string;
  tone: "blue" | "emerald" | "yellow";
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/78 p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="font-black text-slate-950">{title}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <span className="shrink-0 text-sm font-black text-slate-950">
          {value}%
        </span>
      </div>

      <OsoProgressBar value={value} tone={tone} />
    </div>
  );
}

function EnhancedRankBox({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  const meta = label.includes("National")
    ? {
        chip: "National",
        chipClass: "border-blue-200 bg-blue-50 text-blue-700",
        line: "from-blue-600 via-indigo-500 to-cyan-400",
        glow: "bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_36%)]",
        icon: <Trophy className="h-5 w-5" />,
      }
    : label.includes("State")
      ? {
          chip: "State",
          chipClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
          line: "from-emerald-500 via-teal-400 to-cyan-400",
          glow: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.07),transparent_36%)]",
          icon: <GraduationCap className="h-5 w-5" />,
        }
      : label.includes("Institute")
        ? {
            chip: "Institute",
            chipClass: "border-yellow-200 bg-yellow-50 text-yellow-700",
            line: "from-yellow-400 via-amber-400 to-orange-400",
            glow: "bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_36%)]",
            icon: <Medal className="h-5 w-5" />,
          }
        : {
            chip: "Zone / District",
            chipClass: "border-cyan-200 bg-cyan-50 text-cyan-700",
            line: "from-cyan-500 via-sky-400 to-blue-400",
            glow: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.07),transparent_36%)]",
            icon: <LineChart className="h-5 w-5" />,
          };

  return (
    <div className="group relative isolate overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/90 p-5 text-center shadow-[0_18px_52px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_68px_rgba(15,23,42,0.11)]">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 ${meta.glow}`}
      />

      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.line}`}
      />

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-700">
        {meta.icon}
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="oso-heading mt-3 text-4xl font-black leading-none text-slate-950">
        {value}
      </p>

      <div className="mt-3 flex justify-center">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${meta.chipClass}`}
        >
          {meta.chip}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
        {helper}
      </p>
    </div>
  );
}

function PlatformBridgeCard({
  platform,
}: {
  platform: {
    title: string;
    label: string;
    href: string;
    description: string;
    tone: "blue" | "emerald" | "cyan";
  };
}) {
  const tone =
    platform.tone === "emerald"
      ? {
          chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
          top: "from-emerald-500 via-teal-400 to-cyan-300",
        }
      : platform.tone === "cyan"
        ? {
            chip: "border-cyan-200 bg-cyan-50 text-cyan-700",
            top: "from-cyan-500 via-sky-400 to-blue-300",
          }
        : {
            chip: "border-blue-200 bg-blue-50 text-blue-700",
            top: "from-blue-600 via-indigo-400 to-cyan-300",
          };

  return (
    <a
      href={platform.href}
      target="_blank"
      rel="noreferrer"
      className="group grid overflow-hidden rounded-[1.65rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_20px_56px_rgba(15,23,42,0.10)] sm:grid-cols-[190px_1fr]"
    >
      <div className={`relative min-h-[150px] bg-gradient-to-br ${tone.top}`}>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.72),transparent_17%),radial-gradient(circle_at_74%_70%,rgba(255,255,255,0.38),transparent_22%)]"
        />
        <div className="absolute bottom-4 left-4 rounded-2xl border border-white/35 bg-white/25 px-4 py-3 text-white backdrop-blur-xl">
          <Trophy className="h-6 w-6" />
        </div>
      </div>

      <div className="p-5">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${tone.chip}`}
        >
          {platform.label}
        </span>

        <h3 className="mt-3 text-xl font-black text-slate-950">
          {platform.title}
        </h3>

        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          {platform.description}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700">
          Visit Platform
          <ExternalLink className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}

function getProfileCompletion({
  image,
  omniId,
  college,
  branch,
  skills,
  bio,
  careerInterests,
}: {
  image: string | null;
  omniId: string | null;
  college: string | null;
  branch: string | null;
  skills: string[];
  bio: string | null;
  careerInterests: string[];
}) {
  const checks = [
    Boolean(image),
    Boolean(omniId),
    Boolean(college),
    Boolean(branch),
    skills.length > 0,
    Boolean(bio),
    careerInterests.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function getGrowthIndex({
  completedChallenges,
  siliconPoints,
  skillsCount,
  accuracy,
}: {
  completedChallenges: number;
  siliconPoints: number;
  skillsCount: number;
  accuracy: number;
}) {
  if (siliconPoints >= 2500 && accuracy >= 85) return 8;
  if (siliconPoints >= 1500 && accuracy >= 75) return 7;
  if (siliconPoints >= 1000) return 6;
  if (siliconPoints >= 700) return 5;
  if (siliconPoints >= 300) return 4;
  if (skillsCount >= 3 && completedChallenges >= 5) return 3;
  if (completedChallenges >= 3) return 2;
  if (completedChallenges >= 1) return 1;
  return 0;
}

function getNextAction({
  completedChallenges,
  skillsCount,
  careerInterestsCount,
  profileCompletion,
}: {
  completedChallenges: number;
  skillsCount: number;
  careerInterestsCount: number;
  profileCompletion: number;
}) {
  if (profileCompletion < 70) {
    return "Complete your Skill Passport by adding missing academic details, bio, skills and career interests.";
  }

  if (completedChallenges === 0) {
    return "Start one daily challenge today to activate your practice, score and ranking signals.";
  }

  if (completedChallenges < 5) {
    return "Complete at least 5 daily challenges to build consistency and unlock stronger dashboard insight.";
  }

  if (skillsCount < 3) {
    return "Add at least 3 skills so your Skill Passport becomes more meaningful for mentors and industry.";
  }

  if (careerInterestsCount === 0) {
    return "Add your career interests so OMNI can guide you toward internships, placements and domain pathways.";
  }

  return "Keep practicing daily and enter competition tracks to improve visibility and readiness.";
}

function getPortfolioReadiness({
  profileCompletion,
  completedChallenges,
  siliconPoints,
  skillsCount,
}: {
  profileCompletion: number;
  completedChallenges: number;
  siliconPoints: number;
  skillsCount: number;
}) {
  return clampPercent(
    profileCompletion * 0.45 +
      Math.min(completedChallenges, 20) * 1.5 +
      Math.min(siliconPoints, 1500) / 40 +
      Math.min(skillsCount, 8) * 2,
  );
}

function getCareerReadiness({
  averageAccuracy,
  omniScore,
  careerInterestsCount,
}: {
  averageAccuracy: number;
  omniScore: number;
  careerInterestsCount: number;
}) {
  return clampPercent(
    averageAccuracy * 0.45 +
      Math.min(omniScore, 1000) / 20 +
      Math.min(careerInterestsCount, 5) * 4,
  );
}

function getWorldSkillsReadiness({
  completedChallenges,
  streak,
  averageAccuracy,
  siliconPoints,
}: {
  completedChallenges: number;
  streak: number;
  averageAccuracy: number;
  siliconPoints: number;
}) {
  return clampPercent(
    5 +
      Math.min(completedChallenges, 30) * 1.5 +
      Math.min(streak, 30) * 0.9 +
      averageAccuracy * 0.25 +
      Math.min(siliconPoints, 2000) / 80,
  );
}

function clampPercent(value: number) {
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
