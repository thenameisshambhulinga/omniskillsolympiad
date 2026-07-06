import fs from "node:fs";

const requiredFiles = [
  "app/onboarding/page.tsx",
  "app/onboarding/OnboardingClient.tsx",
  "app/api/onboarding/complete/route.ts",
  "components/onboarding/RegistrationWizard.tsx",
  "components/onboarding/RegistrationShell.tsx",
  "components/onboarding/RegistrationProgress.tsx",
  "components/onboarding/WizardNavigation.tsx",
  "components/onboarding/steps/StepPersonalInfo.tsx",
  "components/onboarding/profile/ProfileImageUploader.tsx",
  "components/onboarding/profile/CropRepositionPanel.tsx",
  "components/dashboard/DashboardSmartMissionPlanner.tsx",
  "components/profile/platform/ProfileDropdown.tsx",
  "components/profile/platform/CompetitionNavbar.tsx",
  "app/settings/page.tsx",
];

const checks = [
  {
    file: "app/onboarding/page.tsx",
    mustContain: [
      'edit === "passport"',
      "!isPassportEditMode",
      "initialData",
      "editMode={isPassportEditMode}",
    ],
    reason: "Passport edit mode must not redirect students into admin/home before editing.",
  },
  {
    file: "app/onboarding/OnboardingClient.tsx",
    mustContain: [
      "oso-passport-studio",
      "editMode",
      "initialData",
      "RegistrationWizard",
    ],
    reason: "Onboarding client must preserve edit-mode props and scoped passport styling.",
  },
  {
    file: "components/onboarding/RegistrationWizard.tsx",
    mustContain: [
      "editMode",
      "initialData",
      "profileImageDataUrl",
      "Save Passport",
      "router.refresh",
    ],
    reason: "Wizard must preserve edit flow, profile image persistence and post-save refresh.",
  },
  {
    file: "components/onboarding/steps/StepPersonalInfo.tsx",
    mustContain: [
      "isPersonalStepValid",
      "previewUrl",
      "Continue readiness",
      "phoneDigits",
    ],
    reason: "Personal step must enable Continue for existing profile image and valid edited fields.",
  },
  {
    file: "app/api/onboarding/complete/route.ts",
    mustContain: [
      "getServerSession",
      "runtime",
      "force-dynamic",
      "omniId",
      "redirectTo",
    ],
    reason: "Onboarding completion API must be authenticated, dynamic and must preserve OMNI ID.",
  },
  {
    file: "components/dashboard/DashboardSmartMissionPlanner.tsx",
    mustContain: [
      "/onboarding?edit=passport",
    ],
    reason: "Dashboard passport CTAs must route to the passport editor.",
  },
  {
    file: "components/profile/platform/ProfileDropdown.tsx",
    mustContain: [
      "/api/auth/session",
      "/onboarding?edit=passport",
      "/settings",
    ],
    mustNotContain: [
      "useSession(",
    ],
    reason: "Profile dropdown must not use useSession without SessionProvider and must expose only safe actions.",
  },
  {
    file: "app/globals.css",
    mustContain: [
      "--font-body",
      "Inter",
      "oso-passport-studio",
    ],
    mustNotContain: [
      "Zeitung",
    ],
    reason: "Global font system must avoid unwanted Zeitung/serif leakage.",
  },
];

const packageChecks = [
  "typecheck",
  "build:hosting",
  "preflight:hosting",
];

let failed = false;

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    failed = true;
  }
}

for (const check of checks) {
  const text = read(check.file);

  if (!text) {
    console.error(`❌ Cannot audit missing file: ${check.file}`);
    failed = true;
    continue;
  }

  for (const needle of check.mustContain ?? []) {
    if (!text.includes(needle)) {
      console.error(`❌ ${check.file} must contain: ${needle}`);
      console.error(`   Reason: ${check.reason}`);
      failed = true;
    }
  }

  for (const forbidden of check.mustNotContain ?? []) {
    if (text.includes(forbidden)) {
      console.error(`❌ ${check.file} must NOT contain: ${forbidden}`);
      console.error(`   Reason: ${check.reason}`);
      failed = true;
    }
  }
}

const pkg = JSON.parse(read("package.json") || "{}");
for (const script of packageChecks) {
  if (!pkg.scripts?.[script]) {
    console.error(`❌ package.json missing script: ${script}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nEND-TO-END FLOW AUDIT FAILED");
  process.exit(1);
}

console.log("END-TO-END FLOW AUDIT PASSED");
