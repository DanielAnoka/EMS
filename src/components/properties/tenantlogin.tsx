import { CheckCircle, Copy, X } from "lucide-react";
import type { TenantStatus } from "../../types/tenant";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: TenantStatus;
}
const TenantLogin = ({ isOpen, onClose, property }: ModalProps) => {
  const [copied, setCopied] = useState(false);
  const copyCredentials = async () => {
    try {
      const credentials = `Email: ${property.user.email}\nPassword: ${
        property.user.password || "********"
      }`;
      await navigator.clipboard.writeText(credentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy credentials:", err);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Login Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              For property at {property?.user?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Credentials */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Email:</span>
              <span className="font-medium text-blue-900">
                {property?.user?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Password:</span>
              <span className="font-mono text-blue-900">
                {property?.user?.password || "••••••••"}
              </span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150"
          >
            Close
          </button>

          <button
            onClick={copyCredentials}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;
