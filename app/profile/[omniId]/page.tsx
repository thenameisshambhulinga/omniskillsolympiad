// import { prisma } from "@/lib/prisma";
// import type { PublicActivity } from "@/types/activity";
// import type { EngineeringProfile, ProfileAchievement } from "@/types/profile";

// import ProfileNotFound from "@/components/profile/public/ProfileNotFound";
// import PublicActivityTimeline from "@/components/profile/public/PublicActivityTimeline";
// import PublicProfileAchievements from "@/components/profile/public/PublicProfileAchievements";
// import PublicProfileHero from "@/components/profile/public/PublicProfileHero";
// import PublicProfileSkills from "@/components/profile/public/PublicProfileSkills";
// import PublicProfileStats from "@/components/profile/public/PublicProfileStats";

// type PageProps = {
//   params: Promise<{
//     omniId: string;
//   }>;
// };

// function getTier(points: number) {
//   if (points >= 2000) return "Champion";
//   if (points >= 1000) return "Master";
//   if (points >= 500) return "Architect";
//   if (points >= 100) return "Builder";
//   return "Explorer";
// }

// function getScore(user: {
//   siliconPoints: number;
//   seasonProgress?: { weightedRankScore: number } | null;
// }) {
//   return user.seasonProgress?.weightedRankScore ?? user.siliconPoints ?? 0;
// }

// function getRank<
//   T extends {
//     id: string;
//     siliconPoints: number;
//     seasonProgress?: { weightedRankScore: number } | null;
//   },
// >(users: T[], userId: string) {
//   const sorted = [...users].sort((a, b) => getScore(b) - getScore(a));
//   const index = sorted.findIndex((user) => user.id === userId);
//   return `#${index >= 0 ? index + 1 : 1}`;
// }

// export default async function PublicProfilePage({ params }: PageProps) {
//   const { omniId } = await params;
//   const decodedOmniId = decodeURIComponent(omniId);

//   const user = await prisma.user.findUnique({
//     where: {
//       omniId: decodedOmniId,
//     },
//     include: {
//       seasonProgress: {
//         select: {
//           weightedRankScore: true,
//           averageAccuracy: true,
//         },
//       },
//       dailyAttempts: {
//         where: {
//           completed: true,
//         },
//         select: {
//           id: true,
//           createdAt: true,
//           percentage: true,
//         },
//       },
//       activities: {
//         select: {
//           id: true,
//           type: true,
//           title: true,
//           description: true,
//           createdAt: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//         take: 8,
//       },
//     },
//   });

//   if (!user) {
//     return <ProfileNotFound />;
//   }

//   const rankUsers = await prisma.user.findMany({
//     select: {
//       id: true,
//       state: true,
//       college: true,
//       siliconPoints: true,
//       seasonProgress: {
//         select: {
//           weightedRankScore: true,
//         },
//       },
//     },
//   });

//   const stateUsers = rankUsers.filter(
//     (rankUser) => rankUser.state && rankUser.state === user.state,
//   );

//   const collegeUsers = rankUsers.filter(
//     (rankUser) => rankUser.college && rankUser.college === user.college,
//   );

//   const completedChallenges = user.dailyAttempts.length;

//   const achievements: ProfileAchievement[] = [
//     {
//       id: "engineering-explorer",
//       title: "Engineering Explorer",
//       description: "Activated a public engineering identity.",
//       progress: 100,
//       status: "unlocked",
//       rarity: "common",
//       icon: "shield",
//       earnedAt: user.createdAt.toISOString(),
//     },
//     {
//       id: "challenge-warrior",
//       title: "Challenge Warrior",
//       description: `${completedChallenges}/10 daily challenges completed.`,
//       progress: Math.min(100, Math.round((completedChallenges / 10) * 100)),
//       status:
//         completedChallenges >= 10
//           ? "unlocked"
//           : completedChallenges > 0
//             ? "progress"
//             : "locked",
//       rarity: "rare",
//       icon: "trophy",
//       earnedAt: completedChallenges >= 10 ? user.createdAt.toISOString() : null,
//     },
//     {
//       id: "consistency-master",
//       title: "Consistency Master",
//       description: `${user.streak}/7 streak days completed.`,
//       progress: Math.min(100, Math.round((user.streak / 7) * 100)),
//       status:
//         user.streak >= 7 ? "unlocked" : user.streak > 0 ? "progress" : "locked",
//       rarity: "epic",
//       icon: "flame",
//       earnedAt: user.streak >= 7 ? user.createdAt.toISOString() : null,
//     },
//     {
//       id: "silicon-builder",
//       title: "Silicon Builder",
//       description: `${user.siliconPoints}/100 Silicon Points earned.`,
//       progress: Math.min(100, Math.round((user.siliconPoints / 100) * 100)),
//       status:
//         user.siliconPoints >= 100
//           ? "unlocked"
//           : user.siliconPoints > 0
//             ? "progress"
//             : "locked",
//       rarity: "legendary",
//       icon: "zap",
//       earnedAt: user.siliconPoints >= 100 ? user.createdAt.toISOString() : null,
//     },
//   ];

