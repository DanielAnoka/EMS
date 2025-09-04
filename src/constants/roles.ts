import { type Role } from "../types/auth";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  tenant: "Tenant",
  landlord: "Landlord",
  "estate admin": "Estate Admin",
  "super admin": "Super Admin",
};
