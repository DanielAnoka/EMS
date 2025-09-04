import { Building, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/card";
import { useGetProperties, useCreateProperty } from "../../services/property";
import SearchBar from "../ui/search";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import AddProperty from "./AddProperty";
import type { CreateProperty, CreatePropertyPayload } from "../../types/property";
import { useQueryClient } from "@tanstack/react-query";
import LoginDetails from "./loginDetails";
import { Toast } from "../ui/Toast";
import PropertyTable from "./table";
import { TableSkeleton } from "../ui/TableSkeleton";

const PropertyManagement = () => {
  const { user } = useAuth();
  const { data: propertiesData, isLoading } = useGetProperties();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: createProperty } = useCreateProperty();
  const queryClient = useQueryClient();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // 🔑 role checks using Role[]
  const roles = user?.role ?? [];
  const isSuperOrAdmin = roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");
  const userEstateId = user?.user_estate?.id;

  // Filter based on estate id
  const visibleProperties = isSuperOrAdmin
    ? propertiesData ?? []
    : isEstateAdmin && userEstateId
    ? (propertiesData ?? []).filter((p) => p.estate_id === userEstateId)
    : [];

  const [createdProperty, setCreatedProperty] =
    useState<CreatePropertyPayload | null>(null);

  const handleSubmit = (property: CreateProperty) => {
    createProperty(property, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["properties"] });

        setCreatedProperty(data);
        setToast({
          message: `${property.title} created successfully!`,
          type: "success",
          isVisible: true,
        });
      },
      onError: (err) => {
        console.log(err.message);
        setToast({
          message: `Failed to create estate`,
          type: "error",
          isVisible: true,
        });
      },
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <div className="space-y-6">
        {/* header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Property Management
            </h2>
            <p className="text-gray-600 mt-1">
              {isSuperOrAdmin && "Manage and monitor all properties"}
              {isEstateAdmin && "Manage and monitor all estate properties"}
            </p>
          </div>
          {isEstateAdmin && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </button>
          )}
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full bg-slate-600" />
              <Skeleton className="h-16 w-full bg-slate-600" />
              <Skeleton className="h-16 w-full bg-slate-600" />
            </>
          ) : (
            <Card
              label="Total Properties"
              value={visibleProperties.length}
              icon={Building}
            />
          )}
        </div>

        <SearchBar
          placeholder="Search Estates..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {!isLoading && visibleProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Property found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton rows={8} showActions />
          ) : (
            <PropertyTable property={visibleProperties} />
          )}
        </div>
      )}

      <AddProperty
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSubmit}
      />

      {createdProperty && (
        <LoginDetails
          isOpen={!!createProperty}
          onClose={() => setCreatedProperty(null)}
          property={createdProperty}
        />
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default PropertyManagement;
