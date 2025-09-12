

import { getDurationLabel, type Charge } from "../../types/charges";
import { formatNaira } from "../../utils";

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
                        {canPay && <th className="px-6 py-3 text-right">Action</th>}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {charges.map((charge, index) => {
                        const isActive = charge.status === 1;
                        return (
                            <tr key={charge.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                <td className="px-6 py-3">{charge.name}</td>
                                <td className="px-6 py-3">{formatNaira(charge.amount)}</td>
                                <td className="px-10 py-3">{getDurationLabel(charge.duration)}</td>
                                <td className="px-6 py-3">{renderStatus(charge.status)}</td>

                                {canPay && (
                                    <td className="px-6 py-3">
                                        <div className="flex justify-end">
                                            <button
                                                disabled={!isActive}
                                                onClick={() => onPay?.(charge)}
                                                className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium ${
                                                    isActive
                                                        ? "bg-blue-600 hover:bg-blue-700"
                                                        : "bg-gray-300 cursor-not-allowed"
                                                }`}
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
        </div>
    );
};

export default ChargesTable;