//   const profile: EngineeringProfile = {
//     id: user.id,
//     name: user.fullName || user.email.split("@")[0] || "Student",
//     email: user.email,
//     image: user.image || "",
//     omniId: user.omniId || decodedOmniId,

//     college: user.college || "Not shared",
//     university: user.university || "Not shared",
//     course: user.course || "Not shared",
//     branch: user.branch || "Not shared",
//     semester: user.semester || user.year || "Not shared",
//     state: user.state || "Not shared",
//     district: user.district || "Not shared",
//     pincode: user.pincode || "Not shared",

//     tier: getTier(user.siliconPoints ?? 0),
//     siliconPoints: user.siliconPoints ?? 0,
//     nationalRank: getRank(rankUsers, user.id),
//     stateRank: getRank(stateUsers.length ? stateUsers : [user], user.id),
//     collegeRank: getRank(collegeUsers.length ? collegeUsers : [user], user.id),
//     streak: user.streak ?? 0,
//     challengesSolved: completedChallenges,
//     averageAccuracy: user.seasonProgress?.averageAccuracy ?? 0,
//     mockTests: 0,
//     omniScore: user.siliconPoints ?? 0,
//     successRate: user.seasonProgress?.averageAccuracy ?? 0,

//     bio: user.bio || "Not shared",
//     skills: user.skills ?? [],
//     careerInterests: user.careerInterests ?? [],

//     socials: [],
//     completion: [],
//     achievements,
//   };

//   const activities: PublicActivity[] = user.activities.map((activity) => ({
//     id: activity.id,
//     title: activity.title,
//     description: activity.description || "Engineering activity recorded.",
//     type:
//       activity.type === "identity" ||
//       activity.type === "challenge" ||
//       activity.type === "streak" ||
//       activity.type === "points" ||
//       activity.type === "rank" ||
//       activity.type === "achievement"
//         ? activity.type
//         : "identity",
//     createdAt: activity.createdAt.toISOString(),
//   }));

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
//       <div aria-hidden="true" className="pointer-events-none absolute inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.1),transparent_35%)]" />
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
//       </div>

//       <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8">
//         <PublicProfileHero profile={profile} />

//         <PublicProfileStats profile={profile} />

//         <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
//           <PublicProfileSkills skills={profile.skills} />
//           <PublicActivityTimeline activities={activities} />
//         </div>

//         <PublicProfileAchievements achievements={profile.achievements} />
//       </div>
//     </main>
//   );
// }
import { prisma } from "@/lib/prisma";
import { buildProfileAchievements } from "@/lib/profile/achievement-engine";
import { getRankSnapshot } from "@/lib/profile/rank-engine";
import { getTierProgress } from "@/lib/profile/tier-engine";
import type { PublicActivity } from "@/types/activity";
import type { EngineeringProfile } from "@/types/profile";

