import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import type { User, Role } from "../../types/auth";


import InputField from "../ui/InputField";
import { RoleSelect } from "../ui/SelectField";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  user: User | null;
  allowedRoles: Role[];
}

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  tenant: "Tenant",
  landlord: "Landlord",
  "estate admin": "Estate Admin",
  "super admin": "Super Admin",
};

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  user,
  allowedRoles,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as Role | "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        // pick the first role if multiple exist
        role: (user.role[0] as Role) || "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.role.trim()) newErrors.role = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 2000);
      return;
    }

    // update user with new role as array
    onEdit({
      ...user,
      name: form.name,
      email: form.email,
      role: [form.role as Role],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputField
            label="Full Name"
            type="text"
            id="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={(value) => handleChange("name", value)}
            required
            error={errors.name}
          />

          <InputField
            label="Email Address"
            type="email"
            id="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={(value) => handleChange("email", value)}
            required
            error={errors.email}
          />

          <RoleSelect
            label="Role"
            value={form.role}
            onChange={(value) => handleChange("role", value)}
            allowedRoles={allowedRoles}
            roleLabels={roleLabels}
            required
            error={errors.role}
          />

          {/* Actions */}
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
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
