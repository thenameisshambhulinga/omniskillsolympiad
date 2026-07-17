import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, type Account as DatabaseAccount } from "@prisma/client";

import type { AuthOptions } from "next-auth";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { getAuthRuntimeConfig } from "@/lib/server/auth-env";

const ROLE_REFRESH_INTERVAL_MS = 2 * 60 * 1000;
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

type DatabaseUser = {
  id: string;
  email: string;
  fullName: string | null;
  image: string | null;
  role: string;
  isOnboarded: boolean;
};

type AdapterUserWithRole = AdapterUser & {
  role: string;
  isOnboarded: boolean;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function mapUserToAdapterUser(
  user: DatabaseUser | null,
): AdapterUserWithRole | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    emailVerified: null,
    name: user.fullName,
    image: user.image,
    role: user.role,
    isOnboarded: user.isOnboarded,
  };
}

const userSelection = {
  id: true,
  email: true,
  fullName: true,
  image: true,
  role: true,
  isOnboarded: true,
} as const;

async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email: {
        equals: normalizeEmail(email),
        mode: "insensitive",
      },
    },
    select: userSelection,
  });
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function isAdapterAccountType(
  value: string,
): value is AdapterAccount["type"] {
  return value === "oauth" || value === "oidc" || value === "email";
}

function mapAccountToAdapterAccount(account: DatabaseAccount): AdapterAccount {
  const accountType = account.type;

  if (!isAdapterAccountType(accountType)) {
    throw new Error(
      `Unsupported OAuth account type stored in the database: ${accountType}`,
    );
  }

  return {
    userId: account.userId,
    type: accountType,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    refresh_token: account.refresh_token ?? undefined,
    access_token: account.access_token ?? undefined,
    expires_at: account.expires_at ?? undefined,
    token_type: account.token_type ?? undefined,
    scope: account.scope ?? undefined,
    id_token: account.id_token ?? undefined,
    session_state: account.session_state ?? undefined,
  };
}

const baseAdapter = PrismaAdapter(prisma);

const customPrismaAdapter: Adapter = {
  ...baseAdapter,

  async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    const email = normalizeEmail(user.email);
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return mapUserToAdapterUser(existingUser)!;
    }

    try {
      const createdUser = await prisma.user.create({
        data: {
          email,
          fullName: normalizeOptionalText(user.name),
          image: normalizeOptionalText(user.image),
          skills: [],
          careerInterests: [],
        },
        select: userSelection,
      });

      return mapUserToAdapterUser(createdUser)!;
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }

      const concurrentUser = await findUserByEmail(email);

      if (!concurrentUser) {
        throw error;
      }

      return mapUserToAdapterUser(concurrentUser)!;
    }
  },

  async getUser(id: string): Promise<AdapterUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelection,
    });

    return mapUserToAdapterUser(user);
  },

  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    return mapUserToAdapterUser(await findUserByEmail(email));
  },

  async getUserByAccount({
    provider,
    providerAccountId,
  }): Promise<AdapterUser | null> {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: {
          select: userSelection,
        },
      },
    });

    return mapUserToAdapterUser(account?.user ?? null);
  },

  async updateUser(
    user: Partial<AdapterUser> & Pick<AdapterUser, "id">,
  ): Promise<AdapterUser> {
    const data: {
      email?: string;
      fullName?: string | null;
      image?: string | null;
    } = {};

    if (typeof user.email === "string") {
      data.email = normalizeEmail(user.email);
    }

    if ("name" in user) {
      data.fullName = normalizeOptionalText(user.name);
    }

    if ("image" in user) {
      data.image = normalizeOptionalText(user.image);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      select: userSelection,
    });

    return mapUserToAdapterUser(updatedUser)!;
  },

  async deleteUser(id: string): Promise<AdapterUser | null> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: userSelection,
    });

    if (!existingUser) {
      return null;
    }

    await prisma.user.delete({ where: { id } });
    return mapUserToAdapterUser(existingUser);
  },

  async linkAccount(account: AdapterAccount): Promise<AdapterAccount> {
    const uniqueAccount = {
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    };

    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: uniqueAccount,
      },
    });

    if (existingAccount && existingAccount.userId !== account.userId) {
      throw new Error("OAuth account is already linked to another user.");
    }

    const tokenData = {
      type: account.type,
      refresh_token: account.refresh_token ?? null,
      access_token: account.access_token ?? null,
      expires_at: account.expires_at ?? null,
      token_type: account.token_type ?? null,
      scope: account.scope ?? null,
      id_token: account.id_token ?? null,
      session_state: account.session_state ?? null,
    };

    if (existingAccount) {
      const updatedAccount = await prisma.account.update({
        where: {
          provider_providerAccountId: uniqueAccount,
        },
        data: tokenData,
      });

      return mapAccountToAdapterAccount(updatedAccount);
    }

    const createdAccount = await prisma.account.create({
      data: {
        userId: account.userId,
        ...uniqueAccount,
        ...tokenData,
      },
    });

    return mapAccountToAdapterAccount(createdAccount);
  },

  async unlinkAccount({
    provider,
    providerAccountId,
  }): Promise<AdapterAccount | undefined> {
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });

    if (!existingAccount) {
      return undefined;
    }

    const deletedAccount = await prisma.account.delete({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });

    return mapAccountToAdapterAccount(deletedAccount);
  },
};

