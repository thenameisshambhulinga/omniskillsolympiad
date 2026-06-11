import { prisma } from "@/lib/prisma";

export function formatOmniId(value: number, year = new Date().getFullYear()) {
  return `OMNI-${year}-${String(value).padStart(5, "0")}`;
}

export async function generateOmniId() {
  return prisma.$transaction(async (tx) => {
    const counter = await tx.omniCounter.upsert({
      where: { id: 1 },
      create: { id: 1, nextValue: 1 },
      update: {},
    });

    const omniId = formatOmniId(counter.nextValue);

    await tx.omniCounter.update({
      where: { id: 1 },
      data: {
        nextValue: {
          increment: 1,
        },
      },
    });

    return omniId;
  });
}
