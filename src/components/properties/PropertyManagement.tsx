import { Building, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_NAME_BY_ID } from "../../types/auth";
import Card from "../ui/card";
import { useGetProperties } from "../../services/property";
import SearchBar from "../ui/search";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import AddProperty from "./AddProperty";
import { useCreateProperty } from "../../services/property";


const PropertyManagement = () => {
  const { user } = useAuth();
  const userRole = user ? ROLE_NAME_BY_ID[user.role_id] : null;
  const { data: propertiesData, isLoading } = useGetProperties();
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: createProperty } = useCreateProperty();
  

  const isSuperOrAdmin = userRole === "super_admin" || userRole === "admin";
  const isEstateAdmin = userRole === "estate_admin";

  // Filter based on role
  // const visibleProperties = isSuperOrAdmin
  //   ? propertiesData
  //   : isEstateAdmin
  //   ? propertiesData.filter((p) => p.estate_id === user?.id)
  //   : [];

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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"  onClick={() => setIsAddModalOpen(true)}>
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
              value={propertiesData?.length || 0}
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
      <AddProperty
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
       onAdd={() => {}}
      />
    </>
  );
};

export default PropertyManagement;
