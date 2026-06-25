import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Flame,
  Gauge,
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
import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoPageShell from "@/components/oso/OsoPageShell";
import OsoProgressBar from "@/components/oso/OsoProgressBar";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";
import OfflineState from "@/components/system/OfflineState";

import { worldSkillsPathway } from "@/data/omni-ecosystem";
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
      "Structured LMS-based learning will help students build fundamentals before they enter hands-on and competitive stages.",
  },
  {
    label: "Practice",
    description:
      "Students can practice in guided hands-on environments and labs to convert theory into applied engineering skill.",
  },
  {
    label: "Compete",
    description:
      "Students participate in OMNI events and challenge arenas to prove readiness under performance conditions.",
  },
  {
    label: "Rank",
    description:
      "Points, streak, challenge outcomes and consistency translate into measurable ranking visibility.",
  },
  {
    label: "Get Recognized",
    description:
      "Badges, achievements and selection visibility turn good performance into public engineering proof.",
  },
  {
    label: "Build Portfolio",
    description:
      "Profile evidence, skills, readiness and work proof come together in the Skill Passport and public identity layer.",
  },
  {
    label: "Get Internships",
    description:
      "Once readiness signals improve, OMNI can help guide students toward internship-facing opportunities.",
  },
  {
    label: "Get Hired",
    description:
      "The platform should ultimately help students become placement-ready with visible proof of capability.",
  },
  {
    label: "Become a Leader",
    description:
      "Advanced learners can mentor peers, represent institutions and grow into leadership-facing engineering roles.",
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

  const passportActionLabel =
    profileCompletion >= 100 ? "Edit Passport" : "Complete Passport";

  return (
    <OsoPageShell>
      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div>
            <div className="flex flex-wrap gap-3">
              <OsoStatusPill label="Student Growth Dashboard" tone="blue" />
              <OsoStatusPill label={tierProgress.currentTier} tone="emerald" />
              <OsoStatusPill
                label={`${vibgyorProgress.currentStage} Stage`}
                tone="yellow"
              />
            </div>

            <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Welcome back,{" "}
              <span className="text-blue-600">
                {user.fullName || "Engineer"}
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
              Your dashboard and Skill Passport now live together in one clear
              command center — so profile proof, readiness, growth stage and
              next actions stay connected without repetition.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/daily-challenges"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Today&apos;s Challenge
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/profile"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                View Passport
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/profile"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-900 bg-slate-950 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {passportActionLabel}
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniSignal
                icon={<BookOpenCheck className="h-4 w-4" />}
                label="Skills Added"
                value={user.skills.length}
                helper="Verified profile proof"
              />
              <MiniSignal
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                label="Career Interests"
                value={user.careerInterests.length}
                helper="Direction guidance"
              />
              <MiniSignal
                icon={<Layers3 className="h-4 w-4" />}
                label="Next Stage Goal"
                value={
                  vibgyorProgress.nextStage
                    ? vibgyorProgress.nextStage
                    : "Highest Stage"
                }
                helper={
                  vibgyorProgress.pointsToNextStage !== null
                    ? `${vibgyorProgress.pointsToNextStage} pts remaining`
                    : "Completed"
                }
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                  Growth + Skill Passport Snapshot
                </p>

                <h2 className="oso-heading mt-3 text-3xl font-black text-slate-950">
                  {user.fullName || "OMNI Student"}
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {(user.branch || "Engineering") +
                    " · " +
                    (user.college || "OMNI Campus")}
                </p>
              </div>

              <OsoStatusPill
                label={user.omniId ?? "OMNI Pending"}
                tone="emerald"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                helper="VIBGYOR progression"
              />
              <MiniSignal
                icon={<Target className="h-4 w-4" />}
                label="Engineering Tier"
                value={tierProgress.currentTier}
                helper="Current capability band"
              />
            </div>

            <div className="mt-6 grid gap-4">
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

            <div className="mt-6 rounded-[1.35rem] border border-yellow-200 bg-yellow-50/80 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-800">
                Current Focus
              </p>
              <p className="mt-2 text-sm font-semibold leading-7 text-yellow-900">
                {nextAction}
              </p>
            </div>
          </div>
        </div>
      </OsoGlassSurface>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Ranking"
          title="All your ranking visibility, in one place."
          description="National, zone/district, state and institute rank signals are centralized here so ranking is easy to understand and never repeated elsewhere on the dashboard."
          icon={<LineChart className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <RankBox
            label="National Rank"
            value={`#${nationalRank}`}
            helper="India-wide position"
          />
          <RankBox
            label="Zone / District Rank"
            value={districtRank ? `#${districtRank}` : "Pending"}
            helper={
              districtRank
                ? "Local competitive standing"
                : "Add district to unlock zone rank"
            }
          />
          <RankBox
            label="State Rank"
            value={stateRank ? `#${stateRank}` : "Pending"}
            helper={
              stateRank ? "State-level visibility" : "Add state to unlock state rank"
            }
          />
          <RankBox
            label="Institute Rank"
            value={collegeRank ? `#${collegeRank}` : "Pending"}
            helper={
              collegeRank
                ? "College / institute position"
                : "Add college to unlock institute rank"
            }
          />
        </div>
      </OsoGlassSurface>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <OsoMetricTile
          icon={<Zap className="h-5 w-5" />}
          label="Silicon Points"
          value={siliconPoints}
          helper="Competition momentum"
          tone="blue"
        />

        <OsoMetricTile
          icon={<Gauge className="h-5 w-5" />}
          label="OMNI Score"
          value={omniScore}
          helper="Overall growth signal"
          tone="slate"
        />

        <OsoMetricTile
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={user.streak ?? 0}
          helper="Daily discipline"
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

      <DashboardSmartMissionPlanner
        completedChallenges={completedChallenges}
        totalChallenges={totalChallenges}
        siliconPoints={siliconPoints}
        accuracy={averageAccuracy}
        streak={user.streak ?? 0}
        skillsCount={user.skills.length}
        careerInterestsCount={user.careerInterests.length}
        currentStage={vibgyorProgress.currentStage}
        currentTier={tierProgress.currentTier}
      />

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Growth Loop"
          title="OMNI journey support required."
          description="This journey explains how OMNI should support a student from learning and lab practice to competitions, recognition, internships, hiring and leadership. Hover over any stage to understand it clearly."
          icon={<Route className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {journeySupportSteps.map((step, index) => {
            const active = index <= currentGrowthIndex;

            return (
              <article
                key={step.label}
                title={step.description}
                className={`group rounded-[1.45rem] border p-5 shadow-sm transition duration-200 ${
                  active
                    ? "border-blue-200 bg-blue-50/80 text-blue-800 hover:border-blue-300"
                    : "border-slate-200 bg-white/78 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-black sm:text-lg">{step.label}</p>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                      active
                        ? "border border-blue-200 bg-white text-blue-700"
                        : "border border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {active ? "Active" : "Upcoming"}
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {step.description}
                </p>

                <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-blue-700 opacity-0 transition duration-200 group-hover:opacity-100">
                  Hover support enabled
                </p>
              </article>
            );
          })}
        </div>
      </OsoGlassSurface>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="WorldSkills Direction"
          title="Your pathway beyond campus."
          description="OMNI should guide students from institution level toward district, state, national and WorldSkills readiness."
          icon={<GraduationCap className="h-5 w-5" />}
          action={
            <Link
              href="/worldskills"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore WorldSkills Hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-7 flex flex-wrap gap-2">
          {worldSkillsPathway.map((step, index) => (
            <span
              key={step}
              className={
                index <= 1
                  ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-emerald-700"
                  : "rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-500"
              }
            >
              {step}
            </span>
          ))}
        </div>
      </OsoGlassSurface>

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
              <p className="mt-3 font-black text-slate-700">
                No activity yet.
              </p>
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

function RankBox({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/82 p-5 text-center shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="oso-heading mt-3 text-3xl font-black text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {helper}
      </p>
    </div>
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
    return "Complete your Skill Passport first by adding missing academic details, bio, skills and career interests.";
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
