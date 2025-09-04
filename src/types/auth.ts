export interface LoginResponse {
  message: string;
  user: User;
  role: string[];
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  email_verified_at: string | null;
  created_at: string;
}
