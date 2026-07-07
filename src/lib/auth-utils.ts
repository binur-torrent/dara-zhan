import type { UserRole } from "@/types";

export function getDashboardPath(role: UserRole): string {
  return role === "nurse" ? "/dashboard/nurse" : "/dashboard/doctor";
}
