// import Link from "next/link";
// import {
//   ArrowRight,
//   CalendarDays,
//   CircuitBoard,
//   Sparkles,
//   Trophy,
// } from "lucide-react";

// import { prisma } from "@/lib/prisma";
// import { getChallengeWindowStatus } from "@/lib/challenge-window";
// import StatusBadge from "@/components/ui/StatusBadge";
// import MotionWrapper from "@/components/motion/MotionWrapper";
// import HoverScale from "@/components/motion/HoverScale";
// import GlassCard from "@/components/ui/GlassCard";

// type ChallengeWindowFields = {
//   startTime: Date;
//   endTime: Date;
// };

// export default async function DailyChallengesPage() {
//   const challenges = await prisma.dailyChallenge.findMany({
//     where: {
//       isPublished: true,
//     },

//     orderBy: {
//       dayNumber: "asc",
//     },
//   });

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,rgba(34,211,238,0.03))]"
//       />

//       <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
//         <MotionWrapper>
//           <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 md:rounded-[2.5rem] lg:p-10">
//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
//             />

//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
//             />

//             <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 sm:text-sm">
//                   30 Day Engineering League
//                 </p>

//                 <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
//                   Daily{" "}
//                   <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
//                     Challenges
//                   </span>
//                 </h1>

//                 <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
//                   Complete 5 engineering questions every day, maintain
//                   consistency, compete globally, and climb the leaderboard.
//                 </p>

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
//                     <CircuitBoard className="h-4 w-4" />
//                     Engineering Arena
//                   </span>

//                   <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
//                     <Trophy className="h-4 w-4" />
//                     Rank Progression
//                   </span>
//                 </div>
//               </div>

//               <GlassCard className="p-6">
//                 <div className="flex items-center gap-3">
//                   <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
//                     <Sparkles className="h-6 w-6 text-cyan-300" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
//                       Published Challenges
//                     </p>

//                     <p className="mt-1 text-4xl font-black text-white">
//                       {challenges.length}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-6 h-px bg-linear-to-r from-cyan-400/40 via-white/10 to-transparent" />

//                 <p className="mt-5 text-sm leading-7 text-white/55">
//                   Select a live engineering challenge and continue your Silicon
//                   Skillathon progression.
//                 </p>
//               </GlassCard>
//             </div>
//           </section>
//         </MotionWrapper>

//         {challenges.length === 0 ? (
//           <MotionWrapper>
//             <section className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
//                 <CalendarDays className="h-7 w-7 text-cyan-300" />
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 No challenges published yet
//               </h2>

//               <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/55">
//                 Published daily challenges will appear here when the competition
//                 window opens.
//               </p>
//             </section>
//           </MotionWrapper>
//         ) : (
//           <section
//             aria-label="Published daily challenges"
//             className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
//           >
//             {challenges.map((challenge, index) => {
//               const challengeWindow = challenge as typeof challenge &
//                 ChallengeWindowFields;

//               const status = getChallengeWindowStatus(
//                 challengeWindow.startTime,
//                 challengeWindow.endTime,
//               );

//               return (
//                 <MotionWrapper key={challenge.id} delay={index * 0.04}>
//                   <HoverScale>
//                     <Link
//                       href={`/daily-challenges/${challenge.id}`}
//                       className="group block h-full focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-950"
//                     >
//                       <GlassCard className="relative h-full overflow-hidden p-6 sm:p-7">
//                         <div
//                           aria-hidden="true"
//                           className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20"
//                         />

//                         <div className="relative z-10 flex h-full flex-col">
//                           <div className="mb-5 flex items-start justify-between gap-4">
//                             <div>
//                               <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
//                                 Day {challenge.dayNumber}
//                               </p>

//                               <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
//                                 Challenge #{String(index + 1).padStart(2, "0")}
//                               </p>
//                             </div>

//                             <StatusBadge status={status} />
//                           </div>

//                           <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
//                             {challenge.title}
//                           </h2>

//                           {challenge.description && (
//                             <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/60">
//                               {challenge.description}
//                             </p>
//                           )}

//                           <div className="mt-auto pt-7">
//                             <div className="h-px bg-linear-to-r from-cyan-400/40 via-white/10 to-transparent" />

//                             <div className="mt-5 flex items-center justify-between gap-4">
//                               <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
//                                 Open Challenge
//                               </span>

//                               <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 transition duration-300 group-hover:translate-x-1 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/20">
//                                 <ArrowRight className="h-5 w-5" />
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </GlassCard>
//                     </Link>
//                   </HoverScale>
//                 </MotionWrapper>
//               );
//             })}
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircuitBoard,
  Clock,
  Crosshair,
  Flame,
  Radar,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getChallengeWindowStatus } from "@/lib/challenge-window";
import StatusBadge from "@/components/ui/StatusBadge";
import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

import OfflineState from "@/components/system/OfflineState";

type ChallengeWindowFields = {
  startTime: Date;
  endTime: Date;
};

