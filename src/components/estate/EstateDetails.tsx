import { Building, Mail, MapPin, Phone, User, Users, X } from "lucide-react";
import { useGetEstateById } from "../../services/estates";
import Card from "../ui/card";
import { useState } from "react";

interface EstateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateId: string;
}

const EstateDetails = ({
  isOpen,
  onClose,
  estateId,
}: EstateDetailsModalProps) => {
  const { data: estate, isLoading, error } = useGetEstateById(estateId);
  const [activeTab, setActiveTab] = useState<"overview" | "tenants">(
    "overview"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? "Loading..." : estate?.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading ? "" : estate?.address}
            </p>
            {error && (
              <p className="text-red-500 text-sm">Failed to load estate</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", name: "Overview", icon: Building },
              { id: "tenants", name: "Tenants", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "overview" | "tenants")}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                  {tab.id === "tenants" && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {/* {estateTenants.length} */}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <Card
                  label="Total Properties"
                  value={12}
                  icon={Building}
                  bgColor="bg-blue-50"
                  iconBgColor="bg-green-100"
                  iconColor="text-blue-600"
                />
              </div>
              {/* Estate Information */}
              <div className="p-3 overflow-y-auto max-h-[60vh]">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Estate Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {isLoading ? "Loading..." : estate?.owner}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {isLoading ? "Loading..." : estate?.address}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {isLoading ? "Loading..." : estate?.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {isLoading ? "Loading..." : estate?.phone_number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "tenants" && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Estate Tenants
                </h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">John Smith</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          lisa@email.com
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          +234-123-456-7893
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstateDetails;
