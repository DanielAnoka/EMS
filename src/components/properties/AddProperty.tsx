/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Plus, X } from "lucide-react";
import type {
  CreateProperty,
  LandlordInfo,
  TenantInfo,
} from "../../types/property";
import { useEffect, useState } from "react";
import InputField from "../ui/InputField";
import { useAuth } from "../../hooks/useAuth";
import SelectField from "../ui/select";
import LandlordForm from "./landLord";
import TenantForm from "./tenantForm";

interface AddPropertyProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (propertyData: CreateProperty) => void;
}

const initialLandlord: LandlordInfo = { name: "", email: "" };
const initialTenant: TenantInfo = { name: "", email: "", status: "active" };

const AddProperty = ({ isOpen, onClose, onAdd }: AddPropertyProps) => {
  const { user } = useAuth();
  console.log("user", user);

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
    estate_id: 0,
    owner_status: null as boolean | null,
    landlord_name: "",
    landlord_email: "",
    tenant_status: null as boolean | null,
    tenant_name: "",
    tenant_email: "",
  });

  useEffect(() => {
    if (user?.user_estate?.id) {
      setForm((prev) => ({ ...prev, estate_id: user.user_estate.id }));
    }
  }, [user]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => ({ ...prev, [key as string]: "" }));
  };

  const handleOwnerChange = (value: boolean) => {
    setForm((prev) => ({
      ...prev,
      owner_status: value,
      ...(value
        ? {
            landlord_name: "",
            landlord_email: "",
            tenant_status: null,
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

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).dataset.backdrop === "true") {
      onClose();
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.price.trim()) newErrors.price = "Price is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.bedrooms.trim()) newErrors.bedrooms = "Bedrooms is required";
    if (!form.bathrooms.trim()) newErrors.bathrooms = "Bathrooms is required";
    if (!form.toilets.trim()) newErrors.toilets = "Toilets is required";
    if (!form.estate_id) newErrors.estate_id = "Estate is required";
    if (form.owner_status === null) newErrors.owner_status = "Select ownership";

    // Numeric checks
    const numCheck = (v: string) =>
      Number.isFinite(Number(v)) && Number(v) >= 0;
    if (form.bedrooms && !numCheck(form.bedrooms))
      newErrors.bedrooms = "Enter a valid number";
    if (form.bathrooms && !numCheck(form.bathrooms))
      newErrors.bathrooms = "Enter a valid number";
    if (form.toilets && !numCheck(form.toilets))
      newErrors.toilets = "Enter a valid number";

    // If estate doesn't own it → require landlord; tenant optional based on toggle
    if (form.owner_status === false) {
      if (!landlord.name.trim())
        newErrors.landlord_name = "Landlord name is required";
      if (!landlord.email.trim())
        newErrors.landlord_email = "Landlord email is required";

      if (form.tenant_status === null) {
        newErrors.tenant_status = "Select if there is a current tenant";
      } else if (form.tenant_status === true) {
        if (!tenant.name.trim())
          newErrors.tenant_name = "Tenant name is required";
        if (!tenant.email.trim())
          newErrors.tenant_email = "Tenant email is required";
      }
    }
    const toNum = (v: string | number) =>
      typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
    const payload: CreateProperty = {
      title: form.title.trim(),
      price: toNum(form.price),
      description: form.description?.trim() || "",
      status: form.status as "available" | "sold" | "rented",
      bedrooms: toNum(form.bedrooms),
      bathrooms: toNum(form.bathrooms),
      toilets: toNum(form.toilets),
      property_type_id: toNum(form.property_type_id),
      estate_id: toNum(form.estate_id),
      owner_status: Boolean(form.owner_status),

      ...(form.owner_status === false
        ? {
            landlord_name: form.landlord_name || landlord.name.trim(),
            landlord_email: form.landlord_email || landlord.email.trim(),
            tenant_status: Boolean(form.tenant_status),
            ...(form.tenant_status
              ? {
                  tenant_name: form.tenant_name || tenant.name.trim(),
                  tenant_email: form.tenant_email || tenant.email.trim(),
                }
              : {}),
          }
        : {
            landlord_name: "",
            landlord_email: "",
            tenant_status: false,
          }),
    };

    console.log("property_payload", payload);

    await onAdd(payload);
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div
        data-backdrop="true"
        onClick={handleBackdropClick}
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={[
          "absolute inset-y-0 right-0 w-full sm:max-w-md md:max-w-2xl",
          "bg-white shadow-xl flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Property
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
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
              type="number"
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
            <SelectField
              id="status"
              label="Status"
              value={form.status}
              onChange={(v) =>
                handleChange("status", v as "available" | "sold" | "rented")
              }
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

          {/* Landlord & Tenant sections */}
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

        {/* Footer (sticks at bottom of panel) */}
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
