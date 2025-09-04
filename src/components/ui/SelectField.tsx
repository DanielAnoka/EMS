import React from "react";

interface RoleSelectProps {
  label?: string;
  value: string ;
  onChange: (value: string) => void;
  allowedRoles: string[];
  roleLabels: Record<string, string>;
  required?: boolean;
  error?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  label = "Role",
  value,
  onChange,
  allowedRoles,
  roleLabels,
  required = false,
  error
}) => {
  return (
    <div>
      <label
        htmlFor="role"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <select
        id="role"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required} 
       
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      >
        {allowedRoles.map((role) => (
          <option key={role} value={role}>
            {roleLabels[role] || role}
          </option>
        ))}
      </select>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};
