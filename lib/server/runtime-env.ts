const REQUIRED_SERVER_ENV_KEYS = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;

const OPTIONAL_SERVER_ENV_KEYS = [
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export type RuntimeEnvReport = {
  ready: boolean;
  required: Record<(typeof REQUIRED_SERVER_ENV_KEYS)[number], boolean>;
  optional: Record<(typeof OPTIONAL_SERVER_ENV_KEYS)[number], boolean>;
  missingRequired: string[];
};

export function getRuntimeEnvReport(): RuntimeEnvReport {
  const required = REQUIRED_SERVER_ENV_KEYS.reduce(
    (acc, key) => {
      acc[key] = Boolean(process.env[key]);
      return acc;
    },
    {} as RuntimeEnvReport["required"],
  );

  const optional = OPTIONAL_SERVER_ENV_KEYS.reduce(
    (acc, key) => {
      acc[key] = Boolean(process.env[key]);
      return acc;
    },
    {} as RuntimeEnvReport["optional"],
  );

  const missingRequired = REQUIRED_SERVER_ENV_KEYS.filter(
    (key) => !process.env[key],
  );

  return {
    ready: missingRequired.length === 0,
    required,
    optional,
    missingRequired: [...missingRequired],
  };
}
