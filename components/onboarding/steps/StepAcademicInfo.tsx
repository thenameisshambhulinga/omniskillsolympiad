"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers3,
  MapPin,
  School,
} from "lucide-react";

import { INDIAN_STATES } from "@/components/onboarding/constants/states";
import type { RegistrationFormData } from "@/types/onboarding";

export function isAcademicStepValid(formData: RegistrationFormData): boolean {
  const academic = formData.academic;

  return Boolean(
    academic.collegeName.trim() &&
    academic.university.trim() &&
    academic.usn.trim() &&
    academic.course.trim() &&
    academic.branch.trim() &&
    academic.semester.trim() &&
    academic.state.trim() &&
    academic.district.trim() &&
    academic.pincode.trim(),
  );
}

export default function StepAcademicInfo({
  formData,
  onChange,
}: {
  formData: RegistrationFormData;
  onChange: (formData: RegistrationFormData) => void;
}) {
  const updateAcademic = <K extends keyof RegistrationFormData["academic"]>(
    key: K,
    value: RegistrationFormData["academic"][K],
  ) => {
    onChange({
      ...formData,
      academic: {
        ...formData.academic,
        [key]: value,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Field
        icon={<School className="h-4 w-4 text-cyan-200" />}
        label="College Name"
        value={formData.academic.collegeName}
        onChange={(value) => updateAcademic("collegeName", value)}
        placeholder="Enter college name"
        required
      />

      <Field
        icon={<GraduationCap className="h-4 w-4 text-purple-200" />}
        label="University"
        value={formData.academic.university}
        onChange={(value) => updateAcademic("university", value)}
        placeholder="Enter university name"
        required
      />

      <Field
        icon={<BookOpen className="h-4 w-4 text-emerald-200" />}
        label="USN"
        value={formData.academic.usn}
        onChange={(value) => updateAcademic("usn", value)}
        placeholder="Enter your USN"
        required
      />

      <Field
        icon={<Layers3 className="h-4 w-4 text-amber-200" />}
        label="Course"
        value={formData.academic.course}
        onChange={(value) => updateAcademic("course", value)}
        placeholder="B.Tech / B.E / etc."
        required
      />

      <Field
        icon={<BookOpen className="h-4 w-4 text-blue-200" />}
        label="Branch"
        value={formData.academic.branch}
        onChange={(value) => updateAcademic("branch", value)}
        placeholder="e.g., CSE, ECE, Mechanical"
        required
      />

      <Field
        icon={<Layers3 className="h-4 w-4 text-pink-200" />}
        label="Semester"
        value={formData.academic.semester}
        onChange={(value) => updateAcademic("semester", value)}
        placeholder="e.g., 1, 2, 3..."
        required
      />

      <StateSelect
        value={formData.academic.state}
        onChange={(value) => updateAcademic("state", value)}
      />

      <Field
        icon={<MapPin className="h-4 w-4 text-red-300" />}
        label="District"
        value={formData.academic.district}
        onChange={(value) => updateAcademic("district", value)}
        placeholder="Enter district"
        required
      />

      <Field
        icon={<Building2 className="h-4 w-4 text-indigo-200" />}
        label="Pincode"
        value={formData.academic.pincode}
        onChange={(value) => updateAcademic("pincode", value)}
        placeholder="Enter pincode"
        required
      />
    </motion.div>
  );
}

function StateSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/[0.045]">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">
        <MapPin className="h-4 w-4 text-red-200" />
        State / Union Territory
        <span className="text-cyan-300">*</span>
      </span>

      <input
        list="indian-states"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search and select state"
        className="w-full border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
      />

      <datalist id="indian-states">
        {INDIAN_STATES.map((state) => (
          <option key={state} value={state} />
        ))}
      </datalist>
    </label>
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
        className="w-full border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25"
      />
    </label>
  );
}
