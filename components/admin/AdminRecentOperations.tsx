"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Megaphone, Swords } from "lucide-react";

import OsoExpandableSurface from "@/components/oso/OsoExpandableSurface";
import OsoStatusPill from "@/components/oso/OsoStatusPill";

type RecentChallenge = {
  id: string;
  title: string;
  dayNumber: number;
  isPublished: boolean;
  questions: { id: string }[];
};

type RecentCompetitionUpdate = {
  id: string;
  assessmentName: string | null;
  verificationStatus: string;
  vibgyorStage: string;
  omniStep: string;
  siliconPoints: number;
  createdAt: Date;
  participantName: string;
  participantCode: string;
};

type AdminRecentOperationsProps = {
  recentChallenges: RecentChallenge[];
  recentCompetitionHistory: RecentCompetitionUpdate[];
};

export default function AdminRecentOperations({
  recentChallenges,
  recentCompetitionHistory,
}: AdminRecentOperationsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <OsoExpandableSurface
        eyebrow="Recent Challenges"
        title="Latest daily challenge activity"
        summary={`${recentChallenges.length} recent challenge record${
          recentChallenges.length === 1 ? "" : "s"
        } available.`}
        icon={<Megaphone className="h-5 w-5" />}
        tone="blue"
      >
        <div className="grid gap-3">
          {recentChallenges.length > 0 ? (
            recentChallenges.map((challenge) => (
              <Link
                href={`/admin/challenge/${challenge.id}`}
                key={challenge.id}
                className="group rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/45"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-950">
                    Day {challenge.dayNumber}
                  </p>

                  <OsoStatusPill
                    label={challenge.isPublished ? "Live" : "Draft"}
                    tone={challenge.isPublished ? "emerald" : "yellow"}
                  />
                </div>

                <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-600">
                  {challenge.title}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">
                    {challenge.questions.length} questions attached
                  </p>

                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
                </div>
              </Link>
            ))
          ) : (
            <EmptyState label="No daily challenges created yet." />
          )}
        </div>
      </OsoExpandableSurface>

      <OsoExpandableSurface
        eyebrow="Competition Updates"
        title="Recent competition operations"
        summary={`${recentCompetitionHistory.length} recent competition signal${
          recentCompetitionHistory.length === 1 ? "" : "s"
        } available.`}
        icon={<Swords className="h-5 w-5" />}
        tone="emerald"
      >
        <div className="grid gap-3">
          {recentCompetitionHistory.length > 0 ? (
            recentCompetitionHistory.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {entry.participantName}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {entry.participantCode}
                    </p>
                  </div>

                  <OsoStatusPill label={entry.verificationStatus} tone="blue" />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  {entry.assessmentName ?? "Competition update"} ·{" "}
                  {entry.vibgyorStage} / {entry.omniStep}
                </p>

                <p className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {entry.createdAt.toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <EmptyState label="No competition updates recorded yet." />
          )}
        </div>
      </OsoExpandableSurface>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}