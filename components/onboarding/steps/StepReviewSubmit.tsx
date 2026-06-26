"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  IdCard,
  Link2,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { RegistrationFormData } from "@/types/onboarding";

export default function StepReviewSubmit({
  formData,
}: {
  formData: RegistrationFormData;
}) {
  const personal = formData.personal;
  const academic = formData.academic;
  const professional = formData.professional;

  return (
    <div className="max-h-[42rem] overflow-y-auto pr-1">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(90deg,rgba(248,250,252,0.92)_0%,rgba(240,249,255,0.92)_50%,rgba(250,245,255,0.92)_100%)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-sm">
            {personal.profileImage.previewUrl ? (
              <Image
                src={personal.profileImage.previewUrl}
                alt={personal.fullName || "Profile image"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                No Image
              </div>
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              Review & Submit
            </div>

            <h3 className="mt-3 text-3xl font-black text-slate-800">
              {personal.fullName || "Student"}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <InfoPill
                icon={<IdCard className="h-3.5 w-3.5" />}
                text="OMNI ID hidden until final submission"
              />
              <InfoPill
                icon={<Phone className="h-3.5 w-3.5" />}
                text={personal.phoneNumber || "Phone not provided"}
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-600">
              {personal.email}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SummaryCard
          icon={<GraduationCap className="h-5 w-5" />}
          title="Academic Information"
          subtitle="Official education details"
          items={[
            { label: "College", value: academic.collegeName, icon: <BookOpen className="h-4 w-4" /> },
            { label: "University", value: academic.university, icon: <GraduationCap className="h-4 w-4" /> },
            { label: "USN", value: academic.usn, icon: <IdCard className="h-4 w-4" /> },
            { label: "Course", value: academic.course, icon: <BookOpen className="h-4 w-4" /> },
            { label: "Branch", value: academic.branch, icon: <BriefcaseBusiness className="h-4 w-4" /> },
            { label: "Semester", value: academic.semester, icon: <BadgeCheck className="h-4 w-4" /> },
            { label: "State", value: academic.state, icon: <MapPin className="h-4 w-4" /> },
            { label: "District", value: academic.district, icon: <MapPin className="h-4 w-4" /> },
            { label: "Pincode", value: academic.pincode, icon: <MapPin className="h-4 w-4" /> },
          ]}
        />

        <SummaryCard
          icon={<UserRound className="h-5 w-5" />}
          title="Professional Identity"
          subtitle="Skills, interests and optional links"
          items={[
            {
              label: "Tagline",
              value: professional.tagline,
              icon: <Sparkles className="h-4 w-4" />,
            },
            {
              label: "Skills",
              value: professional.technicalSkills.join(", ") || "Not added",
              icon: <BadgeCheck className="h-4 w-4" />,
            },
            {
              label: "Career Interests",
              value: professional.careerInterests.join(", ") || "Not added",
              icon: <BriefcaseBusiness className="h-4 w-4" />,
            },
            {
              label: "LinkedIn",
              value: professional.linkedIn || "Optional — Not provided",
              icon: <Link2 className="h-4 w-4" />,
              optional: true,
            },
            {
              label: "GitHub",
              value: professional.github || "Optional — Not provided",
              icon: <Link2 className="h-4 w-4" />,
              optional: true,
            },
            {
              label: "Portfolio",
              value: professional.portfolio || "Optional — Not provided",
              icon: <Link2 className="h-4 w-4" />,
              optional: true,
            },
          ]}
        />
      </div>
    </div>
  );
}

function InfoPill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm">
      <span className="text-sky-600">{icon}</span>
      {text}
    </span>
  );
}

function SummaryCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
    optional?: boolean;
  }>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="relative z-10">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700">
            {icon}
          </div>

          <div>
            <h4 className="text-xl font-black text-slate-800">{title}</h4>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-xl border border-sky-100 bg-white text-sky-600">
                    {item.icon}
                  </span>

                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                </div>

                {item.optional && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Optional
                  </span>
                )}
              </div>

              <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-700">
                {item.value || "Not provided"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
