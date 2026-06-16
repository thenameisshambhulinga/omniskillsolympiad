"use client";

import {
  Activity,
  BarChart3,
  CalendarClock,
  CircuitBoard,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";

import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";

type AdminPlatformSignalsProps = {
  totalUsers: number;
  onboardedUsers: number;
  totalChallenges: number;
  publishedChallenges: number;
  livePosters: number;
  draftPosters: number;
  competitionProfiles: number;
  verifiedCompetitionProfiles: number;
  pendingCompetitionProfiles: number;
  totalAttempts: number;
};

export default function AdminPlatformSignals({
  totalUsers,
  onboardedUsers,
  totalChallenges,
  publishedChallenges,
  livePosters,
  draftPosters,
  competitionProfiles,
  verifiedCompetitionProfiles,
  pendingCompetitionProfiles,
  totalAttempts,
}: AdminPlatformSignalsProps) {
  return (
    <OsoGlassSurface hover={false} className="p-6 sm:p-8">
      <OsoSectionHeader
        eyebrow="Platform Signals"
        title="Only the admin metrics that matter."
        description="Detailed records stay inside each admin module. This hub only shows the signals needed for quick decisions."
        icon={<Activity className="h-5 w-5" />}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <OsoMetricTile
          icon={<Users className="h-5 w-5" />}
          label="Users"
          value={totalUsers}
          helper={`${onboardedUsers} onboarded`}
          tone="blue"
        />

        <OsoMetricTile
          icon={<CircuitBoard className="h-5 w-5" />}
          label="Challenges"
          value={totalChallenges}
          helper={`${publishedChallenges} published`}
          tone="cyan"
        />

        <OsoMetricTile
          icon={<Megaphone className="h-5 w-5" />}
          label="Posters"
          value={livePosters}
          helper={`${draftPosters} drafts`}
          tone="yellow"
        />

        <OsoMetricTile
          icon={<BarChart3 className="h-5 w-5" />}
          label="Competition"
          value={competitionProfiles}
          helper={`${verifiedCompetitionProfiles} verified`}
          tone="emerald"
        />

        <OsoMetricTile
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Pending"
          value={pendingCompetitionProfiles}
          helper={`${totalAttempts} total attempts`}
          tone="slate"
        />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-blue-200 bg-blue-50/80 p-5 text-blue-900">
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-black">Admin productivity rule</p>
            <p className="mt-1 text-sm font-semibold leading-7 text-blue-900/80">
              Keep this page as a command center only. Editing, moderation and
              deep data should live inside their own admin modules.
            </p>
          </div>
        </div>
      </div>
    </OsoGlassSurface>
  );
}