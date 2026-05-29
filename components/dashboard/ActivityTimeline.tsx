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
    <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            Engineering Activity
          </p>

          <h2 className="mt-3 text-4xl font-black">Recent Timeline</h2>
        </div>
      </div>

      <div className="space-y-5">
        {activities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-white/40">
            No engineering activity yet.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="group flex items-start justify-between rounded-3xl border border-white/5 bg-black/30 p-6 transition duration-300 hover:border-cyan-400/20 hover:bg-cyan-500/[0.03]"
            >
              <div className="flex gap-5">
                <div className="mt-1 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {activity.title}
                  </h3>

                  {activity.description && (
                    <p className="mt-2 text-sm leading-7 text-white/60">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/30">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {activity.points > 0 && (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300">
                  +{activity.points} XP
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
