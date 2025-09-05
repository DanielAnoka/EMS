import { Filter, Plus, Search, Users } from "lucide-react";
import Card from "../ui/card";
import { useGetUsers, useEditUser } from "../../services/users-service";
import { UserTable } from "./UserTable";
import { type User } from "../../types/auth";
import { ROLE_LABELS } from "../../constants/roles";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
import { TableSkeleton } from "../ui/TableSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import EditUserModal from "./UserEditModal";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import {
  useRegister,
  type RegisterPayload,
  type Role,
} from "../../services/auth";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const editUserMutation = useEditUser(String(selectedUser?.id || ""));

  const { data, isLoading } = useGetUsers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { mutateAsync: registerUser } = useRegister();
  

  const { role } = useAuth();

  const handleAddUser = async (
    user: Omit<RegisterPayload, "id" | "created_at">
  ) => {
    await registerUser(user);
  };

  const handleEditUser = (updatedUser: User) => {
    if (!selectedUser) return;

    editUserMutation.mutate(updatedUser, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(`user updated successfully!`);
        setIsEditOpen(false);
        setSelectedUser(null);
      },
      onError: () => {
        toast.error("Failed to update user.");
      },
    });
  };

  let filteredUsers: User[] = data ?? [];

  // Example restriction: admin cannot see super admin
  if (role === "admin") {
    filteredUsers = filteredUsers.filter(
      (u) => !u.roles.includes("super admin")
    );
  }

  // Search
  filteredUsers = filteredUsers.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Role filter
  if (filterRole !== "all") {
    filteredUsers = filteredUsers.filter((user: User) =>
      user.roles.includes(filterRole)
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              User Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage system users and their permissions
            </p>
          </div>
          {role !== "tenant" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full bg-slate-600" />
              <Skeleton className="h-16 w-full bg-slate-600" />
              <Skeleton className="h-16 w-full bg-slate-600" />
            </>
          ) : (
            <Card
              label="Total Users"
              value={filteredUsers.length || 0}
              icon={Users}
            />
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as Role | "all")}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton rows={8} showActions />
          ) : (
            filteredUsers.length > 0 && (
              <UserTable
                users={filteredUsers}
                canEdit
                onEdit={(user) => {
                  setSelectedUser(user);
                  setIsEditOpen(true);
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onEdit={handleEditUser}
        user={selectedUser as User}
        allowedRoles={[
          "super admin",
          "admin",
          "estate admin",
          "tenant",
          "landlord",
        ]}
      />
    </>
  );
};

export default UserManagement;
