import type { Attribute } from "../../types/attribute";


interface TablePro {
  attributes: Attribute[];
}

const AttributeTable = ({ attributes }: TablePro) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">S/N</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Label</th>
          
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {attributes.map((attr, index) => (
            <tr key={attr.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-3">{attr.name}</td>
              <td className="px-6 py-3">{attr.label}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeTable;
