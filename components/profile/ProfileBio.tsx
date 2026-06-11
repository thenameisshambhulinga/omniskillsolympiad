"use client";

import { useState } from "react";
import { Edit3, Save } from "lucide-react";

export default function ProfileBio({ initialBio }: { initialBio: string }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(initialBio);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-300">
            Engineering Bio
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            Professional Identity
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setEditing((current) => !current)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-black text-white/70 transition hover:border-cyan-400/30 hover:text-white"
        >
          {editing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit3 className="h-4 w-4" />
          )}
          {editing ? "Save" : "Edit"}
        </button>
      </div>

      {editing ? (
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={7}
          className="mt-5 w-full rounded-[1.5rem] border border-white/10 bg-black/30 p-4 text-sm leading-7 text-white outline-none focus:border-cyan-400/35"
        />
      ) : (
        <p className="mt-5 text-sm leading-8 text-white/62">{bio}</p>
      )}

      <p className="mt-4 text-xs font-semibold text-white/35">
        {bio.length} characters
      </p>
    </section>
  );
}
