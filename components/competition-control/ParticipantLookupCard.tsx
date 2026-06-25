"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Search, UserRound } from "lucide-react";

import {
  prepareParticipantLookup,
  type AdapterPreview,
  type ParticipantLookupType,
} from "@/lib/competition-control/entry-adapters";

export default function ParticipantLookupCard() {
  const [preview, setPreview] = useState<AdapterPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPreview(
      prepareParticipantLookup({
        lookupType: String(formData.get("lookupType")) as ParticipantLookupType,
        query: String(formData.get("query") ?? ""),
      }),
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <UserRound className="h-5 w-5 text-cyan-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Participant Lookup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Search By
              </span>
              <select
                name="lookupType"
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-400/40"
              >
                <option value="OMNI_ID">OMNI ID</option>
                <option value="EMAIL">Email</option>
                <option value="NAME">Name</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Participant Search
              </span>
              <input
                name="query"
                placeholder="OMNI-2026-00001 / student@email.com / name"
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-300 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-200"
          >
            <Search className="h-4 w-4" />
            Prepare Lookup
          </button>
        </form>

        {preview && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-semibold leading-6 text-white/65">
            {preview.message}
          </div>
        )}
      </div>
    </motion.section>
  );
}
