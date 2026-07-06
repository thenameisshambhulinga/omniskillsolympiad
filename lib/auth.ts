import { PrismaAdapter } from "@auth/prisma-adapter";

import type { AuthOptions } from "next-auth";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

type DatabaseUser = {
  id: string;
  email: string;
  fullName: string | null;
  image: string | null;
  role: string;
};

type AdapterUserWithRole = AdapterUser & {
  role: string;
};

function mapUserToAdapterUser(user: DatabaseUser | null): AdapterUserWithRole | null {
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
  };
}

const baseAdapter = PrismaAdapter(prisma) as unknown as Adapter;

const customPrismaAdapter: Adapter = {
  ...baseAdapter,

  async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        fullName: user.name ?? null,
        image: user.image ?? null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        image: true,
        role: true,
      },
    });

    return mapUserToAdapterUser(createdUser)!;
  },

  async getUser(id: string): Promise<AdapterUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        image: true,
        role: true,
      },
    });

    return mapUserToAdapterUser(user);
  },

  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        image: true,
        role: true,
      },
    });

    return mapUserToAdapterUser(user);
  },

  async getUserByAccount({
    provider,
    providerAccountId,
  }: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<AdapterUser | null> {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            image: true,
            role: true,
          },
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
      data.email = user.email;
    }

    if ("name" in user) {
      data.fullName = user.name ?? null;
    }

    if ("image" in user) {
      data.image = user.image ?? null;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        image: true,
        role: true,
      },
    });

    return mapUserToAdapterUser(updatedUser)!;
  },
};

export const authOptions: AuthOptions = {
  adapter: customPrismaAdapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as AdapterUser & { role?: string }).role ?? "STUDENT";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string;
        };

        sessionUser.id = String(token.id ?? "");
        sessionUser.role = String(token.role ?? "STUDENT");
      }

      return session;
    },
  },
};