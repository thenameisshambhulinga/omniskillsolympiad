"use client";

import { useRouter } from "next/navigation";
import { Search, Send, SlidersHorizontal } from "lucide-react";

type AdminChallengeLibraryToolbarProps = {
  query: string;
  day: string;
  status: string;
  pageSize: string;
};

export default function AdminChallengeLibraryToolbar({
  query,
  day,
  status,
  pageSize,
}: AdminChallengeLibraryToolbarProps) {
  const router = useRouter();

  const jumpToDay = (formData: FormData) => {
    const value = String(formData.get("jumpDay") ?? "").trim();

    if (!value) return;

    router.push(`/admin/manage-challenges?day=${encodeURIComponent(value)}`);
  };

  return (
    <div className="grid gap-4">
      <form
        action="/admin/manage-challenges"
        method="get"
        className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-white/82 p-4 shadow-sm backdrop-blur-xl lg:grid-cols-[1.2fr_160px_160px_140px_auto] lg:items-end"
      >
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Search Title
          </span>
          <div className="mt-2 flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search challenge title..."
              className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Day
          </span>
          <input
            name="day"
            defaultValue={day}
            type="number"
            min="1"
            placeholder="e.g. 120"
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Status
          </span>
          <select
            name="status"
            defaultValue={status}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Show
          </span>
          <select
            name="limit"
            defaultValue={pageSize}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-blue-700"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Apply
        </button>
      </form>

      <form
        action={jumpToDay}
        className="flex flex-col gap-3 rounded-[1.5rem] border border-blue-200 bg-blue-50/80 p-4 sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            Instant Day Jump
          </p>
          <p className="mt-1 text-sm font-semibold text-blue-900/75">
            Type a day number and open that challenge instantly.
          </p>
        </div>

        <input
          name="jumpDay"
          type="number"
          min="1"
          placeholder="Day number"
          className="min-h-12 rounded-2xl border border-blue-200 bg-white px-4 text-sm font-black text-slate-950 outline-none sm:w-44"
        />

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-blue-700"
        >
          Jump
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}