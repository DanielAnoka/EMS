import React from "react";
import { ROLE_NAME_BY_ID, type User } from "../../types/auth";
import { Mail } from "lucide-react";

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  canEdit?: boolean;
}

const roleColors: Record<number, string> = {
  1: "bg-purple-100 text-purple-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-green-100 text-green-800",
  4: "bg-yellow-100 text-yellow-800",
  5: "bg-red-100 text-red-800",
};

export const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Email</th>

            <th className="px-6 py-3">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => {
            return (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.name}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      roleColors[user.role_id] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ROLE_NAME_BY_ID[user.role_id].replace("_", " ")}
                  </span>
                </td>

                <td className="px-6 py-4 flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.created_at || "").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
