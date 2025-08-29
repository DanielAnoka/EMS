import { Plus, X } from "lucide-react";
import type { CreateEstate } from "../../types/estate";
import InputField from "../ui/InputField";
import { useState } from "react";

interface AddEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (estate: CreateEstate) => void;
}

const AddEstateModal: React.FC<AddEstateModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone_number: "",
    address: "",
    email: "",
    status: null as 1 | null,
  });
  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | number | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Estate name is required";
    if (!form.owner.trim()) newErrors.owner = "Owner name is required";
    if (!form.phone_number.trim())
      newErrors.phone_number = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      setTimeout(() => {
        setErrors({});
      }, 1000);

      return;
    }

    onAdd({
      ...form,
      lga_id: 1,
    });

    setForm({
      name: "",
      owner: "",
      phone_number: "",
      address: "",
      email: "",
      status: null,
    });

    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Estate
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Estate Name"
            type="text"
            id="name"
            placeholder="Enter name"
            value={form.name}
            onChange={(value) => handleChange("name", value)}
            required
            error={errors.name}
          />
          <InputField
            label="Owner's Name"
            type="text"
            id="owner"
            placeholder="Enter Owner's name"
            value={form.owner}
            onChange={(value) => handleChange("owner", value)}
            required
            error={errors.owner}
          />
          <InputField
            label="Phone Number"
            type="tel"
            id="phone_number"
            placeholder="Enter phone number"
            value={form.phone_number}
            onChange={(value) => handleChange("phone_number", value)}
            required
            error={errors.phone_number}
          />
          <InputField
            label="Address"
            type="text"
            id="address"
            placeholder="Enter address"
            value={form.address}
            onChange={(value) => handleChange("address", value)}
            required
            error={errors.address}
          />
          <InputField
            label="Email"
            type="email"
            id="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(value) => handleChange("email", value)}
            required
            error={errors.email}
          />

          {/* Status */}
          <input
            id="isActive"
            type="checkbox"
            checked={form.status === 1}
            onChange={(e) =>
              handleChange("status", e.target.checked ? 1 : null)
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            htmlFor="isActive"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Active Estate
          </label>

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
              Add Estate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEstateModal;
