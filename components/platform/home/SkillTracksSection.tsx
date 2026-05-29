const tracks = [
  {
    title: "Embedded Systems",
    subtitle: "Firmware + Hardware",
    description:
      "Master STM32, RTOS, communication protocols and real-world embedded workflows.",
    gradient: "from-cyan-500/20 to-blue-500/10",
  },

  {
    title: "PCB Design",
    subtitle: "Circuit Engineering",
    description:
      "Learn schematic design, multilayer PCB workflows and hardware manufacturing.",
    gradient: "from-purple-500/20 to-pink-500/10",
  },

  {
    title: "ARM Programming",
    subtitle: "Low-Level Development",
    description:
      "Develop optimized embedded applications using ARM Cortex architectures.",
    gradient: "from-emerald-500/20 to-cyan-500/10",
  },

  {
    title: "Hardware Debugging",
    subtitle: "Diagnostics + Testing",
    description:
      "Industry-grade debugging using oscilloscopes, analyzers and diagnostics.",
    gradient: "from-orange-500/20 to-yellow-500/10",
  },
];

export default function SkillTracksSection() {
  return (
    <section className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-20 text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-cyan-400">
            Skill Tracks
          </p>

          <h2 className="mx-auto max-w-5xl text-5xl font-bold leading-tight md:text-6xl">
            Industry Focused
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Engineering Domains
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/60">
            Explore specialized engineering pathways designed to simulate
            real-world semiconductor and electronics industry environments.
          </p>
        </div>

        {/* TRACK GRID */}
        <div className="grid gap-8 lg:grid-cols-2">
          {tracks.map((track) => (
            <div
              key={track.title}
              className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-10 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
            >
              {/* BACKGROUND */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-0 transition duration-500 group-hover:opacity-100`}
              />

              {/* GRID LIGHT */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

              {/* CONTENT */}
              <div className="relative z-10">
                <div className="mb-10 flex items-center justify-between">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm uppercase tracking-[0.2em] text-cyan-300">
                    {track.subtitle}
                  </div>

                  <div className="text-5xl opacity-40 transition duration-500 group-hover:scale-110 group-hover:opacity-100">
                    ⚡
                  </div>
                </div>

                <h3 className="text-4xl font-bold">{track.title}</h3>

                <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                  {track.description}
                </p>

                {/* BUTTON */}
                <button className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-400 hover:text-black">
                  Explore Track
                </button>
              </div>

              {/* GLOW */}
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
