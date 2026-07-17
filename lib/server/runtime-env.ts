const REQUIRED_SERVER_ENV_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

export type RuntimeEnvReport = {
  ready: boolean;
  missingRequired: string[];
};

export function getRuntimeEnvReport(): RuntimeEnvReport {
  const missingRequired = REQUIRED_SERVER_ENV_KEYS.filter(
    (key) => !process.env[key]?.trim(),
  );

  return {
    ready: missingRequired.length === 0,
    missingRequired: [...missingRequired],
  };
}
