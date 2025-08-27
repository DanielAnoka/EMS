import type { TenantInfo } from "../../types/property";
import InputField from "../ui/InputField";

interface TenantFormProps {
  tenant: TenantInfo;
  onChange: (key: keyof TenantInfo, value: string) => void;
  errors?: Record<string, string>;
}

const TenantForm = ({ tenant, onChange, errors = {} }: TenantFormProps) => {
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
    </div>
  );
};

export default TenantForm;
