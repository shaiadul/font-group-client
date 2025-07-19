export default function FontTable({ fonts, onDelete }) {
  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold mb-6">All Uploaded Fonts</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Font Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Font Id (Server Generated)
              </th>

              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {fonts.map((font) => (
              <tr key={font._id} className={`hover:bg-gray-50 cursor-pointer`}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {font.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {font._id}{" "}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(font._id);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    title="Delete Font"
                  >
                    Delete{" "}
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
