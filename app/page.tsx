import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/platform/home/HeroSection";
import AboutSection from "@/components/platform/home/AboutSection";
import SkillTracksSection from "@/components/platform/home/SkillTracksSection";
import LiveEventsSection from "@/components/platform/home/LiveEventsSection";
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Glow */}
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-purple-700/30 blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-3xl" />
      {/* Grid Overlay */}
      <HeroSection />
      <AboutSection />
      <SkillTracksSection />
      <LiveEventsSection />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Navbar */}
      {/* PREMIUM HERO SECTION */}
      {/* WHY THIS EXISTS */}
     
      {/* SKILL TRACKS */}
      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
                Skill Tracks
              </p>

              <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                Technical Domains
                <span className="block text-cyan-400">
                  Students Will Experience
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-zinc-200">
              Carefully designed practical domains aligned with industry
              electronics engineering workflows and WorldSkills-oriented
              technical preparation.
            </p>
          </div>

          {/* TRACK GRID */}

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-purple-500/40 hover:bg-white/[0.07]">
              <h3 className="text-2xl font-semibold">Embedded Systems</h3>

              <p className="mt-4 leading-7 text-zinc-200">
                ARM programming, firmware logic, microcontroller interfacing and
                embedded hardware workflows.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-500/40 hover:bg-white/[0.07]">
              <h3 className="text-2xl font-semibold">PCB Design & Assembly</h3>

              <p className="mt-4 leading-7 text-zinc-200">
                Circuit-level assembly practices, PCB handling, electronics
                integration and soldering techniques.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-purple-500/40 hover:bg-white/[0.07]">
              <h3 className="text-2xl font-semibold">FPGA & Verilog</h3>

              <p className="mt-4 leading-7 text-zinc-200">
                Digital system concepts, logic design and hardware
                implementation methodologies.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-500/40 hover:bg-white/[0.07]">
              <h3 className="text-2xl font-semibold">Hardware Debugging</h3>

              <p className="mt-4 leading-7 text-zinc-200">
                Fault detection, troubleshooting methodologies and practical
                electronics diagnosis techniques.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-purple-500/40 hover:bg-white/[0.07]">
              <h3 className="text-2xl font-semibold">Instrumentation Skills</h3>

              <p className="mt-4 leading-7 text-zinc-200">
                Exposure to professional electronics instruments used for
                testing and diagnostics.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-500/40 hover:bg-white/[0.07]">
              <h3 className="text-2xl font-semibold">Competition Readiness</h3>

              <p className="mt-4 leading-7 text-zinc-200">
                Structured preparation approach for industry-level technical
                competitions and skill acceleration.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* WORLD SKILLS ROADMAP */}
      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
              Student Journey
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              From Skillathon
              <span className="block text-purple-400">
                To Industry & WorldSkills
              </span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-200">
              Silicon Skillathon is designed as a long-term technical
              acceleration ecosystem that identifies potential, develops
              practical engineering competencies and prepares students for
              advanced opportunities.
            </p>
          </div>

          {/* ROADMAP */}

          <div className="relative mt-24">
            {/* Vertical Line */}

            <div className="absolute left-[27px] top-0 hidden h-full w-[2px] bg-white/10 md:block" />

            {/* STEP 1 */}

            <div className="relative mb-16 flex gap-8">
              <div className="relative z-10 hidden h-14 w-14 items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/20 text-lg font-bold md:flex">
                1
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:w-[80%]">
                <h3 className="text-2xl font-semibold">
                  Registration & Screening
                </h3>

                <p className="mt-4 leading-8 text-zinc-200">
                  Students register and participate in technical evaluation
                  activities designed to assess practical electronics
                  competencies and engineering potential.
                </p>
              </div>
            </div>

            {/* STEP 2 */}

            <div className="relative mb-16 flex gap-8">
              <div className="relative z-10 hidden h-14 w-14 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/20 text-lg font-bold md:flex">
                2
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:ml-24 md:w-[80%]">
                <h3 className="text-2xl font-semibold">Technical Skillathon</h3>

                <p className="mt-4 leading-8 text-zinc-200">
                  Students experience real-world electronics problem solving
                  through embedded systems, PCB handling, debugging, FPGA and
                  instrumentation-based activities.
                </p>
              </div>
            </div>

            {/* STEP 3 */}

            <div className="relative mb-16 flex gap-8">
              <div className="relative z-10 hidden h-14 w-14 items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/20 text-lg font-bold md:flex">
                3
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:w-[80%]">
                <h3 className="text-2xl font-semibold">
                  Finishing School Program
                </h3>

                <p className="mt-4 leading-8 text-zinc-200">
                  Selected students enter advanced practical training programs
                  focused on industry readiness, product-level engineering
                  exposure and technical confidence.
                </p>
              </div>
            </div>

            {/* STEP 4 */}

            <div className="relative flex gap-8">
              <div className="relative z-10 hidden h-14 w-14 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/20 text-lg font-bold md:flex">
                4
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:ml-24 md:w-[80%]">
                <h3 className="text-2xl font-semibold">
                  WorldSkills & Industry Opportunities
                </h3>

                <p className="mt-4 leading-8 text-zinc-200">
                  High-performing students receive advanced mentoring,
                  competition preparation support, industry exposure
                  opportunities and placement-oriented guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BENEFITS SECTION */}
      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}

            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
                Benefits & Opportunities
              </p>

              <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                More Than Just
                <span className="block text-cyan-400">A Technical Event</span>
              </h2>

              <p className="mt-8 text-lg leading-8 text-zinc-200">
                Silicon Skillathon is structured to create long-term student
                growth opportunities aligned with industry electronics
                engineering expectations and future semiconductor ecosystem
                demands.
              </p>
            </div>

            {/* RIGHT */}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-semibold">Internship Exposure</h3>

                <p className="mt-4 leading-7 text-zinc-200">
                  Access to industry-oriented technical learning environments
                  and engineering exposure.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-semibold">Placement Readiness</h3>

                <p className="mt-4 leading-7 text-zinc-200">
                  Develop practical engineering confidence and technical
                  competencies valued by companies.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-semibold">Industry Mentorship</h3>

                <p className="mt-4 leading-7 text-zinc-200">
                  Learn from professionals and mentors aligned with electronics
                  engineering ecosystems.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-semibold">Competition Ecosystem</h3>

                <p className="mt-4 leading-7 text-zinc-200">
                  Exposure to structured technical competitions and advanced
                  electronics skill development pathways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FINAL CTA SECTION */}
      <section className="relative z-10 border-t border-white/10 px-6 py-28 md:px-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-purple-900/30 to-cyan-900/20 p-10 backdrop-blur-xl md:p-16">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* LEFT CONTENT */}

            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-300">
                Begin Your Technical Journey
              </p>

              <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                Join The Next Generation
                <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Of Electronics Engineers
                </span>
              </h2>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-200">
                Participate in Silicon Skillathon and explore a structured
                pathway toward practical electronics engineering, industry
                readiness, WorldSkills preparation and future technical
                opportunities.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-2xl bg-purple-600 px-8 py-4 text-lg font-semibold transition hover:bg-purple-500">
                  Register Now
                </button>

                <button className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/10">
                  Download Brochure
                </button>
              </div>
            </div>

            {/* RIGHT INFO PANEL */}

            <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-semibold">Event Information</h3>

              <div className="mt-10 space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-widest text-purple-400">
                    Event Date
                  </p>

                  <h4 className="mt-2 text-xl font-medium">22 May 2026</h4>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest text-cyan-400">
                    Eligibility
                  </p>

                  <h4 className="mt-2 text-xl font-medium leading-8">
                    2nd & 3rd Year Electronics / ECE / EEE / Embedded Systems
                    Students
                  </h4>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest text-purple-400">
                    Venue
                  </p>

                  <h4 className="mt-2 text-xl font-medium leading-8">
                    Silicon Microsystems, Bengaluru, Karnataka
                  </h4>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest text-cyan-400">
                    Contact
                  </p>

                  <h4 className="mt-2 text-xl font-medium">+91 99988 87776</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* STUDENT ENGAGEMENT ECOSYSTEM */}
      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-400">
              Engagement Ecosystem
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Learn, Compete,
              <span className="block text-purple-400">Earn Silicon Points</span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-200">
              Silicon Skillathon is designed as a continuous technical
              engagement ecosystem where students participate in daily
              electronics activities, mock tests, quizzes and rankings that
              prepare them for competitions and industry readiness.
            </p>
          </div>

          {/* FEATURE GRID */}

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* DAILY QUIZZES */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-purple-500/40 hover:bg-white/[0.07]">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                ⚡
              </div>

              <h3 className="text-2xl font-semibold">
                Daily Technical Quizzes
              </h3>

              <p className="mt-4 leading-8 text-zinc-200">
                Participate in daily electronics MCQs focused on embedded
                systems, analog electronics, digital logic, STM32, sensors, PCB
                concepts and troubleshooting.
              </p>
            </div>

            {/* MOCK TESTS */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-cyan-500/40 hover:bg-white/[0.07]">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl">
                ⏱
              </div>

              <h3 className="text-2xl font-semibold">30 Minute Mock Tests</h3>

              <p className="mt-4 leading-8 text-gray-300">
                Experience timer-based evaluation systems designed to improve
                speed, confidence, troubleshooting ability and competition-level
                technical readiness.
              </p>
            </div>

            {/* SILICON POINTS */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-purple-500/40 hover:bg-white/[0.07]">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                🏆
              </div>

              <h3 className="text-2xl font-semibold">Silicon Points System</h3>

              <p className="mt-4 leading-8 text-gray-300">
                Earn Silicon Points through quizzes, mock tests, leaderboard
                rankings, technical consistency and active participation within
                the ecosystem.
              </p>
            </div>

            {/* LEADERBOARD */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-cyan-500/40 hover:bg-white/[0.07]">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl">
                📈
              </div>

              <h3 className="text-2xl font-semibold">Live Leaderboards</h3>

              <p className="mt-4 leading-8 text-gray-300">
                Track technical rankings, compare performance and compete with
                students across colleges through continuously updated
                leaderboard systems.
              </p>
            </div>

            {/* INDUSTRY VISITS */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-purple-500/40 hover:bg-white/[0.07]">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                🏭
              </div>

              <h3 className="text-2xl font-semibold">Industry Visit Rewards</h3>

              <p className="mt-4 leading-8 text-gray-300">
                Top Silicon Point earners receive opportunities for industry
                visits, ecosystem exposure and technical networking experiences.
              </p>
            </div>

            {/* GAMIFICATION */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-cyan-500/40 hover:bg-white/[0.07]">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl">
                🚀
              </div>

              <h3 className="text-2xl font-semibold">
                Technical Growth Levels
              </h3>

              <p className="mt-4 leading-8 text-gray-300">
                Progress through structured engagement levels from Beginner →
                Explorer → Builder → Innovator → Silicon Master.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* SILICON POINTS ROADMAP */}
      <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* LEFT */}

            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
                Reward Ecosystem
              </p>

              <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                Consistency Builds
                <span className="block text-cyan-400">
                  Technical Excellence
                </span>
              </h2>

              <p className="mt-8 text-lg leading-8 text-gray-300">
                Students are continuously encouraged through performance-based
                rewards, rankings and engagement systems designed to maintain
                long-term technical involvement.
              </p>
            </div>

            {/* RIGHT */}

            <div className="space-y-6">
              <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">
                <h3 className="text-2xl font-semibold">Earn Silicon Points</h3>

                <p className="mt-4 leading-8 text-gray-300">
                  Participate daily and accumulate technical activity points
                  through quizzes and mock tests.
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8">
                <h3 className="text-2xl font-semibold">Improve Rankings</h3>

                <p className="mt-4 leading-8 text-gray-300">
                  Compete with students across colleges and improve your
                  leaderboard performance consistently.
                </p>
              </div>

              <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">
                <h3 className="text-2xl font-semibold">Unlock Opportunities</h3>

                <p className="mt-4 leading-8 text-gray-300">
                  Top performers receive rewards, recognition, industry visit
                  opportunities and advanced technical ecosystem exposure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
    </main>
  );
}
