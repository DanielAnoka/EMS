import { Edit, Eye, Trash } from "lucide-react";
import type { Property } from "../../types/property";

interface PropertyTableProps {
  property: Property[];
  onEdit?: (estate: Property) => void;
  onView?: (estate: Property) => void;
  onDelete?: (estate: Property) => void;
  onToggleStatus?: (estate: Property) => void;
  canEdit?: boolean;
  canView?: boolean;
  canDelete?: boolean;
}

const PropertyTable = ({
  property,
  onEdit,
  onView,
  onDelete,

  canEdit = true,
  canView = true,
  canDelete = true,
}: PropertyTableProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Price</th>
            {/* <th className="px-6 py-3">Bedroom </th>
            <th className="px-6 py-3">Toilet</th> */}
            <th className="px-6 py-3">Created</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {property.map((prop, index) => (
            <tr key={prop.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-3">{prop.title}</td>
              <td className="px-6 py-3">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(Number(prop.price))}
              </td>

              {/* <td className="px-6 py-3">{prop.bedrooms}</td>
              <td className="px-6 py-3">{prop.toilets}</td> */}

              <td className="px-6 py-4 text-gray-500">
                {new Date(prop.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-3">
                {prop.status === "available" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                )}
                {prop.status === "rented" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Rented
                  </span>
                )}
                {prop.status === "sold" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Sold
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-right flex justify-end space-x-3">
                {canView && (
                  <button
                    onClick={() => onView?.(prop)}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="View estate"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => onEdit?.(prop)}
                    className="text-gray-500 hover:text-green-600 transition"
                    title="Edit estate"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete?.(prop)}
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Delete estate"
                  >
                    <Trash className="w-5 h-5" />
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

export default PropertyTable;
