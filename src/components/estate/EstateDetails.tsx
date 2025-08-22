import { Building, Mail, MapPin, Phone, User, X } from "lucide-react";
import { useGetEstateById } from "../../services/estates";
import Card from "../ui/card";

interface EstateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateId: string;
}

const EstateDetails = ({
  isOpen,
  onClose,
  estateId,
}: EstateDetailsModalProps) => {
  const { data: estate, isLoading, error } = useGetEstateById(estateId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? "Loading..." : estate?.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading ? "" : estate?.address}
            </p>
            {error && (
              <p className="text-red-500 text-sm">Failed to load estate</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <Card
            label="Total Properties"
            value={12}
            icon={Building}
            bgColor="bg-blue-50" 
            iconBgColor="bg-green-100" 
            iconColor="text-blue-600"
          />
        </div>

        {/* Estate Information */}
        {/* <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estate Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{estate.owner}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{estate.address}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{estate.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Admin ID: {estate.phone_number}
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EstateDetails;
