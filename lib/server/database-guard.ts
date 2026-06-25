export function isDatabaseConnectivityError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  const name = getErrorName(error).toLowerCase();

  return (
    name.includes("prismaclientinitializationerror") ||
    name.includes("prismaclientknownrequesterror") ||
    message.includes("can't reach database server") ||
    message.includes("cannot reach database server") ||
    message.includes("database server") ||
    message.includes("p1001") ||
    message.includes("connection refused") ||
    message.includes("connection terminated") ||
    message.includes("connection timeout") ||
    message.includes("server closed the connection") ||
    message.includes("timed out") ||
    message.includes("connect etimedout") ||
    message.includes("connect econnrefused") ||
    message.includes("connection reset") ||
    message.includes("socket timeout")
  );
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function getErrorName(error: unknown) {
  if (error instanceof Error) {
    return error.name;
  }

  return "";
}

export async function withDatabaseFallback<T>({
  label,
  action,
  fallback,
}: {
  label: string;
  action: () => Promise<T>;
  fallback: T;
}) {
  try {
    return await action();
  } catch (error) {
    if (isDatabaseConnectivityError(error)) {
      console.error(`[DATABASE OFFLINE] ${label}:`, error);
      return fallback;
    }

    throw error;
  }
}

export async function withDatabaseResult<T>({
  label,
  action,
}: {
  label: string;
  action: () => Promise<T>;
}): Promise<
  | {
      ok: true;
      data: T;
      error: null;
    }
  | {
      ok: false;
      data: null;
      error: string;
      reason: "database-unavailable" | "unknown";
    }
> {
  try {
    const data = await action();

    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    const message = getErrorMessage(error);

    if (isDatabaseConnectivityError(error)) {
      console.error(`[DATABASE OFFLINE] ${label}:`, error);

      return {
        ok: false,
        data: null,
        error: message,
        reason: "database-unavailable",
      };
    }

    console.error(`[DATABASE UNKNOWN ERROR] ${label}:`, error);

    return {
      ok: false,
      data: null,
      error: message,
      reason: "unknown",
    };
  }
}
