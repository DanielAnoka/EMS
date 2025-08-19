import { Plus, X } from "lucide-react";
import { useState } from "react";
import InputField from "../ui/InputField";
import type { Estate } from "../../types/estate";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Estate) => void;
}

const AddEstateModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState({
    name: "",
    lga_id: 1,
    owner: "",
    phone_number: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  if (!isOpen) return null;
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Validation
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

      // ⏳ Clear errors after 1 second
      setTimeout(() => {
        setErrors({});
      }, 1000);

      return;
    }
    onAdd(form);

    setForm({
      name: "",
      lga_id: 1,
      owner: "",
      phone_number: "",
      address: "",
      email: "",
    });
    onClose();
  };
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            label="Owner"
            type="text"
            id="owner"
            placeholder="Enter owner name"
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
