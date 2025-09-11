import { CreditCard, Download } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  useGetAllPayments,
  useGetEstatePayments,
  useGetTenantPayments,
  type Payment,
} from "../../services/payments";

type ScopeResult = {
  payments: Payment[] | undefined;
  isLoading: boolean;

};

function useScopedPayments(): ScopeResult {
  const { user, role } = useAuth();
  const userRole = role ?? "";

  const isSuperOrAdmin =
    userRole.includes("super admin") || userRole.includes("admin");
  const isEstateAdmin = userRole.includes("estate admin");
  const isTenant = userRole.includes("tenant");
  const isLandlord = userRole.includes("landlord");

  // Prefer estate id when available
  const estateId = user?.user?.user_estate?.id ?? null;

  // Tenant: pick first tenant id if present
  const firstTenantId = user?.tenants?.length ? user.tenants[0].id : null;

  // Wire the correct query
  const all = useGetAllPayments({ enabled: isSuperOrAdmin });
  const est = useGetEstatePayments(estateId ?? 0, {
    enabled: !!estateId && (isEstateAdmin || isLandlord),
  });
  const ten = useGetTenantPayments(firstTenantId ?? 0, {
    enabled: !!firstTenantId && isTenant,
  });

  // Choose the active source + label
  if (isSuperOrAdmin) {
    return {
      payments: all.data,
      isLoading: all.isLoading,
   
    };
  }

  if (isEstateAdmin && estateId) {
    return {
      payments: est.data,
      isLoading: est.isLoading,
 
    };
  }

  if (isTenant && firstTenantId) {
    return {
      payments: ten.data,
      isLoading: ten.isLoading,
  
    };
  }

  // Landlord fallback: estate-scoped if attached; otherwise show all (limited)
  if (isLandlord && estateId) {
    return {
      payments: est.data,
      isLoading: est.isLoading,

    };
  }

  // Final fallback
  return {
    payments: all.data,
    isLoading: all.isLoading,
  
  };
}

const Payment = () => {
  const { payments, isLoading,  } = useScopedPayments();

  const totalCount = payments?.length ?? 0;
  const totalAmount = useMemo(
    () =>
      (payments ?? []).reduce((sum, p) => sum + Number(p.amount ?? 0), 0),
    [payments]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
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
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full bg-slate-200" />
            <Skeleton className="h-16 w-full bg-slate-200" />
            <Skeleton className="h-16 w-full bg-slate-200" />
          </>
        ) : (
          <>
            <Card label="Total Payments" value={totalCount} icon={CreditCard} />
            <Card
              label="Total Amount"
              value={new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 2,
              }).format(totalAmount)}
              icon={CreditCard}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
