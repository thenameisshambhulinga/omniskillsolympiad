export default function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[120px] h-[380px] w-[380px] rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[360px] w-[360px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.15),transparent_35%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-purple-500/20 bg-white/5 px-6 py-3 backdrop-blur-xl">
          <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

          <p className="text-sm uppercase tracking-[0.35em] text-purple-200">
            WorldSkills 2026 • Electronics Ecosystem
          </p>
        </div>

        <h1 className="max-w-6xl text-5xl font-bold leading-[0.92] tracking-[-0.06em] md:text-7xl lg:text-[96px]">
          Building India’s
          <span className="block text-white/95">Future Electronics</span>
          <span className="mt-2 block bg-gradient-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent">
            Engineering Talent
          </span>
        </h1>

        <p className="mt-10 max-w-4xl text-lg leading-[2] text-white/85 md:text-xl">
          A next-generation industry-oriented electronics engineering
          acceleration ecosystem focused on Embedded Systems, ARM Programming,
          PCB Design, Hardware Debugging, Semiconductor Skills and
          competition-driven learning pathways.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {[
            "Embedded Systems",
            "ARM Programming",
            "PCB Design",
            "Semiconductor Skills",
            "WorldSkills 2026",
            "Silicon Points",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 backdrop-blur-xl transition duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 sm:flex-row">
          <button className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-5 text-lg font-semibold transition duration-300 hover:scale-[1.03]">
            Register Now
          </button>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold backdrop-blur-xl transition duration-300 hover:bg-white/10">
            Explore Skill Tracks
          </button>
        </div>
      </div>
    </section>
  );
}
