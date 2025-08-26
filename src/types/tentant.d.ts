export type TenantStatus = "active" | "inactive";

export interface TenantInfo {
  // id is optional when creating
  id?: number;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;

  // These can be optional on create, depending on your backend
  user_id?: number;
  estate_id?: number;
  estate_property_id?: number;

  status: TenantStatus; // e.g. "active"
}