import AnimatedSection from "@/components/motion/AnimatedSection";
import GlassCard from "@/components/motion/GlassCard";
import MotionWrapper from "@/components/motion/MotionWrapper";

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
    <AnimatedSection className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%)]" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <MotionWrapper className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-cyan-400 md:text-sm">
              Engineering Dashboard
            </p>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Welcome Back,
              <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                {userName}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              Continue your engineering journey, participate in competitions,
              solve challenges and improve your national ranking.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {engineeringTier && (
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2 shadow-[0_0_30px_rgba(168,85,247,0.12)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    {engineeringTier}
                  </span>
                </div>
              )}

              {engineeringLevel && (
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                    {engineeringLevel}
                  </span>
                </div>
              )}
            </div>
          </MotionWrapper>

          <div className="grid gap-5 sm:grid-cols-3 lg:min-w-[520px]">
            <StatCard
              title="Silicon Points"
              value={siliconPoints}
              delay={0.08}
            />
            <StatCard
              title="Current Streak"
              value={streak}
              subtitle="Protected Engineering Streak"
              delay={0.16}
            />
            <StatCard title="National Rank" value={`#${rank}`} delay={0.24} />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  delay,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  delay: number;
}) {
  return (
    <MotionWrapper delay={delay}>
      <GlassCard className="h-full p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          {title}
        </p>

        <h2 className="mt-4 text-4xl font-black text-cyan-400">{value}</h2>

        {subtitle && (
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/40">
            {subtitle}
          </p>
        )}
      </GlassCard>
    </MotionWrapper>
  );
}
