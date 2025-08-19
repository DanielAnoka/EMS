import React from "react";
import { Skeleton } from "../ui/skeleton";

interface UserTableSkeletonProps {
  rows?: number;
  showActions?: boolean;
}

export const TableSkeleton: React.FC<UserTableSkeletonProps> = ({
  rows =10,
  showActions = true,
}) => {
  const cols = showActions ? 6 : 5; 

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 animate-pulse">
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={`head-${i}`} className="px-6 py-3">
                <Skeleton className="h-5 w-24" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-t">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`} className="px-6 py-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
