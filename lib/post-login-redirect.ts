import {
  buildOnboardingHref,
  DEFAULT_ADMIN_DESTINATION,
  DEFAULT_MEMBER_DESTINATION,
  sanitizeAdminDestination,
  sanitizeMemberDestination,
} from "@/lib/navigation/auth-destination";

type LoginUserState = {
  role: string | null;
  isOnboarded: boolean | null;
};

export function getPostLoginRedirect(
  user: LoginUserState,
  requestedDestination?: string | null,
) {
  const normalizedRole = String(user.role ?? "").toUpperCase();

  if (normalizedRole === "ADMIN") {
    return sanitizeAdminDestination(requestedDestination, {
      fallback: DEFAULT_ADMIN_DESTINATION,
    });
  }

  const memberDestination = sanitizeMemberDestination(
    requestedDestination,
    {
      fallback: DEFAULT_MEMBER_DESTINATION,
    },
  );

  if (!user.isOnboarded) {
    return buildOnboardingHref(memberDestination);
  }

  return memberDestination;
}
