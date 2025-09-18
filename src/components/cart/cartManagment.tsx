import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/useCart";
import { useState } from "react";
import CartModal from "./cartScreen";

const CartIcon = () => {
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-blue-600 text-white text-[10px] font-semibold border-2 border-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default CartIcon;