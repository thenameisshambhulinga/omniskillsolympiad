"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Target, TrendingUp, Wrench } from "lucide-react";

export type OmniMentorFeedbackData = {
  remarks: string;
  strengthAreas: string[];
  improvementAreas: string[];
  recommendedNextFocus: string;
};

export default function OmniMentorFeedbackCard({
  feedback,
}: {
  feedback: OmniMentorFeedbackData;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[3rem] border border-purple-400/20 bg-purple-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-5 w-5 text-purple-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
            Mentor Feedback
          </p>
        </div>

        <p className="mt-6 rounded-[2rem] border border-white/10 bg-black/25 p-5 text-sm font-semibold leading-7 text-white/68">
          {feedback.remarks}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <FeedbackColumn
            icon={<TrendingUp className="h-4 w-4 text-emerald-200" />}
            title="Strength Areas"
            items={feedback.strengthAreas}
          />

          <FeedbackColumn
            icon={<Wrench className="h-4 w-4 text-amber-200" />}
            title="Improvement Areas"
            items={feedback.improvementAreas}
          />

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
            <Target className="h-4 w-4 text-cyan-200" />

            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Recommended Next Focus
            </p>

            <p className="mt-3 text-lg font-black leading-7 text-white">
              {feedback.recommendedNextFocus}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FeedbackColumn({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
      {icon}

      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {title}
      </p>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <p
            key={item}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/62"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
