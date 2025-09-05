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
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  estate: string | null;
  roles: string[];
};

export type CurrentUser = {
  id:number;
  user: UserRes;
  roles: string[];
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
