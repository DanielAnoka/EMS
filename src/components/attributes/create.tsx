import { useEffect, useState, useCallback } from "react";
import { ListPlus, X } from "lucide-react";

import InputField from "../ui/InputField";
import type { CreatePropertyAttributePayload } from "../../types/attribute";

interface CreateAttributeProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (attribute: CreatePropertyAttributePayload) => void;
}

const CreateAttribute = ({
  isOpen,
  onClose,
  onCreate,
}: CreateAttributeProps) => {
  const [form, setForm] = useState<CreatePropertyAttributePayload>({
    name: "",
    label: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.label.trim()) nextErrors.label = "Label is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);

      const payload: CreatePropertyAttributePayload = {
        name: form.name.trim(),
        label: form.label.trim(),
      };
      onCreate(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", label: "" });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Create Property Attribute"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ListPlus  className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Property Attribute
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]"
        >
          <InputField
            label="Name"
            id="name"
            value={form.name}
            onChange={(value) => handleChange("name", value)}
            error={errors.name}
            placeholder="e.g., Bedrooms"
          />
          <InputField
            label="Label"
            id="label"
            value={form.label}
            onChange={(value) => handleChange("label", value)}
            error={errors.label}
            placeholder="e.g., Number of Bedrooms"
          />

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Attribute"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default CreateAttribute;
