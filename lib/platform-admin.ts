export const PLATFORM_ADMIN_EMAIL = "dinhkhanhmg05@gmail.com";
export type PlatformRole = "STUDENT" | "TEACHER" | "ADMIN";

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === PLATFORM_ADMIN_EMAIL;
}

export function getPlatformRole(
  email: string | null | undefined,
  requestedRole: unknown
): PlatformRole {
  if (isPlatformAdminEmail(email)) {
    return "ADMIN";
  }

  if (
    requestedRole === "STUDENT" ||
    requestedRole === "TEACHER" ||
    requestedRole === "ADMIN"
  ) {
    return requestedRole;
  }

  return "STUDENT";
}
