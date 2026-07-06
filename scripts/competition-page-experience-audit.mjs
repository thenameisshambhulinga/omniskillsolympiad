import fs from "node:fs";

const checks = [
  {
    file: "app/competition/page.tsx",
    mustContain: [
      "OsoCompetitionCommandCenter",
      "OsoCompetitionLiveArena",
      "publicDailyChallengeWhere",
      "studentDailyChallengeOrderBy",
      "liveDailyChallenges",
      "buildCompetitionLiveArena",
      "getRecommendedLiveArena",
    ],
    mustNotContain: [
      "<OsoCompetitionCalendar />",
    ],
  },
  {
    file: "lib/competition/competition-live-arena.ts",
    mustContain: [
      "CompetitionLiveArena",
      "buildCompetitionLiveArena",
      "getRecommendedLiveArena",
      "getCompetitionMomentumLabel",
      "questions.length",
      "/daily-challenges/",
    ],
  },
  {
    file: "components/competition/OsoCompetitionCommandCenter.tsx",
    mustContain: [
      "Competition Command Center",
      "/onboarding?edit=passport",
      "/daily-leaderboard",
      "/quiz",
      "recommendedArena",
      "framer-motion",
    ],
  },
  {
    file: "components/competition/OsoCompetitionLiveArena.tsx",
    mustContain: [
      "Live Competition Arenas",
      "Actual published challenges",
      "Open Daily-Challenges",
      "No live daily arena yet",
      "framer-motion",
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

  for (const needle of check.mustContain ?? []) {
    if (!text.includes(needle)) {
      console.error(`❌ ${check.file} must contain: ${needle}`);
      failed = true;
    }
  }

  for (const forbidden of check.mustNotContain ?? []) {
    if (text.includes(forbidden)) {
      console.error(`❌ ${check.file} must NOT contain: ${forbidden}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("COMPETITION PAGE EXPERIENCE AUDIT FAILED");
  process.exit(1);
}

console.log("COMPETITION PAGE EXPERIENCE AUDIT PASSED");
