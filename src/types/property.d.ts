export type CreateProperty = {
  title: string;
  price: number;
  description?: string;
  status: "available" | "rented" | "sold";
  property_type_id: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  estate_id: number;
  owner_status?: boolean;
  landlord_name?: string;
  landlord_email?: string;
  tenant_status?: boolean;
  tenant_name?: string;
  tenant_email?: string;
};

export type LandlordInfo = {
  name: string;
  email: string;
};

export type TenantInfo = {
  name: string;
  email: string;
  status: "active" | "inactive";
};

export type CreatePropertyPayload = {
  status: string;
  message: string;
  landlord: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
  tenant: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
  property: {
    title: string;
    price: number;
    description?: string;
    status: "available" | "rented" | "sold";
    property_type_id: number;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    estate_id: number;
    owner_status?: boolean;
    landlord_name?: string;
    landlord_email?: string;
    tenant_status?: boolean;
    tenant_name?: string;
    tenant_email?: string;
  };
};

export interface Property {
  id: number;
  title: string;
  description: string;
  price: string; 
  status: "available" | "rented" | "sold"; 
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  estate_id: number;
  property_type_id: number;
  owner_id: number;
  user_id: number;
  features: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  landlord_name: string ;
  landlord_email: string;
  tenant_name: string;
  tenant_email: string;
}
