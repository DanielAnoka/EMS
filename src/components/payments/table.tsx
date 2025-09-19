import { useState, useMemo } from "react";
import type { Payment } from "../../types/payment";
import Pagination from "../ui/Pagination";

interface PaymentProps {
  payment: Payment[];
}

const PaymentTable = ({ payment }: PaymentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(payment.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginated = useMemo(
    () => payment.slice(startIndex, startIndex + itemsPerPage),
    [payment, startIndex, itemsPerPage]
  );

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Invoice #</th>
            <th className="px-6 py-3">Amount (₦)</th>
            <th className="px-6 py-3">Method</th>
            <th className="px-6 py-3">Reference</th>
            <th className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginated.map((p, index) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {p.invoice_number}
              </td>
              <td className="px-6 py-4">₦{p.amount.toLocaleString()}</td>
              <td className="px-6 py-4">{p.payment_method}</td>
              <td className="px-6 py-4">{p.transaction_reference}</td>
              <td className="px-6 py-4">
                {new Date(p.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showWhenSinglePage
      />
    </div>
  );
};

export default PaymentTable;
