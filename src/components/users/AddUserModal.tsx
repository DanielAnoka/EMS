import { Plus, X } from "lucide-react";
// import { type User, type UserRole } from "../../types/auth";
// import InputField from "../ui/InputField";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
//   onAdd: (user: Omit<User, "id" | "createdAt">) => void;
//   allowedRoles: UserRole[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  //   onAdd,
  //   allowedRoles,
}) => {
  if (!isOpen) return null;
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
        {/* Form */}
        <form className="p-6 space-y-4">
          {/* <InputField
            label="Full Name"
            type="text"
            id="name"
            placeholder="Enter full name"
            required
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            required
          /> */}

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
