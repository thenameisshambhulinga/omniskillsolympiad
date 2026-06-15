type LoginUserState = {
  role: string | null;
  isOnboarded: boolean | null;
};

export function getPostLoginRedirect(user: LoginUserState | null) {
  if (!user) {
    return "/login";
  }

  if (user.role === "ADMIN") {
    return "/admin";
  }

  if (user.isOnboarded) {
    return "/";
  }

  return "/onboarding";
}