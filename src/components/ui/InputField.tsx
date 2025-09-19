import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  onChange: (value: string) => void;
  readOnly?: boolean; 
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  readOnly = false,
  type = "text",
  placeholder,
  value,
  error,
  required = false,
  as = "input",
  rows = 3,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          readOnly={readOnly}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-300" : "border-gray-300"
          } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`} 
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly} 
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-300" : "border-gray-300"
          } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      )}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
