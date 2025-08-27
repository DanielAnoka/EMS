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
