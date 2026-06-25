"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Radio } from "lucide-react";

import {
  COMPETITION_EVENT_TYPES,
  prepareCompetitionEvent,
  type AdapterPreview,
  type CompetitionEventType,
} from "@/lib/competition-control/entry-adapters";

export default function CompetitionEventCard() {
  const [preview, setPreview] = useState<AdapterPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPreview(
      prepareCompetitionEvent({
        eventType: String(formData.get("eventType")) as CompetitionEventType,
        eventName: String(formData.get("eventName") ?? ""),
        participationMode: String(formData.get("participationMode") ?? ""),
        date: String(formData.get("date") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      }),
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="relative overflow-hidden rounded-[3rem] border border-sky-400/20 bg-sky-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Radio className="h-5 w-5 text-sky-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
            Competition Event Entry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Event Type
              </span>
              <select
                name="eventType"
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-400/40"
              >
                {COMPETITION_EVENT_TYPES.map((eventType) => (
                  <option key={eventType} value={eventType}>
                    {eventType}
                  </option>
                ))}
              </select>
            </label>

            <ControlInput
              label="Event Name"
              name="eventName"
              placeholder="Embedded Systems Workshop"
            />
            <ControlInput
              label="Participation"
              name="participationMode"
              placeholder="Lab / Workshop / Round"
            />
            <ControlInput label="Event Date" name="date" type="date" />

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Notes
              </span>
              <textarea
                name="notes"
                rows={4}
                placeholder="Event participation notes"
                className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-sky-400/40"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-400/25 bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
          >
            <CalendarDays className="h-4 w-4" />
            Prepare Event Entry
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

function ControlInput({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-sky-400/40"
      />
    </label>
  );
}
