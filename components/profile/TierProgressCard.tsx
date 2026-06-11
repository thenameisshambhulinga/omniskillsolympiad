// "use client";

// import { motion } from "framer-motion";
// import { ChevronRight, Sparkles } from "lucide-react";

// import { getTierProgress } from "@/lib/tier-engine";

// const accentClasses: Record<string, string> = {
//   cyan: "from-cyan-300 via-blue-400 to-purple-400",
//   blue: "from-blue-300 via-cyan-400 to-purple-400",
//   purple: "from-purple-300 via-fuchsia-400 to-cyan-400",
//   emerald: "from-emerald-300 via-cyan-400 to-blue-400",
//   amber: "from-amber-300 via-orange-400 to-cyan-400",
//   rose: "from-rose-300 via-purple-400 to-cyan-400",
//   fuchsia: "from-fuchsia-300 via-purple-400 to-cyan-400",
//   violet: "from-violet-300 via-purple-400 to-cyan-400",
// };

// export default function TierProgressCard({ points }: { points: number }) {
//   const progress = getTierProgress(points);
//   const gradient =
//     accentClasses[progress.currentTier.accent] ?? accentClasses.cyan;

//   return (
//     <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.13),transparent_34%)]"
//       />

//       <div className="relative z-10">
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
//               Tier Progression
//             </p>

//             <h2 className="mt-3 text-3xl font-black text-white">
//               {progress.currentTier.name}
//             </h2>

//             <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
//               {progress.currentTier.description}
//             </p>
//           </div>

//           <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_38px_rgba(34,211,238,0.14)]">
//             <Sparkles className="h-6 w-6 text-cyan-200" />
//           </div>
//         </div>

//         <div className="mt-7 rounded-[2rem] border border-white/10 bg-black/25 p-5">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm font-bold text-white">
//                 {progress.points} Silicon Points
//               </p>

//               <p className="mt-1 text-xs text-white/45">
//                 {progress.nextTier
//                   ? `${progress.pointsRequiredForNextTier} points to ${progress.nextTier.name}`
//                   : "Maximum tier achieved"}
//               </p>
//             </div>

//             {progress.nextTier && (
//               <div className="flex items-center gap-2 text-sm font-black text-cyan-200">
//                 {progress.currentTier.name}
//                 <ChevronRight className="h-4 w-4" />
//                 {progress.nextTier.name}
//               </div>
//             )}
//           </div>

//           <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
//             <motion.div
//               initial={{ width: 0 }}
//               whileInView={{ width: `${progress.progressPercent}%` }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//               className={`h-full rounded-full bg-linear-to-r ${gradient} shadow-[0_0_28px_rgba(34,211,238,0.28)]`}
//             />
//           </div>

//           <p className="mt-3 text-right text-xs font-black uppercase tracking-[0.18em] text-white/40">
//             {progress.progressPercent}% Complete
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import type { TierProgress } from "@/lib/profile/tier-engine";

export default function TierProgressCard({
  tier,
}: {
  tier: TierProgress;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Medal className="h-5 w-5 text-cyan-200" />
          <p className="section-label">Tier Progression</p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-black text-white">{tier.currentTier}</p>
            <p className="mt-2 text-sm text-white/50">
              {tier.nextTier
                ? `${tier.pointsToNextTier} points to ${tier.nextTier}`
                : "Maximum tier achieved"}
            </p>
          </div>

          <p className="text-4xl font-black text-cyan-200">
            {tier.progressPercent}%
          </p>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${tier.progressPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400"
          />
        </div>
      </div>
    </section>
  );
}