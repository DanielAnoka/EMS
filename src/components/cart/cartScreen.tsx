
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/useCart";
import { formatNaira } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PayCharges, { type CartItemMeta } from "../charges/PayCharges";
import { useCreatePayment } from "../../services/payments";
import { toast } from "sonner";
import type { CreatePaymentPayload } from "../../types/payment";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const [isPayOpen, setIsPayOpen] = useState(false);

  const { mutate: createPayment } = useCreatePayment();

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    setIsPayOpen(true);
  };

  const handleCartPaySubmit = (payload: CreatePaymentPayload) => {
    createPayment(payload, {
      onSuccess: () => {
        toast.success("Payment recorded successfully.");
        setIsPayOpen(false);
        clearCart();
      },
      onError: () => {
        toast.error("Failed to record payment.");
      },
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/charges");
  };

  const cartItemsMeta: CartItemMeta[] = cart.items.map((it) => ({
    charge_id: it.charge.id,
    name: it.charge.name,
    unit_amount: it.charge.amount,
    quantity: it.quantity,
  }));

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              aria-label="Go back"
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart ({cart.items.length})
            </h1>
          </div>

          {cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Content */}
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add some charges to get started.
            </p>
            <button
              onClick={() => navigate("/charges")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Browse Charges
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.charge.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatNaira(item.charge.amount)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.charge.id, item.quantity - 1)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700 rounded disabled:opacity-50"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.charge.id, item.quantity + 1)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700 rounded"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.charge.id)}
                      className="p-1 text-red-500 hover:text-red-700 rounded ml-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Items</span>
                <span>{cart.items.length}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>{formatNaira(cart.total)}</span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <PayCharges
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        onAdd={handleCartPaySubmit}
        charge={null}
        mode="cart"
        amountOverride={cart.total}
        cartItems={cartItemsMeta}
      />
    </>
  );
}
