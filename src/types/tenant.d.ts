export interface TenantStatus {
  status: string;
  tenant: {
    user_id: number;
    estate_id: number;
    estate_property_id: number;
    created_at: string;
    created_by: number;
    updated_at: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  user_id: number;
  estate_id: number;
  estate_property_id: number;
  status: 0 | 1;
}

export type CreateTenantPayload = Omit<Tenant, "id">;
