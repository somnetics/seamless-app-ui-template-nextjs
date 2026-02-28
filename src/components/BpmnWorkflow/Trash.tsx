import Link from "next/link";
import { Trash2, Download, Edit2, Copy, Key } from "lucide-react";
import { SessionData } from "@/libs/session";
import SearchTable from "@/components/SearchTable";

export default function Trash({ session, endpoint }: { session: SessionData, endpoint: string }) {
  return (
    <div className="px-4 mb-7">
      <SearchTable
        columns={[
          { name: "legal_name", label: "Leagal Name", render: (value: any, row: any) => <Link href={"/services/bpmn-workflow/modeler/" + row.id} className="text-blue-500 hover:text-blue-600">{value}</Link> },
          { name: "trade_name", label: "Trade Name" },
          { name: "owner", label: "Owner" },
        ]}
        primaryField="organization_id"
        endpoint={"/identity-demo/organizations/search"}
        searchParamsKey="search_parameters"
        // orderBy="con.id:desc"
        // orderByKey="sort"
        recordsPerPage={10}
        actions={[
          { label: "Edit", icon: <Edit2 size={16} className="text-blue-500 hover:text-blue-600" />, onClick: (e: any, row: any) => { alert(row); } },
          { label: "Trash", icon: <Trash2 size={16} className="text-red-500 hover:text-red-600" />, onClick: () => { alert("OK"); } },
          { label: "Download", icon: <Download size={16} className="text-green-500 hover:text-green-600" />, onClick: () => { alert("OK"); } },
        ]}        
        session={session}
        style={{ height: "calc(100vh - 446px)" }}
      />
    </div>
  )
}