import { X } from "lucide-react";
import type { CreatePropertyPayload } from "../../types/property";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: CreatePropertyPayload;
}

const LoginDetails: React.FC<ModalProps> = ({ isOpen, onClose, property }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
         {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Login Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              For property at {property.property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
         <div className="bg-blue-50 rounded-lg p-4">
          
         </div>
      </div>
    </div>
  );
};

export default LoginDetails;
