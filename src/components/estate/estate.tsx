import { Building, Plus } from "lucide-react";
import React, { useState } from "react";
import Card from "../ui/card";
import SearchBar from "../ui/search";

const Estate: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Estate Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and monitor all estates in the system
          </p>
        </div>
        <button
          // onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Estate
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Total Estates" value={10} icon={Building} />
        <Card
          label="Active Estates"
          value={8}
          icon={Building}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      <SearchBar
        placeholder="Search Estates..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
    </div>
  );
};

export default Estate;
