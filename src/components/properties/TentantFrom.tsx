import InputField from "../ui/InputField";
import type { TenantInfo } from "../../types/tentant";

interface TenantFormProps {
  tenant: TenantInfo;
  onChange: (key: keyof TenantInfo, value: string) => void;
  errors?: Record<string, string>;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenant, onChange, errors = {} }) => {
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-gray-50">
      <h4 className="font-medium">Tenant Details</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="tenant_name"
          label="Tenant Name"
          value={tenant.name}
          onChange={(v) => onChange("name", v)}
          required
          error={errors.tenant_name}
        />
        <InputField
          id="tenant_email"
          label="Tenant Email"
          value={tenant.email}
          onChange={(v) => onChange("email", v)}
          required
          error={errors.tenant_email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="tenant_phone"
          label="Tenant Phone (optional)"
          value={tenant.phone_number || ""}
          onChange={(v) => onChange("phone_number", v)}
        />
        <InputField
          id="tenant_address"
          label="Tenant Address (optional)"
          value={tenant.address || ""}
          onChange={(v) => onChange("address", v)}
        />
      </div>

      {/* If you want to capture status explicitly (default to "active") */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Status</label>
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tenant.status || "active"}
          onChange={(e) => onChange("status", e.target.value as TenantInfo["status"])}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.tenant_status && (
          <p className="mt-1 text-xs text-red-600">{errors.tenant_status}</p>
        )}
      </div>
    </div>
  );
};

export default TenantForm;
