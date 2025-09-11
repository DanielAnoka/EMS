import { Bell, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CreateNotification } from "../../types/notifications";
import InputField from "../ui/InputField";
import SelectField from "../ui/select";
import { useAuth } from "../../hooks/useAuth";

interface AddNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (notificationData: CreateNotification) => void;
}

const AddNotifications = ({ isOpen, onClose, onAdd }: AddNotificationsProps) => {
  const { user, role } = useAuth();

  // normalize roles from auth (string | string[])
  const roles = useMemo<string[]>(() => {
    if (!role) return [];
    return Array.isArray(role)
      ? role.map((r) => String(r).toLowerCase())
      : [String(role).toLowerCase()];
  }, [role]);

  const isSuperOrAdmin = roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");

  const currentEstateId = user?.user?.user_estate?.id ?? null;
  const currentUserId = user?.user?.id ?? 0; // created_by

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "" as "" | "email" | "whatsapp",
    audience: "" as "" | "landlord" | "tenant" | "both", // -> roles
    estate_id: 0,
    url: "",
    is_read: 0 as 0 | 1,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key as string]: "" }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    if (!form.type) newErrors.type = "Select a type";
    if (!form.audience) newErrors.audience = "Select an audience";

    if (!currentUserId) {
      newErrors.created_by = "Cannot determine current user (created_by).";
    }

    if (isEstateAdmin && !currentEstateId) {
      newErrors.estate_id = "No estate is linked to your account.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // estate id resolution
    const estateIdToUse: number | null = isSuperOrAdmin
      ? null // backend can treat null/omitted as "all estates" or you can pass 0 if required
      : isEstateAdmin
      ? Number(currentEstateId)
      : null;

    // map audience -> roles[]
    const rolesToUse =
      form.audience === "landlord"
        ? ["landlord"]
        : form.audience === "tenant"
        ? ["tenant"]
        : ["landlord", "tenant"]; // both

    const payload: CreateNotification = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type as "email" | "whatsapp",
      estate_id: estateIdToUse,
      url: form.url.trim(),
      is_read: form.is_read,
      created_by: Number(currentUserId),
      roles: rolesToUse as ("landlord" | "tenant")[],
    };

    onAdd(payload);
    setForm({
      title: "",
      message: "",
      type: "" as "" | "email" | "whatsapp",
      audience: "" as "" | "landlord" | "tenant" | "both",
      estate_id: 0,
      url: "",
      is_read: 0 as 0 | 1,
    });
    onClose();
  };

  // prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

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
        className={`
          absolute inset-y-0 right-0 w-full sm:max-w-md md:max-w-xl
          bg-white shadow-xl flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Notification</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <InputField
            id="title"
            label="Title"
            value={form.title}
            onChange={(v) => handleChange("title", v)}
            placeholder="e.g. Estate Meeting"
            required
            error={errors.title}
          />

          <InputField
            id="message"
            label="Message"
            value={form.message}
            onChange={(v) => handleChange("message", v)}
            placeholder="e.g. Meeting with residents"
            required
            rows={4}
            as="textarea"
            error={errors.message}
          />

          <SelectField
            id="type"
            label="Type"
            value={form.type}
            onChange={(v) => handleChange("type", v as "email" | "whatsapp")}
            placeholder="Select notification type"
            options={[
              { label: "Email", value: "email" },
              { label: "WhatsApp", value: "whatsapp" },
            ]}
            error={errors.type}
          />

          {/* Audience -> roles[] */}
          <SelectField
            id="audience"
            label="Audience"
            value={form.audience}
            onChange={(v) => handleChange("audience", v as "landlord" | "tenant" | "both")}
            placeholder="Select audience"
            options={[
              { label: "Landlord", value: "landlord" },
              { label: "Tenant", value: "tenant" },
              { label: "Both (Landlord & Tenant)", value: "both" },
            ]}
            error={errors.audience}
          />

          <InputField
            id="url"
            label="URL (Optional)"
            value={form.url}
            onChange={(v) => handleChange("url", v)}
            placeholder="e.g., /notification/1"
            error={errors.url}
          />

          {/* Estate info note for visibility */}
          {isEstateAdmin && currentEstateId && (
            <p className="text-xs text-gray-500">
              Notice: As an Estate Admin, this notification will be scoped to your estate
               {/* (ID: {currentEstateId}). */}
            </p>
          )}
          {errors.estate_id && <p className="text-sm text-red-600">{errors.estate_id}</p>}
          {errors.created_by && <p className="text-sm text-red-600">{errors.created_by}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNotifications;
