import React from "react";
import StatCard from "../ui/StatCard";
import {
  Users,
  Building,
  CreditCard,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useGetStatistics, useGetEstateStatistics } from "../../services/auth";
import { Skeleton } from "../ui/skeleton";


const DashboardStat: React.FC = () => {
  const { user, role } = useAuth();
  const userRole = role ?? null;

  // Only fetch what this role cares about
  const enableStatistics = userRole === "super admin" || userRole === "admin";
  const enableEstateStats = userRole === "estate admin";


  const { data: statistics, isLoading: isStatisticsLoading } = useGetStatistics(
    { enabled: enableStatistics }
  );

  const { data: estateStatistics, isLoading: isEstateStatsLoading } =
    useGetEstateStatistics(user?.user?.user_estate?.id ?? 0, {
      enabled: enableEstateStats,
    });


  const isLoading = isStatisticsLoading || isEstateStatsLoading ;

  const userCount = statistics?.total_users ?? 0;
  const estateCount = statistics?.total_estates ?? 0;
  const propertyCount = statistics?.total_properties ?? 0;
  const revenue = statistics?.payments_received ?? 0;
  const tenantCount = statistics?.total_tenants ?? 0;

  const estatePayments = estateStatistics?.payments_received ?? 0;
  const estateProperties = estateStatistics?.total_properties ?? 0;
  const estateTenants = estateStatistics?.total_tenants ?? 0;


  // const totalProperties  = propertyStatistics?.

  const getStatsForRole = (role: string | null) => {
    switch (role) {
      case "super admin":
        return [
          {
            title: "Total Users",
            value: userCount,
            icon: Users,
            trend: userCount
              ? `+${userCount} new user${userCount > 1 ? "s" : ""}`
              : "No users yet",
            trendDirection: userCount ? ("up" as const) : ("down" as const),
            color: userCount ? ("green" as const) : ("blue" as const),
          },
          {
            title: "Total Estates",
            value: estateCount,
            icon: Building,
            trend: estateCount
              ? `+${estateCount} new estate${estateCount > 1 ? "s" : ""}`
              : "No estates yet",
            trendDirection: estateCount ? ("up" as const) : ("down" as const),
            color: estateCount ? ("green" as const) : ("blue" as const),
          },
          {
            title: "Total Properties",
            value: propertyCount,
            icon: Building,
            trend: propertyCount
              ? `+${propertyCount} new property${propertyCount > 1 ? "s" : ""}`
              : "No properties yet",
            trendDirection: propertyCount ? ("up" as const) : ("down" as const),
            color: propertyCount ? ("green" as const) : ("blue" as const),
          },
          {
            title: "Total Tenants",
            value: tenantCount,
            icon: Users,
            trend: tenantCount
              ? `+${tenantCount} new tenant${tenantCount > 1 ? "s" : ""}`
              : "No tenants yet",
            trendDirection: tenantCount ? ("up" as const) : ("down" as const),
            color: tenantCount ? ("purple" as const) : ("blue" as const),
          },
          {
            title: "Total Revenue",
            value: revenue,
            icon: Building,
            trend: revenue
              ? `+${revenue} new property${revenue > 1 ? "s" : ""}`
              : "No properties yet",
            trendDirection: revenue ? ("up" as const) : ("down" as const),
            color: revenue ? ("green" as const) : ("blue" as const),
          },
        ];

      case "admin":
        return [
          {
            title: "Total Users",
            value: "856",
            icon: Users,
            trend: "+8% from last month",
            trendDirection: "up" as const,
            color: "blue" as const,
          },
          {
            title: "Managed Estates",
            value: "12",
            icon: Building,
            trend: "+1 new estate",
            trendDirection: "up" as const,
            color: "green" as const,
          },
          {
            title: "Monthly Revenue",
            value: "₦1.2M",
            icon: CreditCard,
            trend: "+5% from last month",
            trendDirection: "up" as const,
            color: "purple" as const,
          },
          {
            title: "Pending Approvals",
            value: "15",
            icon: Clock,
            trend: "8 processed today",
            trendDirection: "down" as const,
            color: "yellow" as const,
          },
        ];

      case "estate admin":
        return [
          {
            title: "Total Tenants",
            value: estateTenants,
            icon: Users,
            trend: estateTenants
              ? `+${estateTenants} new tenant${estateTenants > 1 ? "s" : ""}`
              : "No tenants yet",
            trendDirection: "up" as const,
            color: "blue" as const,
          },
          {
            title: "Total Properties",
            value: estateProperties,
            icon: Home,
            trend: estateProperties
              ? `+${estateProperties} new property${
                  estateProperties > 1 ? "s" : ""
                }`
              : "No properties yet",
            trendDirection: estateProperties
              ? ("up" as const)
              : ("down" as const),
            color: estateProperties ? ("green" as const) : ("blue" as const),
          },
          {
            title: "Payments",
            value: estatePayments,
            icon: CreditCard,
            trend: estatePayments
              ? `+${estatePayments} new payment${estatePayments > 1 ? "s" : ""}`
              : "No payments yet",
            trendDirection: estatePayments
              ? ("up" as const)
              : ("down" as const),
            color: estatePayments ? ("purple" as const) : ("blue" as const),
          },
        ];

      case "tenant":
        return [
          {
            title: "Current Rent",
            value: "₦25K",
            icon: Home,
            trend: "Paid this month",
            trendDirection: "up" as const,
            color: "green" as const,
          },
          {
            title: "Service Charges",
            value: "₦12K",
            icon: CreditCard,
            trend: "Due in 10 days",
            trendDirection: "down" as const,
            color: "yellow" as const,
          },
          {
            title: "Payment History",
            value: "100%",
            icon: CheckCircle,
            trend: "Always on time",
            trendDirection: "up" as const,
            color: "blue" as const,
          },
          {
            title: "Outstanding",
            value: "₦0",
            icon: AlertTriangle,
            trend: "All cleared",
            trendDirection: "up" as const,
            color: "green" as const,
          },
        ];
      case "landlord":
        return [
          {
            title: "Total Properties",
            value: "25",
            icon: Building,
            trend: "+2 new properties",
            trendDirection: "up" as const,
            color: "green" as const,
          },
          {
            title: "Total Tenants",
            value: "100",
            icon: Users,
            trend: "+5 new tenants",
            trendDirection: "up" as const,
            color: "blue" as const,
          },
        ];

      default:
        return [
          {
            title: "Dashboard",
            value: "1",
            icon: Home,
            color: "blue" as const,
          },
          {
            title: "Active",
            value: "✓",
            icon: CheckCircle,
            color: "green" as const,
          },
        ];
    }
  };

  const stats = getStatsForRole(userRole);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              // className="p-4 border rounded-lg shadow bg-white flex flex-col space-y-3"
            >
              <Skeleton className="h-16 w-full bg-slate-600" />
            </div>
          ))
        : stats.map((stat, index) => <StatCard key={index} {...stat} />)}
    </div>
  );
};

export default DashboardStat;
