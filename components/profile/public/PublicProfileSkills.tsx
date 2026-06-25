// "use client";

// import { motion } from "framer-motion";
// import { Cpu } from "lucide-react";

// export default function PublicProfileSkills({ skills }: { skills: string[] }) {
//   return (
//     <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
//       <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />

//       <div className="relative z-10">
//         <div className="flex items-center gap-3">
//           <Cpu className="h-5 w-5 text-cyan-200" />
//           <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
//             Technical Skills
//           </p>
//         </div>

//         <h2 className="mt-3 text-3xl font-black text-white">Skill Stack</h2>

//         <div className="mt-6 flex flex-wrap gap-3">
//           {skills.length > 0 ? (
//             skills.map((skill, index) => (
//               <motion.span
//                 key={skill}
//                 initial={{ opacity: 0, scale: 0.88 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.28, delay: index * 0.03 }}
//                 className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100"
//               >
//                 {skill}
//               </motion.span>
//             ))
//           ) : (
//             <p className="text-sm text-white/45">Skills not updated yet.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";

export default function PublicProfileSkills({
  skills,
  careerInterests = [],
}: {
  skills: string[];
  careerInterests?: string[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-cyan-200" />
          <p className="section-label">Technical Skills</p>
        </div>

        <h2 className="mt-3 text-3xl font-black text-white">Skill Stack</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: index * 0.03 }}
                whileHover={{ y: -2, scale: 1.04 }}
                className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100"
              >
                {skill}
              </motion.span>
            ))
          ) : (
            <p className="text-sm text-white/45">No skills shared.</p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-purple-200" />
          <p className="section-label text-purple-300">Career Interests</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {careerInterests.length > 0 ? (
            careerInterests.map((interest, index) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: index * 0.03 }}
                whileHover={{ y: -2, scale: 1.04 }}
                className="rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-100"
              >
                {interest}
              </motion.span>
            ))
          ) : (
            <p className="text-sm text-white/45">No career interests shared.</p>
          )}
        </div>
      </div>
    </section>
  );
}
