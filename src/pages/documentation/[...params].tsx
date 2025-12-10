import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Header from "@/components/HeaderBar";
import Page from "@/components/Page";
import Button from "@/components/Button";
import Form from "@/components/FormOld";
import { Home, Trash, Binoculars, Plus, ExternalLink } from "lucide-react";
import ApiDocumentationMenu from "@/components/ApiDocumentationMenu";
import TabContent from "@/components/TabContent";
import Textbox from "@/components/Textbox";

import { Apis, Api } from "@/libs/apis";
import { twMerge } from "tailwind-merge";

interface PageProps {
  session: SessionData;
  service: Api;
  id: string;
  tab: string;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function Documentation({ session, meta, service, id, tab }: PageProps) {
  const [apiDetails, setApiDetails] = useState<any>({});
  const [endpoints, setEndpoints] = useState<any>();

  useEffect(() => {
    // console.log(apiDetails)
  }, [apiDetails]);

  useEffect(() => {
    if (endpoints && id) {      
      setApiDetails(endpoints.find((endpoint: any) => endpoint.operationId == id));
    }
  }, [endpoints, id]);

  return (
    <>
      <Page session={session} title={`${service.title} - Documentation`} breadcrumbs={[{ link: "/", name: "Home" }]} menu={<ApiDocumentationMenu session={session} service={service} endpoints={endpoints} setEndpoints={setEndpoints} />}>
        <div className="relative mx-auto flex flex-col">
          <div className="px-12">
            <div className="w-full p-4 mx-auto1 border-b1 border-black/10 dark:border-white/101">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image className="h-[60px]" src={service.icon || ""} alt={service.title || ""} width={60} height={60} />
                  <div className="flex flex-col justify-center">
                    <h2 className="text-[24px] font-semibold">{service.title}</h2>
                    <p className="truncate overflow-hidden text-ellipsis text-gray-600 dark:text-gray-300">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 mx-auto1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <div className="flex items-center border-r border-black/10 dark:border-white/10">
                  <div className="flex flex-col justify-center">
                    <p className="font-semibold">Name</p>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">{service.title}</p>
                  </div>
                </div>
                <div className="flex items-center border-r border-black/10 dark:border-white/10">
                  <div className="flex flex-col justify-center">
                    <p className="font-semibold">Version</p>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">3.5</p>
                  </div>
                </div>
                <div className="flex items-center border-r border-black/10 dark:border-white/10">
                  <div className="flex flex-col justify-center">
                    <p className="font-semibold">Type</p>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">Public API</p>
                  </div>
                </div>
                <div className="flex items-center border-r border-black/10 dark:border-white/10">
                  <div className="flex flex-col justify-center">
                    <p className="font-semibold">Status</p>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">Active</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex flex-col justify-center">
                    <p className="font-semibold">Documentation</p>
                    <Link href={`/services/${service.name}/overview`} className="text-[13px] flex items-center">
                      <span className="me-2">Service Details</span>
                      <ExternalLink size={15} className="text-primary-500 hover:text-primary-600" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <span className="font-semibold text-sm w-auto">{apiDetails.name || apiDetails.link}</span>
              <div className="p-2 mt-4 flex items-center border border-gray-700 rounded-md w-auto space-x-2">
                <div className={twMerge("flex items-center bg-gray-700 text-sm font-semibold p-2 rounded", apiDetails.color)}>
                  <span>{apiDetails.method}</span>
                </div>
                <Textbox type="text" esize="sm" rounded="sm" className="py-1" defaultValue={apiDetails.link} />
                <Button type="button" color="primary">Test</Button>
              </div>
            </div>
          </div>
          {id && (
            <TabContent ulClassName="px-12 mt-3 mb-4 justify-start" tabs={[
              { name: "Params", icon: "BookText", link: `/documentation/${service.name}/v3.5/${id}/params`, content: <h1>Params</h1> },
              { name: "Authorization", icon: "Workflow", link: `/documentation/${service.name}/v3.5/${id}/authorization`, content: <h1>Authorization</h1> },
              { name: "Headers", icon: "Trash2", link: `/documentation/${service.name}/v3.5/${id}/headers`, content: <h1>Headers</h1> },
              { name: "Body", icon: "Trash2", link: `/documentation/${service.name}/v3.5/${id}/body`, content: <h1>Body</h1> },
              { name: "Response", icon: "Trash2", link: `/documentation/${service.name}/v3.5/${id}/response`, content: <h1>Response</h1> }
            ]} />
          )}
        </div>
      </Page>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Access context properties with type safety
  const { query, req, res, resolvedUrl } = context;

  // set page metadata
  const meta = {
    title: "Seamless 4.0 Dshboard",
    description: "This is a great product.",
    keywords: `product, workflow`,
  };

  let session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (typeof session.isLoggedIn === "undefined") {
    session = { ...defaultSession, ...session };
  }

  // get url path
  const path = resolvedUrl.split("/");

  return {
    props: {
      session,
      service: Apis.find((app) => app.name == path[2]),
      id: path[4] || "",
      tab: path[5] || "params",
      meta: meta,
    },
  };
};
