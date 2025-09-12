import { CreditCard, Download } from "lucide-react";
import SearchBar from "../ui/search";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGetAllPayments,useGetEstatePayments,useGetTenantPayments } from "../../services/payments";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PaymentManagement = () => {
  const { user, role } = useAuth();
  const userRole = role ?? null;
  const estateId = user?.user?.user_estate?.id ?? 0;
  const tenantId = user?.tenants[0]?.estate?.id ?? 0;
  console.log("tenantId", tenantId);

  const enablePayments = userRole === "super admin" || userRole === "admin";
  const enableEstatePayments = userRole === "estate admin";
  const enableTenantPayments = userRole === "tenant";


  const { data: payments, isLoading } = useGetAllPayments({
    enabled: enablePayments,
  });
  const { data: estatePayments, isLoading: isLoadingEstatePayments } =
    useGetEstatePayments(estateId, {
      enabled: enableEstatePayments,
    });

    const { data: tenantPayments, isLoading: isLoadingTenantPayments } =
    useGetTenantPayments(tenantId, {
      enabled: enableTenantPayments,
    });

  const roles = useMemo<string[]>(() => {
    if (!role) return [];
    return Array.isArray(role)
      ? role.map((r) => String(r).toLowerCase())
      : [String(role).toLowerCase()];
  }, [role]);

  const isSuperOrAdmin =
    roles.includes("super admin") || roles.includes("admin");
    const isEstateAdmin = roles.includes("estate admin");
    const isTenantAdmin = roles.includes("tenant");

  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Management
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage service charges{" "}
          </p>
        </div>

        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || isLoadingEstatePayments || isLoadingTenantPayments ? (
          <>
            <Skeleton className="h-16 w-full bg-slate-600" />
            <Skeleton className="h-16 w-full bg-slate-600" />
            <Skeleton className="h-16 w-full bg-slate-600" />
          </>
        ) : (
          <>
            {isSuperOrAdmin && (
              <Card
                label="Total Charges"
                value={payments?.length ?? 0}
                icon={CreditCard}
              />
            )}
            {isEstateAdmin && (
              <Card
                label="Total Estate Payments"
                value={estatePayments?.length ?? 0}
                icon={CreditCard}
              />
            )}
            {isTenantAdmin && (
              <Card
                label="Total Tenant Payments"
                value={tenantPayments?.length ?? 0}
                icon={CreditCard}
              />
            )}
          </>
        )}
      </div>

      <div className="!mb-5">
        <SearchBar
          placeholder="Search Payments..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default PaymentManagement;
