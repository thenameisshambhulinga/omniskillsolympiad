"use client";

import Image from "next/image";

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
    <div className="max-h-155 overflow-y-auto pr-2">
      <section className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-cyan-400/30 bg-black/40">
            {personal.profileImage.previewUrl ? (
              <Image
                src={personal.profileImage.previewUrl}
                alt={personal.fullName || "Profile image"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                No Image
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
              Review & Submit
            </p>
            <h3 className="mt-2 text-3xl font-black text-white">
              {personal.fullName || "Student"}
            </h3>
            <p className="mt-2 text-sm text-white/55">{personal.email}</p>
            <p className="mt-1 text-sm text-white/55">{personal.phoneNumber}</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SummaryCard
          title="Academic Information"
          items={[
            ["College", academic.collegeName],
            ["USN", academic.usn],
            ["Branch", academic.branch],
            ["State", academic.state],
            ["District", academic.district],
          ]}
        />

        <SummaryCard
          title="Professional Identity"
          items={[
            ["Tagline", professional.tagline],
            ["Skills", professional.technicalSkills.join(", ") || "Not added"],
            [
              "Career Interests",
              professional.careerInterests.join(", ") || "Not added",
            ],
          ]}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
      <h4 className="text-lg font-black text-white">{title}</h4>
      <div className="mt-4 space-y-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/75">
              {value || "Not provided"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