import ProfileNotFound from "@/components/profile/public/ProfileNotFound";
import PublicActivityTimeline from "@/components/profile/public/PublicActivityTimeline";
import PublicProfileAchievements from "@/components/profile/public/PublicProfileAchievements";
import PublicProfileHero from "@/components/profile/public/PublicProfileHero";
import PublicProfileSkills from "@/components/profile/public/PublicProfileSkills";
import PublicProfileStats from "@/components/profile/public/PublicProfileStats";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
type PageProps = {
  params: Promise<{
    omniId: string;
  }>;
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { omniId } = await params;
  const decodedOmniId = decodeURIComponent(omniId);

  const user = await prisma.user.findUnique({
    where: {
      omniId: decodedOmniId,
    },
    include: {
      seasonProgress: {
        select: {
          weightedRankScore: true,
          averageAccuracy: true,
        },
      },
      dailyAttempts: {
        where: {
          completed: true,
        },
        select: {
          id: true,
          createdAt: true,
          percentage: true,
        },
      },
      activities: {
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
      },
    },
  });

  if (!user) {
    return <ProfileNotFound />;
  }

  const rankUsers = await prisma.user.findMany({
    select: {
      id: true,
      state: true,
      college: true,
      siliconPoints: true,
      seasonProgress: {
        select: {
          weightedRankScore: true,
        },
      },
    },
  });

  const tierProgress = getTierProgress(user.siliconPoints ?? 0);

  const rankSnapshot = getRankSnapshot({
    currentUser: user,
    users: rankUsers,
  });

  const achievements = buildProfileAchievements({
    createdAt: user.createdAt,
    siliconPoints: user.siliconPoints ?? 0,
    streak: user.streak ?? 0,
    skills: user.skills ?? [],
    isOnboarded: user.isOnboarded,
    dailyAttempts: user.dailyAttempts,
  });

  const completedChallenges = user.dailyAttempts.length;

  const profile: EngineeringProfile = {
    id: user.id,
    name: user.fullName || user.email.split("@")[0] || "Student",
    email: user.email,
    image: user.image || "",
    omniId: user.omniId || decodedOmniId,

    college: user.college || "",
    university: user.university || "",
    course: user.course || "",
    branch: user.branch || "",
    semester: user.semester || user.year || "",
    state: user.state || "",
    district: user.district || "",
    pincode: user.pincode || "",

    tier: tierProgress.currentTier,
    siliconPoints: user.siliconPoints ?? 0,
    nationalRank: rankSnapshot.nationalRank,
    stateRank: rankSnapshot.stateRank,
    collegeRank: rankSnapshot.collegeRank,
    streak: user.streak ?? 0,
    challengesSolved: completedChallenges,
    averageAccuracy: user.seasonProgress?.averageAccuracy ?? 0,
    mockTests: 0,
    omniScore: user.siliconPoints ?? 0,
    successRate: user.seasonProgress?.averageAccuracy ?? 0,

    bio: user.bio || "",
    skills: user.skills ?? [],
    careerInterests: user.careerInterests ?? [],

    socials: [],
    completion: [],
    achievements,
  };

const realActivities: PublicActivity[] = user.activities.map((activity) => ({
  id: activity.id,
  title: activity.title,
  description: activity.description || "Engineering activity recorded.",
  type:
    activity.type === "identity" ||
    activity.type === "challenge" ||
    activity.type === "streak" ||
    activity.type === "points" ||
    activity.type === "rank" ||
    activity.type === "achievement"
      ? activity.type
      : "identity",
  createdAt: activity.createdAt.toISOString(),
}));

const virtualActivities: PublicActivity[] = [
  {
    id: "virtual-omni-activated",
    title: "OMNI Identity Activated",
    description: `${profile.omniId} became a verified public engineering identity.`,
    type: "identity",
    createdAt: user.createdAt.toISOString(),
  },
  {
    id: "virtual-tier",
    title: `Reached ${profile.tier} Tier`,
    description: `${profile.name} reached the ${profile.tier} engineering tier.`,
    type: "achievement",
    createdAt: user.createdAt.toISOString(),
  },
  {
    id: "virtual-points",
    title: `Earned ${profile.siliconPoints} Silicon Points`,
    description: "Competition momentum is now visible on the public profile.",
    type: "points",
    createdAt: user.createdAt.toISOString(),
  },
  {
    id: "virtual-challenges",
    title: `Completed ${profile.challengesSolved} Challenges`,
    description: "Daily challenge participation contributes to rankings and growth.",
    type: "challenge",
    createdAt: user.createdAt.toISOString(),
  },
  ...(profile.skills.length > 0
    ? [
        {
          id: "virtual-track",
          title: `Started ${profile.skills[0]} Track`,
          description: "Technical skill identity has been added to the profile.",
          type: "identity" as const,
          createdAt: user.createdAt.toISOString(),
        },
      ]
    : []),
];

const activities = realActivities.length > 0 ? realActivities : virtualActivities;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-20 pt-36 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8">
        <PublicProfileHero profile={profile} />

        <PublicProfileStats profile={profile} />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <PublicProfileSkills
            skills={profile.skills}
            careerInterests={profile.careerInterests}
          />
          <PublicActivityTimeline activities={activities} />
        </div>

        <PublicProfileAchievements achievements={profile.achievements} />
      </div>
    </main>
  );
}
