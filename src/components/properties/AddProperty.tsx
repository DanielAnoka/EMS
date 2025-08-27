/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plus, X } from "lucide-react";
import type {
  CreateProperty,
  LandlordInfo,
  TenantInfo,
} from "../../types/property";
import { useState } from "react";
import InputField from "../ui/InputField";
import { useAuth } from "../../hooks/useAuth";
import SelectField from "../ui/select";
import LandlordForm from "./landLord";
import TenantForm from "./TenantForm";

interface AddPropertyProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (propertyData: CreateProperty) => Promise<void>;
}

const initialLandlord: LandlordInfo = { name: "", email: "" };
const initialTenant: TenantInfo = { name: "", email: "", status: "active" };

const AddProperty = ({ isOpen, onClose, onAdd }: AddPropertyProps) => {
  const { user } = useAuth();
  const [landlord, setLandlord] = useState<LandlordInfo>(initialLandlord);
  const [tenant, setTenant] = useState<TenantInfo>(initialTenant);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    status: "" as "" | "available" | "sold" | "rented",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    property_type_id: 3,
    estate_id: "",
    owner_status: null as boolean | null,
    landlord_name: "",
    landlord_email: "",
    tenant_status: null as boolean | null,
    tenant_name: "",
    tenant_email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

 const handleChange = <K extends keyof typeof form>(
  key: K,
  value: (typeof form)[K]
) => {
  setForm((prev) => ({ ...prev, [key]: value }));
};
  const handleOwnerChange = (value: boolean) => {
    // Update owner_status and reset dependent fields appropriately
    setForm((prev) => ({
      ...prev,
      owner_status: value,

      // If the estate owns the property, clear landlord/tenant details
      ...(value
        ? {
            landlord_name: "",
            landlord_email: "",
            tenant_status: null, // no tenant question when estate owns
            tenant_name: "",
            tenant_email: "",
          }
        : {
            tenant_status: null,
          }),
    }));

    setErrors((e) => {
      const {
        landlord_name,
        landlord_email,
        tenant_status,
        tenant_name,
        tenant_email,
        ...rest
      } = e;
      return rest;
    });
  };
  const handleLandlordChange = (key: keyof LandlordInfo, value: string) => {
    setLandlord((prev) => ({ ...prev, [key]: value }));
  };
  const handleTenantChange = (key: keyof TenantInfo, value: string) => {
    setTenant((prev) => ({ ...prev, [key]: value }));
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Property
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="title"
              label="Title"
              value={form.title}
              onChange={(v) => handleChange("title", v)}
              placeholder="e.g. 3-Bedroom Apartment"
              required
              error={errors.title}
            />
            <InputField
              id="price"
              label="Price"
              value={form.price}
              onChange={(v) => handleChange("price", v)}
              placeholder="e.g. 250000"
              required
              error={errors.price}
            />
            <InputField
              id="bedrooms"
              label="Bedrooms"
              value={form.bedrooms}
              onChange={(v) => handleChange("bedrooms", v)}
              placeholder="e.g. 3"
              required
              error={errors.bedrooms}
            />
            <InputField
              id="bathrooms"
              label="Bathrooms"
              value={form.bathrooms}
              onChange={(v) => handleChange("bathrooms", v)}
              placeholder="e.g. 2"
              required
              error={errors.bathrooms}
            />
            <InputField
              id="toilets"
              label="Toilets"
              value={form.toilets}
              onChange={(v) => handleChange("toilets", v)}
              placeholder="e.g. 2"
              required
              error={errors.toilets}
            />
            <SelectField
              id="status"
              label="Status"
              value={form.status}
              onChange={(v) => handleChange("status", v)}
              placeholder="Select status"
              options={[
                { label: "Available", value: "available" },
                { label: "Sold", value: "sold" },
                { label: "Rented", value: "rented" },
              ]}
              error={errors.status}
            />
          </div>
          <InputField
            id="description"
            label="Description"
            as="textarea"
            rows={4}
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            error={errors.description}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Does the estate own this property?
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="owner_status"
                  value="yes"
                  checked={form.owner_status === true}
                  onChange={() => handleOwnerChange(true)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="owner_status"
                  value="no"
                  checked={form.owner_status === false}
                  onChange={() => handleOwnerChange(false)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
            {errors.owner_status && (
              <p className="mt-1 text-xs text-red-600">{errors.owner_status}</p>
            )}
            {errors.estate_id && (
              <p className="mt-1 text-xs text-red-600">{errors.estate_id}</p>
            )}
          </div>
          {form.owner_status === false && (
            <>
              <LandlordForm
                landlord={landlord}
                onChange={handleLandlordChange}
                errors={errors}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Is there a current tenant?
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasTenant"
                      value="yes"
                      checked={form.tenant_status === true}
                      onChange={() => handleChange("tenant_status", true)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasTenant"
                      value="no"
                      checked={form.tenant_status === false}
                      onChange={() => handleChange("tenant_status", false)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.tenant_status && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.tenant_status}
                  </p>
                )}
              </div>
              {form.tenant_status && (
                <TenantForm
                  tenant={tenant}
                  onChange={handleTenantChange}
                  errors={errors}
                />
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            // onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
