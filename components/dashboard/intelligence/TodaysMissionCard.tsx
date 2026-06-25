"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

type TodaysMissionCardProps = {
  hasCompletedDailyChallenge?: boolean;
  streak?: number;
  accuracy?: number;
};

export default function TodaysMissionCard({
  hasCompletedDailyChallenge = false,
  streak = 0,
  accuracy = 0,
}: TodaysMissionCardProps) {
  const tasks = [
    { label: "Complete Daily Challenge", done: hasCompletedDailyChallenge },
    { label: "Maintain Streak", done: streak > 0 },
    { label: "Improve Accuracy > 80%", done: accuracy >= 80 },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-cyan-400/20 bg-slate-950/80 p-5 shadow-[0_18px_50px_rgba(8,15,35,0.35)] backdrop-blur-xl"
    >
      <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
        Today’s Mission
      </p>
      <h3 className="mt-2 text-xl font-black text-white">Growth Focus</h3>
      <ul className="mt-4 space-y-3 text-sm text-white/80">
        {tasks.map((task) => (
          <li
            key={task.label}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-3"
          >
            {task.done ? (
              <Check className="h-4 w-4 text-cyan-200" />
            ) : (
              <Circle className="h-4 w-4 text-white/40" />
            )}
            <span>{task.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-2xl border border-purple-400/20 bg-purple-400/8 p-3 text-xs uppercase tracking-[0.18em] text-purple-100">
        Rewards: +15 Silicon Points
      </div>
    </motion.aside>
  );
}
