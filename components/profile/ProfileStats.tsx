"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

import type { ProfileMetric } from "@/types/profile";

export default function ProfileStats({
  metrics,
}: {
  metrics: ProfileMetric[];
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.article
          key={metric.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.42, delay: index * 0.04 }}
          className="group relative min-h-36 overflow-visible rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.045]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
              {metric.label}
            </p>

            {metric.tooltip && (
              <div className="group/info relative">
                <Info className="h-4 w-4 text-cyan-200" />

                <div className="pointer-events-none absolute right-0 top-7 z-50 w-72 rounded-2xl border border-cyan-300/25 bg-slate-950/95 p-4 opacity-0 shadow-[0_24px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition group-hover/info:opacity-100">
                  <p className="text-sm font-black text-white">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-white/65">
                    {metric.tooltip}
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 truncate text-4xl font-black text-white">
            {metric.value}
          </p>

          {metric.helper && (
            <p className="mt-3 text-sm font-semibold text-white/48">
              {metric.helper}
            </p>
          )}
        </motion.article>
      ))}
    </section>
  );
}
