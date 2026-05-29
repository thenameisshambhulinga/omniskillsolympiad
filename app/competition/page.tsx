export default function CompetitionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* BACKGROUND EFFECTS */}

      <div className="absolute left-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-purple-700/20 blur-3xl" />

      <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl" />





      {/* HERO */}

      <section className="relative z-10 px-6 py-28 md:px-16">

        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
            Competition Architecture
          </p>

          <h1 className="max-w-6xl text-5xl font-bold leading-tight md:text-7xl">
            Silicon Skillathon
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Multi-Stage Technical Competition
            </span>
          </h1>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-gray-300">
            A national-level industry-oriented electronics engineering
            competition ecosystem designed to evaluate practical
            knowledge, embedded systems capability, troubleshooting
            skills and technical problem-solving ability.
          </p>

        </div>

      </section>







      {/* STAGES */}

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
              Competition Structure
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Multi-Stage
              <span className="block text-cyan-400">
                Evaluation Ecosystem
              </span>
            </h2>

          </div>





          {/* STAGE GRID */}

          <div className="mt-20 space-y-8">

            {/* STAGE 1 */}

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-3xl">

                  <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
                    Stage 01
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    Electronics Fundamentals Screening
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Online electronics quiz and MCQ-based evaluation
                    focused on circuit theory, analog electronics,
                    digital systems and troubleshooting concepts.
                  </p>

                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 px-8 py-6">

                  <p className="text-sm uppercase tracking-widest text-purple-300">
                    Duration
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">
                    30 Mins
                  </h4>

                </div>

              </div>

            </div>





            {/* STAGE 2 */}

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-3xl">

                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                    Stage 02
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    Funnathon & Technical Demonstration
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Practical electronics demonstrations, technical
                    engagement activities and guided engineering
                    implementation sessions.
                  </p>

                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-8 py-6">

                  <p className="text-sm uppercase tracking-widest text-cyan-300">
                    Duration
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">
                    45–60 Mins
                  </h4>

                </div>

              </div>

            </div>





            {/* STAGE 3 */}

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-3xl">

                  <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
                    Stage 03
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    Skillathon Practical Competition
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Hands-on embedded systems, debugging,
                    troubleshooting, PCB implementation and
                    electronics practical evaluation.
                  </p>

                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 px-8 py-6">

                  <p className="text-sm uppercase tracking-widest text-purple-300">
                    Duration
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">
                    3–5 Hours
                  </h4>

                </div>

              </div>

            </div>





            {/* FINAL STAGE */}

            <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-10 backdrop-blur-md">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-3xl">

                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                    Final Stage
                  </p>

                  <h3 className="mt-4 text-3xl font-bold">
                    WorldSkills Talent Selection
                  </h3>

                  <p className="mt-6 leading-8 text-gray-300">
                    Selection of high-potential students for advanced
                    mentorship, finishing school programs and
                    WorldSkills-oriented preparation pathways.
                  </p>

                </div>

                <div className="rounded-2xl border border-cyan-400/30 bg-black/20 px-8 py-6">

                  <p className="text-sm uppercase tracking-widest text-cyan-300">
                    Outcome
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">
                    Selection
                  </h4>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>







      {/* SKILLS ASSESSED */}

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
              Technical Skills
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Engineering Competencies
              <span className="block text-purple-400">
                Evaluated During Competition
              </span>
            </h2>

          </div>





          {/* SKILLS GRID */}

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Embedded C Programming
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              ARM & STM32 Programming
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              PCB Assembly
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Soldering & De-soldering
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Hardware Troubleshooting
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Sensor Interfacing
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Oscilloscope Usage
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Circuit Analysis
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Fault Diagnosis
            </div>

          </div>

        </div>

      </section>







      {/* EVALUATION SYSTEM */}

      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">

          {/* LEFT */}

          <div>

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
              Evaluation System
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Fair, Structured &
              <span className="block text-cyan-400">
                Industry-Oriented
              </span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-gray-300">
              Participants are evaluated through structured technical
              scoring systems aligned with practical engineering
              implementation and competition standards.
            </p>

          </div>





          {/* RIGHT */}

          <div className="space-y-6">

            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">

              <h3 className="text-2xl font-semibold">
                Accuracy & Logic
              </h3>

              <p className="mt-4 leading-8 text-gray-300">
                Evaluate technical correctness, implementation
                methodology and analytical approach.
              </p>

            </div>





            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8">

              <h3 className="text-2xl font-semibold">
                Speed & Efficiency
              </h3>

              <p className="mt-4 leading-8 text-gray-300">
                Assess performance under time-based practical
                engineering constraints.
              </p>

            </div>





            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">

              <h3 className="text-2xl font-semibold">
                Safety & Discipline
              </h3>

              <p className="mt-4 leading-8 text-gray-300">
                Ensure professional electronics handling practices,
                safety protocols and fair-play compliance.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}