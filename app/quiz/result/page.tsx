import Link from "next/link";
import { CheckCircle2, Home, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type QuizResultPageProps = { searchParams?: Promise<{ score?: string; total?: string; percentage?: string }> };

export default async function QuizResultPage({ searchParams }: QuizResultPageProps) {
  const params = await searchParams;
  const score = Number(params?.score ?? 0);
  const total = Number(params?.total ?? 0);
  const percentage = Number(params?.percentage ?? 0);

  return (
    <main className="min-h-screen bg-[#f8fbff] px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-4xl rounded-[2.75rem] border border-white bg-white/82 p-8 text-center shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Test Submitted</p>
        <h1 className="mt-4 text-5xl font-black text-[#6d6e6f]">Performance Report</h1>
        <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
          <Metric label="Score" value={`${score}/${total}`} />
          <Metric label="Percentage" value={`${percentage}%`} />
          <Metric label="Status" value={percentage >= 50 ? "Passed" : "Review"} />
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-800"><Home className="h-4 w-4" />Home</Link>
          <Link href="/daily-leaderboard" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"><Trophy className="h-4 w-4" />Leaderboard</Link>
        </div>
      </section>
    </main>
  );
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>; }
