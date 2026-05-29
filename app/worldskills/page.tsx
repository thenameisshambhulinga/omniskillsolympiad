export default function WorldSkillsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[120px] h-[380px] w-[380px] rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[360px] w-[360px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.15),transparent_35%)]" />
      </div>

      {/* HERO */}

      <section className="relative z-10 px-6 py-28 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/20 bg-white/5 px-6 py-3 backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-purple-400" />

            <p className="text-sm uppercase tracking-[0.35em] text-purple-200">
              Future Engineering Ecosystem
            </p>
          </div>

          <h1 className="mt-10 max-w-6xl text-5xl font-bold leading-[0.92] tracking-[-0.06em] md:text-7xl lg:text-[92px]">
            Building India’s
            <span className="block text-white/90">WorldSkills &</span>
            <span className="mt-2 block bg-gradient-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent">
              Semiconductor Talent Pipeline
            </span>
          </h1>

          <p className="mt-10 max-w-4xl text-lg leading-[2] text-white/85 md:text-xl">
            Silicon Skillathon is designed as a long-term electronics
            engineering acceleration ecosystem focused on identifying
            high-potential students and preparing them through finishing school
            programs, technical mentorship, practical competitions and
            industry-aligned training pathways.
          </p>

          {/* CHIPS */}

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="tech-chip">WorldSkills Preparation</div>

            <div className="tech-chip">Finishing School</div>

            <div className="tech-chip">Embedded Systems</div>

            <div className="tech-chip">Industry Mentorship</div>

            <div className="tech-chip">Semiconductor Skills</div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
              Student Transformation Journey
            </p>

            <h2 className="text-4xl font-bold leading-[1] md:text-6xl">
              From Student
              <span className="block text-cyan-400">
                To Industry-Ready Engineer
              </span>
            </h2>
          </div>

          {/* FLOW */}

          <div className="mt-24 grid gap-8 md:grid-cols-5">
            <div className="glass-card rounded-[32px] p-8 text-center">
              <h3 className="text-3xl font-bold text-purple-400">01</h3>

              <p className="mt-6 text-lg text-white/80">
                Participate in Skillathon
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 text-center">
              <h3 className="text-3xl font-bold text-cyan-400">02</h3>

              <p className="mt-6 text-lg text-white/80">
                Build Technical Consistency
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 text-center">
              <h3 className="text-3xl font-bold text-purple-400">03</h3>

              <p className="mt-6 text-lg text-white/80">
                Enter Finishing School
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 text-center">
              <h3 className="text-3xl font-bold text-cyan-400">04</h3>

              <p className="mt-6 text-lg text-white/80">
                Industry & Mentorship Exposure
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 text-center">
              <h3 className="text-3xl font-bold text-purple-400">05</h3>

              <p className="mt-6 text-lg text-white/80">
                WorldSkills Preparation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINISHING SCHOOL */}

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
              Finishing School Ecosystem
            </p>

            <h2 className="text-4xl font-bold leading-[1] md:text-6xl">
              Advanced Practical
              <span className="block text-purple-400">
                Engineering Acceleration
              </span>
            </h2>

            <p className="mt-10 text-lg leading-[2] text-white/85">
              Selected students enter structured finishing school pathways
              focused on embedded systems, ARM programming, PCB implementation,
              debugging, troubleshooting and practical electronics engineering
              aligned with industry expectations.
            </p>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            <div className="glass-card rounded-[32px] p-8">
              <h3 className="text-2xl font-semibold">
                Embedded Systems Training
              </h3>

              <p className="mt-4 text-white/75">
                ARM, STM32 and firmware implementation workflows.
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8">
              <h3 className="text-2xl font-semibold">
                Hardware Troubleshooting
              </h3>

              <p className="mt-4 text-white/75">
                Practical debugging methodologies and diagnosis systems.
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8">
              <h3 className="text-2xl font-semibold">
                Industry-Oriented Exposure
              </h3>

              <p className="mt-4 text-white/75">
                Product-level engineering exposure and mentorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY VISITS */}

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl md:p-16">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              {/* LEFT */}

              <div>
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
                  Industry Exposure
                </p>

                <h2 className="text-4xl font-bold leading-[1] md:text-6xl">
                  Top Silicon Point
                  <span className="block text-cyan-400">
                    Earners Unlock Opportunities
                  </span>
                </h2>
              </div>

              {/* RIGHT */}

              <div>
                <p className="text-lg leading-[2] text-white/85">
                  High-performing students receive opportunities for industrial
                  visits, technical networking, ecosystem mentorship and
                  advanced exposure to real-world engineering environments and
                  semiconductor ecosystems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="relative z-10 border-t border-white/10 px-6 py-28 md:px-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-5xl font-bold leading-[1] md:text-7xl">
            Your Engineering Journey
            <span className="mt-2 block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h2>

          <p className="mx-auto mt-10 max-w-3xl text-lg leading-[2] text-white/85">
            Join Silicon Skillathon and become part of a next-generation
            technical ecosystem focused on practical engineering, competitions,
            mentorship, innovation and WorldSkills preparation.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <button className="purple-glow rounded-2xl bg-purple-600 px-10 py-5 text-lg font-semibold transition duration-300 hover:scale-[1.03] hover:bg-purple-500">
              Register Now
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/10">
              Explore Competition
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
