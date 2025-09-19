export type CreatePaymentPayload = {
  phone_number: string;
  charge_id: number;
  estate_property_id: number;
  tenant_id: number;
  estate_id:number;
  amount: number;
};

export interface Payment {
  id: number;
  tenant_id: number;
  estate_id: number;
  estate_property_id: number;
  charge_id: number;
  amount: number;
  payment_method: string;
  transaction_reference: string;
  invoice_number: string;
  payload: unknown | null;
  created_at: string; 
  updated_at: string;
}

