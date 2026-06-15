import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AssessmentLedger from "@/components/competition/AssessmentLedger";
import AssessmentSummaryCard from "@/components/competition/AssessmentSummaryCard";
import AssessmentTimeline from "@/components/competition/AssessmentTimeline";
import AssessmentTrendCard from "@/components/competition/AssessmentTrendCard";
import CompetitionMilestoneCard from "@/components/competition/CompetitionMilestoneCard";
import CompetitionNextTarget from "@/components/competition/CompetitionNextTarget";
import CompetitionPassportHero from "@/components/competition/CompetitionPassportHero";
import CompetitionProgressOverview from "@/components/competition/CompetitionProgressOverview";
import CompetitionRankSnapshot from "@/components/competition/CompetitionRankSnapshot";
import CompetitionStatusCard from "@/components/competition/CompetitionStatusCard";
import CompetitionTimeline from "@/components/competition/CompetitionTimeline";
import EngineeringReadinessMatrix from "@/components/competition/EngineeringReadinessMatrix";
import OmniJourneyStatus from "@/components/competition/OmniJourneyStatus";
import OmniReadinessCard from "@/components/competition/OmniReadinessCard";
import OmniRoadmapHero from "@/components/competition/OmniRoadmapHero";
import OmniStageTracker from "@/components/competition/OmniStageTracker";
import UpcomingAssessmentAreas from "@/components/competition/UpcomingAssessmentAreas";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getAssessmentHistory,
  getAssessmentTrend,
  getAverageAssessmentScore,
  getLatestAssessment,
  getUpcomingAssessmentAreas,
} from "@/lib/profile/assessment-ledger";
import { getCompetitionPassport } from "@/lib/profile/competition-passport";
import { getJourneyProgress } from "@/lib/profile/omni-roadmap";
import {
  buildReadinessInputFromSnapshot,
  getEngineeringReadiness,
} from "@/lib/profile/readiness-engine";
import { getRankSnapshot } from "@/lib/profile/rank-engine";
import { getVibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function CompetitionPage() {
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
      omniId: true,
      college: true,
      state: true,
      siliconPoints: true,
      isOnboarded: true,
      skills: true,
      careerInterests: true,
      streak: true,
      createdAt: true,
      activities: {
        select: {
          id: true,
        },
      },
      dailyAttempts: {
        where: {
          completed: true,
        },
        select: {
          id: true,
        },
      },
      seasonProgress: {
        select: {
          totalPoints: true,
          weightedRankScore: true,
          consistencyScore: true,
          averageAccuracy: true,
          completedDays: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
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

  const roadmapSnapshot = getJourneyProgress(siliconPoints);
  const vibgyorSnapshot = getVibgyorJourneySnapshot(siliconPoints);

  const readinessInput = buildReadinessInputFromSnapshot({
    snapshot: vibgyorSnapshot,
    dailyCompletedCount:
      user.seasonProgress?.completedDays ?? user.dailyAttempts.length,
    activityCount: user.activities.length,
    consistencyScore: user.seasonProgress?.consistencyScore ?? user.streak ?? 0,
    averageAccuracy: user.seasonProgress?.averageAccuracy ?? 0,
    skills: user.skills ?? [],
    careerInterests: user.careerInterests ?? [],
  });

  const engineeringReadiness = getEngineeringReadiness(readinessInput);

  const assessmentInput = {
    snapshot: vibgyorSnapshot,
    readiness: engineeringReadiness,
  };

  const assessmentHistory = getAssessmentHistory(assessmentInput);
  const latestAssessment = getLatestAssessment(assessmentInput);
  const averageAssessmentScore = getAverageAssessmentScore(assessmentInput);
  const assessmentTrend = getAssessmentTrend(assessmentInput);
  const upcomingAssessmentAreas = getUpcomingAssessmentAreas(assessmentInput);

  const rankSnapshot = getRankSnapshot({
    currentUser: user,
    users: rankUsers,
  });

  const competitionPassport = getCompetitionPassport({
    omniId: user.omniId ?? "OMNI Pending",
    siliconPoints,
    nationalRank: rankSnapshot.nationalRank,
    stateRank: rankSnapshot.stateRank,
    collegeRank: rankSnapshot.collegeRank,
    rankChange: 0,
    createdAt: user.createdAt,
    vibgyorSnapshot,
    readiness: engineeringReadiness,
    latestAssessment,
    assessmentTrend,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute left-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-purple-700/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl" />

      <section className="relative z-10 px-6 py-28 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
            Competition Architecture
          </p>

          <h1 className="max-w-6xl text-5xl font-bold leading-tight md:text-7xl">
            Omni Skills Olympiad
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Multi-Stage Technical Competition
            </span>
          </h1>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-gray-300">
            A national-level industry-oriented electronics engineering
            competition ecosystem designed to track offline labs, workshops,
            mentor evaluations, judge evaluations, practical demonstrations and
            WorldSkills preparation.
          </p>
        </div>
      </section>

      <OmniRoadmapHero snapshot={roadmapSnapshot} />

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto grid max-w-[1600px] gap-8">
          <OmniJourneyStatus snapshot={vibgyorSnapshot} />

          <OmniStageTracker snapshot={vibgyorSnapshot} />

          <OmniReadinessCard snapshot={vibgyorSnapshot} />

          <EngineeringReadinessMatrix readiness={engineeringReadiness} />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
            <div className="space-y-8">
              <AssessmentSummaryCard assessment={latestAssessment} />

              <AssessmentLedger assessments={assessmentHistory} />
            </div>

            <div className="space-y-8">
              <AssessmentTrendCard
                trend={assessmentTrend}
                averageScore={averageAssessmentScore}
              />

              <AssessmentTimeline latestAssessment={latestAssessment} />

              <UpcomingAssessmentAreas areas={upcomingAssessmentAreas} />
            </div>
          </div>

          <CompetitionPassportHero passport={competitionPassport} />

          <CompetitionStatusCard passport={competitionPassport} />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
            <div className="space-y-8">
              <CompetitionProgressOverview passport={competitionPassport} />

              <div className="grid gap-5 md:grid-cols-2">
                {competitionPassport.milestones.map((milestone) => (
                  <CompetitionMilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <CompetitionRankSnapshot passport={competitionPassport} />

              <CompetitionNextTarget passport={competitionPassport} />

              <CompetitionTimeline timeline={competitionPassport.timeline} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
              Competition Structure
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Multi-Stage
              <span className="block text-cyan-400">Evaluation Ecosystem</span>
            </h2>
          </div>

          <div className="mt-20 space-y-8">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
                    Stage 01
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    Electronics Fundamentals Screening
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Offline lab-based electronics fundamentals screening focused
                    on component recognition, circuit theory, analog
                    electronics, digital systems and troubleshooting concepts.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 px-8 py-6">
                  <p className="text-sm uppercase tracking-widest text-purple-300">
                    Format
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">Lab</h4>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                    Stage 02
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    Workshop & Technical Demonstration
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Practical electronics demonstrations, mentor-led technical
                    engagement activities and guided engineering implementation
                    sessions.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-8 py-6">
                  <p className="text-sm uppercase tracking-widest text-cyan-300">
                    Format
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">Workshop</h4>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
                    Stage 03
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    Practical Skillathon Evaluation
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Hands-on embedded systems, debugging, troubleshooting, PCB
                    implementation and electronics practical evaluation judged
                    through physical demonstrations.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 px-8 py-6">
                  <p className="text-sm uppercase tracking-widest text-purple-300">
                    Format
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">Assessment</h4>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-10 backdrop-blur-md">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                    Final Stage
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    WorldSkills Talent Selection
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Selection of high-potential students for advanced
                    mentorship, finishing school programs and
                    WorldSkills-oriented preparation pathways.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/30 bg-black/20 px-8 py-6">
                  <p className="text-sm uppercase tracking-widest text-cyan-300">
                    Outcome
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">Selection</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
