export type UserRole = "usuario" | "profissional" | "admin";

export function normalizeUserRole(role?: string): UserRole {
  const r = (role ?? "").toUpperCase();
  if (r === "USUARIO") return "usuario";
  if (r === "PROFISSIONAL") return "profissional";
  if (r === "ADMIN") return "admin";
  return "usuario";
}
