"use client";

import {
  BadgeCheck,
  Flag,
  Globe2,
  Medal,
  Route,
  Sparkles,
  Trophy,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionMetricTile,
  CompetitionProgressBar,
  CompetitionSectionHeading,
  CompetitionStatusPill,
} from "@/components/competition/CompetitionGlassPanel";

type OsoCompetitionEssentialsProps = {
  currentStage: string;
  currentTier: string;
  completedSteps: number;
  totalSteps: number;
  nationalRank: string;
  stateRank: string;
  collegeRank: string;
  competitionsParticipated: number;
  badgesEarned: number;
  domainExpertise: string[];
};

export default function OsoCompetitionEssentials({
  currentStage,
  currentTier,
  completedSteps,
  totalSteps,
  nationalRank,
  stateRank,
  collegeRank,
  competitionsParticipated,
  badgesEarned,
  domainExpertise,
}: OsoCompetitionEssentialsProps) {
  const progress =
    totalSteps > 0
      ? Math.max(0, Math.min(100, Math.round((completedSteps / totalSteps) * 100)))
      : 0;

  const visibleDomains =
    domainExpertise.length > 0
      ? domainExpertise.slice(0, 4)
      : ["Embedded", "PCB", "Electronics"];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <CompetitionGlassPanel className="p-6 sm:p-8">
        <CompetitionSectionHeading
          eyebrow="VIBGYOR Snapshot"
          title="Your current competition stage."
          description="A single clear progression snapshot. Detailed stage and timeline data is available below only when expanded."
          icon={<Route className="h-5 w-5" />}
        />

        <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Current Stage
              </p>

              <h3 className="oso-heading mt-2 text-3xl font-black text-slate-950">
                {currentStage}
              </h3>
            </div>

            <CompetitionStatusPill label={currentTier} tone="blue" />
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Journey
              </p>
              <p className="text-sm font-black text-slate-950">
                {completedSteps}/{totalSteps}
              </p>
            </div>

            <CompetitionProgressBar value={progress} tone="blue" />
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-yellow-200 bg-yellow-50/80 p-5 text-yellow-900">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5" />
            <p className="font-black">Road to WorldSkills</p>
          </div>

          <p className="mt-2 text-sm font-semibold leading-7 text-yellow-900/80">
            Full pathway is kept in the expandable details section so this page
            stays clean.
          </p>
        </div>
      </CompetitionGlassPanel>

      <CompetitionGlassPanel className="p-6 sm:p-8">
        <CompetitionSectionHeading
          eyebrow="Skill Passport"
          title="Your visible competition identity."
          description="Only the main passport signals are shown here. Milestones and timeline are hidden below."
          icon={<BadgeCheck className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <CompetitionMetricTile
            icon={<Trophy className="h-5 w-5" />}
            label="Competitions"
            value={competitionsParticipated}
            helper="Tracked competition signals"
            tone="blue"
          />

          <CompetitionMetricTile
            icon={<Medal className="h-5 w-5" />}
            label="Badges"
            value={badgesEarned}
            helper="Recognition signals"
            tone="yellow"
          />

          <CompetitionMetricTile
            icon={<Flag className="h-5 w-5" />}
            label="National Rank"
            value={nationalRank}
            helper={`State: ${stateRank} · College: ${collegeRank}`}
            tone="emerald"
          />

          <CompetitionMetricTile
            icon={<Globe2 className="h-5 w-5" />}
            label="Passport"
            value="Active"
            helper="Portfolio-ready identity"
            tone="cyan"
          />
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Domains
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleDomains.map((domain) => (
              <span
                key={domain}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-blue-700"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {domain}
              </span>
            ))}
          </div>
        </div>
      </CompetitionGlassPanel>
    </div>
  );
}