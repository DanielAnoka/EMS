import React from "react";
import { Filter } from "lucide-react";

export type RoleOption = { value: string; label: string };

interface RoleFilterProps {
  value: string;
  onChange: (value: string) => void;
  roles: RoleOption[];             
  showIcon?: boolean;               
  leadingOption?: RoleOption | null; 
  containerClassName?: string;      
  className?: string;
}
export const RoleFilter: React.FC<RoleFilterProps> = ({
  value,
  onChange,
  roles,
  showIcon = true,
  leadingOption = { value: "all", label: "All Roles" },
  containerClassName = "",
  className = "",
  ...selectProps
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {showIcon && (
        <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${
          showIcon ? "pl-10" : "pl-3"
        } pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${className}`}
        {...selectProps}
      >
        {leadingOption && (
          <option value={leadingOption.value}>{leadingOption.label}</option>
        )}
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
};

