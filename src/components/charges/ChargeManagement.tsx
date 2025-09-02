import { CreditCard, Plus } from "lucide-react";
import { useGetCharges } from "../../services/charges";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import SearchBar from "../ui/search";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_NAME_BY_ID } from "../../types/auth";
import ChargesTable from "./table";
import type { Charge } from "../../types/charges";
import { TableSkeleton } from "../ui/TableSkeleton";
import AddCharges from "./AddCharges";
import { useCreateCharge } from "../../services/charges";
import { norm, statusText } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "../ui/Toast";

const Charges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: createCharges } = useCreateCharge();
  const userRole = user ? ROLE_NAME_BY_ID[user.role_id] : null;
  const { data: charges = [], isLoading } = useGetCharges();
  // console.log("charges", charges);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isSuperOrAdmin = userRole === "super_admin" || userRole === "admin";
  const isEstateAdmin = userRole === "estate_admin";
  const userEstateId = user?.user_estate?.id;
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Role-based visibility
  const visibleCharges: Charge[] = useMemo(() => {
    if (isSuperOrAdmin) return charges;
    if (isEstateAdmin)
      return charges.filter(
        (c: { estate_id: number | undefined }) => c.estate_id === userEstateId
      );
    return [];
  }, [isSuperOrAdmin, isEstateAdmin, charges, userEstateId]);

  // Search-aware filter
  const filteredCharges: Charge[] = useMemo(() => {
    const term = norm(searchTerm);
    if (!term) return visibleCharges;

    return visibleCharges.filter((c) => {
      const haystack = [
        c.name,
        c.amount,
        c.duration,
        c.estate_id,
        c.property_type_id,
        statusText(c.status),
      ]
        .map(norm)
        .join(" ");

      return haystack.includes(term);
    });
  }, [visibleCharges, searchTerm]);

  const handleSubmit = (charge: Charge) => {
    createCharges(charge, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["charges"] });

        setToast({
          message: `${charge.name} created successfully!`,
          type: "success",
          isVisible: true,
        });
      },
      onError: () => {
        setToast({
          message: `Failed to create charge`,
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
              Charge Management
            </h2>
            <p className="text-gray-600 mt-1">
              Create and manage service charges for residents
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Charges
          </button>
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
              label="Total Charges"
              value={visibleCharges.length}
              icon={CreditCard}
            />
          )}
        </div>

        {/* search */}
        <SearchBar
          placeholder="Search charges..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {/* empty state OR table */}
        {!isLoading && filteredCharges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Charge found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {isLoading ? (
              // <Skeleton className="h-40 w-full bg-slate-600" />
              <TableSkeleton rows={8} showActions />
            ) : (
              <ChargesTable charges={filteredCharges} />
            )}
          </div>
        )}
      </div>
      <AddCharges
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSubmit}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Charges;
