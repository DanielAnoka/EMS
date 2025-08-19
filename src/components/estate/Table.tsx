import type { Estate } from "../../types/estate";
import { Eye, Power } from "lucide-react";

interface EstateTableProps {
  estates: Estate[];
  onView: (estate: Estate) => void;
  onToggleStatus?: (estateId: string) => void;
}

const EstateTable: React.FC<EstateTableProps> = ({
  estates,
  onView,
  onToggleStatus,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Owner</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
          <tbody className="divide-y divide-gray-200">
          {estates.map((estate, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {/* Name */}
              <td className="px-6 py-4 font-medium text-gray-900">
                {estate.name}
              </td>

              {/* Owner */}
              <td className="px-6 py-4">{estate.owner}</td>

              {/* Phone */}
              <td className="px-6 py-4">{estate.phone_number}</td>

              {/* Address */}
              <td className="px-6 py-4">{estate.address}</td>

              {/* Email */}
              <td className="px-6 py-4">{estate.email}</td>

              {/* Actions */}
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onView(estate)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors duration-150 inline-flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>

                {onToggleStatus && (
                  <button
                    onClick={() => onToggleStatus((estate as any).id)} 
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors duration-150 inline-flex items-center"
                  >
                    <Power className="w-4 h-4 mr-1" />
                    Toggle
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstateTable;
