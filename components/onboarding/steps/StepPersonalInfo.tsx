"use client";

import { motion } from "framer-motion";
import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";

import ProfileImageUploader from "@/components/onboarding/profile/ProfileImageUploader";
import type { RegistrationFormData } from "@/types/onboarding";

export function isPersonalStepValid(formData: RegistrationFormData): boolean {
  const personal = formData.personal;
  const profileImage = personal.profileImage;

  const hasCleanProfileImage =
    !profileImage.error &&
    Boolean(profileImage.previewUrl || profileImage.file) &&
    (profileImage.isValid || Boolean(profileImage.previewUrl));

  const hasName = personal.fullName.trim().length >= 2;
  const hasEmail =
    personal.email.trim().length >= 5 && personal.email.includes("@");
  const hasPhone = personal.phoneNumber.trim().replace(/\D/g, "").length >= 10;
  const hasDateOfBirth = personal.dateOfBirth.trim().length > 0;

  return Boolean(
    hasCleanProfileImage &&
      hasName &&
      hasEmail &&
      hasPhone &&
      hasDateOfBirth,
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

  const phoneDigits = formData.personal.phoneNumber
    .trim()
    .replace(/\D/g, "");

  const requirements = [
    {
      label: "Profile image",
      done:
        !formData.personal.profileImage.error &&
        Boolean(
          formData.personal.profileImage.previewUrl ||
            formData.personal.profileImage.file,
        ),
    },
    {
      label: "Full name",
      done: formData.personal.fullName.trim().length >= 2,
    },
    {
      label: "Email",
      done:
        formData.personal.email.trim().length >= 5 &&
        formData.personal.email.includes("@"),
    },
    {
      label: "Phone",
      done: phoneDigits.length >= 10,
    },
    {
      label: "Date of birth",
      done: formData.personal.dateOfBirth.trim().length > 0,
    },
  ];

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
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 grid gap-4 md:grid-cols-2"
      >
        <Field
          icon={<UserRound className="h-4 w-4 text-sky-600" />}
          label="Full Name"
          value={formData.personal.fullName}
          onChange={(value) => updatePersonal("fullName", value)}
          placeholder="Enter your full name"
          required
        />

        <Field
          icon={<Mail className="h-4 w-4 text-violet-600" />}
          label="Email"
          type="email"
          value={formData.personal.email}
          onChange={(value) => updatePersonal("email", value)}
          placeholder="name@example.com"
          required
        />

        <Field
          icon={<Phone className="h-4 w-4 text-emerald-600" />}
          label="Phone Number"
          type="tel"
          value={formData.personal.phoneNumber}
          onChange={(value) => updatePersonal("phoneNumber", value)}
          placeholder="Enter 10 digit phone number"
          required
        />

        <Field
          icon={<CalendarDays className="h-4 w-4 text-amber-600" />}
          label="Date Of Birth"
          type="date"
          value={formData.personal.dateOfBirth}
          onChange={(value) => updatePersonal("dateOfBirth", value)}
          required
        />
      </motion.div>

      <div className="mt-5 rounded-[1.35rem] border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Continue readiness
          </p>
          <p className="text-xs font-bold text-slate-500">
            {requirements.filter((item) => item.done).length}/
            {requirements.length} complete
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {requirements.map((item) => (
            <span
              key={item.label}
              className={
                item.done
                  ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                  : "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500"
              }
            >
              {item.done ? "✓" : "•"}&nbsp;{item.label}
            </span>
          ))}
        </div>
      </div>
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
    <label className="block rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-sky-200 focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.08)]">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {icon}
        {label}
        {required ? <span className="text-sky-600">*</span> : null}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={
          type === "date"
            ? "w-full border-none bg-transparent text-[15px] font-semibold text-slate-800 outline-none placeholder:text-slate-400 [color-scheme:light]"
            : "w-full border-none bg-transparent text-[15px] font-semibold text-slate-800 outline-none placeholder:text-slate-400"
        }
      />
    </label>
  );
}
