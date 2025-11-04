import Link from "next/link";
import { Trash2, Download, Edit2, Copy } from "lucide-react";
import DataTable from "@/components/DataTable";

export default function Daigrams({ state }: { state: boolean }) {
  return (
    <DataTable
      columns={[
        { field: "username", label: "Username", render: (row) => <Link href={"/services/bpmn-workflow/modeler/" + row} className="text-blue-500 hover:text-blue-600">{row}</Link> },
        { field: "fullname", label: "Fullname" }
      ]}
      endpoint=""
      // isSearchable={false}
      actions={[
        { label: "Edit", icon: <Edit2 size={16} className="text-blue-500 hover:text-blue-600" />, onClick: (e, data) => { console.log(e.target); console.log(data) } },
        { label: "Trash", icon: <Trash2 size={16} className="text-red-500 hover:text-red-600" />, onClick: () => { alert("OK") } },
        { label: "Download", icon: <Download size={16} className="text-green-500 hover:text-green-600" />, onClick: () => { alert("OK") } },
      ]}
    />
  )
}