export default async function DailyChallengesPage() {
  let challenges: any[] = [];

  try {
    challenges = await prisma.dailyChallenge.findMany({
      where: {
        isPublished: true,
      },

      orderBy: {
        dayNumber: "asc",
      },
    });
  } catch (error) {
    console.error(error);

    challenges = [
      {
        id: "fallback-1",
        title: "System Maintenance",
        description: "Challenges temporarily unavailable.",
      },
    ];
  }

  const activeChallenges = challenges.filter((challenge) => {
    const challengeWindow = challenge as typeof challenge &
      ChallengeWindowFields;

    return (
      getChallengeWindowStatus(
        challengeWindow.startTime,
        challengeWindow.endTime,
      ) === "LIVE"
    );
  });

  if (challenges.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <OfflineState />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.2),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.13),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_35%,rgba(34,211,238,0.025))]" />
        <div className="absolute left-10 top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-10 top-56 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <MotionWrapper>
          <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]" />
            <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.36em] text-cyan-300 sm:text-sm">
                  Silicon Skillathon Arena
                </p>

                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  Daily{" "}
                  <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Mission Grid
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/60 sm:text-base md:text-lg md:leading-8">
                  Enter the engineering arena, complete daily technical
                  missions, protect your streak, and climb the competitive
                  leaderboard.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    <CircuitBoard className="h-4 w-4" />
                    Engineering Arena
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
                    <Trophy className="h-4 w-4" />
                    Rank Progression
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                    <Flame className="h-4 w-4" />
                    Streak Protected
                  </span>
                </div>
              </div>

              <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-3 shadow-[0_0_32px_rgba(34,211,238,0.12)]">
                      <Radar className="h-7 w-7 text-cyan-300" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
                        Mission Control
                      </p>

                      <p className="mt-1 text-4xl font-black text-white">
                        {challenges.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/70">
                        Live
                      </p>
                      <p className="mt-2 text-2xl font-black text-emerald-200">
                        {activeChallenges.length}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200/70">
                        Published
                      </p>
                      <p className="mt-2 text-2xl font-black text-purple-200">
                        {challenges.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 h-px bg-linear-to-r from-cyan-400/40 via-white/10 to-transparent" />

                  <p className="mt-5 text-sm leading-7 text-white/55">
                    Pick an active mission card and launch the protected
                    challenge environment.
                  </p>
                </div>
              </GlassCard>
            </div>
          </section>
        </MotionWrapper>

        <MotionWrapper delay={0.08}>
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  Season Timeline
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Daily Challenge Progression
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {challenges.slice(0, 12).map((challenge) => {
                  const challengeWindow = challenge as typeof challenge &
                    ChallengeWindowFields;

                  const status = getChallengeWindowStatus(
                    challengeWindow.startTime,
                    challengeWindow.endTime,
                  );

                  const isLive = status === "LIVE";

                  return (
                    <Link
                      key={challenge.id}
                      href={`/daily-challenges/${challenge.id}`}
                      aria-label={`Open day ${challenge.dayNumber} challenge`}
                      className={
                        isLive
                          ? "flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-400/20 text-xs font-black text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.2)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                          : "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-white/50 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      }
                    >
                      {challenge.dayNumber}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </MotionWrapper>

        {challenges.length === 0 ? (
          <MotionWrapper>
            <section className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <CalendarDays className="h-7 w-7 text-cyan-300" />
              </div>

              <h2 className="text-2xl font-black text-white">
                No missions published yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/55">
                Published daily engineering missions will appear here when the
                competition window opens.
              </p>
            </section>
          </MotionWrapper>
        ) : (
          <section
            aria-label="Published daily challenges"
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {challenges.map((challenge, index) => {
              const challengeWindow = challenge as typeof challenge &
                ChallengeWindowFields;

              const status = getChallengeWindowStatus(
                challengeWindow.startTime,
                challengeWindow.endTime,
              );

              const isLive = status === "LIVE";

              return (
                <MotionWrapper key={challenge.id} delay={index * 0.04}>
                  <HoverScale>
                    <Link
                      href={`/daily-challenges/${challenge.id}`}
                      className="group block h-full focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      <GlassCard className="relative h-full overflow-hidden p-6 sm:p-7">
                        <div
                          aria-hidden="true"
                          className={
                            isLive
                              ? "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl transition duration-500 group-hover:bg-emerald-400/30"
                              : "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20"
                          }
                        />

                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                                Mission Day {challenge.dayNumber}
                              </p>

                              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                                Grid #{String(index + 1).padStart(2, "0")}
                              </p>
                            </div>

                            <StatusBadge status={status} />
                          </div>

                          <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                            {challenge.title}
                          </h2>

                          {challenge.description && (
                            <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/60">
                              {challenge.description}
                            </p>
                          )}

                          <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                              <div className="flex items-center gap-2 text-white/45">
                                <Clock className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                                  Window
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-bold text-white/70">
                                Status Locked
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                              <div className="flex items-center gap-2 text-white/45">
                                <Crosshair className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                                  Mode
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-bold text-white/70">
                                Protected
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto pt-7">
                            <div className="h-px bg-linear-to-r from-cyan-400/40 via-white/10 to-transparent" />

                            <div className="mt-5 flex items-center justify-between gap-4">
                              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                                <Zap className="h-4 w-4 text-cyan-300" />
                                Launch Mission
                              </span>

                              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 transition duration-300 group-hover:translate-x-1 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/20">
                                <ArrowRight className="h-5 w-5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </HoverScale>
                </MotionWrapper>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
