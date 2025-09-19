/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard, Download } from "lucide-react";
import SearchBar from "../ui/search";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useGetAllPayments,
  useGetEstatePayments,
  useGetTenantPayments,
} from "../../services/payments";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import PaymentTable from "./table";
import { TableSkeleton } from "../ui/TableSkeleton";
import type { Payment } from "../../types/payment";

const PaymentManagement = () => {
  const { user, role } = useAuth();
  const userRole = role ?? null;

 
  const estateId = user?.user?.user_estate?.id ?? 0;
  const tenantId = user?.tenants?.[0]?.id ?? 0;

  const enablePayments = userRole === "super admin" || userRole === "admin";
  const enableEstatePayments = userRole === "estate admin";
  const enableTenantPayments = userRole === "tenant";

  const { data: payments = [], isLoading } = useGetAllPayments({
    enabled: enablePayments,
  });
  const { data: estatePayments = [], isLoading: isLoadingEstatePayments } =
    useGetEstatePayments(estateId, {
      enabled: enableEstatePayments && estateId > 0,
    });

  const { data: tenantPayments = [], isLoading: isLoadingTenantPayments } =
    useGetTenantPayments(tenantId, {
      enabled: enableTenantPayments && tenantId > 0,
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

  const isBusy =
    isLoading || isLoadingEstatePayments || isLoadingTenantPayments;


  const visiblePayments: Payment[] = useMemo(() => {
    const ensurePaymentType = (arr: any[]): Payment[] =>
      arr.map((p) => ({
        estate_property_id: p.estate_property_id ?? "",
        payment_method: p.payment_method ?? "",
        transaction_reference: p.transaction_reference ?? "",
        invoice_number: p.invoice_number ?? "",
        payload: p.payload ?? {},
        amount: p.amount ?? 0,
        created_at: p.created_at ?? "",
        ...p,
      }));

    if (isSuperOrAdmin) return ensurePaymentType(payments);
    if (isEstateAdmin) return ensurePaymentType(estatePayments);
    if (isTenantAdmin) return ensurePaymentType(tenantPayments);
    return [];
  }, [
    isSuperOrAdmin,
    isEstateAdmin,
    isTenantAdmin,
    payments,
    estatePayments,
    tenantPayments,
  ]);


  const norm = (s: unknown) =>
    String(s ?? "").toLowerCase().trim().replace(/\s+/g, " ");
  const q = norm(searchTerm);

  const filteredPayments = useMemo(() => {
    if (!q) return visiblePayments;
    return visiblePayments.filter((p) => {
      const haystack = [
        p.invoice_number,
        p.payment_method,
        p.transaction_reference,
        p.amount,
        p.created_at,
      ]
        .map((v) => String(v ?? ""))
        .join(" ");
      return norm(haystack).includes(q);
    });
  }, [visiblePayments, q]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600 mt-1">Track and manage service charges</p>
        </div>

        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isBusy ? (
          <>
            <Skeleton className="h-16 w-full bg-slate-600" />
            <Skeleton className="h-16 w-full bg-slate-600" />
            <Skeleton className="h-16 w-full bg-slate-600" />
          </>
        ) : (
          <>
            {isSuperOrAdmin && (
              <Card label="Total Payments" value={payments.length} icon={CreditCard} />
            )}
            {isEstateAdmin && (
              <Card
                label="Total Estate Payments"
                value={estatePayments.length}
                icon={CreditCard}
              />
            )}
            {isTenantAdmin && (
              <Card
                label="Total Tenant Payments"
                value={tenantPayments.length}
                icon={CreditCard}
              />
            )}
          </>
        )}
      </div>

      {/* Search */}
      <div className="!mb-5">
        <SearchBar
          placeholder="Search Payments..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="mt-6">
        {isBusy ? (
          <TableSkeleton rows={8} />
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <PaymentTable payment={filteredPayments} />
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
