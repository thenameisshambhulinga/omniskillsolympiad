import fs from "node:fs";

const checks = [
  {
    file: "lib/daily-challenge/public-challenge-visibility.ts",
    mustContain: [
      "publicDailyChallengeWhere",
      "isPublished: true",
      "questions",
      "studentDailyChallengeOrderBy",
    ],
  },
  {
    file: "app/api/admin/publish-challenge/route.ts",
    mustContain: [
      "revalidatePath",
      "studentVisible",
      "getStudentDailyChallengePath",
      "published-visible",
    ],
  },
  {
    file: "app/daily-challenges/page.tsx",
    mustContain: [
      "publicDailyChallengeWhere",
      "studentDailyChallengeOrderBy",
    ],
  },
  {
    file: "components/daily-challenges/DailyChallengeMissionBrowser.tsx",
    mustContain: [
      "sortStudentVisibleFirst",
      "expired",
      "Published Daily Challenges",
    ],
  },
  {
    file: "data/omni-ecosystem.ts",
    mustContain: [
      'label: "Daily-Challenges"',
    ],
  },
  {
    file: "app/api/daily/start/route.ts",
    mustContain: [
      "publicDailyChallengeWhere",
      "CHALLENGE_NOT_AVAILABLE",
    ],
  },
  {
    file: "app/api/daily/attempt/route.ts",
    mustContain: [
      "publicDailyChallengeWhere",
      "CHALLENGE_UNAVAILABLE",
    ],
  },
];

let failed = false;

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    console.error(`❌ Missing file: ${check.file}`);
    failed = true;
    continue;
  }

  const text = fs.readFileSync(check.file, "utf8");

  for (const needle of check.mustContain) {
    if (!text.includes(needle)) {
      console.error(`❌ ${check.file} must contain: ${needle}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("DAILY CHALLENGE VISIBILITY AUDIT FAILED");
  process.exit(1);
}

console.log("DAILY CHALLENGE VISIBILITY AUDIT PASSED");
