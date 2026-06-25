import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function main() {
  const emails = getAdminEmails();

  if (emails.length === 0) {
    throw new Error("ADMIN_EMAILS is empty. Add one or more comma-separated admin emails first.");
  }

  const result = await prisma.user.updateMany({
    where: {
      email: {
        in: emails,
        mode: "insensitive",
      },
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`Promoted ${result.count} existing user(s) to ADMIN.`);

  if (result.count === 0) {
    console.log("No matching users found yet. Sign in once with the admin Google account, then run this again.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
