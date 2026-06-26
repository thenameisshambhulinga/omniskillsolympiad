import fs from "node:fs";

const checks = [
  [
    "app/api/onboarding/complete/route.ts",
    [
      "normalizeOnboardingPayload",
      "redirectTo",
      "seasonProgress.upsert",
      "PASSPORT_UPDATED",
      "ONBOARDING_COMPLETED",
    ],
  ],
  [
    "components/onboarding/RegistrationWizard.tsx",
    [
      "editMode",
      "initialData",
      "profileImageDataUrl",
      "result.redirectTo",
      "Save Passport",
    ],
  ],
  [
    "components/onboarding/steps/StepPersonalInfo.tsx",
    [
      "isPersonalStepValid",
      "Continue readiness",
    ],
  ],
  [
    "components/dashboard/DashboardSmartMissionPlanner.tsx",
    [
      "/onboarding?edit=passport",
      "Complete Passport",
    ],
  ],
];

let failed = false;

for (const [file, needles] of checks) {
  if (!fs.existsSync(file)) {
    console.error(`PASSPORT FLOW AUDIT FAILED: missing ${file}`);
    failed = true;
    continue;
  }

  const text = fs.readFileSync(file, "utf8");

  for (const needle of needles) {
    if (!text.includes(needle)) {
      console.error(
        `PASSPORT FLOW AUDIT FAILED: ${file} does not contain "${needle}"`,
      );
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("PASSPORT FLOW AUDIT PASSED");
