"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardCheck,
  Layers3,
  Zap,
} from "lucide-react";

import type { VerificationSummaryData } from "@/lib/competition/verification-engine";

export default function VerificationSummary({
  summary,
}: {
  summary: VerificationSummaryData;
}) {
  const cards = [
    {
      label: "Verified Assessments",
      value: summary.verifiedAssessments,
      icon: ClipboardCheck,
      tone: "text-cyan-200",
    },
    {
      label: "Verified Stages",
      value: summary.verifiedStages,
      icon: Layers3,
      tone: "text-purple-200",
    },
    {
      label: "Verified Points",
      value: summary.verifiedPoints,
      icon: Zap,
      tone: "text-amber-200",
    },
    {
      label: "Pending Reviews",
      value: summary.pendingReviews,
      icon: BadgeCheck,
      tone: "text-emerald-200",
    },
    {
      label: "Rejected Reviews",
      value: summary.rejectedReviews,
      icon: AlertTriangle,
      tone: "text-rose-200",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.15),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.14),transparent_34%)]" />

      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
          Verification Summary
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.012 }}
                className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                <Icon className={`h-5 w-5 ${card.tone}`} />

                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {card.label}
                </p>

                <p className="mt-3 text-3xl font-black text-white">
                  {card.value}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
