import React, { useReducer, useMemo } from "react";
import type { CartItem, Cart } from "../types/cart";
import type { Charge } from "../types/charges";
import { CartContext, type CartContextValue } from "./cart-context";

type CartAction =
  | { type: "ADD_TO_CART"; payload: Charge }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { chargeId: number; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find(i => i.charge.id === action.payload.id);
      if (existing) {
        return state.map(i =>
          i.charge.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...state,
        {
          id: `${action.payload.id}-${Date.now()}`,
          charge: action.payload,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ];
    }
    case "REMOVE_FROM_CART":
      return state.filter(i => i.charge.id !== action.payload);
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return state.filter(i => i.charge.id !== action.payload.chargeId);
      }
      return state.map(i =>
        i.charge.id === action.payload.chargeId ? { ...i, quantity: action.payload.quantity } : i
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const cart = useMemo<Cart>(
    () => ({
      items,
      total: items.reduce((sum, it) => sum + it.charge.amount * it.quantity, 0),
    }),
    [items]
  );

  const value: CartContextValue = {
    cart,
    addToCart: (charge: Charge) => dispatch({ type: "ADD_TO_CART", payload: charge }),
    removeFromCart: (chargeId: number) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: chargeId }),
    updateQuantity: (chargeId: number, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { chargeId, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    getItemCount: () => items.reduce((sum, it) => sum + it.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
