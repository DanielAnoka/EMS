import React from "react";
import { Mail, Edit, Eye } from "lucide-react";
import type { Role } from "../../services/auth";
import type { User } from "../../types/auth";

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  canEdit?: boolean;
  canView?: boolean;
}

// Role-based badge colors
const roleColors: Record<Role, string> = {
  admin: "bg-purple-100 text-purple-800",
  tenant: "bg-blue-100 text-blue-800",
  landlord: "bg-green-100 text-green-800",
  "estate admin": "bg-yellow-100 text-yellow-800",
  "super admin": "bg-red-100 text-red-800",
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onView,
  canEdit = true,
  canView = true,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Phone number</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {user.roles.length > 0 ? (
                    user.roles.map((r) => (
                      <span
                        key={r}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          roleColors[r as Role]
                        }`}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No Role</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </td>
                <td className="px-6 py-4 text-gray-500">
                 {user.phone_number || "N/A"}
                </td>
              <td className="px-6 py-4 text-right flex justify-end space-x-3">
                {canView && (
                  <button
                    onClick={() => onView?.(user)}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="View user"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => onEdit?.(user)}
                    className="text-gray-500 hover:text-green-600 transition"
                    title="Edit user"
                  >
                    <Edit className="w-5 h-5" />
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