const authEnv = getAuthRuntimeConfig();

export const authOptions: AuthOptions = {
  adapter: customPrismaAdapter,

  providers: [
    GoogleProvider({
      clientId: authEnv.googleClientId,
      clientSecret: authEnv.googleClientSecret,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  secret: authEnv.secret,
  debug: false,
  useSecureCookies: process.env.NODE_ENV === "production",

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google" || !user.email) {
        return false;
      }

      const googleProfile = profile as
        | { email?: unknown; email_verified?: unknown }
        | undefined;

      const profileEmail =
        typeof googleProfile?.email === "string"
          ? normalizeEmail(googleProfile.email)
          : "";

      return (
        googleProfile?.email_verified === true &&
        profileEmail.length > 0 &&
        profileEmail === normalizeEmail(user.email)
      );
    },

    async jwt({ token, user, trigger }) {
      const now = Date.now();

      if (user) {
        token.id = user.id;
        token.role = user.role ?? "STUDENT";
        token.isOnboarded = user.isOnboarded ?? false;
        token.roleCheckedAt = now;
        token.authError = undefined;
      }

      const userId =
        typeof token.id === "string"
          ? token.id
          : typeof token.sub === "string"
            ? token.sub
            : "";

      const lastCheckedAt =
        typeof token.roleCheckedAt === "number" ? token.roleCheckedAt : 0;

      const shouldRefresh =
        Boolean(userId) &&
        (trigger === "update" || now - lastCheckedAt >= ROLE_REFRESH_INTERVAL_MS);

      if (!shouldRefresh) {
        return token;
      }

      try {
        const databaseUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            role: true,
            isOnboarded: true,
          },
        });

        if (!databaseUser) {
          token.authError = "USER_NOT_FOUND";
          token.role = "STUDENT";
          token.isOnboarded = false;
          token.roleCheckedAt = now;
          return token;
        }

        token.id = databaseUser.id;
        token.email = databaseUser.email;
        token.role = databaseUser.role;
        token.isOnboarded = databaseUser.isOnboarded;
        token.roleCheckedAt = now;
        token.authError = undefined;
      } catch (error) {
        console.error("AUTH_ROLE_REFRESH_FAILED", {
          code:
            error instanceof Prisma.PrismaClientKnownRequestError
              ? error.code
              : "UNKNOWN",
        });
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role =
          typeof token.role === "string" ? token.role : "STUDENT";
        session.user.isOnboarded = token.isOnboarded === true;
        session.user.authError =
          typeof token.authError === "string" ? token.authError : undefined;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString();
      }

      try {
        const destination = new URL(url);
        const application = new URL(baseUrl);

        return destination.origin === application.origin
          ? destination.toString()
          : application.toString();
      } catch {
        return baseUrl;
      }
    },
  },
};
