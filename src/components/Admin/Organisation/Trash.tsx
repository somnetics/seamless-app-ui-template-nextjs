import Link from "next/link";
import { Edit2, Trash2, Download } from "lucide-react";
import { SessionData } from "@/libs/session";
import SearchTable from "@/components/SearchTable";

export default function Search({ session, endpoint }: { session: SessionData, endpoint: string }) {
  return (
    <SearchTable
      columns={[
        { name: "legal_name", label: "Leagal Name", render: (value: any, row: any) => <Link href={"/services/bpmn-workflow/modeler/" + row.organization_id} className="text-blue-500 hover:text-blue-600">{value}</Link> },
        { name: "trade_name", label: "Trade Name" },
        { name: "owner", label: "Owner" },
      ]}
      primaryField="organization_id"
      endpoint={endpoint}
      searchParamsKey="search_parameters"
      // orderBy="con.id:desc"
      // orderByKey="sort"
      recordsPerPage={10}
      actions={[
        { label: "Edit", icon: <Edit2 size={16} className="text-blue-500 hover:text-blue-600" />, onClick: (e, row) => { console.log(row); } },
        { label: "Trash", icon: <Trash2 size={16} className="text-red-500 hover:text-red-600" />, onClick: () => { alert("OK"); } },
        { label: "Download", icon: <Download size={16} className="text-green-500 hover:text-green-600" />, onClick: () => { alert("OK"); } },
      ]}
      session={session}
      style={{ height: "calc(100vh - 271px)" }}
    />
  )
}