import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visibleChallenges = await prisma.dailyChallenge.findMany({
  where: {
    isPublished: true,
    questions: {
      some: {},
    },
  },
  orderBy: [
    {
      dayNumber: "desc",
    },
    {
      createdAt: "desc",
    },
  ],
  take: 10,
  select: {
    id: true,
    dayNumber: true,
    title: true,
    isPublished: true,
    createdAt: true,
    _count: {
      select: {
        questions: true,
        attempts: true,
      },
    },
  },
});

const publishedButInvisible = await prisma.dailyChallenge.findMany({
  where: {
    isPublished: true,
    questions: {
      none: {},
    },
  },
  select: {
    id: true,
    dayNumber: true,
    title: true,
    isPublished: true,
    _count: {
      select: {
        questions: true,
      },
    },
  },
});

console.log("\n✅ Student-visible published daily challenges:");
console.table(
  visibleChallenges.map((challenge) => ({
    id: challenge.id,
    day: challenge.dayNumber,
    title: challenge.title,
    questions: challenge._count.questions,
    attempts: challenge._count.attempts,
    url: `/daily-challenges/${challenge.id}`,
  })),
);

if (publishedButInvisible.length > 0) {
  console.log("\n⚠️ Published but invisible because they have zero questions:");
  console.table(
    publishedButInvisible.map((challenge) => ({
      id: challenge.id,
      day: challenge.dayNumber,
      title: challenge.title,
      questions: challenge._count.questions,
    })),
  );
} else {
  console.log("\n✅ No published empty challenges found.");
}

await prisma.$disconnect();
