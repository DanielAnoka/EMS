export type CreateEstate = {
  name: string;
  lga_id: number;
  owner: string;
  phone_number: string;
  address: string;
  email: string;
  status: number | null;
};

export type CreateEstatePayload = {
    status: string;
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
        password: string;
    }
}

export interface Estates {
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
}
