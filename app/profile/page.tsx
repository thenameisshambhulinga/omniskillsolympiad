import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Flame,
  Gauge,
  GraduationCap,
  Layers3,
  MapPin,
  Medal,
  Route,
  Share2,
  ShieldCheck,
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
import { buildProfileAchievements } from "@/lib/profile/achievement-engine";
import { getRankSnapshot } from "@/lib/profile/rank-engine";
import { getTierProgress, getVibgyorProgress } from "@/lib/profile/tier-engine";
import { omniGrowthLoop, worldSkillsPathway } from "@/data/omni-ecosystem";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ProfilePage() {
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
      image: true,
      fullName: true,
      omniId: true,
      college: true,
      university: true,
      course: true,
      branch: true,
      semester: true,
      year: true,
      state: true,
      district: true,
      pincode: true,
      siliconPoints: true,
      streak: true,
      skills: true,
      careerInterests: true,
      bio: true,
      isOnboarded: true,
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
        take: 5,
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

  const rankUsers = await prisma.user.findMany({
    select: {
      id: true,
      college: true,
      state: true,
      siliconPoints: true,
      seasonProgress: {
        select: {
          weightedRankScore: true,
        },
      },
    },
  });

  const siliconPoints = Math.max(
    user.siliconPoints ?? 0,
    user.seasonProgress?.totalPoints ?? 0,
    Math.round(user.seasonProgress?.weightedRankScore ?? 0),
  );

  const completedChallenges = user.dailyAttempts.length;

  const achievements = buildProfileAchievements({
    createdAt: user.createdAt,
    siliconPoints,
    streak: user.streak ?? 0,
    skills: user.skills ?? [],
    isOnboarded: user.isOnboarded,
    dailyAttempts: user.dailyAttempts,
  });

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.status === "unlocked",
  ).length;

  const rankSnapshot = getRankSnapshot({
    currentUser: {
      id: user.id,
      college: user.college,
      state: user.state,
      siliconPoints,
      seasonProgress: user.seasonProgress
        ? {
            weightedRankScore: user.seasonProgress.weightedRankScore,
          }
        : null,
    },
    users: rankUsers,
  });

  const tierProgress = getTierProgress(siliconPoints);
  const vibgyorProgress = getVibgyorProgress(siliconPoints);

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

  const displayName = user.fullName || user.email.split("@")[0] || "Student";
  const omniId = user.omniId || "OMNI Pending";
  const publicProfilePath =
    omniId !== "OMNI Pending" ? `/profile/${encodeURIComponent(omniId)}` : "";

  const profileCompletion = getProfileCompletion({
    image: user.image,
    omniId: user.omniId,
    college: user.college,
    branch: user.branch,
    skills: user.skills,
    bio: user.bio,
    careerInterests: user.careerInterests,
  });

  const portfolioReadiness = getPortfolioReadiness({
    profileCompletion,
    completedChallenges,
    achievements: unlockedAchievements,
    skills: user.skills.length,
    careerInterests: user.careerInterests.length,
  });

  const currentGrowthIndex = getGrowthIndex({
    completedChallenges,
    siliconPoints,
    skillsCount: user.skills.length,
    achievementCount: unlockedAchievements,
  });

  return (
    <OsoPageShell>
      <div id="passport-overview" className="scroll-mt-[190px]" />
      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <OsoStatusPill
                label="Skill Passport"
                tone="blue"
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
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
              {displayName}&apos;s{" "}
              <span className="text-blue-600">engineering skill passport.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
              Your Skill Passport brings together OMNI ID, VIBGYOR level,
              rankings, Silicon Points, badges, skills, academic identity and
              career direction into one portfolio-ready profile.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding?edit=passport"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Complete / Edit Passport
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              {publicProfilePath ? (
                <Link
                  href={publicProfilePath}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                >
                  Public Profile
                  <Share2 className="h-4 w-4 transition group-hover:rotate-6" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              OMNI Identity
            </p>

            <p className="oso-heading mt-3 break-words text-3xl font-black leading-tight text-slate-950">
              {omniId}
            </p>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Permanent identity for rankings, competitions, badges and public
              engineering recognition.
            </p>

            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                <span>Passport Completion</span>
                <span>{profileCompletion}%</span>
              </div>

              <OsoProgressBar
                value={profileCompletion}
                tone={profileCompletion >= 80 ? "emerald" : "blue"}
              />
            </div>
          </div>
        </div>
      </OsoGlassSurface>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Profile Image"
          title="Profile Image & Identity."
          description="Your uploaded profile image is part of the Skill Passport identity layer and should be visible to the student."
          icon={<UserRound className="h-5 w-5" />}
          action={
            <Link
              href="/onboarding?edit=passport"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(37,99,235,0.20)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Edit Passport
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-7 grid gap-5 lg:grid-cols-[260px_1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/86 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="aspect-square overflow-hidden rounded-[1.55rem] border border-blue-200 bg-blue-50">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.fullName || "Student"} profile image`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-700">
                  <UserRound className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={<UserRound className="h-5 w-5" />} label="Name" value={user.fullName || "Not added"} />
            <InfoCard icon={<ShieldCheck className="h-5 w-5" />} label="OMNI ID" value={user.omniId || "Pending"} />
            <InfoCard icon={<Building2 className="h-5 w-5" />} label="College / Institute" value={user.college || "Not added"} />
            <InfoCard icon={<GraduationCap className="h-5 w-5" />} label="Branch" value={user.branch || "Not added"} />
          </div>
        </div>
      </OsoGlassSurface>


      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <div id="passport-editor" className="scroll-mt-[190px]" />

        <OsoSectionHeader
          eyebrow="Passport Editor"
          title="Passport Completion Studio."
          description="This is the clear action area for updating academic details, skills, career interests, bio and identity proof. Use the guided editor when your passport is incomplete."
          icon={<ClipboardList className="h-5 w-5" />}
          action={
            <Link
              href="/onboarding?edit=passport"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(37,99,235,0.20)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Open Guided Editor
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PassportEditCard
            icon={<Building2 className="h-5 w-5" />}
            title="Academic Identity"
            description="College, branch, course, semester and education details."
            status={user.college && user.branch ? "Ready" : "Needs update"}
            tone={user.college && user.branch ? "emerald" : "yellow"}
          />

          <PassportEditCard
            icon={<BookOpenCheck className="h-5 w-5" />}
            title="Technical Skills"
            description="Skills that make your profile meaningful for mentors and industry."
            status={user.skills.length > 0 ? `${user.skills.length} added` : "Needs skills"}
            tone={user.skills.length > 0 ? "emerald" : "yellow"}
          />

          <PassportEditCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="Career Direction"
            description="Career interests used for guidance, internships and pathways."
            status={
              user.careerInterests.length > 0
                ? `${user.careerInterests.length} added`
                : "Needs direction"
            }
            tone={user.careerInterests.length > 0 ? "emerald" : "yellow"}
          />

          <PassportEditCard
            icon={<UserRound className="h-5 w-5" />}
            title="Bio & Proof"
            description="Short engineering bio and identity readiness details."
            status={user.bio ? "Ready" : "Needs bio"}
            tone={user.bio ? "emerald" : "yellow"}
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
          icon={<Trophy className="h-5 w-5" />}
          label="National Rank"
          value={rankSnapshot.nationalRank}
          helper="India-wide visibility"
          tone="emerald"
        />

        <OsoMetricTile
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Challenges"
          value={completedChallenges}
          helper="Completed practice signals"
          tone="cyan"
        />

        <OsoMetricTile
          icon={<Medal className="h-5 w-5" />}
          label="Badges"
          value={unlockedAchievements}
          helper={`${achievements.length} total badge paths`}
          tone="yellow"
        />

        <OsoMetricTile
          icon={<Gauge className="h-5 w-5" />}
          label="Accuracy"
          value={`${averageAccuracy}%`}
          helper="Attempt performance"
          tone="slate"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="VIBGYOR Passport"
            title="Your skill stage and next unlock."
            description="VIBGYOR converts your activity into a clear engineering growth stage."
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
            <PassportMiniCard
              icon={<Award className="h-4 w-4" />}
              label="Engineering Tier"
              value={tierProgress.currentTier}
            />

            <PassportMiniCard
              icon={<Target className="h-4 w-4" />}
              label="Next Tier"
              value={tierProgress.nextTier ?? "Completed"}
            />
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Ranking Passport"
            title="Your competitive visibility."
            description="Ranks make student growth visible at college, state and national levels."
            icon={<Trophy className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <RankBox label="National" value={rankSnapshot.nationalRank} />
            <RankBox label="State" value={rankSnapshot.stateRank} />
            <RankBox label="College" value={rankSnapshot.collegeRank} />
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900">
            <p className="font-black">Recognition layer</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-emerald-900/80">
              Every challenge, badge and rank strengthens the public Skill
              Passport that mentors, institutions and future industry partners
              can understand quickly.
            </p>
          </div>
        </OsoGlassSurface>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Academic Identity"
            title="Institution and education profile."
            description="This is the academic layer of your Skill Passport."
            icon={<GraduationCap className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={<Building2 className="h-4 w-4" />}
              label="College"
              value={displayValue(user.college)}
            />
            <InfoCard
              icon={<BookOpenCheck className="h-4 w-4" />}
              label="University"
              value={displayValue(user.university)}
            />
            <InfoCard
              icon={<ClipboardList className="h-4 w-4" />}
              label="Course"
              value={displayValue(user.course)}
            />
            <InfoCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Branch"
              value={displayValue(user.branch)}
            />
            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Semester"
              value={displayValue(user.semester || user.year)}
            />
            <InfoCard
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={`${displayValue(user.district)}, ${displayValue(user.state)}`}
            />
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Career Direction"
            title="Skills and career interests."
            description="This layer helps OMNI connect your skill identity to future careers."
            icon={<BriefcaseBusiness className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-5">
            <SkillGroup
              title="Technical Skills"
              empty="No skills added yet."
              items={user.skills}
              tone="blue"
            />

            <SkillGroup
              title="Career Interests"
              empty="No career interests added yet."
              items={user.careerInterests}
              tone="emerald"
            />

            <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Bio
              </p>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                {user.bio?.trim() || "No professional bio added yet."}
              </p>
            </div>
          </div>
        </OsoGlassSurface>
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Portfolio Readiness"
          title="How ready is your profile for recognition?"
          description="A scalable passport must show what is complete, what is missing, and what to improve next."
          icon={<Sparkles className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Portfolio Readiness
            </p>

            <p className="oso-heading mt-3 text-6xl font-black text-slate-950">
              {portfolioReadiness}%
            </p>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Based on profile completion, badges, skills, career interests and
              challenge activity.
            </p>

            <OsoProgressBar
              value={portfolioReadiness}
              tone={portfolioReadiness >= 75 ? "emerald" : "yellow"}
              className="mt-5"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ReadinessCheck
              label="OMNI ID"
              done={Boolean(user.omniId)}
              helper="Permanent passport identity"
            />
            <ReadinessCheck
              label="Skills"
              done={user.skills.length > 0}
              helper={`${user.skills.length} skills added`}
            />
            <ReadinessCheck
              label="Challenges"
              done={completedChallenges > 0}
              helper={`${completedChallenges} completed`}
            />
            <ReadinessCheck
              label="Career Direction"
              done={user.careerInterests.length > 0}
              helper={`${user.careerInterests.length} interests added`}
            />
          </div>
        </div>
      </OsoGlassSurface>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Growth Journey"
          title="Your OMNI ecosystem pathway."
          description="Your profile should clearly show the journey from learning to recognition and career growth."
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

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Achievements"
            title="Badges and recognition."
            description="Achievements convert raw student activity into visible proof."
            icon={<Medal className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <article
                key={achievement.id}
                className="rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                      {achievement.rarity}
                    </p>

                    <h3 className="mt-1 font-black text-slate-950">
                      {achievement.title}
                    </h3>
                  </div>

                  <OsoStatusPill
                    label={achievement.status}
                    tone={
                      achievement.status === "unlocked"
                        ? "emerald"
                        : achievement.status === "progress"
                          ? "blue"
                          : "slate"
                    }
                  />
                </div>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                  {achievement.description}
                </p>

                <OsoProgressBar
                  value={achievement.progress}
                  tone={achievement.status === "unlocked" ? "emerald" : "blue"}
                  className="mt-4"
                />
              </article>
            ))}
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="WorldSkills Direction"
            title="Where this passport can lead."
            description="OMNI profile data should support future WorldSkills and national recognition pathways."
            // icon={<GraduationCap className="h-5 w-5" />}
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

          <div className="mt-6 grid gap-3">
            {user.activities.length > 0 ? (
              user.activities.map((activity) => (
                <article
                  key={activity.id}
                  className="rounded-[1.25rem] border border-slate-200 bg-white/82 p-4"
                >
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
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-6 text-center">
                <Flame className="mx-auto h-8 w-8 text-blue-600" />
                <p className="mt-3 font-black text-slate-700">
                  No timeline yet.
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Complete challenges to start building your public growth
                  timeline.
                </p>
              </div>
            )}
          </div>
        </OsoGlassSurface>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <OsoActionTile
          href="/daily-challenges"
          icon={<Zap className="h-5 w-5" />}
          title="Earn More Signals"
          description="Complete daily challenges to improve rank, badges and passport readiness."
          meta="Practice"
          tone="blue"
        />

        <OsoActionTile
          href="/competition"
          icon={<Trophy className="h-5 w-5" />}
          title="Compete Nationally"
          description="Use competition activity to strengthen your public engineering identity."
          meta="Competition"
          tone="emerald"
        />

        <OsoActionTile
          href="/worldskills"
          icon={<GraduationCap className="h-5 w-5" />}
          title="Explore WorldSkills"
          description="Understand how OMNI competition pathways connect to higher recognition."
          meta="Pathway"
          tone="yellow"
        />
      </section>
    </OsoPageShell>
  );
}

function PassportMiniCard({
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


function PassportEditCard({
  icon,
  title,
  description,
  status,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  status: string;
  tone: "emerald" | "yellow";
}) {
  const style =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <article className="rounded-[1.45rem] border border-slate-200 bg-white/86 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_46px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
          {icon}
        </div>

        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${style}`}>
          {status}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/78 p-4">
      <div className="flex items-center gap-2 text-blue-700">{icon}</div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black leading-6 text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SkillGroup({
  title,
  empty,
  items,
  tone,
}: {
  title: string;
  empty: string;
  items: string[];
  tone: "blue" | "emerald";
}) {
  const className =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] ${className}`}
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm font-semibold text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  );
}

function ReadinessCheck({
  label,
  helper,
  done,
}: {
  label: string;
  helper: string;
  done: boolean;
}) {
  return (
    <div
      className={
        done
          ? "rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
          : "rounded-[1.25rem] border border-slate-200 bg-white p-4 text-slate-500"
      }
    >
      <div className="flex items-center gap-2">
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Target className="h-5 w-5" />
        )}

        <p className="font-black">{label}</p>
      </div>

      <p className="mt-2 text-sm font-semibold leading-6">{helper}</p>
    </div>
  );
}

function displayValue(value: string | null) {
  return value?.trim() || "Not updated";
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

function getPortfolioReadiness({
  profileCompletion,
  completedChallenges,
  achievements,
  skills,
  careerInterests,
}: {
  profileCompletion: number;
  completedChallenges: number;
  achievements: number;
  skills: number;
  careerInterests: number;
}) {
  const score =
    profileCompletion * 0.45 +
    Math.min(100, completedChallenges * 10) * 0.2 +
    Math.min(100, achievements * 18) * 0.18 +
    Math.min(100, skills * 20) * 0.1 +
    Math.min(100, careerInterests * 25) * 0.07;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getGrowthIndex({
  completedChallenges,
  siliconPoints,
  skillsCount,
  achievementCount,
}: {
  completedChallenges: number;
  siliconPoints: number;
  skillsCount: number;
  achievementCount: number;
}) {
  if (siliconPoints >= 1500 && achievementCount >= 4) return 7;
  if (siliconPoints >= 700) return 6;
  if (siliconPoints >= 300) return 5;
  if (achievementCount >= 2) return 4;
  if (completedChallenges >= 3) return 3;
  if (completedChallenges >= 1) return 2;
  if (skillsCount > 0) return 1;
  return 0;
}