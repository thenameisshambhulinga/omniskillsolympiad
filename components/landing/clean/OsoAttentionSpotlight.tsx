import { Sparkles, TerminalSquare } from "lucide-react";

export default function OsoAttentionSpotlight() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[150px] opacity-95"
      >
        <div className="absolute left-6 top-4 h-28 w-28 rounded-[2rem] bg-[#f4d93d] rotate-[18deg]" />
        <div className="absolute left-1 top-10 h-28 w-28 rounded-[2rem] bg-[#22c55e] rotate-[-8deg]" />
        <div className="absolute left-3 top-20 h-24 w-24 rounded-[1.8rem] bg-[#38bdf8] rotate-[12deg]" />
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <div className="ml-6 flex h-[92px] w-[92px] items-center justify-center rounded-[1.8rem] border-[5px] border-slate-900 bg-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
          <div className="relative">
            <TerminalSquare className="h-10 w-10 text-slate-900" />
            <Sparkles className="absolute -right-5 -top-3 h-5 w-5 text-slate-900" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-700">
            Smart student journey
          </p>
          <h3 className="oso-heading mt-1 text-xl font-black text-slate-950">
            From first login to skill recognition
          </h3>
          <p className="mt-1.5 text-sm font-medium leading-6 text-slate-600">
            A cleaner, guided experience that helps students understand where
            they are, what to do next and how they grow.
          </p>
        </div>
      </div>
    </div>
  );
}