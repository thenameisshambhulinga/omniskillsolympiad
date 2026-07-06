import { Prisma } from "@prisma/client";

export type InfrastructureFailure =
  | "DATABASE_UNAVAILABLE"
  | "DNS_UNAVAILABLE"
  | "NETWORK_UNAVAILABLE"
  | "UNKNOWN_INFRASTRUCTURE_ERROR";

const TRANSIENT_NETWORK_CODES = new Set([
  "EAI_AGAIN",
  "ENOTFOUND",
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
]);

export function classifyInfrastructureError(error: unknown): InfrastructureFailure {
  const chain = flattenError(error);

  if (chain.some((item) => item.code === "EAI_AGAIN" || item.code === "ENOTFOUND")) {
    return "DNS_UNAVAILABLE";
  }

  if (chain.some((item) => typeof item.code === "string" && TRANSIENT_NETWORK_CODES.has(item.code))) {
    return "NETWORK_UNAVAILABLE";
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    chain.some((item) =>
      String(item.message ?? "").includes("Can't reach database server"),
    )
  ) {
    return "DATABASE_UNAVAILABLE";
  }

  return "UNKNOWN_INFRASTRUCTURE_ERROR";
}

export function isTransientInfrastructureError(error: unknown): boolean {
  return classifyInfrastructureError(error) !== "UNKNOWN_INFRASTRUCTURE_ERROR";
}

function flattenError(error: unknown): Array<{ code?: string; message?: string }> {
  const result: Array<{ code?: string; message?: string }> = [];
  let current: unknown = error;
  const visited = new Set<unknown>();

  while (current && typeof current === "object" && !visited.has(current)) {
    visited.add(current);
    const candidate = current as { code?: unknown; message?: unknown; cause?: unknown };
    result.push({
      code: typeof candidate.code === "string" ? candidate.code : undefined,
      message: typeof candidate.message === "string" ? candidate.message : undefined,
    });
    current = candidate.cause;
  }

  return result;
}
