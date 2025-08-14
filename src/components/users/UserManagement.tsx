import { Filter, Plus, Search, Users } from "lucide-react";
import Card from "../ui/card";
import { useGetUsers } from "../../services/users-service";
import { UserCard } from "./UserCard";
import { type User } from "../../types/auth";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
import { LoadingSpinner } from "../ui/Loaders";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const { data, isLoading } = useGetUsers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  let filteredUsers = data?.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterRole !== "all") {
    filteredUsers = filteredUsers?.filter(
      (user: User) => user.role_id === Number(filterRole)
    );
  }

  if (isLoading) return  <LoadingSpinner size="lg" color="blue" fullScreen />;

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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card label="Total Users" value={data?.length || 0} icon={Users} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">

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
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="1">Super Admin</option>
                <option value="2">Admin</option>
                <option value="3">Estate Admin</option>
                <option value="4">Tenant</option>
              </select>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 && (
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

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers?.map((user: User) => (
            <UserCard key={user.id} user={user} canEdit />
          ))}
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default UserManagement;
