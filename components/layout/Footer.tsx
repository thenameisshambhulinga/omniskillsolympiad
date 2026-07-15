export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 py-14 md:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div>
          <h2 className="text-3xl font-bold">
            <span className="text-purple-400">Silicon</span> Skillathon
          </h2>

          <p className="mt-4 max-w-xl leading-8 text-gray-400">
            Industry-oriented electronics engineering ecosystem focused on
            practical learning, competitions, engagement, ranking systems and
            WorldSkills preparation.
          </p>
        </div>

        {/* CENTER */}

        <div className="flex flex-wrap gap-8 text-gray-300">
          <p>Competition</p>
          <p>Daily Quizzes</p>
          <p>Mock Tests</p>
          <p>Leaderboard</p>
          <p>WorldSkills</p>
        </div>

        {/* RIGHT */}

        <div className="text-gray-400">

          <p className="mt-2 text-sm">© 2026 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
