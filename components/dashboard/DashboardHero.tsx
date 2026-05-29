type DashboardHeroProps = {
  userName: string;
  siliconPoints: number;
  streak: number;
  rank: number;
  engineeringTier?: string;
  engineeringLevel?: string;
};

export default function DashboardHero({
  userName,
  siliconPoints,
  streak,
  rank,
  engineeringTier,
  engineeringLevel,
}: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/3 p-10">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
              Engineering Dashboard
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Welcome Back,
              <span className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                {userName}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Continue your engineering journey, participate in competitions,
              solve challenges and improve your national ranking.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {engineeringTier && (
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    {engineeringTier}
                  </span>
                </div>
              )}
              {engineeringLevel && (
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                    {engineeringLevel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid gap-5 sm:grid-cols-3">
            <StatCard title="Silicon Points" value={siliconPoints} />
            <StatCard
              title="Current Streak"
              value={streak}
              subtitle="Protected Engineering Streak"
            />
            <StatCard title="National Rank" value={`#${rank}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-white/50">
        {title}
      </p>

      <h2 className="mt-4 text-4xl font-bold text-cyan-400">{value}</h2>

      {subtitle && (
        <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/40">
          {subtitle}
        </p>
      )}
    </div>
  );
}
