export default function AboutSection() {
  return (
    <section className="relative z-10 border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        {/* TOP */}
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-cyan-400">
              About The Ecosystem
            </p>

            <h2 className="max-w-2xl text-5xl font-bold leading-tight md:text-6xl">
              Bridging Engineering
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Education & Industry
              </span>
            </h2>
          </div>

          {/* RIGHT */}
          <div>
            <p className="text-lg leading-[2] text-white/70">
              Silicon Skillathon is a next-generation electronics engineering
              acceleration ecosystem focused on embedded systems, PCB design,
              ARM programming, hardware debugging, semiconductor workflows and
              competition-driven practical learning.
            </p>

            <p className="mt-6 text-lg leading-[2] text-white/60">
              Students participate in technical challenges, live leaderboards,
              daily quizzes, mock tests and WorldSkills-oriented engineering
              experiences that simulate real industry exposure.
            </p>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Embedded Systems",
              desc: "Practical firmware development, STM32 workflows and hardware interfacing.",
            },
            {
              title: "PCB Design",
              desc: "Industry-oriented PCB handling, circuit design and assembly exposure.",
            },
            {
              title: "WorldSkills",
              desc: "Competition ecosystem aligned with technical excellence pathways.",
            },
            {
              title: "Silicon Points",
              desc: "Gamified ecosystem rewarding consistency and technical performance.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.05]"
            >
              {/* GLOW */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-500/20" />

              {/* ICON */}
              <div className="relative z-10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl backdrop-blur-xl">
                ⚡
              </div>

              {/* TITLE */}
              <h3 className="relative z-10 text-2xl font-semibold">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="relative z-10 mt-5 leading-8 text-white/60">
                {item.desc}
              </p>

              {/* HOVER LINE */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* BOTTOM STRIP */}
        <div className="mt-24 rounded-[36px] border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-10 backdrop-blur-2xl">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-5xl font-bold text-cyan-400">100+</h3>

              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-white/50">
                Technical Challenges
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-purple-400">30+</h3>

              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-white/50">
                Mock Test Series
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-cyan-400">WorldSkills</h3>

              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-white/50">
                Competition Pipeline
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
