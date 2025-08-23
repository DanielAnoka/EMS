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
import { ROLE_NAME_BY_ID } from "../../types/auth";
import { useGetUsers } from "../../services/users-service";
import { useGetEstates } from "../../services/estates";
import { useGetProperties } from "../../services/property";

const DashboardStat: React.FC = () => {
  const { user } = useAuth();
  const userRole = user ? ROLE_NAME_BY_ID[user.role_id] : null;
  const { data } = useGetUsers();
  const { data: estatesData } = useGetEstates();
  const { data: propertiesData } = useGetProperties();
  

  const getStatsForRole = (role: string | null) => {
    switch (role) {
      case "super_admin":
        return [
          {
            title: "Total Users",
            value: data?.length || 0,
            icon: Users,
            trend: data?.length
              ? `+${data.length} new user${data.length > 1 ? "s" : ""}`
              : "No users yet",
            trendDirection: data?.length ? ("up" as const) : ("down" as const),
            color: data?.length ? ("green" as const) : ("blue" as const),
          },
          {
            title: "Total Estates",
            value: estatesData?.length || 0,
            icon: Building,
            trend: estatesData?.length
              ? `+${estatesData.length} new estate${
                  estatesData.length > 1 ? "s" : ""
                }`
              : "No estates yet",
            trendDirection: estatesData?.length
              ? ("up" as const)
              : ("down" as const),
            color: estatesData?.length ? ("green" as const) : ("blue" as const),
          },
          {
            title: "Total Properties",
            value: propertiesData?.length || 0,
            icon: Building,
            trend: propertiesData?.length
              ? `+${propertiesData.length} new property${
                  propertiesData.length > 1 ? "s" : ""
                }`
              : "No properties yet",
            trendDirection: propertiesData?.length
              ? ("up" as const)
              : ("down" as const),
            color: propertiesData?.length ? ("green" as const) : ("blue" as const),
          },
          {
            title: "System Alerts",
            value: "7",
            icon: AlertTriangle,
            trend: "3 resolved today",
            trendDirection: "down" as const,
            color: "red" as const,
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

      case "estate_admin":
        return [
          {
            title: "Total Residents",
            value: "156",
            icon: Users,
            trend: "+8 new residents",
            trendDirection: "up" as const,
            color: "blue" as const,
          },
          {
            title: "Occupied Units",
            value: "89",
            icon: Home,
            trend: "85% occupancy",
            trendDirection: "up" as const,
            color: "green" as const,
          },
          {
            title: "Monthly Collections",
            value: "₦345K",
            icon: CreditCard,
            trend: "+5% from last month",
            trendDirection: "up" as const,
            color: "purple" as const,
          },
          {
            title: "Pending Approvals",
            value: "12",
            icon: Clock,
            trend: "4 processed today",
            trendDirection: "down" as const,
            color: "yellow" as const,
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
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStat;
