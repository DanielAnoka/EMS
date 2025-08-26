import { Plus, X } from "lucide-react";
import { useState } from "react";
import InputField from "../ui/InputField";
import type { TenantInfo } from "../../types/tentant";
import TenantForm from "./TentantFrom";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (payload: {
    title: string;
    price: number;
    description: string;
    property_type_id: number;
    status: "available" | "sold" | "rented";
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    isOwner: boolean;
    tenant?: TenantInfo;
  }) => void;
}

const initialTenant: TenantInfo = { name: "", email: "", phone_number: "", address: "", status: "active" };

const AddProperty = ({ isOpen, onClose, onAdd }: AddPropertyModalProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tenant, setTenant] = useState<TenantInfo>(initialTenant);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    status: "" as "" | "available" | "sold" | "rented",
    property_type_id: "" as string | number,
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    isOwner: null as boolean | null,
  });

  if (!isOpen) return null;

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const handleTenantChange = (key: keyof TenantInfo, value: string) => {
    setTenant((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(Number(form.price)))
      e.price = "Valid price is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (
      !form.property_type_id ||
      isNaN(Number(form.property_type_id as number))
    )
      e.property_type_id = "Property type is required";
    if (!form.status) e.status = "Status is required";
    if (!form.bedrooms || isNaN(Number(form.bedrooms)))
      e.bedrooms = "Valid bedrooms is required";
    if (!form.bathrooms || isNaN(Number(form.bathrooms)))
      e.bathrooms = "Valid bathrooms is required";
    if (!form.toilets || isNaN(Number(form.toilets)))
      e.toilets = "Valid toilets is required";
    if (form.isOwner === null) e.isOwner = "Please select Yes or No";

 if (form.isOwner === false) {
  if (!tenant.name.trim()) e.tenant_name = "Tenant name is required";
  if (!tenant.email.trim()) e.tenant_email = "Tenant email is required";
  if (!(tenant.phone_number ?? "").trim()) e.tenant_phone = "Tenant phone number is required";
  if (!(tenant.address ?? "").trim()) e.tenant_address = "Tenant address is required";
}


    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      property_type_id: Number(form.property_type_id),
      status: form.status as "available" | "sold" | "rented",
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      toilets: Number(form.toilets),
      isOwner: Boolean(form.isOwner),
      ...(form.isOwner === false ? { tenant } : {}),
    };

    onAdd?.(payload);

    setForm({
      title: "",
      price: "",
      description: "",
      status: "" as "" | "available" | "sold" | "rented",
      property_type_id: "" as string | number,
      bedrooms: "",
      bathrooms: "",
      toilets: "",
      isOwner: null as boolean | null,
    });

    setTenant(initialTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Property
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          {/* Property form */}
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
              type="number"
              value={form.price}
              onChange={(v) => handleChange("price", v)}
              placeholder="e.g. 1500000"
              required
              error={errors.price}
            />
            <InputField
              id="bedrooms"
              label="Bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={(v) => handleChange("bedrooms", v)}
              placeholder="e.g. 3"
              required
              error={errors.bedrooms}
            />
            <InputField
              id="bathrooms"
              label="Bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={(v) => handleChange("bathrooms", v)}
              placeholder="e.g. 2"
              required
              error={errors.bathrooms}
            />
            <InputField
              id="toilets"
              label="Toilets"
              type="number"
              value={form.toilets}
              onChange={(v) => handleChange("toilets", v)}
              placeholder="e.g. 2"
              required
              error={errors.toilets}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Select status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-red-600">{errors.status}</p>
              )}
            </div>
            {/* <InputField
              id="property_type_id"
              label="Property Type ID"
              type="number"
              value={String(form.property_type_id || "")}
              onChange={(v) => handleChange("property_type_id", v)}
              placeholder="e.g. 1"
              required
              error={errors.property_type_id}
            /> */}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full min-h-[90px] rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the property..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Radio yes/no */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Does the estate own this property?
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isOwner"
                  value="yes"
                  checked={form.isOwner === true}
                  onChange={() => setForm((p) => ({ ...p, isOwner: true }))}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isOwner"
                  value="no"
                  checked={form.isOwner === false}
                  onChange={() => setForm((p) => ({ ...p, isOwner: false }))}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
            {errors.isOwner && (
              <p className="mt-1 text-xs text-red-600">{errors.isOwner}</p>
            )}
          </div>

          {form.isOwner === false && (
            <TenantForm
              tenant={tenant}
              onChange={handleTenantChange}
              errors={errors}
            />
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
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
