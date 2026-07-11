"use client";

import { useMemo, useState } from "react";
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
      "Confirm your identity details and profile image before continuing.",
  },
  {
    id: "academic",
    title: "Academic Information",
    eyebrow: "Step 02",
    description:
      "Keep your institution, course, branch and location details connected to your passport.",
  },
  {
    id: "professional",
    title: "Professional Profile",
    eyebrow: "Step 03",
    description:
      "Add your skill proof, tagline, career interests and portfolio direction.",
  },
  {
    id: "review",
    title: "Review & Submit",
    eyebrow: "Step 04",
    description:
      "Review the complete passport before saving it into the OMNI ecosystem.",
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

type CompleteResponse = {
  success?: boolean;
  error?: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string>;
};

export default function RegistrationWizard({
  editMode = false,
  initialData,
}: {
  editMode?: boolean;
  initialData?: RegistrationFormData;
}) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [studentId] = useState(() => initialData?.studentId ?? generateStudentId());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const baseFormData = initialData ?? createEmptyRegistrationFormData();

    if (baseFormData.studentId) {
      return baseFormData;
    }

    return {
      ...baseFormData,
      studentId,
    };
  });

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

  const completeOnboarding = async (payloadData: RegistrationFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const profileImagePreview = payloadData.personal.profileImage.previewUrl;
      const profileImageDataUrl = profileImagePreview.startsWith("data:image/")
        ? profileImagePreview
        : "";

      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payloadData,
          personal: {
            ...payloadData.personal,
            profileImageDataUrl,
          },
        }),
      });

      const result = (await response.json()) as CompleteResponse;

      if (!response.ok || !result.success) {
        const firstFieldError = result.fieldErrors
          ? Object.values(result.fieldErrors)[0]
          : "";

        throw new Error(
          firstFieldError ||
            result.error ||
            "Unable to save Skill Passport.",
        );
      }

      router.push(
        result.redirectTo ||
          (editMode
            ? "/profile?updated=passport#passport-overview"
            : "/onboarding/success"),
      );

      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save Skill Passport.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (!canGoNext || isSubmitting) return;

    if (isLastStep) {
      const finalPayload = {
        ...formData,
        studentId: formData.studentId || studentId,
      };

      setFormData(finalPayload);
      void completeOnboarding(finalPayload);
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
      title={editMode ? "Edit Your Skill Passport" : "Complete Your Engineering Identity"}
      subtitle={
        editMode
          ? "Update your profile image, academic identity, skills and career direction without entering admin space."
          : "Create your Omni Skills Olympiad profile foundation before entering the competition ecosystem."
      }
      completionPercent={completionPercent}
    >
      <div className="grid w-full gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
        <RegistrationProgress
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepSelect={goToStep}
        />

        <section className="relative max-w-none overflow-hidden rounded-[2.35rem] border border-slate-200/90 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.13),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.11),transparent_28%),radial-gradient(circle_at_bottom_center,rgba(14,165,233,0.07),transparent_34%)]"
          />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <StepHeader
                  step={currentStep}
                  currentStepIndex={currentStepIndex}
                  totalSteps={steps.length}
                  completionPercent={completionPercent}
                />

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
                ) : (
                  <StepReviewSubmit formData={formData} />
                )}
              </motion.div>
            </AnimatePresence>

            {submitError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {submitError}
              </div>
            ) : null}

            <WizardNavigation
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              canGoNext={canGoNext && !isSubmitting}
              onBack={goBack}
              onNext={goNext}
              nextLabel={
                isSubmitting
                  ? editMode
                    ? "Saving..."
                    : "Generating..."
                  : isLastStep
                    ? editMode
                      ? "Save Passport"
                      : "Generate Identity"
                    : "Continue"
              }
            />
          </div>
        </section>
      </div>
    </RegistrationShell>
  );
}

function StepHeader({
  step,
  currentStepIndex,
  totalSteps,
  completionPercent,
}: {
  step: OnboardingStep;
  currentStepIndex: number;
  totalSteps: number;
  completionPercent: number;
}) {
  const Icon = stepIcons[step.id];

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-gradient-to-r from-slate-50 via-sky-50/80 to-violet-50/70 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-sky-700">
              {step.eyebrow}
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl lg:text-[2.65rem]">
            {step.title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
            {step.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden min-w-[155px] rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm sm:block">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <span>Status</span>
              <span>{completionPercent}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.25rem] border border-sky-200 bg-white text-sky-600 shadow-[0_12px_28px_rgba(56,189,248,0.10)]">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

