import { Plus, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import CreateAttribute from "./create";
import {
  useCreatePropertyAttribute,
  useGetAttribute,
} from "../../services/attributes";
import type { CreatePropertyAttributePayload } from "../../types/attribute";
import AttributeTable from "./attributeTable";
import { TableSkeleton } from "../ui/TableSkeleton";
import SearchBar from "../ui/search";

const AttributeManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { mutate: create } = useCreatePropertyAttribute();

  // Always default to [] so .filter/.map are safe
  const { data: attributes = [], isLoading, isFetching } = useGetAttribute();

  const handleCreate = (payload: CreatePropertyAttributePayload) => {
    create(payload, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      },
    });
  };

  const filteredAttributes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return attributes;
    return attributes.filter((a: { name?: string; label?: string }) => {
      const name = (a?.name ?? "").toLowerCase();
      const label = (a?.label ?? "").toLowerCase();
      return name.includes(q) || label.includes(q);
    });
  }, [attributes, searchTerm]);

  const showEmpty =
    !isLoading && !isFetching && filteredAttributes.length === 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Attributes Management
          </h2>

          <button
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new attribute"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Attribute
          </button>
        </div>

        <SearchBar
          placeholder="Search Attributes..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <CreateAttribute
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreate}
      />

      <div className="mt-6">
        {isLoading ? (
          <TableSkeleton rows={8} showActions />
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <SearchX className="w-12 h-12 mb-3 text-gray-400" />
            <p>No attributes found.</p>
          </div>
        ) : (
          <AttributeTable attributes={filteredAttributes} />
        )}
      </div>
    </>
  );
};

export default AttributeManagement;
