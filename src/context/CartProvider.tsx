import React, { useReducer, useMemo, useEffect } from "react";
import type { CartItem, Cart } from "../types/cart";
import type { Charge } from "../types/charges";
import { CartContext, type CartContextValue } from "./cart-context";

import { useAuth } from "../hooks/useAuth";

type CartAction =
  | { type: "ADD_TO_CART"; payload: Charge }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { chargeId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] }; // <-- new action

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
    case "HYDRATE":
      return Array.isArray(action.payload) ? action.payload : [];
    default:
      return state;
  }
}

const STORAGE_VERSION = "v1";
const storageKeyFor = (userId?: number | string) =>
  `cart:${STORAGE_VERSION}:${userId ?? "guest"}`;

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); 
  const userId = user?.user?.id ?? user?.id; 

  const [items, dispatch] = useReducer(cartReducer, []);

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKeyFor(userId));
      if (raw) {
        const data = JSON.parse(raw) as { items?: CartItem[] };
        if (Array.isArray(data?.items)) {
          dispatch({ type: "HYDRATE", payload: data.items });
        }
      } else {
     
        dispatch({ type: "HYDRATE", payload: [] });
      }
    } catch {
    
      dispatch({ type: "HYDRATE", payload: [] });
    }
  }, [userId]);

  // --- PERSIST to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKeyFor(userId),
        JSON.stringify({ items, updatedAt: new Date().toISOString() })
      );
    } catch {
      // storage might be full or blocked; ignore
    }
  }, [items, userId]);

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
