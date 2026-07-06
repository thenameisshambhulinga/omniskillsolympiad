export const USER_ROLES = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isAdmin(role?: string | null) {
  return role === USER_ROLES.ADMIN;
}

export function isStudent(role?: string | null) {
  return role === USER_ROLES.STUDENT;
}
