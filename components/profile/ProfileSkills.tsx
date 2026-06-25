
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";

export default function ProfileSkills({
  initialSkills,
}: {
  initialSkills: string[];
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [input, setInput] = useState("");

  const addSkill = () => {
    const next = input.trim();
    if (!next) return;

    const exists = skills.some(
      (skill) => skill.toLowerCase() === next.toLowerCase(),
    );

    if (!exists) {
      setSkills((current) => [...current, next]);
    }

    setInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((current) => current.filter((item) => item !== skill));
  };

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
          Technical Skills
        </p>

        <div className="mt-5 flex gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add skill"
            className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-cyan-400/35"
          />

          <button
            type="button"
            onClick={addSkill}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-300 px-5 text-sm font-black text-black"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full text-cyan-100/70 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}