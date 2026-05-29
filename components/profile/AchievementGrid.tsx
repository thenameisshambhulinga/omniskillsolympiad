const achievements = [
  {
    title: "Challenge Warrior",
    description: "Completed 10 daily challenges",
  },

  {
    title: "Firmware Explorer",
    description: "Participated in embedded systems track",
  },

  {
    title: "PCB Architect",
    description: "Completed PCB design assessments",
  },

  {
    title: "Consistency Master",
    description: "Maintained 7 day streak",
  },
];

export default function AchievementGrid() {
  return (
    <section className="grid gap-8 lg:grid-cols-2">
      {achievements.map((achievement) => (
        <div
          key={achievement.title}
          className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
        >
          {/* GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 transition duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 text-3xl">
              🏆
            </div>

            <h2 className="text-3xl font-bold">{achievement.title}</h2>

            <p className="mt-4 text-lg leading-8 text-white/60">
              {achievement.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
