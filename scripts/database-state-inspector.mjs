import process from "node:process";
import nextEnv from "@next/env";
import pg from "pg";

const { loadEnvConfig } = nextEnv;
const { Client } = pg;
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const connectionString =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!connectionString) {
  console.error("DIRECT_URL or DATABASE_URL is required.");
  process.exit(1);
}

const requiredTables = ["User", "Account", "Session", "VerificationToken"];
const requiredColumns = {
  User: [
    "id",
    "email",
    "fullName",
    "image",
    "role",
    "isOnboarded",
    "skills",
    "careerInterests",
  ],
  Account: ["id", "userId", "provider", "providerAccountId"],
  Session: ["id", "sessionToken", "userId", "expires"],
  VerificationToken: ["identifier", "token", "expires"],
};

const client = new Client({
  connectionString,
  statement_timeout: 10_000,
  query_timeout: 12_000,
  application_name: "oso-phase1-readonly-inspector",
});

try {
  await client.connect();
  await client.query("BEGIN READ ONLY");

  const tablesResult = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);

  const tables = new Set(tablesResult.rows.map((row) => row.table_name));
  const missingTables = requiredTables.filter((table) => !tables.has(table));
  const missingColumns = [];

  for (const [table, columns] of Object.entries(requiredColumns)) {
    if (!tables.has(table)) continue;

    const result = await client.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1`,
      [table],
    );

    const available = new Set(result.rows.map((row) => row.column_name));
    for (const column of columns) {
      if (!available.has(column)) missingColumns.push(`${table}.${column}`);
    }
  }

  let duplicateNormalizedEmails = 0;
  let orphanAccounts = 0;

  if (tables.has("User")) {
    const duplicateResult = await client.query(`
      SELECT COUNT(*)::int AS count
      FROM (
        SELECT lower(email)
        FROM "User"
        GROUP BY lower(email)
        HAVING COUNT(*) > 1
      ) duplicates
    `);
    duplicateNormalizedEmails = duplicateResult.rows[0]?.count ?? 0;
  }

  if (tables.has("Account") && tables.has("User")) {
    const orphanResult = await client.query(`
      SELECT COUNT(*)::int AS count
      FROM "Account" account
      LEFT JOIN "User" app_user ON app_user.id = account."userId"
      WHERE app_user.id IS NULL
    `);
    orphanAccounts = orphanResult.rows[0]?.count ?? 0;
  }

  const migrationTablePresent = tables.has("_prisma_migrations");
  const ready =
    missingTables.length === 0 &&
    missingColumns.length === 0 &&
    duplicateNormalizedEmails === 0 &&
    orphanAccounts === 0;

  console.log(
    JSON.stringify(
      {
        ready,
        authTablesPresent: missingTables.length === 0,
        prismaMigrationHistoryPresent: migrationTablePresent,
        missingTables,
        missingColumns,
        duplicateNormalizedEmailGroups: duplicateNormalizedEmails,
        orphanAccounts,
        note: migrationTablePresent
          ? "Prisma migration history exists."
          : "No Prisma migration history was found; create a reviewed baseline before production deployment.",
      },
      null,
      2,
    ),
  );

  await client.query("ROLLBACK");
  process.exitCode = ready ? 0 : 1;
} catch (error) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // Connection may already be closed.
  }

  console.error("DATABASE STATE INSPECTION FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}
