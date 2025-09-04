import React from "react";
import DashboardStats from "./DashboardStat";
import { useAuth } from "../../hooks/useAuth";
import { useGetRoles } from "../../services/users-service";

const recentActivity = [
  {
    action: "New tenant registered",
    user: "John Doe - Apt 204",
    time: "2 hours ago",
  },
  {
    action: "Payment received",
    user: "Sarah Smith - ₦25,000",
    time: "4 hours ago",
  },
  {
    action: "Property listed",
    user: "3BR Apartment - Block C",
    time: "6 hours ago",
  },
  {
    action: "Maintenance request",
    user: "Mike Johnson - Plumbing",
    time: "8 hours ago",
  },
  {
    action: "Service charge due",
    user: "Multiple residents",
    time: "1 day ago",
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || "User";
  const { data: roles } = useGetRoles();
  console.log("User Roles:", roles);
  console.log("Authenticated User:", user);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening in your estate management system today.
        </p>
      </div>

        {/* Stats Cards */}
      <DashboardStats />

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
