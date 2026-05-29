// import { prisma } from "@/lib/prisma";

// export default async function LeaderboardPage() {
//   const users = await prisma.user.findMany({
//     orderBy: {
//       siliconPoints: "desc",
//     },

//     take: 50,

//     select: {
//       id: true,
//       fullName: true,
//       siliconPoints: true,
//       streak: true,
//     },
//   });

//   return (
//     <main className="min-h-screen bg-black px-6 py-16 text-white">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-12">
//           <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
//             Global Rankings
//           </p>

//           <h1 className="mt-4 text-6xl font-bold">Engineering Leaderboard</h1>
//         </div>

//         <div className="space-y-4">
//           {users.map((user, index) => (
//             <div
//               key={user.id}
//               className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6"
//             >
//               <div className="flex items-center gap-5">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/20 text-xl font-bold">
//                   #{index + 1}
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-semibold">{user.fullName}</h2>

//                   <p className="mt-1 text-white/60">{user.streak} day streak</p>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <p className="text-3xl font-bold text-cyan-400">
//                   {user.siliconPoints}
//                 </p>

//                 <p className="text-sm text-white/60">Omni Score</p>
//
//                 <p className="mt-2 text-xs text-white/50">State Rank: -- · College Rank: --</p>
//
//                 <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/5 px-3 py-1 text-xs text-purple-300">
//                   Level {Math.min(5, Math.max(1, Math.floor((user.siliconPoints || 0) / 300)))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }
