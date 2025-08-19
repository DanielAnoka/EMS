import { Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_NAME_BY_ID } from "../../types/auth";

const PropertyManagement = () => {
  const { user } = useAuth();
  const userRole = user ? ROLE_NAME_BY_ID[user.role_id] : null;

    const isSuperOrAdmin =
    userRole === "super_admin" || userRole === "admin";
  const isEstateAdmin = userRole === "estate_admin";
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Property Management
          </h2>
          <p className="text-gray-600 mt-1">
            {isSuperOrAdmin &&
              "Manage and monitor all properties"}
            {isEstateAdmin &&
              "Manage and monitor all estate properties"}
          </p>
        </div>
          <button
            // onClick={() => setIsAddWizardOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </button>
      
      </div>
    </div>
  );
};

export default PropertyManagement;
