import DataTable from "@/components/DataTable";

export type DataType = {
  name: string;
  value: string;
  type: string;
}

export default function ApiDocs({ data }: { data: DataType[] | undefined }) {
  // console.log(data)

  return (
    <DataTable
      name="medicine"
      columns={[
        { name: "id", label: "id", type: "hidden" },
        { name: "name", label: "Name", width: "80px", type: "text", readOnly: true },
        { name: "value", label: "Value", width: "105px", type: "text" },
        { name: "type", label: "Type", width: "155px", type: "text", readOnly: true },
      ]}
      value={data}
      canDelete={false}
      canAppend={false}
      onAddFocusField="name"
    />
  )
}