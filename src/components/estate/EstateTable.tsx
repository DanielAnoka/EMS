import React from "react";
import type { Estates } from "../../types/estate";
import { Edit, Eye, Trash2 } from "lucide-react";

interface EstateTableProps {
  estates: Estates[];
  onEdit?: (estate: Estates) => void;
  onView?: (estate: Estates) => void;
  onDelete?: (estate: Estates) => void;
  onToggleStatus?: (estate: Estates) => void;
  canEdit?: boolean;
  canView?: boolean;
  canDelete?: boolean;
}

const EstateTable: React.FC<EstateTableProps> = ({
  estates,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  canEdit = true,
  canView = true,
  canDelete = true,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Owner</th>

            <th className="px-6 py-3">Created</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {estates.map((estate, index) => (
            <tr key={estate.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {index + 1}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900">
                {estate.name}
              </td>

              <td className="px-6 py-4">{estate.owner}</td>

              <td className="px-6 py-4 text-gray-500">
                {new Date(estate.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              {/* ✅ Status toggle */}
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleStatus?.(estate)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    estate.status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {estate.status === 1 ? "Active" : "Inactive"}
                </button>
              </td>

              {/* ✅ Actions */}
              <td className="px-6 py-4 text-right flex justify-end space-x-3">
                {canView && (
                  <button
                    onClick={() => onView?.(estate)}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="View estate"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => onEdit?.(estate)}
                    className="text-gray-500 hover:text-green-600 transition"
                    title="Edit estate"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete?.(estate)}
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Delete estate"
                  >
                    <Trash2 className="w-5 h-5" />
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
