"use client";

import HoverScale from "@/components/motion/HoverScale";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  points: number;
  createdAt: Date;
}

export default function ActivityTimeline({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <MotionWrapper>
      <section
        aria-labelledby="activity-timeline-title"
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-6 md:rounded-[2.5rem] md:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_38%,rgba(34,211,238,0.04))]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
        />

        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300 sm:text-sm">
                Engineering Activity
              </p>

              <h2
                id="activity-timeline-title"
                className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl"
              >
                Recent Timeline
              </h2>
            </div>

            <div className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Live Progress Feed
            </div>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 p-8 text-center">
                <div>
                  <div
                    aria-hidden="true"
                    className="mx-auto mb-5 h-14 w-14 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_32px_rgba(34,211,238,0.12)]"
                  />

                  <h3 className="text-lg font-bold text-white">
                    No engineering activity yet
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-white/50">
                    Complete challenges and platform activities to start
                    building your engineering timeline.
                  </p>
                </div>
              </div>
            ) : (
              activities.map((activity, index) => (
                <HoverScale key={activity.id}>
                  <article className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 p-5 transition duration-300 hover:border-cyan-400/25 hover:bg-cyan-500/[0.04] sm:p-6">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/0 blur-3xl transition duration-500 group-hover:bg-cyan-400/12"
                    />

                    <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4 sm:gap-5">
                        <div className="flex flex-col items-center">
                          <div
                            aria-hidden="true"
                            className="mt-2 h-3 w-3 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.9)]"
                          />

                          <div
                            aria-hidden="true"
                            className="mt-3 h-full min-h-10 w-px bg-linear-to-b from-cyan-400/40 to-transparent"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                              {activity.type}
                            </p>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                              #{String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <h3 className="mt-3 text-base font-bold text-white sm:text-lg">
                            {activity.title}
                          </h3>

                          {activity.description && (
                            <p className="mt-2 text-sm leading-7 text-white/60">
                              {activity.description}
                            </p>
                          )}

                          <time className="mt-4 block text-xs uppercase tracking-[0.22em] text-white/30">
                            {new Date(activity.createdAt).toLocaleString()}
                          </time>
                        </div>
                      </div>

                      {activity.points > 0 && (
                        <div className="w-fit shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                          +{activity.points} XP
                        </div>
                      )}
                    </div>
                  </article>
                </HoverScale>
              ))
            )}
          </div>
        </div>
      </section>
    </MotionWrapper>
  );
}
