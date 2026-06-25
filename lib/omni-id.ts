import { prisma } from "@/lib/prisma";

export function formatOmniId(value: number, year = new Date().getFullYear()) {
  return `OMNI-${year}-${String(value).padStart(5, "0")}`;
}

export async function generateOmniId() {
  const counter = await prisma.omniCounter.upsert({
    where: {
      id: 1,
    },
    create: {
      id: 1,
      nextValue: 2,
    },
    update: {
      nextValue: {
        increment: 1,
      },
    },
    select: {
      nextValue: true,
    },
  });

  return formatOmniId(counter.nextValue - 1);
}
