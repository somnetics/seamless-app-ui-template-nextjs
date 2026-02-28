import Link from "next/link";
import { Edit2, Trash2, Download } from "lucide-react";
import { SessionData } from "@/libs/session";
import SearchTable from "@/components/SearchTable";
import TabContent from "@/components/TabContent";
import Button from "@/components/Button";

import Records from "./Records";
import Trash from "./Trash";

export default function Organisation({ session }: { session: SessionData }) {
  return (
    <>
      <TabContent
        tabs={[
          { name: "Records", icon: "Files", link: "/admin/organisation/records", content: <Records session={session} endpoint="/identity-demo/organizations/search" /> },
          { name: "Trash", icon: "Trash", link: "/admin/organisation/trash", content: <Records session={session} endpoint="/identity-demo/organizations/search?search_parameters=eyJsZWdhbF9uYW1lIjoiMSJ9" /> },
        ]}
        controls={
          <>
            <Button color="secondary" size="md">Export</Button>
            <Button color="primary" size="md">Create</Button>
          </>
        }
        containerClassName="p-0 pt-3 mb-8"
        ulClassName="flex items-center"
        liClassName="py-4"
      />
    </>
  )
}