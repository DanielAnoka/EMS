import React from "react";

const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          {/* Label placeholder */}
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          {/* Value placeholder */}
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>
        {/* Icon placeholder */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
