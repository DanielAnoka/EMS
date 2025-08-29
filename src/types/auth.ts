
export type RoleId = 1 | 2 | 3 | 4 | 5;
export type UserRole =
  | "super_admin"
  | "admin"
  | "estate_admin"
  | "tenant"
  | "landlord";

export const ROLE_NAME_BY_ID: Record<RoleId, UserRole> = {
  1: "super_admin",
  2: "admin",
  3: "estate_admin",
  4: "tenant",
  5: "landlord",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",          
  estate_admin: "Estate Admin", 
  tenant: "Tenant",
  landlord: "Landlord",
};

export const ROLE_ID_BY_NAME: Record<UserRole, RoleId> = {
  super_admin: 1,
  admin: 2,          
  estate_admin: 3,   
  tenant: 4,
  landlord: 5,
};

export type User = {
  id: number;
  role_id: RoleId;
  name: string;
  email: string;
  phone_number: number;
  created_at?: string;
  updated_at?: string;
   role: string[];   
  user_estate?: {
    id: number;
    lga_id: number;
    name: string;
    description: string | null;
    owner: string;
    address: string;
    email: string;
    phone_number: string;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: number;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string; 
  user: User;
};


export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role_id: RoleId;
};

