import Link from "next/link";

export default function FontGroupTable({ fontGroups, onEdit, onDelete }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Font Groups</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fonts
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Count
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {fontGroups.map((group) => (
              <tr key={group._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                  {group.name}
                </td>
                <td className="px-6 py-4 whitespace-normal text-xs text-gray-600 max-w-xs">
                  {group.fontIds.map((font) => font.name).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-medium">
                  {group.fontIds.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                  <button
                    onClick={() => onEdit(group)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(group._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
