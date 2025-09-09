/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../hooks/useAuth";
import { useGetCharges, useCreateCharge } from "../../services/charges";

import Card from "../ui/card";
import SearchBar from "../ui/search";
import { Skeleton } from "../ui/skeleton";
import AddCharges from "./AddCharges";
import ChargesTable from "./table";
import { TableSkeleton } from "../ui/TableSkeleton";

import type { Charge, CreateChargePayload } from "../../types/charges";
import { norm } from "../../utils";

const Charges = () => {
  const { user, role } = useAuth();
  
  const queryClient = useQueryClient();

  // API
  const { data: chargesData, isLoading } = useGetCharges();
  // console.log(chargesData);
  const { mutate: createCharges } = useCreateCharge();

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  
  const roles = useMemo<string[]>(() => {
    if (!role) return [];
    return Array.isArray(role)
      ? role.map((r) => String(r).toLowerCase())
      : [String(role).toLowerCase()];
  }, [role]);

  const isSuperOrAdmin =
    roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");

  
  const userEstateId =
    user?.user?.user_estate?.id ??
    user?.user?.user_estate?.id ?? 
    null;

  // Base list
  const allCharges: Charge[] = (chargesData ?? []) as Charge[];

  // Role-based visibility
  const visibleCharges: Charge[] = useMemo(() => {
    if (isSuperOrAdmin) return allCharges;

    if (isEstateAdmin && userEstateId) {
      return allCharges.filter((c) => c.estate_id === userEstateId);
    }

    // Other roles currently see nothing (adjust when needed)
    return [];
  }, [allCharges, isSuperOrAdmin, isEstateAdmin, userEstateId]);

  // Search (case/diacritic-insensitive via norm)
  const searchQ = norm(searchTerm);
  const filteredCharges: Charge[] = useMemo(() => {
    if (!searchQ) return visibleCharges;
    return visibleCharges.filter((c) => {
      const haystack = [c.name, String(c.amount), String(c.duration)]
        .filter(Boolean)
        .join(" ");
      return norm(haystack).includes(searchQ);
    });
  }, [visibleCharges, searchQ]);

  const handleSubmit = (payload: CreateChargePayload) => {
    createCharges(payload, {
      onSuccess: (created) => {
        queryClient.invalidateQueries({ queryKey: ["charges"] });
        toast.success(`${created.name} created successfully!`);
        setIsAddModalOpen(false);
      },
      onError: (err: unknown) => {
        console.error(err);
        toast.error("Failed to create charge.");
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Charge Management</h2>
            <p className="text-gray-600 mt-1">
              {isSuperOrAdmin && "Manage and monitor all charges"}
              {isEstateAdmin && "Manage and monitor your estate charges"}
              {!isSuperOrAdmin && !isEstateAdmin && "View charges (restricted access)"}
            </p>
          </div>

          {(isSuperOrAdmin || isEstateAdmin) && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Charges
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
            <Card label="Total Charges" value={filteredCharges.length} icon={CreditCard} />
          )}
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Search charges..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Table / Empty */}
      {!isLoading && filteredCharges.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Charge found</h3>
          <p className="text-gray-600">
            {isSuperOrAdmin || isEstateAdmin
              ? "Try adjusting your search or filter criteria"
              : "No charges are visible for your role"}
          </p>
          {isEstateAdmin && !userEstateId && (
            <p className="text-gray-500 mt-2">
              Your account isn’t linked to an estate. Contact an admin to assign an estate.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton rows={8} showActions />
          ) : (
            <ChargesTable charges={filteredCharges} />
          )}
        </div>
      )}

      {/* Modals */}
      <AddCharges
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSubmit}
      />
    </>
  );
};

export default Charges;
