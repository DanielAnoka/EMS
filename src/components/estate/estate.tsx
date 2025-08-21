import { Building, Plus } from "lucide-react";
import React, { useState } from "react";
import Card from "../ui/card";
import SearchBar from "../ui/search";
import { useGetEstates } from "../../services/estates";
import AddEstateModal from "./AddEstateModal";
import { useCreateEstate } from "../../services/estates";
import { Toast } from "../ui/Toast";
import type { CreateEstate } from "../../types/estate";
import EstateTable from "./EstateTable";
import { TableSkeleton } from "../ui/TableSkeleton";
import type { Estates } from "../../types/estate";
import EstateLogin from "./EstateLogin";

const Estate: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: estatesData, isLoading } = useGetEstates();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { mutate: createEstate } = useCreateEstate();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });
    const [createdEstate, setCreatedEstate] = useState<Estates | null>(null);

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = (estate: CreateEstate) => {
    createEstate(estate, {
      onSuccess: (data) => {
        
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            label="Total Estates"
            value={estatesData?.length || 0}
            icon={Building}
          />
        </div>

        <SearchBar
          placeholder="Search Estates..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

          {/* Empty State */}
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
          <EstateTable estates={estatesData || []} />
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

    
    </>
  );
};

export default Estate;
