"use client";

import { motion } from "framer-motion";
import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";

import ProfileImageUploader from "@/components/onboarding/profile/ProfileImageUploader";
import type { RegistrationFormData } from "@/types/onboarding";

export function isPersonalStepValid(formData: RegistrationFormData): boolean {
  return Boolean(
    formData.personal.profileImage.isValid &&
    formData.personal.profileImage.file &&
    formData.personal.fullName.trim() &&
    formData.personal.email.trim() &&
    formData.personal.phoneNumber.trim() &&
    formData.personal.dateOfBirth.trim(),
  );
}

export default function StepPersonalInfo({
  formData,
  onChange,
}: {
  formData: RegistrationFormData;
  onChange: (formData: RegistrationFormData) => void;
}) {
  const updatePersonal = <K extends keyof RegistrationFormData["personal"]>(
    key: K,
    value: RegistrationFormData["personal"][K],
  ) => {
    onChange({
      ...formData,
      personal: {
        ...formData.personal,
        [key]: value,
      },
    });
  };

  return (
    <div>
      <ProfileImageUploader
        value={formData.personal.profileImage}
        onChange={(profileImage) =>
          updatePersonal("profileImage", profileImage)
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 grid gap-4 md:grid-cols-2"
      >
        <Field
          icon={<UserRound className="h-4 w-4 text-cyan-200" />}
          label="Full Name"
          value={formData.personal.fullName}
          onChange={(value) => updatePersonal("fullName", value)}
          placeholder="Enter your full name"
          required
        />

        <Field
          icon={<Mail className="h-4 w-4 text-purple-200" />}
          label="Email"
          type="email"
          value={formData.personal.email}
          onChange={(value) => updatePersonal("email", value)}
          placeholder="name@example.com"
          required
        />

        <Field
          icon={<Phone className="h-4 w-4 text-emerald-200" />}
          label="Phone Number"
          type="tel"
          value={formData.personal.phoneNumber}
          onChange={(value) => updatePersonal("phoneNumber", value)}
          placeholder="Enter phone number"
          required
        />

        <Field
          icon={<CalendarDays className="h-4 w-4 text-amber-200" />}
          label="Date Of Birth"
          type="date"
          value={formData.personal.dateOfBirth}
          onChange={(value) => updatePersonal("dateOfBirth", value)}
          required
        />
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/[0.045]">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
        {icon}
        {label}
        {required && <span className="text-cyan-300">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={
          type === "date"
            ? "w-full border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert"
            : "w-full border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
        }
      />
    </label>
  );
}
