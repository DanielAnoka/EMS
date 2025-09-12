import {
  Building,
  Mail,
  User,
  Users,
  CalendarDays,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useGetPropertyById } from "../../services/property";
import Card from "../ui/card";
import AddTenanttoProprety from "./AddTenanttoProprety";
import { useCreateTenant } from "../../services/tenant";
import type { CreateTenantPayload, TenantStatus } from "../../types/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TenantLogin from "./tenantlogin";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}

const DetailsModal = ({ isOpen, onClose, propertyId }: DetailsModalProps) => {
  const queryClient = useQueryClient();
  const { data: property, isLoading, error } = useGetPropertyById(propertyId);

  const [activeTab, setActiveTab] = useState<"overview" | "tenants">(
    "overview"
  );
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [createdEstate, setCreatedEstate] = useState<TenantStatus | null>(null);
  const { mutate: createTenant } = useCreateTenant();

  const handleSubmit = (tenant: CreateTenantPayload) => {
    const key = ["properties", propertyId] as const;
    createTenant(tenant, {
      onSuccess: (data) => {
        setCreatedEstate(data);
        queryClient.invalidateQueries({ queryKey: key });
        queryClient.invalidateQueries({ queryKey: ["tenants", propertyId] });

        toast.success(`${tenant.name} added successfully!`);
        setIsAddTenantModalOpen(false);
      },
      onError: () => {
        toast.error("Failed to add tenant");
      },
    });
  };

  if (!isOpen) return null;

  const ngn = (n?: number | string) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(n || 0));

  const createdAt =
    property?.created_at &&
    new Date(property.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusBadge = (s?: string) => {
    if (s === "available") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Available
        </span>
      );
    }
    if (s === "rented") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Rented
        </span>
      );
    }
    if (s === "sold") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Sold
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        Unknown
      </span>
    );
  };
  const tenants = Array.isArray(property?.tenant) ? property!.tenant : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? "Loading..." : property?.title ?? "Property Details"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading ? "" : statusBadge(property?.status)}
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-1">
                Failed to load property details
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", name: "Overview", icon: Building },
              { id: "tenants", name: "Tenants", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === (tab.id as "overview" | "tenants");
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
                      {tenants.length}
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
              {/* Stat cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <Card
                  label="Price"
                  value={isLoading ? "—" : ngn(property?.price)}
                  icon={Building}
                  bgColor="bg-blue-50"
                  iconBgColor="bg-blue-100"
                  iconColor="text-blue-600"
                />
                <Card
                  label="Bedrooms"
                  value={isLoading ? "—" : String(property?.bedrooms ?? 0)}
                  icon={Building}
                  bgColor="bg-green-50"
                  iconBgColor="bg-green-100"
                  iconColor="text-green-600"
                />
                <Card
                  label="Toilets"
                  value={isLoading ? "—" : String(property?.toilets ?? 0)}
                  icon={Building}
                  bgColor="bg-purple-50"
                  iconBgColor="bg-purple-100"
                  iconColor="text-purple-600"
                />
              </div>

              {/* Property Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Information
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="mr-2 font-medium">Owner:</span>
                    <span>{property?.landlord?.name ?? "—"}</span>
                  </div>

                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="mr-2 font-medium">Owner Email:</span>
                    <span>{property?.landlord?.email ?? "—"}</span>
                  </div>

                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="mr-2 font-medium">Created:</span>
                    <span>{createdAt ?? "—"}</span>
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
                <button
                  onClick={() => setIsAddTenantModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tenant
                </button>
              </div>

              {/* Tenant */}
              {tenants.length > 0 ? (
                <div className="space-y-3">
                  {tenants.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-150"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Tenant</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {t.name ?? "—"}
                            </div>
                            <div className="flex items-center mt-1 sm:mt-0">
                              <Mail className="w-4 h-4 mr-1" />
                              {t.email ?? "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tenants found
                  </h3>
                  <p className="text-gray-600">
                    Add tenants to this Property to get started
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isAddTenantModalOpen && property && (
        <AddTenanttoProprety
          isOpen={isAddTenantModalOpen}
          onClose={() => setIsAddTenantModalOpen(false)}
          property={property}
          onAdd={handleSubmit}
        />
      )}
      {createdEstate && (
        <TenantLogin
          isOpen={!!createdEstate}
          onClose={() => setCreatedEstate(null)}
          property={createdEstate}
        />
      )}
    </div>
  );
};

export default DetailsModal;
