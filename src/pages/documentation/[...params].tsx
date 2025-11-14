import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Header from "@/components/Header";
import Page from "@/components/Page";
import Button from "@/components/Button";
import Form from "@/components/FormOld";
import { Home, Trash, Binoculars, Plus, Bolt } from "lucide-react";
import ApiDocumentationMenu from "@/components/ApiDocumentationMenu";
import TabContent from "@/components/TabContent";
import Textbox from "@/components/Textbox";

export default function Documentation({ session }: { session: SessionData }) {
  // const [open, setOpen] = useState(true);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]} menu={<ApiDocumentationMenu session={session} />}>
        <div className="px-12">
          <div className="p-4">
            <span className="font-semibold text-sm w-auto">Search User</span>
            <div className="p-2 mt-4 flex items-center border border-gray-700 rounded-md w-auto space-x-2">
              <div className="flex items-center bg-gray-700 text-green-400 text-sm font-semibold p-2 rounded">
                <span>GET</span>
              </div>
              <Textbox type="text" esize="sm" rounded="sm" placeholder="https://example.com/api/user/search" className="py-1" value="http://172.30.10.10:3000/api/v1/test" />
              <Button type="button" color="primary">Test</Button>
            </div>
          </div>
        </div>
        <TabContent ulClassName="px-12 mt-3 mb-4 justify-start" tabs={[
          { name: "Params", icon: "BookText", link: "/documentation/params", content: <h1>Params</h1> },
          { name: "Authorization", icon: "Workflow", link: "/documentation/authorization", content: <h1>Authorization</h1> },
          { name: "Headers", icon: "Trash2", link: "/documentation/headers", content: <h1>Headers</h1> },
          { name: "Body", icon: "Trash2", link: "/documentation/body", content: <h1>Body</h1> },
          { name: "Scripts", icon: "Trash2", link: "/documentation/scripts", content: <h1>Scripts</h1> },
          { name: "Tests", icon: "Trash2", link: "/documentation/tests", content: <h1>Tests</h1> },
          { name: "Settings", icon: "Trash2", link: "/documentation/settings", content: <h1>Settings</h1> },
        ]} />
      </Page>
    </>
  );
}

export const getServerSideProps = checkSession;
