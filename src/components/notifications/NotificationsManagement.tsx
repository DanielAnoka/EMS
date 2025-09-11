import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddNotifications from "./AddNotifications";
import { useCreateNotification } from "../../services/notifications";
import type { CreateNotification } from "../../types/notifications";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import SearchBar from "../ui/search";
import { useGetNotifications } from "../../services/notifications";
import NotificationsTable from "./NotificationsView";

const NotificationsManagement = () => {
  const { role,user } = useAuth();
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: notifications = [], isLoading } = useGetNotifications();


  

  const { mutate: createNotification } = useCreateNotification();

  const handleCreateNotification = (payload: CreateNotification) => {
    createNotification(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.success("Notification created successfully!");
        setIsAddModalOpen(false);
      },
      onError: (err: unknown) => {
        console.error(err);
        toast.error("Failed to create notification.");
      },
    });
  };

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

  // Initialize estateId with a default value
  let estateId: number = 0;
  if (role === "estate admin") {
    estateId = user?.user?.user_estate?.id ?? 0;
  }
  if (role === "tenant") {
    estateId = user?.tenants?.[0]?.estate?.id ?? 0;
  }

  // Role-based visibility
  const visibleProperties = useMemo(()=>{
     if (isSuperOrAdmin) return notifications;
     if(isEstateAdmin || isUsers){
       return notifications.filter((n: { estate_id: number; }) => n.estate_id === estateId);
     }
  }, [isSuperOrAdmin, notifications, isEstateAdmin, isUsers, estateId]);

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
            {isEstateAdmin && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150"
                onClick={() => setIsAddModalOpen(true)}
              >
                Create Notification
              </button>
            )}
          </div>
        </div>
        <div className="!mb-5">
          <SearchBar
            placeholder="Search Notifications..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
     
      </div>

      <NotificationsTable
        notifications={visibleProperties}
        isLoading={isLoading}
        searchTerm={searchTerm}
        roles={roles}
      />

      <AddNotifications
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleCreateNotification}
      />
    </>
  );
};

export default NotificationsManagement;
