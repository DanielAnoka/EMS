import { useState } from "react";
import { Plus, X } from "lucide-react";
import { type RegisterPayload, type UserRole, ROLE_NAME_BY_ID,type RoleId } from "../../types/auth";
import InputField from "../ui/InputField";
import { RoleSelect } from "../ui/SelectField";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Omit<RegisterPayload, "id" | "created_at">) => void;
  allowedRoles: UserRole[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  allowedRoles,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as UserRole | "",
  });

  if (!isOpen) return null;

  const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    estate_admin: "Estate Admin",
    tenant: "Tenant",
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email|| !form.password || !form.role) {
      return;
    }

    // Convert UserRole to RoleId
    const roleId = (Object.keys(ROLE_NAME_BY_ID) as unknown as RoleId[]).find(
      (id) => ROLE_NAME_BY_ID[id] === form.role
    );

    if (!roleId) return;

    onAdd({
      name: form.name,
      email: form.email,
      password: form.password,
      role_id: roleId,
    } );

    setForm({ name: "", email: "", password: "", role: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputField
            label="Full Name"
            type="text"
            id="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={(value) => handleChange("name", value)}
            required
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={(value) => handleChange("email", value)}
            required id={""}          />
     
          <InputField
            label="Password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(value) => handleChange("password", value)}
            required id={""}          />
          <RoleSelect
            label="Role"
            value={form.role}
            onChange={(value) => handleChange("role", value)}
            allowedRoles={allowedRoles}
            roleLabels={roleLabels}
            required
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
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
