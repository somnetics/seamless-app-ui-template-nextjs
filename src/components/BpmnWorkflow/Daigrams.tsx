import Link from "next/link";
import { Trash2, Download, Edit2, Copy } from "lucide-react";
import { SessionData } from "@/libs/session";
import DataTable from "@/components/DataTable";

export default function Daigrams({ session, endpoint }: { session: SessionData, endpoint: string }) {
  return (
    <DataTable
      columns={[
        { field: "username", label: "Username", render: (value, row) => <Link href={"/services/bpmn-workflow/modeler/" + row.id} className="text-primary-500 hover:text-primary-600">{value}</Link> },
        { field: "fullname", label: "Fullname" },
        {
          field: "status", label: "Status", type: "select", options: [
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ], defaultValue: "Active"
        },
      ]}
      endpoint={endpoint}
      actions={[
        { label: "Edit", icon: <Edit2 size={16} className="text-primary-500 hover:text-primary-600" />, onClick: (e, row) => { alert(row) } },
        { label: "Trash", icon: <Trash2 size={16} className="text-red-500 hover:text-red-600" />, onClick: () => { alert("OK") } },
        { label: "Download", icon: <Download size={16} className="text-green-500 hover:text-green-600" />, onClick: () => { alert("OK") } },
      ]}
      session={session}
    />
  )
}