type Props = {
  name: string;
  email: string;
  siliconPoints: number;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
};

export default function ProfileHero({
  name,
  email,
  siliconPoints,
  streak,
  level,
  xp,
  nextLevelXp,
}: Props) {
  const progress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-10">
      {/* GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* AVATAR */}
          <div className="flex h-32 w-32 items-center justify-center rounded-[32px] bg-gradient-to-br from-cyan-400 to-purple-500 text-5xl font-black text-black shadow-2xl shadow-cyan-500/30">
            {name.charAt(0)}
          </div>

          {/* INFO */}
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">
              Engineering Profile
            </p>

            <h1 className="text-5xl font-black">{name}</h1>

            <p className="mt-4 text-lg text-white/60">{email}</p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Badge label={`Level ${level}`} />

              <Badge label={`${siliconPoints} Silicon Points`} />

              <Badge label={`${streak} Day Streak`} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm uppercase tracking-[0.2em] text-white/50">
              Engineering XP
            </span>

            <span className="font-semibold text-cyan-400">
              {xp} / {nextLevelXp}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="h-5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-4 text-sm text-white/50">
            Complete challenges and competitions to level up your engineering
            profile.
          </p>
        </div>
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur-xl">
      {label}
    </div>
  );
}
