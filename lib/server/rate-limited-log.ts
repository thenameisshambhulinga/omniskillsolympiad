const lastLoggedAt = new Map<string, number>();

export function logInfrastructureWarning(
  key: string,
  message: string,
  meta?: Record<string, unknown>,
  cooldownMs = 60_000,
) {
  const now = Date.now();
  const last = lastLoggedAt.get(key) ?? 0;

  if (now - last < cooldownMs) {
    return;
  }

  lastLoggedAt.set(key, now);
  console.warn(message, meta ?? {});
}
