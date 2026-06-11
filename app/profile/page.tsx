import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProfileAchievements } from "@/lib/profile/achievement-engine";
import { getRankSnapshot } from "@/lib/profile/rank-engine";
import { getTierProgress } from "@/lib/profile/tier-engine";

import OfflineState from "@/components/system/OfflineState";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileBio from "@/components/profile/ProfileBio";
import AchievementGrid from "@/components/profile/AchievementGrid";

import type { EngineeringProfile, ProfileAchievement } from "@/types/profile";

function getCompletionPercent(profile: EngineeringProfile) {
  const checks = [
    Boolean(profile.image),
    Boolean(profile.omniId && profile.omniId !== "OMNI Pending"),
    Boolean(profile.college && profile.college !== "Not updated"),
    Boolean(profile.branch && profile.branch !== "Not updated"),
    Boolean(profile.skills.length),
    Boolean(profile.bio && profile.bio !== "Not updated"),
    Boolean(profile.careerInterests.length),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      seasonProgress: true,
      dailyAttempts: {
        where: {
          completed: true,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <main className="relative z-10 min-h-screen px-6 pb-20 pt-36 text-white">
        <OfflineState />
      </main>
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

  const dailyCompleted = user.dailyAttempts.length;

  const achievements: ProfileAchievement[] = buildProfileAchievements({
    createdAt: user.createdAt,
    siliconPoints: user.siliconPoints ?? 0,
    streak: user.streak ?? 0,
    skills: user.skills ?? [],
    isOnboarded: user.isOnboarded,
    dailyAttempts: user.dailyAttempts,
  });

  const rankSnapshot = getRankSnapshot({
    currentUser: user,
    users: rankUsers,
  });

  const tierProgress = getTierProgress(user.siliconPoints ?? 0);

  const profile: EngineeringProfile = {
    id: user.id,
    name: user.fullName || user.email.split("@")[0] || "Student",
    email: user.email,
    image: user.image || "",
    omniId: user.omniId || "OMNI Pending",

    college: user.college || "Not updated",
    university: user.university || "Not updated",
    course: user.course || "Not updated",
    branch: user.branch || "Not updated",
    semester: user.semester || user.year || "Not updated",
    state: user.state || "Not updated",
    district: user.district || "Not updated",
    pincode: user.pincode || "Not updated",

    tier: tierProgress.currentTier,
    siliconPoints: user.siliconPoints ?? 0,
    nationalRank: rankSnapshot.nationalRank,
    stateRank: rankSnapshot.stateRank,
    collegeRank: rankSnapshot.collegeRank,
    streak: user.streak ?? 0,
    challengesSolved: dailyCompleted,
    averageAccuracy: user.seasonProgress?.averageAccuracy ?? 0,
    mockTests: 0,
    omniScore: user.siliconPoints ?? 0,
    successRate: user.seasonProgress?.averageAccuracy ?? 0,

    bio: user.bio || "Not updated",
    skills: user.skills ?? [],
    careerInterests: user.careerInterests ?? [],

    socials: [],
    completion: [],
    achievements,
  };

  const completionPercent = getCompletionPercent(profile);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-20 pt-36 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8">
        <ProfileHero
          profile={profile}
          completionPercent={completionPercent}
          publicProfilePath={`/profile/${profile.omniId}`}
          tierProgress={tierProgress}
        />

        <section className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ProfileAcademicCard profile={profile} />
          <ProfileProfessionalCard profile={profile} />
        </section>

        <ProfileSkills initialSkills={profile.skills} />

        <ProfileBio initialBio={profile.bio} />

        <AchievementGrid achievements={profile.achievements} />
      </div>
    </main>
  );
}

function ProfileAcademicCard({ profile }: { profile: EngineeringProfile }) {
  return (
    <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <p className="section-label">Academic Information</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info label="College" value={profile.college} />
        <Info label="University" value={profile.university} />
        <Info label="Course" value={profile.course} />
        <Info label="Branch" value={profile.branch} />
        <Info label="Semester" value={profile.semester} />
        <Info label="State" value={profile.state} />
        <Info label="District" value={profile.district} />
        <Info label="Pincode" value={profile.pincode} />
      </div>
    </section>
  );
}

function ProfileProfessionalCard({ profile }: { profile: EngineeringProfile }) {
  return (
    <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <p className="section-label">Professional Identity</p>

      <div className="mt-6 space-y-5">
        <Info label="Tagline" value={profile.bio} />

        <div>
          <p className="field-label">Career Interests</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {profile.careerInterests.length > 0 ? (
              profile.careerInterests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-purple-400/25 bg-purple-400/10 px-3 py-1.5 text-xs font-bold text-purple-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-sm text-white/45">No interests added yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="field-label">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white/75">{value}</p>
    </div>
  );
}
