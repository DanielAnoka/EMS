import { Plus, X } from "lucide-react";
import type { Property } from "../../types/property";
import type { CreateTenantPayload } from "../../types/tenant";
import { useState } from "react";
import InputField from "../ui/InputField";
import { useAuth } from "../../hooks/useAuth";

interface AddTenanttoPropretyProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onAdd: (tenant: CreateTenantPayload) => void;
}

const AddTenanttoProprety = ({
  isOpen,
  onClose,
  property,
  onAdd,
}: AddTenanttoPropretyProps) => {
  const { user } = useAuth();
  const userId = Number(user?.user?.id ?? 0);
  const estateIdFromProperty = Number(property.estate_id);
  const estatePropertyId = Number(property.id);

  const initialForm: CreateTenantPayload = {
    name: "",
    email: "",
    phone_number: "",
    address: "",
    user_id: userId,
    estate_id: estateIdFromProperty,
    estate_property_id: estatePropertyId,
    status: 1, 
  };

  const [form, setForm] = useState<CreateTenantPayload>(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = <K extends keyof CreateTenantPayload>(
    key: K,
    value: CreateTenantPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key as string]: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone_number) newErrors.phone_number = "Phone number is required";
    if (!form.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd(form);
    setForm(initialForm); 
    onClose();           
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Tenant</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adding to {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Tenant Name"
            type="text"
            id="name"
            placeholder="Enter name"
            value={form.name}
            onChange={(value) => handleChange("name", value)}
            required
            error={errors.name}
          />
          <InputField
            label="Tenant Email"
            type="email"
            id="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(value) => handleChange("email", value)}
            required
            error={errors.email}
          />
          <InputField
            label="Tenant Phone Number"
            type="tel"
            id="phone_number"
            placeholder="Enter phone number"
            value={form.phone_number}
            onChange={(value) => handleChange("phone_number", value)}
            required
            error={errors.phone_number}
          />
          <InputField
            label="Tenant Address"
            type="text"
            id="address"
            placeholder="Enter address"
            value={form.address}
            onChange={(value) => handleChange("address", value)}
            required
            error={errors.address}
          />

          {/* Optional: status toggle (0/1) */}
          {/* Replace with your Select/Toggle UI if you have one */}
          {/* <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Active?</span>
            <input
              type="checkbox"
              checked={form.status === 1}
              onChange={(e) => handleChange("status", e.target.checked ? 1 : 0)}
            />
          </div> */}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenanttoProprety;
