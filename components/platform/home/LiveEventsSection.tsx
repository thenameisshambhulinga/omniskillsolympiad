const events = [
  {
    title: "National Embedded Systems Challenge",
    status: "LIVE NOW",
    participants: "1,240+",
    time: "02 Days Left",
    color: "from-red-500/20 to-orange-500/10",
  },

  {
    title: "WorldSkills PCB Design League",
    status: "UPCOMING",
    participants: "840+",
    time: "Starts Tomorrow",
    color: "from-cyan-500/20 to-blue-500/10",
  },

  {
    title: "ARM Firmware Sprint",
    status: "REGISTRATION OPEN",
    participants: "2,120+",
    time: "7 Days Remaining",
    color: "from-purple-500/20 to-pink-500/10",
  },
];

export default function LiveEventsSection() {
  return (
    <section className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-cyan-400">
              Live Ecosystem
            </p>

            <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
              Real Engineering
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Competitions
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-white/60">
            Participate in industry-level engineering competitions designed
            around practical hardware, firmware and semiconductor workflows.
          </p>
        </div>

        {/* EVENT GRID */}
        <div className="grid gap-8 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.title}
              className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
            >
              {/* BACKGROUND */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 transition duration-500 group-hover:opacity-100`}
              />

              {/* GLOW */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* CONTENT */}
              <div className="relative z-10">
                {/* STATUS */}
                <div className="mb-10 flex items-center justify-between">
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-cyan-300">
                    {event.status}
                  </div>

                  <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                </div>

                {/* TITLE */}
                <h3 className="text-3xl font-bold leading-tight">
                  {event.title}
                </h3>

                {/* STATS */}
                <div className="mt-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-white/50">Participants</span>

                    <span className="font-semibold">
                      {event.participants}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-white/50">Event Status</span>

                    <span className="font-semibold">{event.time}</span>
                  </div>
                </div>

                {/* BUTTON */}
                <button className="mt-10 w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-white transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-400 hover:text-black">
                  View Competition
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM STATS */}
        <div className="mt-20 grid gap-8 rounded-[40px] border border-white/10 bg-white/[0.03] p-10 lg:grid-cols-4">
          <div>
            <h3 className="text-5xl font-bold text-cyan-400">12K+</h3>

            <p className="mt-3 uppercase tracking-[0.2em] text-white/50">
              Registered Engineers
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400">100+</h3>

            <p className="mt-3 uppercase tracking-[0.2em] text-white/50">
              Technical Challenges
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400">30+</h3>

            <p className="mt-3 uppercase tracking-[0.2em] text-white/50">
              Mock Test Series
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400">24/7</h3>

            <p className="mt-3 uppercase tracking-[0.2em] text-white/50">
              Competitive Learning
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}