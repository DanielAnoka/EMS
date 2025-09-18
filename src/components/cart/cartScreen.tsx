import { X, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatNaira } from "../../utils";
import { useState } from "react";
// import PaystackPayment from "./PaystackPayment";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    setIsPaymentOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Shopping Cart ({cart.items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {cart.items.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">🛒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600">
                  Add some charges to get started
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.charge.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatNaira(item.charge.amount)} each
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.charge.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.charge.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.charge.id)}
                        className="p-1 text-red-400 hover:text-red-600 rounded ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total: {formatNaira(cart.total)}
                </span>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* {isPaymentOpen && (
        <PaystackPayment
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          cartItems={cart.items}
          total={cart.total}
          onPaymentSuccess={() => {
            clearCart();
            setIsPaymentOpen(false);
            onClose();
          }}
        />
      )} */}
    </>
  );
};

export default CartModal;