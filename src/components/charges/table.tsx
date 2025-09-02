import { getDurationLabel, type Charge } from "../../types/charges";
import { formatNaira,formatDate } from "../../utils";

interface ChargesTableProps {
  charges: Charge[];
  onEdit?: (charge: Charge) => void;
  onView?: (charge: Charge) => void;
  onDelete?: (charge: Charge) => void;
  onToggleStatus?: (charge: Charge) => void;
  canEdit?: boolean;
  canView?: boolean;
  canDelete?: boolean;
}



// if status is 1 => Active, 0 => Inactive (adjust if your API differs)
const renderStatus = (status: number) => {
  const isActive = status === 1;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

const ChargesTable = ({
  charges,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  canEdit,
  canView,
  canDelete,
}: ChargesTableProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Duration (mo)</th>
            <th className="px-6 py-3">Created</th>
            <th className="px-6 py-3">Status</th>
            
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {charges.map((charge, index) => (
            <tr key={charge.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {index + 1}
              </td>

              <td className="px-6 py-3">{charge.name}</td>

              <td className="px-6 py-3 ">{formatNaira(charge.amount)}</td>

              <td className="px-10 py-3 ">{getDurationLabel(charge.duration)}</td>

              <td className="px-6 py-4 text-gray-500">
                {formatDate(charge.created_at)}
              </td>

              <td className="px-6 py-3">{renderStatus(charge.status)}</td>

              {/* <td className="px-6 py-3 space-x-3">
                {canEdit && (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onEdit?.(charge)}
                  >
                    Edit
                  </button>
                )}
                {canView && (
                  <button
                    className="text-gray-700 hover:underline"
                    onClick={() => onView?.(charge)}
                  >
                    View
                  </button>
                )}
                {canDelete && (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onDelete?.(charge)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="text-indigo-600 hover:underline"
                  onClick={() => onToggleStatus?.(charge)}
                >
                  Toggle Status
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChargesTable;
