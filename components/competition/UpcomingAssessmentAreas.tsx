"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Target } from "lucide-react";

import type { AssessmentCategory } from "@/lib/profile/assessment-ledger";

export default function UpcomingAssessmentAreas({
  areas,
}: {
  areas: AssessmentCategory[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-amber-400/20 bg-amber-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-amber-200" />

          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
            Upcoming Assessment Areas
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {areas.map((area, index) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-4"
            >
              <p className="text-sm font-black text-white">{area}</p>

              <ArrowUpRight className="h-4 w-4 text-amber-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
