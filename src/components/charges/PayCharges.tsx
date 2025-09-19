// components/charges/PayCharges.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, X } from "lucide-react";
import type { CreatePaymentPayload } from "../../types/payment";
import type { Charge } from "../../types/charges";
import { useAuth } from "../../hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputField from "../ui/InputField";
import SelectField from "../ui/select";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

type PaymentMethod = "paystack";

export type CartItemMeta = {
  charge_id: number;
  name: string;
  unit_amount: number;
  quantity: number;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  // 🔹 existing single-charge flow
  charge: Charge | null;

  // 🔹 NEW: cart support
  mode?: "single" | "cart";
  amountOverride?: number;           // total cart amount (in NGN)
  cartItems?: CartItemMeta[];        // line items for metadata

  onAdd: (
    payload: CreatePaymentPayload & {
      payment_method: PaymentMethod;
      reference?: string;
      gateway?: "paystack";
      status?: "success" | "failed" | "cancelled";
      payload?: unknown;             // you can store cart items here too
    }
  ) => void;
}

type PayChargeForm = CreatePaymentPayload & {
  payment_method: "" | PaymentMethod;
};

const NUMERIC_KEYS = ["charge_id", "estate_property_id", "tenant_id", "amount"] as const;

const PayCharges = ({
  isOpen,
  onClose,
  onAdd,
  charge,
  mode = "single",
  amountOverride,
  cartItems = [],
}: ModalProps) => {
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialEstatePropertyId = useMemo(
    () => user?.tenants?.[0]?.estate_property?.id ?? 0,
    [user]
  );
  const initialEstateId = useMemo(() => user?.tenants?.[0]?.estate?.id ?? 0, [user]);
  const initialTenantId = useMemo(() => user?.tenants?.[0]?.id ?? 0, [user]);

  const computeInitial = useCallback<() => PayChargeForm>(() => {
    return {
      phone_number: "",
      charge_id: mode === "cart" ? 0 : (charge?.id ?? 0), // cart has multiple charges
      estate_property_id: initialEstatePropertyId,
      tenant_id: initialTenantId,
      amount: amountOverride ?? charge?.amount ?? 0,       // 👈 use cart total if provided
      estate_id: initialEstateId,
      payment_method: "",                                  // user still selects Paystack
    };
  }, [charge, mode, amountOverride, initialEstatePropertyId, initialTenantId, initialEstateId]);

  const [form, setForm] = useState<PayChargeForm>(computeInitial);

  useEffect(() => {
    if (isOpen) {
      setForm(computeInitial());
      setErrors({});
    }
  }, [isOpen, computeInitial]);

  const isNumericKey = (key: keyof PayChargeForm): key is (typeof NUMERIC_KEYS)[number] =>
    (NUMERIC_KEYS as readonly string[]).includes(key as string);

  function handleChange<K extends keyof PayChargeForm>(key: K, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: isNumericKey(key) ? (value === "" ? 0 : Number(value)) : (value as any),
    }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.phone_number || form.phone_number.trim().length < 7)
      next.phone_number = "Enter a valid phone number";
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0";
    if (!form.tenant_id) next.tenant_id = "Missing tenant";
    if (!form.estate_property_id) next.estate_property_id = "Missing property";
    if (!form.estate_id) next.estate_id = "Missing estate";
    if (!form.payment_method) next.payment_method = "Select a payment method";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const ensurePaystackScript = async () => {
    if (window.PaystackPop) return;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Paystack script"));
      document.body.appendChild(script);
    });
  };

  const runPaystack = async () => {
    await ensurePaystackScript();

    const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;
    if (!key) {
      console.error("Missing VITE_PAYSTACK_PUBLIC_KEY");
      return;
    }

    const email =
      (user as any)?.email || (user as any)?.user?.email || "no-email@placeholder.com";

    const ref = `EST-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

    const handler = window.PaystackPop.setup({
      key,
      email,
      amount: Math.round(Number(form.amount) * 100),
      currency: "NGN",
      ref,
      metadata: {
        // 🔹 plain KV: useful on verify/webhook (not shown on dashboard)
        mode,
        tenant_id: form.tenant_id,
        estate_id: form.estate_id,
        estate_property_id: form.estate_property_id,
        cart_count: mode === "cart" ? cartItems.length : 0,
        items: mode === "cart" ? cartItems : undefined, // keep it machine-friendly

        // 🔹 visible on Dashboard
        custom_fields: [
          { display_name: "Mode", variable_name: "mode", value: mode },
          { display_name: "Tenant ID", variable_name: "tenant_id", value: String(form.tenant_id) },
          { display_name: "Estate ID", variable_name: "estate_id", value: String(form.estate_id) },
          ...(mode === "single"
            ? [
                { display_name: "Charge ID", variable_name: "charge_id", value: String(form.charge_id) },
              ]
            : [
                {
                  display_name: "Cart Items",
                  variable_name: "cart_items",
                  value: `${cartItems.length} item(s)`,
                },
              ]),
          { display_name: "Phone", variable_name: "phone_number", value: form.phone_number },
        ],
      },
      callback: (response: { reference: string; status: string; message?: string }) => {
        onAdd({
          ...form,
          payment_method: "paystack",
          reference: response.reference,
          gateway: "paystack",
          status: response.status === "success" ? "success" : "failed",
          payload: mode === "cart" ? { items: cartItems } : undefined, // optional mirror
        });

        setForm(computeInitial());
        setErrors({});
        onClose();
      },
      onClose: () => {},
    });

    handler.openIframe();
  };

  function handleClose() {
    setForm(computeInitial());
    setErrors({});
    onClose();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (form.payment_method === "paystack") {
      runPaystack();
      return;
    }
  };

  if (!isOpen) return null;

  const titleSuffix =
    mode === "single" ? (charge?.name ? ` — ${charge.name}` : "") : " — Cart Checkout";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Make Payment{titleSuffix}</h2>
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
          {/* Hidden charge_id is 0 in cart mode */}
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
            readOnly
          />

          <SelectField
            label="Payment Method"
            id="payment_method"
            placeholder="Select a payment method"
            value={form.payment_method}
            onChange={(v) => handleChange("payment_method", v)}
            options={[{ label: "Paystack", value: "paystack" }]}
            error={errors.payment_method}
            required
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
