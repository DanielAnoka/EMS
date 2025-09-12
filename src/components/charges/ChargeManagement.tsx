import { CreditCard, Plus } from "lucide-react";
import {
  useGetCharges,
  useCreateCharge,
  useGetChargesbyEstateId,
} from "../../services/charges";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import SearchBar from "../ui/search";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import ChargesTable from "./table";
import type { Charge, CreateChargePayload } from "../../types/charges";
import { TableSkeleton } from "../ui/TableSkeleton";
import AddCharges from "./AddCharges";
import { norm } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreatePayment } from "../../services/payments";
import PayCharges from "./PayCharges";

const Charges = () => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const userRole = role ?? null;

  const enableStatistics = userRole === "super admin" || userRole === "admin";
  const enableCharge =
    userRole === "estate admin" ||
    userRole === "tenant" ||
    userRole === "landlord";

  const { mutate: createCharges } = useCreateCharge();
  const { data: charges = [], isLoading } = useGetCharges({
    enabled: enableStatistics,
  });

  let estateId;
  if (userRole === "estate admin") {
    estateId = user?.user?.user_estate?.id ?? 0;
  }
  if (userRole === "tenant") {
    estateId = user?.tenants[0]?.estate?.id ?? 0;
  }

  const { data: chargesByEstateId = [], isLoading: isLoadingByEstateId } =
    useGetChargesbyEstateId(estateId ?? 0, { enabled: enableCharge });

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);

  const roles = useMemo<string[]>(
    () =>
      Array.isArray(role)
        ? role.map((r) => String(r).toLowerCase())
        : role
        ? [String(role).toLowerCase()]
        : [],
    [role]
  );

  const isSuperOrAdmin =
    roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");
   const isTenant = roles.includes("tenant");

  // ✅ Role-based visibility
  const visibleCharges: Charge[] = useMemo(() => {
    if (!userRole) return [];
    if (userRole === "super admin" || userRole === "admin") return charges;
    if (
      userRole === "estate admin" ||
      userRole === "tenant" ||
      userRole === "landlord"
    )
      return chargesByEstateId;
    return [];
  }, [userRole, charges, chargesByEstateId]);

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
        const eid =
          user?.tenants?.at(0)?.estate?.id ?? user?.user?.user_estate?.id ?? 0;

        if (eid) {
          queryClient.setQueryData<Charge[]>(
            ["charges:by-estate", eid],
            (prev = []) => [created, ...prev]
          );
          queryClient.invalidateQueries({
            queryKey: ["charges:by-estate", eid],
          });
        }
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

  const { mutate: createPayment,  } = useCreatePayment();

  const openPayModal = (charge: Charge) => {
    setSelectedCharge(charge);
    setIsPayOpen(true);
  };

  const handlePaySubmit = (payload: {
    phone_number: string;
    charge_id: number;
    estate_property_id: number;
    tenant_id: number;
    amount: number;
    estate_id:number;
  }) => {
    createPayment(payload, {
      onSuccess: () => {
        toast.success("Payment initialized successfully.");
        setIsPayOpen(false);
        setSelectedCharge(null);
        // If your payments affect any list, invalidate here
        // queryClient.invalidateQueries({ queryKey: ["payments", tenantId] });
      },
      onError: (err: unknown) => {
        console.error(err);
        toast.error("Failed to initialize payment.");
      },
    });
  };
  const isBusy =
    isLoading || // global/all charges
    isLoadingByEstateId; // estate-scoped fetch

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

          {(isSuperOrAdmin || isEstateAdmin) && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
              onClick={() => setIsAddModalOpen(true)}
            >
              {" "}
              <Plus className="w-4 h-4 mr-2" /> Add Charges{" "}
            </button>
          )}
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading || isLoadingByEstateId ? (
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
        {!isBusy && filteredCharges.length === 0 ? (
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
            {isLoading || isLoadingByEstateId ? (
              <TableSkeleton rows={8} showActions />
            ) : (
              <ChargesTable
                charges={filteredCharges}
                canPay={isTenant}
                onPay={openPayModal}
              />
            )}
          </div>
        )}
      </div>

      {/* Add Charges modal */}
      <AddCharges
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSubmit}
      />
      <PayCharges
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        onAdd={handlePaySubmit}
        charge={selectedCharge}
      />
    </>
  );
};

export default Charges;
