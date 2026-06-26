"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Globe, Link as LinkIcon, Link2, Plus } from "lucide-react";
import { useState } from "react";

import SkillChipInput from "@/components/onboarding/profile/SkillChipInput";
import type { RegistrationFormData } from "@/types/onboarding";

const CAREER_INTERESTS = [
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
] as const;

export function isProfessionalStepValid(
  formData: RegistrationFormData,
): boolean {
  const professional = formData.professional;

  return Boolean(
    professional.tagline.trim() &&
      professional.tagline.trim().length >= 5 &&
      professional.tagline.trim().length <= 120 &&
      professional.technicalSkills.length > 0 &&
      professional.careerInterests.length > 0,
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
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <TaglineField
        value={formData.professional.tagline}
        onChange={(value) => updateProfessional("tagline", value)}
      />

      <SkillChipInput
        skills={formData.professional.technicalSkills}
        onChange={(skills) => updateProfessional("technicalSkills", skills)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <LinkField
          icon={<LinkIcon className="h-4 w-4 text-sky-600" />}
          label="LinkedIn"
          value={formData.professional.linkedIn}
          onChange={(value) => updateProfessional("linkedIn", value)}
          placeholder="linkedin.com/in/yourprofile"
        />

        <LinkField
          icon={<Globe className="h-4 w-4 text-violet-600" />}
          label="GitHub"
          value={formData.professional.github}
          onChange={(value) => updateProfessional("github", value)}
          placeholder="github.com/yourprofile"
        />
      </div>

      <LinkField
        icon={<Link2 className="h-4 w-4 text-emerald-600" />}
        label="Portfolio"
        value={formData.professional.portfolio}
        onChange={(value) => updateProfessional("portfolio", value)}
        placeholder="your-portfolio-url.com"
      />

      <CareerInterestsSection
        selected={formData.professional.careerInterests}
        onToggle={toggleCareerInterest}
      />

      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          <Plus className="h-4 w-4 text-sky-600" />
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
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-200 focus:bg-white"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-sky-700 transition hover:bg-sky-100"
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
    <label className="block rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-sky-200 focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          <Briefcase className="h-4 w-4 text-slate-600" />
          Tagline
          <span className="text-sky-600">*</span>
        </span>
        <span
          className={`text-xs font-semibold ${
            isValid ? "text-sky-700" : "text-slate-500"
          }`}
        >
          {charCount}/120
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe yourself in one impactful line"
        className="w-full resize-none border-none bg-transparent text-[15px] font-semibold text-slate-800 outline-none placeholder:text-slate-400"
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
    <label className="block rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-sky-200 focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.08)]">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {icon}
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-[15px] font-semibold text-slate-800 outline-none placeholder:text-slate-400"
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
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        <div className="h-4 w-4 rounded-full bg-gradient-to-r from-violet-400 to-pink-400" />
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
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`rounded-[1.2rem] border px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] transition-all ${
                  isSelected
                    ? "border-sky-200 bg-sky-50 text-sky-800 shadow-[0_8px_24px_rgba(56,189,248,0.08)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
