import SchemaView from "./SchemaView";

export default function ApiEndpoint({ path, method, details, schemas }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        {method.toUpperCase()} {path}
      </h1>

      <p className="mt-2 text-gray-600">{details.description}</p>

      {/* Parameters */}
      {details.parameters && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Parameters</h2>
          <div className="space-y-2">
            {details.parameters.map((p, i) => (
              <div key={i} className="p-3 border rounded bg-white shadow">
                <p><strong>{p.name}</strong> ({p.in})</p>
                <p className="text-sm text-gray-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Body */}
      {details.requestBody && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Request Body</h2>

          <SchemaView
            schema={
              details.requestBody.content["application/json"]?.schema
            }
            schemas={schemas}
          />
        </div>
      )}

      {/* Responses */}
      {details.responses && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Responses</h2>

          {Object.entries(details.responses).map(([code, res], i) => (
            <div key={i} className="mt-3 border p-3 rounded shadow-sm">
              <p className="font-semibold">Status {code}</p>

              {res.content?.["application/json"]?.schema && (
                <SchemaView
                  schema={res.content["application/json"].schema}
                  schemas={schemas}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
