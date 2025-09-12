// components/charges/PayCharges.tsx
import { Plus, X } from "lucide-react";
import type { CreatePaymentPayload } from "../../types/payment";
import type { Charge } from "../../types/charges";
import { useAuth } from "../../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import InputField from "../ui/InputField";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: CreatePaymentPayload) => void;
  charge: Charge | null;
}

const NUMERIC_KEYS = [
  "charge_id",
  "estate_property_id",
  "tenant_id",
  "amount",
] as const;

const PayCharges = ({ isOpen, onClose, onAdd, charge }: ModalProps) => {
  const { user } = useAuth();
 
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialEstatePropertyId = user?.tenants?.[0]?.estate_property?.id ?? 0;
    const initialEstateId = user?.tenants?.[0]?.estate?.id ?? 0;
  const initialTenantId = user?.tenants?.[0]?.id ?? 0;

  const computeInitial = useCallback<() => CreatePaymentPayload>(() => {
    return {
      phone_number: "",
      charge_id: charge?.id ?? 0,
      estate_property_id: initialEstatePropertyId,
      tenant_id: initialTenantId,
      amount: charge?.amount ?? 0,
      estate_id:initialEstateId,
    };
  }, [charge, initialEstatePropertyId, initialTenantId,initialEstateId]);

  const [form, setForm] = useState<CreatePaymentPayload>(computeInitial);


  useEffect(() => {
    if (isOpen) {
      setForm(computeInitial());
      setErrors({});
    }
  }, [isOpen, computeInitial]);

  const isNumericKey = (
    key: keyof CreatePaymentPayload
  ): key is (typeof NUMERIC_KEYS)[number] =>
    (NUMERIC_KEYS as readonly string[]).includes(key as string);

  function handleChange<K extends keyof CreatePaymentPayload>(
    key: K,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: isNumericKey(key) ? (value === "" ? 0 : Number(value)) : value,
    }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.charge_id) next.charge_id = "Missing charge";
    if (!form.phone_number || form.phone_number.trim().length < 7)
      next.phone_number = "Enter a valid phone number";
    if (!form.amount || form.amount <= 0)
      next.amount = "Amount must be greater than 0";
    if (!form.tenant_id) next.tenant_id = "Missing tenant";
    if (!form.estate_property_id) next.estate_property_id = "Missing property";
    if (!form.estate_id) next.estate_id = "Missing estate";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleClose() {
    setForm(computeInitial());
    setErrors({});
    onClose();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(form);
    setForm(computeInitial());
    setErrors({});
    onClose();
    console.log("Submitting payment", form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Make Payment{charge?.name ? ` — ${charge.name}` : ""}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <input type="hidden" value={form.charge_id} readOnly />

          <InputField
            label="Phone Number"
            value={form.phone_number}
            onChange={(v) => handleChange("phone_number", v)}
            type="tel"
            id="phone_number"
            placeholder="Enter phone number"
            required
            error={errors.phone_number}
          />

          <InputField
            label="Amount"
            value={String(form.amount)}
            onChange={(v) => handleChange("amount", v)}
            type="number"
            id="amount"
            placeholder="Enter amount"
            required
            error={errors.amount}
          />

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayCharges;
