export default function ApiSidebar({ paths, onSelect }) {
  return (
    <div className="w-72 border-r p-4 overflow-y-auto bg-gray-50">
      <h3 className="font-bold text-lg mb-4">API Endpoints</h3>

      {Object.keys(paths).map((path) => (
        <div key={path} className="mb-4">
          <p className="text-sm font-semibold text-gray-600">{path}</p>
          <div className="ml-2 mt-1 space-y-1">
            {Object.keys(paths[path]).map((method) => (
              <button
                key={method}
                onClick={() => onSelect(path, method)}
                className="block w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-200"
              >
                <span className="uppercase font-bold">{method}</span> →{" "}
                {paths[path][method].summary || "No summary"}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
