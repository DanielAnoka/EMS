import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddNotifications from "./AddNotifications";

const NotificationsManagement = () => {
  const { role } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const roles = useMemo<string[]>(() => {
    if (!role) return [];
    return Array.isArray(role)
      ? role.map((r) => String(r).toLowerCase())
      : [String(role).toLowerCase()];
  }, [role]);
  const isSuperOrAdmin =
    roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");
  const isUsers = roles.includes("landlord") || roles.includes("tenant");

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600 mt-1">
              {isSuperOrAdmin && "Manage and monitor all notifications"}
              {isEstateAdmin && "Manage and monitor your estate notifications"}
              {isUsers && "Stay updated with important alerts and messages"}
            </p>
          </div>

          <div>
            {(isSuperOrAdmin || isEstateAdmin) && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150"
                onClick={() => setIsAddModalOpen(true)}
              >
                Create Notification
              </button>
            )}
          </div>
        </div>
      </div>

      <AddNotifications
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={()=>{}}
      />
    </>
  );
};

export default NotificationsManagement;
