"use client";

import { motion } from "framer-motion";
import { Activity, Clock } from "lucide-react";
import type { PublicActivity } from "@/types/activity";

export default function PublicActivityTimeline({
  activities,
}: {
  activities: PublicActivity[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-purple-200" />

          <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
            Activity Timeline
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-black text-white">
          Engineering Activity
        </h2>

        <div className="mt-6 space-y-4">
          {activities.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/45">
              No public activity available yet.
            </div>
          ) : (
            activities.map((activity, index) => (
              <motion.article
                key={activity.id}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.05 }}
                className="rounded-[1.75rem] border border-white/10 bg-black/25 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

                  <div>
                    <h3 className="font-black text-white">{activity.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {activity.description}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-xs font-bold text-white/35">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(activity.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
