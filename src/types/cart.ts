export interface CartItem {
  id: string;
  charge: {
    id: number;
    name: string;
    amount: number;
    duration: number;
    status: number;
  };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface PaystackPaymentData {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback_url?: string;
  metadata?: {
    charges: Array<{
      charge_id: number;
      amount: number;
      tenant_id: number;
      estate_property_id: number;
      estate_id: number;
    }>;
  };
}