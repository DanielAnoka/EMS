import { createContext } from "react";
import type { Cart } from "../types/cart";
import type { Charge } from "../types/charges";

export interface CartContextValue {
  cart: Cart;
  addToCart: (charge: Charge) => void;
  removeFromCart: (chargeId: number) => void;
  updateQuantity: (chargeId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const CartContext = createContext<CartContextValue | null>(null);
