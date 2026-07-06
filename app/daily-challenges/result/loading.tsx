export default function DailyResultLoading() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center">
        <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <div className="h-4 w-48 rounded-full bg-cyan-300/20" />
          <div className="mt-6 h-16 w-2/5 rounded-2xl bg-white/10" />
          <div className="mt-4 h-16 w-1/3 rounded-2xl bg-white/10" />

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <div className="h-36 rounded-[1.5rem] bg-white/10" />
            <div className="h-36 rounded-[1.5rem] bg-white/10" />
            <div className="h-36 rounded-[1.5rem] bg-white/10" />
            <div className="h-36 rounded-[1.5rem] bg-white/10" />
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-cyan-200/80">
            Building performance report...
          </p>
        </div>
      </section>
    </main>
  );
}