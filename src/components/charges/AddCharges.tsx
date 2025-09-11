import { Plus, X } from "lucide-react";
import {
  DURATION_MAP,
  type CreateChargePayload,
  type DurationType,
} from "../../types/charges";
import InputField from "../ui/InputField";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import SelectField from "../ui/select";
import { toNum } from "../../utils";

interface AddChargesProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (chargesData: CreateChargePayload) => void;
}

type FormState = {
  name: string;
  amount: string;
  durationType: "" | DurationType;
  property_type_id: number | string;
  status: 0 | 1;
};

const AddCharges = ({ isOpen, onClose, onAdd }: AddChargesProps) => {
  const { user, role } = useAuth();

  const roles = useMemo<string[]>(() => {
    if (!role) return [];
    return Array.isArray(role)
      ? role.map((r) => String(r).toLowerCase())
      : [String(role).toLowerCase()];
  }, [role]);

  const isEstateAdmin = roles.includes("estate admin");

  // Keep IDs undefined if missing (don’t coerce to 0 here)
  const currentUserId = user?.user?.id as number | undefined;
  const currentEstateId = user?.user?.user_estate?.id ;

  const [form, setForm] = useState<FormState>({
    name: "",
    amount: "",
    durationType: "",
    property_type_id: 3,
    status: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key as string]: "" }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.amount.trim() || !Number.isFinite(toNum(form.amount)))
      newErrors.amount = "Enter a valid amount";
    if (!form.durationType) newErrors.durationType = "Select a duration";
    if (!currentUserId) newErrors.user_id = "Your user account is missing an ID.";

    // Estate Admin must have an estate
    if (isEstateAdmin && !currentEstateId) {
      newErrors.estate_id = "No estate is linked to your account.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

 
    const estateIdForCreate: number =
      isEstateAdmin ? (currentEstateId as number) : 0;

    const payload: CreateChargePayload = {
      name: form.name.trim(),
      amount: toNum(form.amount),
      duration: DURATION_MAP[form.durationType as DurationType],
      estate_id: estateIdForCreate,                 // ← now 0 for admin/super, estate id for estate admin
      property_type_id: toNum(form.property_type_id),
      status: form.status,
      user_id: currentUserId as number,
    };

    // console.log("CreateChargePayload →", payload);
    onAdd(payload);

    setForm({
      name: "",
      amount: "",
      durationType: "",
      property_type_id: 3,
      status: 1,
    });

    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "visible" : "invisible"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Charge</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              <InputField
                id="name"
                label="Name"
                value={form.name}
                onChange={(v) => handleChange("name", v)}
                placeholder="e.g. Service Charge"
                required
                error={errors.name}
              />

              <InputField
                id="amount"
                label="Amount (₦)"
                type="number"
                value={form.amount}
                onChange={(v) => handleChange("amount", v)}
                placeholder="e.g. 25000"
                required
                error={errors.amount}
              />

              <SelectField
                id="durationType"
                label="Duration *"
                value={form.durationType}
                onChange={(v) => handleChange("durationType", v as DurationType)}
                placeholder="Select duration"
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Yearly", value: "yearly" },
                  { label: "One Time Fee", value: "one_time" },
                ]}
                error={errors.durationType}
              />

              {errors.estate_id && (
                <p className="text-sm text-red-600">{errors.estate_id}</p>
              )}
              {errors.user_id && (
                <p className="text-sm text-red-600">{errors.user_id}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
              disabled={isEstateAdmin && !currentEstateId}
              title={isEstateAdmin && !currentEstateId ? "No active estate" : undefined}
            >
              <Plus className="w-4 h-4" />
              Add Charge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCharges;
