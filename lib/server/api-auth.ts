import { getServerSession } from "next-auth";
import type { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/server/api-response";

export type ApiDbUser = {
  id: string;
  email: string;
  role: string;
  isOnboarded: boolean;
  streak: number;
  siliconPoints: number;
  seasonProgress: {
    id: string;
    eliminated: boolean;
    championBlocked: boolean;
  } | null;
};

type ApiAuthResult<TUser> =
  | {
      user: TUser;
      response: null;
    }
  | {
      user: null;
      response: NextResponse;
    };

export async function requireApiUser(): Promise<ApiAuthResult<ApiDbUser>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      user: null,
      response: apiError("Unauthorized.", 401, "UNAUTHORIZED"),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isOnboarded: true,
      streak: true,
      siliconPoints: true,
      seasonProgress: {
        select: {
          id: true,
          eliminated: true,
          championBlocked: true,
        },
      },
    },
  });

  if (!user) {
    return {
      user: null,
      response: apiError("User not found.", 404, "USER_NOT_FOUND"),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function requireApiAdmin(): Promise<ApiAuthResult<ApiDbUser>> {
  const result = await requireApiUser();

  if (result.response) {
    return result;
  }

  if (result.user.role !== "ADMIN") {
    return {
      user: null,
      response: apiError("Admin access required.", 403, "ADMIN_REQUIRED"),
    };
  }

  return result;
}

export async function requireApiOnboardedUser(): Promise<
  ApiAuthResult<ApiDbUser>
> {
  const result = await requireApiUser();

  if (result.response) {
    return result;
  }

  if (!result.user.isOnboarded) {
    return {
      user: null,
      response: apiError("Onboarding required.", 403, "ONBOARDING_REQUIRED"),
    };
  }

  return result;
}