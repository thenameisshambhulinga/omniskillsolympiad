import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isOnboarded: boolean;
      authError?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    isOnboarded: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isOnboarded: boolean;
    roleCheckedAt: number;
    authError?: string;
  }
}
