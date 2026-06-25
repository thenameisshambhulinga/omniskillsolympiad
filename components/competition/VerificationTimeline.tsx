"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck, ClipboardCheck, Gavel, Trophy } from "lucide-react";

import type { VerificationTimelineItem } from "@/lib/competition/verification-engine";

function getIcon(id: string) {
  if (id.includes("assessment")) return ClipboardCheck;
  if (id.includes("mentor")) return BadgeCheck;
  if (id.includes("judge")) return Gavel;
  if (id.includes("points")) return Award;
  return Trophy;
}

export default function VerificationTimeline({
  timeline,
}: {
  timeline: VerificationTimelineItem[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Verification Timeline
        </p>

        <div className="mt-7 space-y-5">
          {timeline.map((item, index) => {
            const Icon = getIcon(item.id);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.04 }}
                className="relative rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                {index < timeline.length - 1 && (
                  <div className="absolute left-8 top-[4.6rem] h-7 w-px bg-white/15" />
                )}

                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10">
                    <Icon className="h-5 w-5 text-emerald-200" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
                      {item.description}
                    </p>

                    <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-white/35">
                      {item.status} • {item.date}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
