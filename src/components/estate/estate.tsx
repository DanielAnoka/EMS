import { Building, Plus, UserCheck, UserX } from "lucide-react";
import React, { useState } from "react";
import Card from "../ui/card";
import SearchBar from "../ui/search";
import { useGetEstates } from "../../services/estates";
import AddEstateModal from "./AddEstateModal";
import { useCreateEstate } from "../../services/estates";
import { Toast } from "../ui/Toast";
import type { CreateEstate, CreateEstatePayload } from "../../types/estate";
import EstateTable from "./EstateTable";
import { TableSkeleton } from "../ui/TableSkeleton";
import type { Estates } from "../../types/estate";
import EstateLogin from "./EstateLogin";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import EstateDetails from "./EstateDetails";
import { Skeleton } from "../ui/skeleton";

const Estate: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: estatesData, isLoading } = useGetEstates();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { mutate: createEstate } = useCreateEstate();
  const { user } = useAuth();
  const [selectedEstateId, setSelectedEstateId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [createdEstate, setCreatedEstate] =
    useState<CreateEstatePayload | null>(null);

  const activeCount =
    estatesData?.filter((estate: Estates) => estate.status === 1).length || 0;
  const inactiveCount =
    estatesData?.filter((estate: Estates) => estate.status === null).length ||
    0;

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = (estate: CreateEstate) => {
    createEstate(estate, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["estates"] });
        setCreatedEstate(data);
        setToast({
          message: `${estate.name} created successfully!`,
          type: "success",
          isVisible: true,
        });
      },
      onError: () => {
        setToast({
          message: `Failed to create estate`,
          type: "error",
          isVisible: true,
        });
      },
    });
  };

  const filteredEstates: Estates[] =
    estatesData?.filter((estate: Estates) => {
      const term = searchTerm.toLowerCase();
      return (
        estate.name.toLowerCase().includes(term) ||
        estate.owner.toLowerCase().includes(term) ||
        estate.address.toLowerCase().includes(term) ||
        estate.email.toLowerCase().includes(term) ||
        estate.phone_number.toLowerCase().includes(term)
      );
    }) || [];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Estate Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and monitor all estates in the system
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Estate
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full bg-slate-600" />
              <Skeleton className="h-16 w-full bg-slate-600" />
              <Skeleton className="h-16 w-full bg-slate-600" />
            </>
          ) : (
            <>
              <Card
                label="Total Estates"
                value={estatesData?.length || 0}
                icon={Building}
              />
              <Card
                label="Active Estates"
                icon={UserCheck}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                value={activeCount}
              />
              <Card
                label="Inactive Estates"
                icon={UserX}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                value={inactiveCount}
              />
            </>
          )}
        </div>

        <SearchBar
          placeholder="Search Estates..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {!isLoading && filteredEstates?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No estates found
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
          <EstateTable
            estates={estatesData || []}
            canDelete={user?.role_id === 1}
            onView={(estate) => setSelectedEstateId(String(estate.id))}
          />
        )}
      </div>

      <AddEstateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSubmit}
      />

      {createdEstate && (
        <EstateLogin
          isOpen={!!createdEstate}
          onClose={() => setCreatedEstate(null)}
          estate={createdEstate}
        />
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
      {selectedEstateId && (
        <EstateDetails
          isOpen={!!selectedEstateId}
          onClose={() => setSelectedEstateId(null)}
          estateId={selectedEstateId}
        />
      )}
    </>
  );
};

export default Estate;
