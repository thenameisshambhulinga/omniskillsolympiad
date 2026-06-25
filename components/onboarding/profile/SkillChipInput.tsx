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

  const normalizeSkill = (skill: string): string => {
    return skill.trim().toLowerCase();
  };

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
    <div>
      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/4.5">
        <label className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
          <span className="h-4 w-4 rounded-full bg-linear-to-br from-cyan-300 to-blue-300" />
          Technical Skills
          <span className="text-cyan-300">*</span>
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
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 text-xs font-semibold text-cyan-100 border border-cyan-400/30"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-1 rounded-full p-0.5 hover:bg-cyan-400/20 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="flex gap-2">
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
              className="flex-1 border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25"
            />

            <button
              type="button"
              onClick={addSkill}
              className="rounded-full bg-linear-to-r from-cyan-400/20 to-blue-400/20 px-4 py-2 text-xs font-bold uppercase text-cyan-200 border border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-400/30 transition"
            >
              Add
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-red-400"
            >
              {error}
            </motion.p>
          )}

          {skills.length === 0 && !error && (
            <p className="text-xs font-medium text-white/35">
              Add at least one technical skill
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
