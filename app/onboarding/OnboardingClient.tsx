"use client";

import RegistrationWizard from "@/components/onboarding/RegistrationWizard";
import type { RegistrationFormData } from "@/types/onboarding";

type OnboardingClientProps = {
  editMode?: boolean;
  initialData?: RegistrationFormData;
};

export default function OnboardingClient({
  editMode = false,
  initialData,
}: OnboardingClientProps) {
  return (
    <main className="oso-passport-studio relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_46%,#f8fbff_100%)] text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(168,85,247,0.12),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.08),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1620px] items-start px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <RegistrationWizard editMode={editMode} initialData={initialData} />
      </div>
    </main>
  );
}
