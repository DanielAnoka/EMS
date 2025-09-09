import { Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const TenantManagement = () => {
  const { user } = useAuth();
  console.log("user", user);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tenants</h2>
          <p className="text-gray-600 mt-1">
            Manage tenants in your properties
          </p>
        </div>
        <button
          //   onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </button>
      </div>
    </div>
  );
};

export default TenantManagement;
