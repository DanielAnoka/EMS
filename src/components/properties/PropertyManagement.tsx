/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Building, Plus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../hooks/useAuth";
import { useGetProperties, useCreateProperty } from "../../services/property";

import Card from "../ui/card";
import SearchBar from "../ui/search";
import { Skeleton } from "../ui/skeleton";
import AddProperty from "./AddProperty";
import LoginDetails from "./loginDetails";
import PropertyTable from "./table";
import { TableSkeleton } from "../ui/TableSkeleton";

import type {
  CreateProperty,
  CreatePropertyPayload,
} from "../../types/property";
import DetailsModal from "./DetailsModal";

const PropertyManagement = () => {
  const { user, role } = useAuth();

  const queryClient = useQueryClient();

  // API
  const { data: propertiesData, isLoading } = useGetProperties();

  const { mutate: createProperty } = useCreateProperty();

  // UI state
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createdProperty, setCreatedProperty] =
    useState<CreatePropertyPayload | null>(null);

  const roles = useMemo<string[]>(() => {
    if (!role) return [];
    return Array.isArray(role)
      ? role.map((r) => String(r).toLowerCase())
      : [String(role).toLowerCase()];
  }, [role]);

  const isSuperOrAdmin =
    roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");
  const isLandlord = roles.includes("landlord");

  // Safely read estate id from either shape
  const userEstateId =
    user?.user?.user_estate?.id ?? user?.user?.user_estate?.id ?? null;

  const userId = user?.user?.id ?? null;

  // Base list
  const allProperties = propertiesData ?? [];

  // Role-based visibility
  const visibleProperties = useMemo(() => {
    if (isSuperOrAdmin) return allProperties;

    if (isEstateAdmin && userEstateId) {
      return allProperties.filter((p) => p.estate_id === userEstateId);
    }

    if (isLandlord && userId) {
      return allProperties.filter((p) => p.owner_id === userId);
    }

    return [];
  }, [allProperties, isSuperOrAdmin, isEstateAdmin, userEstateId, isLandlord]);

  // (Optional) search filter — keeps your SearchBar wiring
  const searchLower = searchTerm.trim().toLowerCase();
  const filteredProperties = useMemo(() => {
    if (!searchLower) return visibleProperties;
    return visibleProperties.filter((p) => {
      const haystack = [p.title, p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchLower);
    });
  }, [visibleProperties, searchLower]);

  const handleSubmit = (property: CreateProperty) => {
    createProperty(property, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        setCreatedProperty(data);
        toast.success(`${property.title} created successfully!`);
        setIsAddModalOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast.error(
          `Failed to create property: ${err?.message ?? "Unknown error"}`
        );
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Property Management
            </h2>
            <p className="text-gray-600 mt-1">
              {isSuperOrAdmin && "Manage and monitor all properties"}
              {isEstateAdmin && "Manage and monitor all estate properties"}
              {isLandlord && "View your assigned properties"}
            </p>
          </div>

          {(isSuperOrAdmin || isEstateAdmin) && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </button>
          )}
        </div>

        {/* Cards */}
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
              value={filteredProperties.length}
              icon={Building}
            />
          )}
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Search Properties..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Table / Empty */}
      {!isLoading && filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Property found
          </h3>
          <p className="text-gray-600">
            {isSuperOrAdmin || isEstateAdmin
              ? "Try adjusting your search or filter criteria"
              : "No properties are assigned to your account"}
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton rows={8} showActions />
          ) : (
            <PropertyTable
              property={filteredProperties}
              onView={(propertiesData) => setSelectedPropertyId(propertiesData.id)}
              onEdit={() => {}}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <AddProperty
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSubmit}
      />

   {selectedPropertyId && (
      <DetailsModal
        isOpen={!!selectedPropertyId}
        onClose={() => setSelectedPropertyId(null)}
        propertyId={selectedPropertyId}
      />
   )}

      {createdProperty && (
        <LoginDetails
          isOpen={!!createdProperty}
          onClose={() => setCreatedProperty(null)}
          property={createdProperty}
        />
      )}
    </>
  );
};

export default PropertyManagement;
