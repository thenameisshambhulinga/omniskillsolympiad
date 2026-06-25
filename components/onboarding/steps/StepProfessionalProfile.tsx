"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Globe, Link, Link2, Plus } from "lucide-react";

import SkillChipInput from "@/components/onboarding/profile/SkillChipInput";
import type { RegistrationFormData } from "@/types/onboarding";

export const CAREER_INTERESTS = [
  "Software Engineering",
  "Embedded Systems",
  "VLSI Design",
  "PCB Design",
  "AI & Robotics",
  "IoT",
  "Semiconductors",
  "Firmware Development",
  "Hardware Testing",
  "Automotive Electronics",
  "WorldSkills Preparation",
] as const;

export function isProfessionalStepValid(
  formData: RegistrationFormData,
): boolean {
  const tagline = formData.professional.tagline.trim();

  return Boolean(
    tagline.length >= 5 &&
    tagline.length <= 120 &&
    formData.professional.technicalSkills.length > 0,
  );
}

export default function StepProfessionalProfile({
  formData,
  onChange,
}: {
  formData: RegistrationFormData;
  onChange: (formData: RegistrationFormData) => void;
}) {
  const [customInterest, setCustomInterest] = useState("");

  const updateProfessional = <
    K extends keyof RegistrationFormData["professional"],
  >(
    key: K,
    value: RegistrationFormData["professional"][K],
  ) => {
    onChange({
      ...formData,
      professional: {
        ...formData.professional,
        [key]: value,
      },
    });
  };

  const toggleCareerInterest = (interest: string) => {
    const current = formData.professional.careerInterests;
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    updateProfessional("careerInterests", updated);
  };

  const addCustomInterest = () => {
    const next = customInterest.trim();

    if (!next) return;

    const exists = formData.professional.careerInterests.some(
      (item) => item.toLowerCase() === next.toLowerCase(),
    );

    if (exists) {
      setCustomInterest("");
      return;
    }

    if (
      !CAREER_INTERESTS.includes(next as (typeof CAREER_INTERESTS)[number]) &&
      formData.professional.careerInterests.filter(
        (item) =>
          !CAREER_INTERESTS.includes(item as (typeof CAREER_INTERESTS)[number]),
      ).length >= 10
    ) {
      return;
    }

    updateProfessional("careerInterests", [
      ...formData.professional.careerInterests,
      next,
    ]);
    setCustomInterest("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Tagline */}
      <TaglineField
        value={formData.professional.tagline}
        onChange={(value) => updateProfessional("tagline", value)}
      />

      {/* Technical Skills */}
      <SkillChipInput
        skills={formData.professional.technicalSkills}
        onChange={(skills) => updateProfessional("technicalSkills", skills)}
      />

      {/* Links Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <LinkField
          icon={<Link className="h-4 w-4 text-cyan-200" />}
          label="LinkedIn"
          value={formData.professional.linkedIn}
          onChange={(value) => updateProfessional("linkedIn", value)}
          placeholder="linkedin.com/in/yourprofile"
        />

        <LinkField
          icon={<Globe className="h-4 w-4 text-purple-200" />}
          label="GitHub"
          value={formData.professional.github}
          onChange={(value) => updateProfessional("github", value)}
          placeholder="github.com/yourprofile"
        />
      </div>

      {/* Portfolio */}
      <LinkField
        icon={<Link2 className="h-4 w-4 text-emerald-200" />}
        label="Portfolio"
        value={formData.professional.portfolio}
        onChange={(value) => updateProfessional("portfolio", value)}
        placeholder="your-portfolio-url.com"
      />

      {/* Career Interests */}
      <CareerInterestsSection
        selected={formData.professional.careerInterests}
        onToggle={toggleCareerInterest}
      />

      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
          <Plus className="h-4 w-4 text-cyan-200" />
          Add Custom Interest
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={customInterest}
            onChange={(event) => setCustomInterest(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomInterest();
              }
            }}
            placeholder="Type a custom interest"
            className="flex-1 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/35"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-400/20"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TaglineField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const charCount = value.length;
  const isValid = charCount >= 5 && charCount <= 120;

  return (
    <label className="block rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/4.5">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
          <Briefcase className="h-4 w-4" />
          Tagline
          <span className="text-cyan-300">*</span>
        </span>
        <span
          className={`text-xs font-semibold ${
            isValid ? "text-cyan-400" : "text-white/45"
          }`}
        >
          {charCount}/120
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe yourself in one impactful line"
        className="w-full border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25 resize-none"
        rows={4}
      />
    </label>
  );
}

function LinkField({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/4.5">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
        {icon}
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25"
      />
    </label>
  );
}

function CareerInterestsSection({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (interest: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
        <div className="h-4 w-4 rounded-full bg-linear-to-r from-purple-300 to-pink-300" />
        Career Interests
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {CAREER_INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <motion.button
                key={interest}
                type="button"
                onClick={() => onToggle(interest)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-[1.25rem] px-4 py-3 text-xs font-bold uppercase tracking-wider border transition-all ${
                  isSelected
                    ? "border-cyan-400/60 bg-cyan-400/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "border-white/10 bg-black/25 text-white/65 hover:border-white/25 hover:bg-black/40"
                }`}
              >
                {interest}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
