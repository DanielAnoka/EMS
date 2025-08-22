import { CheckCircle, Copy, X } from "lucide-react";
import { useState } from "react";
import type { CreateEstatePayload } from "../../types/estate";

interface EstateLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: CreateEstatePayload;
}

const EstateLogin = ({ isOpen, onClose, estate }: EstateLoginModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyCredentials = async () => {
    try {
      const credentials = `Email: ${estate.user.email}\nPassword: ${
        estate.user.password || "********"
      }`;
      await navigator.clipboard.writeText(credentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy credentials:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Estate Admin Login
            </h2>
            <p className="text-sm text-gray-600 mt-1">For {estate.user.name}</p>
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
          <h3 className="font-medium text-blue-900 mb-3">
            Estate Admin Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Email:</span>
              <span className="font-medium text-blue-900">
                {estate.user.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Password:</span>
              <span className="font-mono text-blue-900">
                {estate.user.password || "••••••••"}
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

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">
            Important Instructions
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Share these credentials securely with the estate admin</li>
            <li>• Admin should change password after first login</li>
            <li>• Admin will have full access to manage this estate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EstateLogin;
