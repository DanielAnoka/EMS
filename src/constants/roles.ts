import type { Role } from "../services/auth";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  tenant: "Tenant",
  landlord: "Landlord",
  "estate admin": "Estate Admin",
  "super admin": "Super Admin",
};
