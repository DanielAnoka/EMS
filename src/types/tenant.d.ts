export type TenantStatus = "active" | "inactive" | "pending" | "suspended";

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  user_id: number;
  estate_id: number;
  estate_property_id: number;
  status: TenantStatus;
}
