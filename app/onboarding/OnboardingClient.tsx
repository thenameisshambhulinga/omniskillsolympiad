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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-36 top-24 h-[38rem] w-[38rem] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] items-start px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <RegistrationWizard editMode={editMode} initialData={initialData} />
      </div>
    </main>
  );
}
