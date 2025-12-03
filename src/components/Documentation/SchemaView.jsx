export default function SchemaView({ schema, schemas }) {
  if (!schema) return null;

  // Resolve $ref
  if (schema.$ref) {
    const refName = schema.$ref.replace("#/components/schemas/", "");
    return <SchemaView schema={schemas[refName]} schemas={schemas} />;
  }

  return (
    <div className="border-l-4 border-blue-500 pl-4 mt-2 text-sm">
      {schema.type && <p>Type: {schema.type}</p>}

      {schema.properties &&
        Object.entries(schema.properties).map(([key, val]) => (
          <div key={key} className="mt-2">
            <p className="font-semibold">{key}</p>

            <SchemaView schema={val} schemas={schemas} />
          </div>
        ))}
    </div>
  );
}
