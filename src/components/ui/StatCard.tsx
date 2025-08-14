import React from "react";
import { TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;  
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down";
  color: "blue" | "green" | "yellow" | "red" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
  color,
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200",
    yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
    red: "bg-red-100 text-red-600 border-red-200",
    purple: "bg-purple-100 text-purple-600 border-purple-200",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-1 flex items-center ${
                trendDirection === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  trendDirection === "down" ? "rotate-180" : ""
                }`}
              />
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
