"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SkillChipInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillChipInput({
  skills,
  onChange,
}: SkillChipInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [input]);

  const normalizeSkill = (skill: string): string => skill.trim().toLowerCase();

  const addSkill = () => {
    const normalized = normalizeSkill(input);

    if (!normalized) {
      setError("Skill cannot be empty");
      return;
    }

    if (normalized.length < 2) {
      setError("Skill must be at least 2 characters");
      return;
    }

    const skillExists = skills.some(
      (skill) => normalizeSkill(skill) === normalized,
    );

    if (skillExists) {
      setError("This skill already exists");
      return;
    }

    onChange([...skills, input.trim()]);
    setInput("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-sky-200 focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.08)]">
      <label className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        <span className="h-4 w-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-500" />
        Technical Skills
        <span className="text-sky-600">*</span>
      </label>

      <div className="space-y-3">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {skills.map((skill, index) => (
                <motion.div
                  key={`${skill}-${index}`}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-1 rounded-full p-0.5 transition hover:bg-sky-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              skills.length === 0
                ? "Press Enter to add skill"
                : "Add another skill"
            }
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-200 focus:bg-white"
          />

          <button
            type="button"
            onClick={addSkill}
            className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sky-700 transition hover:bg-sky-100"
          >
            Add
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-red-600"
          >
            {error}
          </motion.p>
        )}

        {skills.length === 0 && !error && (
          <p className="text-xs font-medium text-slate-500">
            Add at least one technical skill
          </p>
        )}
      </div>
    </div>
  );
}
