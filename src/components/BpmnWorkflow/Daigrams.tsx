import Link from "next/link";
import { Trash2, Download, Edit2, Copy } from "lucide-react";
import { SessionData } from "@/libs/session";
import DataTable from "@/components/DataTable";

export default function Daigrams({ session, endpoint }: { session: SessionData, endpoint: string }) {
  return (
    <DataTable
      columns={[
        { field: "username", label: "Username", render: (value, row) => <Link href={"/services/bpmn-workflow/modeler/" + row.id} className="text-primary-500 hover:text-primary-600">{value}</Link> },
        { field: "firstName", label: "First Name" },
        { field: "lastName", label: "Last Name" },
        { field: "email", label: "Email" },
        {
          field: "status", label: "Status", type: "select", options: [
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ], defaultValue: "Active"
        },
      ]}
      isSelectable={true}      
      endpoint={endpoint}
      resultVariable="users"
      actions={[
        { label: "Edit", icon: <Edit2 size={16} className="text-primary-500 hover:text-primary-600" />, onClick: (e, selected) => { console.log(selected) }, multiple: false },
        { label: "Trash", icon: <Trash2 size={16} className="text-red-500 hover:text-red-600" />, onClick: (e, selected) => { console.log(selected) } },
        { label: "Download", icon: <Download size={16} className="text-green-500 hover:text-green-600" />, onClick: (e, selected) => { console.log(selected) } },
      ]}
      session={session}
    />
  )
}