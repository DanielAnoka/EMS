export interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoadingCurrentUser: boolean;
  role: string | undefined;
}

export interface LoginResponse {
  message: string;
  user: User;
  role: string[];
  token: string;
}

export interface LoginPayload {
  email:string;
  password:string
}

type Pivot = {
  model_type: string;
  model_id: number;
  role_id: number;
};

type Role = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  estate: string | null;
  roles: string[];
};

type UserRes = {
  id: number;
  role_id: number | null;
  name: string;
  email: string;
  phone_number: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  user_estate: {
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

type TenantRes = {
  id: number;
  estate_id: number;
  estate_property_id: number;
  user_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  estate: {
    id: number;
    lga_id: number;
    name: string;
    description: string | null;
    owner: string;
    address: string;
    email: string;
    phone_number: string;
    status: 0 | 1;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: number;
  };
  estate_property: {
    id: number;
    estate_id: number;
    user_id: number;
    owner_id: number | null;
    title: string;
    description: string | null;
    property_type_id: number;
    location: string | null;
    price: string;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    status: "available" | string;
    features: unknown | null;
    created_at: string;
    updated_at: string;
  };
};

export type CurrentUser = {
  id: number;
  permissions: string[];
  user: UserRes;
  roles: string[];
  tenants: TenantRes[];
};

export type UserRole = "Admin" | "SuperAdmin" | "EstateAdmin" | "Tenant";

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
}
