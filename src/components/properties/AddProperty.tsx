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
import TenantForm from "./tenantform";
import { useGetEstates } from "../../services/estates";
import { useGetAttribute } from "../../services/attributes";

interface AddPropertyProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (propertyData: CreateProperty) => void;
}

const initialLandlord: LandlordInfo = { name: "", email: "" };
const initialTenant: TenantInfo = { name: "", email: "", status: "active" };

const AddProperty = ({ isOpen, onClose, onAdd }: AddPropertyProps) => {
  const { user, role } = useAuth();
  const userRole = role ?? null;

  const enableEstateStats = userRole === "super admin" || userRole === "admin";
  const { data: estates } = useGetEstates({ enabled: enableEstateStats });

  const { data: attributes = [] } = useGetAttribute();

  const [landlord, setLandlord] = useState<LandlordInfo>(initialLandlord);
  const [tenant, setTenant] = useState<TenantInfo>(initialTenant);
const [attributeValues, setAttributeValues] = useState<Record<string, string>>({});

  const [form, setForm] = useState<{
    title: string;
    price: string;
    description: string;
    status: "" | "available" | "sold" | "rented";
    property_type_id: number;
    attributes: string[];
    estate_id: number;
    owner_status: boolean | null;
    landlord_name: string;
    landlord_email: string;
    tenant_status: boolean | null;
    tenant_name: string;
    tenant_email: string;
  }>({
    title: "",
    price: "",
    description: "",
    status: "" as "" | "available" | "sold" | "rented",
    property_type_id: 3,
    attributes: [],
    estate_id: 0,
    owner_status: null,
    landlord_name: "",
    landlord_email: "",
    tenant_status: null,
    tenant_name: "",
    tenant_email: "",
  });

  useEffect(() => {
    if (user?.user?.user_estate?.id) {
      setForm((prev) => ({ ...prev, estate_id: user.user.user_estate.id }));
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

const toggleAttribute = (name: string) => {
  setForm((prev) => {
    const exists = prev.attributes.includes(name);
    const next = exists
      ? prev.attributes.filter((n) => n !== name)
      : [...prev.attributes, name];

    return { ...prev, attributes: next };
  });

  setAttributeValues((prev) => {
    const exists = form.attributes.includes(name);
    if (exists) {
      // removing → drop its value
      const { [name]: _, ...rest } = prev;
      return rest;
    }
    // adding → set a default if not present
    return prev[name] ? prev : { ...prev, [name]: "1" };
  });

  setErrors((prev) => ({ ...prev, attributes: "" }));
};


 const selectAllAttributes = () => {
  const allNames = attributes.map((a) => a.name).filter(Boolean);
  setForm((prev) => ({ ...prev, attributes: allNames }));
  setAttributeValues((prev) => {
    const next = { ...prev };
    for (const n of allNames) if (!next[n]) next[n] = "1";
    return next;
  });
  setErrors((prev) => ({ ...prev, attributes: "" }));
};

const clearAllAttributes = () => {
  setForm((prev) => ({ ...prev, attributes: [] }));
  setAttributeValues({});
};

  // const handleSubmit = async () => {
  //   const newErrors: Record<string, string> = {};
  //   if (!form.title.trim()) newErrors.title = "Title is required";
  //   if (!form.price.trim()) newErrors.price = "Price is required";
  //   if (!form.status) newErrors.status = "Status is required";
  //   if (form.attributes.length === 0)
  //     newErrors.attributes = "Select at least one attribute";
  //   if (!form.estate_id) newErrors.estate_id = "Estate is required";
  //   if (form.owner_status === null) newErrors.owner_status = "Select ownership";

  //   // If estate doesn't own it → require landlord; tenant optional based on toggle
  //   if (form.owner_status === false) {
  //     if (!landlord.name.trim())
  //       newErrors.landlord_name = "Landlord name is required";
  //     if (!landlord.email.trim())
  //       newErrors.landlord_email = "Landlord email is required";

  //     if (form.tenant_status === null) {
  //       newErrors.tenant_status = "Select if there is a current tenant";
  //     } else if (form.tenant_status === true) {
  //       if (!tenant.name.trim())
  //         newErrors.tenant_name = "Tenant name is required";
  //       if (!tenant.email.trim())
  //         newErrors.tenant_email = "Tenant email is required";
  //     }
  //   }
  //   const toNum = (v: string | number) =>
  //     typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  //   const payload: CreateProperty = {
  //     title: form.title.trim(),
  //     price: toNum(form.price),
  //     description: form.description?.trim() || "",
  //     status: form.status as "available" | "sold" | "rented",
  //     attributes: form.attributes,
  //     property_type_id: toNum(form.property_type_id),
  //     estate_id: toNum(form.estate_id),
  //     owner_status: Boolean(form.owner_status),

  //     ...(form.owner_status === false
  //       ? {
  //           landlord_name: form.landlord_name || landlord.name.trim(),
  //           landlord_email: form.landlord_email || landlord.email.trim(),
  //           tenant_status: Boolean(form.tenant_status),
  //           ...(form.tenant_status
  //             ? {
  //                 tenant_name: form.tenant_name || tenant.name.trim(),
  //                 tenant_email: form.tenant_email || tenant.email.trim(),
  //               }
  //             : {}),
  //         }
  //       : {
  //           landlord_name: "",
  //           landlord_email: "",
  //           tenant_status: false,
  //         }),
  //   };

  //   onAdd(payload);

  //   setForm({
  //     title: "",
  //     price: "",
  //     description: "",
  //     status: "available",
  //     property_type_id: 0,
  //     estate_id: 0,
  //     attributes: [],
  //     owner_status: null,
  //     landlord_name: "",
  //     landlord_email: "",
  //     tenant_status: false,
  //     tenant_name: "",
  //     tenant_email: "",
  //   });
  //   onClose();
  // };
const handleSubmit = async () => {
  const newErrors: Record<string, string> = {};

  // existing validations...
  if (form.attributes.length === 0) newErrors.attributes = "Select at least one attribute";

  // ensure every selected attribute has a chosen value
  for (const name of form.attributes) {
    if (!attributeValues[name]) {
      newErrors[`attr_${name}`] = `Select a value for ${name}`;
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const toNum = (v: string | number) =>
    typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));

  // build attributes payload
  const attributesPayload = form.attributes
    .map((name) => {
      const def = attributes.find((a: { name: string; }) => a.name === name);
      if (!def) return null;
      return {
        id: def.id,
        value: def.name,              
        label: attributeValues[name], 
      };
    })
    .filter((x): x is { id: number; value: string; label: string } => Boolean(x));

  const payload: CreateProperty = {
    title: form.title.trim(),
    price: toNum(form.price),
    description: form.description?.trim() || "",
    status: form.status as "available" | "sold" | "rented",
    property_type_id: toNum(form.property_type_id),
    estate_id: toNum(form.estate_id),
    attributes: attributesPayload, // <-- now the correct shape
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

  onAdd(payload);


  setForm({
    title: "",
    price: "",
    description: "",
    status: "available",
    property_type_id: 0,
    estate_id: 0,
    attributes: [],
    owner_status: null,
    landlord_name: "",
    landlord_email: "",
    tenant_status: false,
    tenant_name: "",
    tenant_email: "",
  });
  setAttributeValues({});
  onClose();
};

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "visible" : "invisible"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`
          absolute inset-y-0 right-0 w-full sm:max-w-md md:max-w-2xl
          bg-white shadow-xl flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
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
            {(user?.roles.includes("super admin") ||
              user?.roles.includes("admin")) && (
              <SelectField
                id="estate_id"
                label="Estates"
                value={form.estate_id}
                onChange={(v) => handleChange("estate_id", Number(v))}
                placeholder="Select estate"
                options={
                  estates?.map((estate) => ({
                    label: estate.name,
                    value: estate.id.toString(),
                  })) ?? []
                }
                error={errors.estate_id}
              />
            )}
          </div>

          {/* ✅ Attributes (checkbox grid) — appears BEFORE ownership question */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Attributes
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllAttributes}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearAllAttributes}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                  disabled={form.attributes.length === 0}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {attributes.map((attr: any) => {
                const name = attr?.name as string;
                const label = attr?.label ?? name;
                const checked = form.attributes.includes(name);
                return (
                  <label
                    key={name}
                    className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={checked}
                      onChange={() => toggleAttribute(name)}
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>

            {errors.attributes && (
              <p className="mt-1 text-xs text-red-600">{errors.attributes}</p>
            )}
          </div>

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
