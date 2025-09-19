import { getDurationLabel, type Charge } from "../../types/charges";
import { formatNaira } from "../../utils";
import { useCart } from "../../context/useCart";
import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import Pagination from "../ui/Pagination";

interface ChargesTableProps {
  charges: Charge[];
  canPay?: boolean;
  onPay?: (charge: Charge) => void;
}

const renderStatus = (status: number) => {
  const isActive = status === 1;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

const ChargesTable = ({ charges, canPay = false, onPay }: ChargesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { addToCart } = useCart();

  const totalPages = Math.max(1, Math.ceil(charges.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginated = useMemo(
    () => charges.slice(startIndex, startIndex + itemsPerPage),
    [charges, startIndex, itemsPerPage]
  );

  const handleAddToCart = (charge: Charge) => {
    addToCart(charge);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Duration (mo)</th>
            <th className="px-6 py-3">Status</th>
            {canPay && <th className="px-6 py-3 text-right">Actions</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {paginated.map((charge, idx) => {
            const isActive = charge.status === 1;
            const sn = startIndex + idx + 1;

            return (
              <tr key={charge.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{sn}</td>
                <td className="px-6 py-3">{charge.name}</td>
                <td className="px-6 py-3">{formatNaira(charge.amount)}</td>
                <td className="px-10 py-3">{getDurationLabel(charge.duration)}</td>
                <td className="px-6 py-3">{renderStatus(charge.status)}</td>

                {canPay && (
                  <td className="px-6 py-3">
                    <div className="flex justify-end space-x-2">
                      <button
                        disabled={!isActive}
                        onClick={() => handleAddToCart(charge)}
                        className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center ${
                          isActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                        }`}
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Cart
                      </button>
                      <button
                        disabled={!isActive}
                        onClick={() => onPay?.(charge)}
                        className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium ${
                          isActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                        }`}
                        title="Pay now"
                      >
                        Pay
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Reusable Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showWhenSinglePage
      />
    </div>
  );
};

export default ChargesTable;
