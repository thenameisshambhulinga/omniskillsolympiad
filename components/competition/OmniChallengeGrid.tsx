"use client";

import type { OmniChallengeEngineResult } from "@/lib/challenges/omni-challenge-engine";
import OmniChallengeCard from "@/components/competition/OmniChallengeCard";

export default function OmniChallengeGrid({
  engine,
}: {
  engine: OmniChallengeEngineResult;
}) {
  const sections = [
    {
      title: "Current Stage Challenges",
      subtitle: `${engine.currentStage} active challenge track`,
      challenges: engine.currentStageChallenges,
    },
    {
      title: "Unlocked Challenges",
      subtitle: "Available challenges ready to start",
      challenges: engine.availableChallenges,
    },
    {
      title: "Completed Challenges",
      subtitle: "Finished OMNI challenge milestones",
      challenges: engine.completedChallenges,
    },
    {
      title: "Upcoming Challenges",
      subtitle: "Locked challenges unlocked through Silicon Points",
      challenges: engine.upcomingChallenges.slice(0, 6),
    },
  ];

  return (
    <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
            OMNI Challenge Engine
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            Challenge-Based
            <span className="block bg-gradient-to-r from-purple-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
              Engineering Progression
            </span>
          </h2>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/62">
            Each OMNI step becomes a challenge, each challenge creates a
            submission, and each reward improves Silicon Points, tier progress
            and leaderboard momentum.
          </p>
        </div>

        <div className="mt-16 space-y-14">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-white/38">
                    {section.subtitle}
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-white">
                    {section.title}
                  </h3>
                </div>

                <p className="text-sm font-black text-cyan-200">
                  {section.challenges.length} Challenges
                </p>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {section.challenges.map((challenge) => (
                  <OmniChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
