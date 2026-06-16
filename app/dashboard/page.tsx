import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
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
  UserRound,
  Zap,
} from "lucide-react";

import OsoActionTile from "@/components/oso/OsoActionTile";
import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoPageShell from "@/components/oso/OsoPageShell";
import OsoProgressBar from "@/components/oso/OsoProgressBar";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";
import OfflineState from "@/components/system/OfflineState";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateOmniScore } from "@/lib/engineering-system";
import { getTierProgress, getVibgyorProgress } from "@/lib/profile/tier-engine";
import { omniGrowthLoop, worldSkillsPathway } from "@/data/omni-ecosystem";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

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

  return (
    <OsoPageShell>
      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <OsoStatusPill
                label="Student Growth Dashboard"
                tone="blue"
                icon={<UserRound className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label={tierProgress.currentTier}
                tone="emerald"
                icon={<Award className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label={`${vibgyorProgress.currentStage} Stage`}
                tone="yellow"
                icon={<Layers3 className="h-3.5 w-3.5" />}
              />
            </div>

            <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Welcome back,{" "}
              <span className="text-blue-600">
                {user.fullName || "Engineer"}
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
              This is your OMNI growth control room: practice progress,
              rankings, VIBGYOR stage, skill passport readiness and career
              direction in one clean view.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                View Skill Passport
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              OMNI Score
            </p>

            <p className="oso-heading mt-3 text-6xl font-black text-slate-950">
              {omniScore}
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Based on accuracy, consistency, completed days and Silicon Points.
            </p>

            <OsoProgressBar
              value={Math.min(100, Math.round(omniScore / 10))}
              tone="blue"
              className="mt-5"
            />
          </div>
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
          icon={<Gauge className="h-5 w-5" />}
          label="Accuracy"
          value={`${averageAccuracy}%`}
          helper={`${totalCorrectAnswers}/${totalQuestionsAttempted} correct`}
          tone="cyan"
        />

        <OsoMetricTile
          icon={<Trophy className="h-5 w-5" />}
          label="National Rank"
          value={`#${nationalRank}`}
          helper="India-wide position"
          tone="slate"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="VIBGYOR Level"
            title="Your current skill stage."
            description="VIBGYOR converts raw activity into a visible engineering growth pathway."
            icon={<Layers3 className="h-5 w-5" />}
          />

          <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Current Stage
                </p>

                <h3 className="oso-heading mt-2 text-4xl font-black text-slate-950">
                  {vibgyorProgress.currentStage}
                </h3>
              </div>

              <OsoStatusPill
                label={
                  vibgyorProgress.nextStage
                    ? `Next: ${vibgyorProgress.nextStage}`
                    : "Highest Stage"
                }
                tone="blue"
              />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <span>Stage Progress</span>
                <span>{vibgyorProgress.progressPercent}%</span>
              </div>

              <OsoProgressBar
                value={vibgyorProgress.progressPercent}
                tone="blue"
              />

              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                {vibgyorProgress.pointsToNextStage !== null
                  ? `${vibgyorProgress.pointsToNextStage} points needed for the next VIBGYOR stage.`
                  : "You have reached the highest VIBGYOR stage."}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniSignal
              icon={<Medal className="h-4 w-4" />}
              label="Engineering Tier"
              value={tierProgress.currentTier}
            />

            <MiniSignal
              icon={<Target className="h-4 w-4" />}
              label="Next Tier"
              value={tierProgress.nextTier ?? "Completed"}
            />
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Skill Passport"
            title="Build a portfolio-ready identity."
            description="Your Skill Passport is the proof layer for skills, ranks, badges, projects and recognition."
            icon={<ClipboardList className="h-5 w-5" />}
            action={
              <Link
                href="/profile"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Open Passport
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Profile Completion
                </p>
                <p className="oso-heading mt-2 text-4xl font-black text-slate-950">
                  {profileCompletion}%
                </p>
              </div>

              <OsoStatusPill
                label={user.omniId ?? "OMNI Pending"}
                tone="emerald"
              />
            </div>

            <OsoProgressBar
              value={profileCompletion}
              tone={profileCompletion >= 80 ? "emerald" : "yellow"}
              className="mt-5"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniSignal
              icon={<BookOpenCheck className="h-4 w-4" />}
              label="Skills"
              value={user.skills.length}
            />

            <MiniSignal
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label="Careers"
              value={user.careerInterests.length}
            />

            <MiniSignal
              icon={<GraduationCap className="h-4 w-4" />}
              label="College Rank"
              value={collegeRank ? `#${collegeRank}` : "Pending"}
            />
          </div>
        </OsoGlassSurface>
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Growth Loop"
          title="Where you are in the OMNI journey."
          description="The dashboard now follows the national ecosystem flow: learn, practice, compete, rank, get recognized and build your career."
          icon={<Route className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-3 md:grid-cols-3 xl:grid-cols-9">
          {omniGrowthLoop.map((step, index) => {
            const active = index <= currentGrowthIndex;

            return (
              <div
                key={step}
                className={
                  active
                    ? "rounded-[1.25rem] border border-blue-200 bg-blue-50 p-4 text-blue-800"
                    : "rounded-[1.25rem] border border-slate-200 bg-white/78 p-4 text-slate-500"
                }
              >
                <p className="text-xs font-black uppercase tracking-[0.16em]">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm font-black leading-6">{step}</p>
              </div>
            );
          })}
        </div>
      </OsoGlassSurface>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Ranking"
            title="Your ranking visibility."
            description="Ranks are calculated from your current competitive score signals."
            icon={<LineChart className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <RankBox label="National" value={`#${nationalRank}`} />
            <RankBox label="State" value={stateRank ? `#${stateRank}` : "Pending"} />
            <RankBox
              label="College"
              value={collegeRank ? `#${collegeRank}` : "Pending"}
            />
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-yellow-200 bg-yellow-50/80 p-5 text-yellow-900">
            <p className="font-black">Next best action</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-yellow-900/80">
              {nextAction}
            </p>
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="WorldSkills Direction"
            title="Your pathway beyond campus."
            description="OMNI should guide students from institution level toward state, national and WorldSkills readiness."
            icon={<GraduationCap className="h-5 w-5" />}
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
                {index + 1}. {step}
              </span>
            ))}
          </div>

          <Link
            href="/worldskills"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Explore WorldSkills Hub
            <ArrowRight className="h-4 w-4" />
          </Link>
        </OsoGlassSurface>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <OsoActionTile
          href="/daily-challenges"
          icon={<BrainCircuit className="h-5 w-5" />}
          title="Practice Daily"
          description="Complete today’s challenge to grow points, accuracy and streak."
          meta="Practice"
          tone="blue"
        />

        <OsoActionTile
          href="/competition"
          icon={<Trophy className="h-5 w-5" />}
          title="Compete"
          description="Enter the competition ecosystem and build national ranking signals."
          meta="Competition"
          tone="emerald"
        />

        <OsoActionTile
          href="/profile"
          icon={<Sparkles className="h-5 w-5" />}
          title="Build Passport"
          description="Improve your portfolio-ready Skill Passport and public identity."
          meta="Identity"
          tone="yellow"
        />
      </section>

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
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/78 p-4">
      <div className="flex items-center gap-2 text-blue-700">{icon}</div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function RankBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-5 text-center shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="oso-heading mt-3 text-3xl font-black text-slate-950">
        {value}
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
  if (siliconPoints >= 1500 && accuracy >= 75) return 7;
  if (siliconPoints >= 700) return 6;
  if (siliconPoints >= 300) return 5;
  if (skillsCount >= 3 && completedChallenges >= 5) return 4;
  if (completedChallenges >= 3) return 3;
  if (completedChallenges >= 1) return 2;
  if (skillsCount > 0) return 1;
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
    return "Complete your Skill Passport first: add skills, career interests, college details and bio.";
  }

  if (completedChallenges === 0) {
    return "Start with one daily challenge today to activate your practice and ranking signals.";
  }

  if (completedChallenges < 5) {
    return "Complete at least 5 daily challenges to build consistency and unlock stronger dashboard insights.";
  }

  if (skillsCount < 3) {
    return "Add at least 3 skills to make your Skill Passport more meaningful for mentors and industry.";
  }

  if (careerInterestsCount === 0) {
    return "Add your career interests so OMNI can guide you toward internships, placements and domain pathways.";
  }

  return "Keep practicing daily and start entering competition tracks to improve national visibility.";
}