import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">
          Omni Skills Olympiad
        </p>

        <h1 className="mt-6 text-8xl font-black text-white">404</h1>

        <h2 className="mt-4 text-4xl font-bold">Page Not Found</h2>

        <p className="mt-6 text-lg text-white/60">
          The requested challenge, resource, or page does not exist or may no
          longer be available.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            Go Home
          </Link>

          <Link
            href="/daily-challenges"
            className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-white transition hover:border-cyan-400"
          >
            Daily Challenges
          </Link>
        </div>
      </div>
    </main>
  );
}
