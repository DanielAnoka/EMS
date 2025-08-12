
export type RoleId = 1 | 2 | 3 | 4;
export type UserRole = 'super_admin' | 'admin' | 'estate_admin' | 'tenant' | 'landlord' | 'caretaker' | 'agent';

export const ROLE_NAME_BY_ID: Record<RoleId, UserRole> = {
  1: 'super_admin',
  2: 'admin',
  3: 'estate_admin',
  4: 'tenant',
};
export type User = {
  id: number;
  role_id: RoleId;
  name: string;
  email: string;
  phone_number: number;
  created_at?: string;
  updated_at?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string; 
  user: User;
};
