"use client";

import RankCard from "@/components/rank/RankCard";

export default function ProfileRecognition({
  nationalRank,
  stateRank,
  collegeRank,
  currentTier,
  omniScore,
  streak,
}: {
  nationalRank: number;
  stateRank: number;
  collegeRank: number;
  currentTier: string;
  omniScore: number;
  streak: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
          Achievements & Recognition
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Competitive Standing
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RankCard
            title="National Rank"
            rank={nationalRank}
            metadata="India Rank"
          />
          <RankCard title="State Rank" rank={stateRank} metadata="State Rank" />
          <RankCard
            title="College Rank"
            rank={collegeRank}
            metadata="College Rank"
          />

          <div className="rounded-[2.25rem] border border-white/10 bg-black/25 p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
              Current Tier
            </p>
            <p className="mt-4 text-3xl font-black text-white">{currentTier}</p>
          </div>

          <div className="rounded-[2.25rem] border border-white/10 bg-black/25 p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
              Omni Score
            </p>
            <p className="mt-4 text-3xl font-black text-white">{omniScore}</p>
          </div>

          <div className="rounded-[2.25rem] border border-white/10 bg-black/25 p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
              Competition Streak
            </p>
            <p className="mt-4 text-3xl font-black text-white">{streak} Days</p>
          </div>
        </div>
      </div>
    </section>
  );
}
