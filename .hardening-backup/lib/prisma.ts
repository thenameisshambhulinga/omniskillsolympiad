import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prismaLogLevels: Prisma.PrismaClientOptions["log"] =
  process.env.PRISMA_QUERY_LOGS === "true"
    ? [
        {
          emit: "stdout",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ]
    : [
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ];

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogLevels,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}