import Textbox from "@/components/Textbox";
import CheckRadio from "@/components/CheckRadio";

export default function SchemaView({ schema, schemas }) {
  if (!schema) return null;

  // Resolve $ref
  if (schema.$ref) {
    const refName = schema.$ref.replace("#/components/schemas/", "");
    return <SchemaView schema={schemas[refName]} schemas={schemas} />;
  }

  return (
    <div className="mt-3">
      {/* {JSON.stringify(schema)} */}
      {/* {schema.type && <p>Type: {schema.type}</p>} */}
      <div className="border grid grid-cols-12">
        <div className="col-span-3 flex">
          <div className="border-e p-2 flex items-center">
            <CheckRadio type="checkbox" name={`chk_all`} />
          </div>
          <div className="p-1 border-e w-full">Key</div>
        </div>
        <div className="p-1 col-span-3 border-e">Value</div>
        <div className="p-1 col-span-3 border-e">Type</div>
        <div className="p-1 col-span-3">Description</div>
      </div>
      {schema.properties &&
        Object.entries(schema.properties).map(([key, val], index) => (
          <>
            <div key={index} className="border grid grid-cols-12 border-t-0">
              {/* <p className="font-semibold">{key}</p> */}
              {/* <p>{schema.properties[key].title}</p> */}
              {/* <p>{JSON.stringify(schema.properties[key])}</p> */}
              {/* <Textbox type="text" name={key} defaultValue={key} esize="sm" /> */}
              {/* <p className="font-semibold">{JSON.stringify(val)}</p> */}
              {/* <SchemaView schema={val} schemas={schemas} /> */}
              <div className="col-span-3 flex">
                <div className="border-e p-2 flex items-center">
                  <CheckRadio type="checkbox" name={`chk_${key}`} />
                </div>
                <div className="p-1 border-e w-full">
                  <Textbox type="text" esize="sm" defaultValue={key} />
                </div>
              </div>
              <div className="p-1 col-span-3 border-e">
                <Textbox type="text" esize="sm" />
              </div>
              <div className="p-1 col-span-3 border-e">{schema.properties[key].type}</div>
              <div className="p-1 col-span-3">{schema.properties[key].title}</div>
            </div>
            {/* <SchemaView schema={val} schemas={schemas} /> */}
          </>
        ))}
    </div>
  );
}
