import type { LandlordInfo } from "../../types/property";
import InputField from "../ui/InputField";

interface LandlordFormProps {
  landlord: LandlordInfo;
  onChange: (key: keyof LandlordInfo, value: string) => void;
  errors?: Record<string, string>;
}

const LandLord = ({ landlord, onChange, errors = {} }: LandlordFormProps) => {
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-gray-50">
      <h4 className="font-medium">Landlord Details</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="landlord_name"
          label="Landlord Name"
          value={landlord.name}
          onChange={(v) => onChange("name", v)}
          required
          error={errors.landlord_name}
        />
        <InputField
          id="landlord_email"
          label="Landlord Email"
          value={landlord.email}
          onChange={(v) => onChange("email", v)}
          required
          error={errors.landlord_email}
        />
      </div>
    </div>
  );
};

export default LandLord;
