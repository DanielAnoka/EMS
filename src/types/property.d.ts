export interface Property {
  id: number;
  estate_id: number;
  user_id: number;
  title: string;
  description: string;
  property_type_id: number;
  location: string | null;
  price: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  status: "available" | "sold" | "rented";
  features: string | null;
  created_at: string; 
  updated_at: string; 
}


export type CreateProperty = {
  id?: number;
  title: string;
  price: number;
  description: string;
  status: "available" | "sold" | "rented"; 
  property_type_id: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  estate_id: number;
};