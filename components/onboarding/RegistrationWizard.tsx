"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  ImagePlus,
} from "lucide-react";

import RegistrationProgress from "@/components/onboarding/RegistrationProgress";
import RegistrationShell from "@/components/onboarding/RegistrationShell";
import WizardNavigation from "@/components/onboarding/WizardNavigation";
import StepPersonalInfo, {
  isPersonalStepValid,
} from "@/components/onboarding/steps/StepPersonalInfo";
import StepAcademicInfo, {
  isAcademicStepValid,
} from "@/components/onboarding/steps/StepAcademicInfo";
import StepProfessionalProfile, {
  isProfessionalStepValid,
} from "@/components/onboarding/steps/StepProfessionalProfile";
import StepReviewSubmit from "@/components/onboarding/steps/StepReviewSubmit";
import {
  createEmptyRegistrationFormData,
  type OnboardingStep,
  type OnboardingStepId,
  type RegistrationFormData,
} from "@/types/onboarding";
import { generateStudentId } from "@/utils/generateStudentId";

const steps: OnboardingStep[] = [
  {
    id: "personal",
    title: "Personal Information",
    eyebrow: "Step 01",
    description:
      "Begin with identity details and a mandatory profile image foundation.",
  },
  {
    id: "academic",
    title: "Academic Information",
    eyebrow: "Step 02",
    description:
      "Capture college, university, course, branch, semester, and graduation context.",
  },
  {
    id: "professional",
    title: "Professional Profile",
    eyebrow: "Step 03",
    description:
      "Prepare your tagline, technical skills, LinkedIn, GitHub, and portfolio profile fields.",
  },
  {
    id: "review",
    title: "Review & Submit",
    eyebrow: "Step 04",
    description:
      "Review registration details and generate a Silicon Skillathon student identity.",
  },
];

const stepIcons: Record<
  OnboardingStepId,
  React.ComponentType<{ className?: string }>
> = {
  personal: ImagePlus,
  academic: GraduationCap,
  professional: BriefcaseBusiness,
  review: BadgeCheck,
};

export default function RegistrationWizard() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [studentId, setStudentId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState<RegistrationFormData>(() =>
    createEmptyRegistrationFormData(),
  );

  useEffect(() => {
    // Generate only on the client to avoid SSR/client hydration mismatch.
    const nextId = generateStudentId();

    setFormData((current) => {
      if (current.studentId) return current;

      return {
        ...current,
        studentId: nextId,
      };
    });

    setStudentId(nextId);
  }, []);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const completionPercent = useMemo(() => {
    return Math.round(((currentStepIndex + 1) / steps.length) * 100);
  }, [currentStepIndex]);

  const canGoNext = useMemo(() => {
    if (currentStep.id === "personal") {
      return isPersonalStepValid(formData);
    }

    if (currentStep.id === "academic") {
      return isAcademicStepValid(formData);
    }

    if (currentStep.id === "professional") {
      return isProfessionalStepValid(formData);
    }

    return true;
  }, [currentStep.id, formData]);

  const completeOnboarding = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to complete onboarding");
      }

      router.push("/dashboard");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to complete onboarding",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (!canGoNext || isSubmitting) return;

    if (isLastStep) {
      setFormData((current) => ({
        ...current,
        studentId: current.studentId || studentId,
      }));
      void completeOnboarding();
      return;
    }

    setCurrentStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStepIndex((current) => Math.max(current - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStepIndex(() =>
      Math.max(0, Math.min(stepIndex, steps.length - 1)),
    );
  };

  return (
    <RegistrationShell
      title="Complete Your Engineering Identity"
      subtitle="Create your Omni Skills Olympiad profile foundation before entering the competition ecosystem."
      studentId={formData.studentId}
      completionPercent={completionPercent}
    >
      <div className="grid w-full gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
        <RegistrationProgress
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepSelect={goToStep}
        />

        <section className="relative max-w-none overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/5.5 p-5 shadow-[0_34px_140px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7 lg:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_34%)]"
          />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <StepHeader step={currentStep} />

                {currentStep.id === "personal" ? (
                  <StepPersonalInfo
                    formData={formData}
                    onChange={setFormData}
                  />
                ) : currentStep.id === "academic" ? (
                  <StepAcademicInfo
                    formData={formData}
                    onChange={setFormData}
                  />
                ) : currentStep.id === "professional" ? (
                  <StepProfessionalProfile
                    formData={formData}
                    onChange={setFormData}
                  />
                ) : currentStep.id === "review" ? (
                  <StepReviewSubmit formData={formData} />
                ) : (
                  <StepPlaceholder step={currentStep} />
                )}
              </motion.div>
            </AnimatePresence>

            {submitError && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
                {submitError}
              </div>
            )}

            <WizardNavigation
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              canGoNext={canGoNext && !isSubmitting}
              onBack={goBack}
              onNext={goNext}
              nextLabel={
                isSubmitting
                  ? "Generating..."
                  : isLastStep
                    ? "Generate Identity"
                    : "Continue"
              }
            />
          </div>
        </section>
      </div>
    </RegistrationShell>
  );
}

function StepHeader({ step }: { step: OnboardingStep }) {
  const Icon = stepIcons[step.id];

  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          {step.eyebrow}
        </p>

        <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
          {step.title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
          {step.description}
        </p>
      </div>

      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_44px_rgba(34,211,238,0.14)]">
        <Icon className="h-7 w-7 text-cyan-200" />
      </div>
    </div>
  );
}

function StepPlaceholder({ step }: { step: OnboardingStep }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/15 bg-black/25 p-8 text-center">
      <p className="text-sm font-semibold leading-7 text-white/52">
        {step.title} fields will be connected in the next onboarding sprint.
      </p>
    </div>
  );
}
