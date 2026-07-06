import { prisma } from "@/lib/prisma";
import { getRuntimeEnvReport } from "@/lib/server/runtime-env";
import { runtimeError, runtimeSuccess } from "@/lib/server/runtime-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startedAt = Date.now();
  const env = getRuntimeEnvReport();

  let database = {
    ready: false,
    latencyMs: null as number | null,
  };

  try {
    const dbStart = Date.now();

    await prisma.$queryRaw`SELECT 1`;

    database = {
      ready: true,
      latencyMs: Date.now() - dbStart,
    };
  } catch {
    database = {
      ready: false,
      latencyMs: null,
    };
  }

  const report = {
    service: "silicon-skillathon-runtime",
    ready: env.ready && database.ready,
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startedAt,
    environment: {
      ready: env.ready,
      required: env.required,
      optional: env.optional,
      missingRequired: env.missingRequired,
    },
    database,
  };

  if (!report.ready) {
    return runtimeError("Runtime health check failed", {
      status: 503,
      code: "RUNTIME_NOT_READY",
      meta: report,
    });
  }

  return runtimeSuccess(report);
}
