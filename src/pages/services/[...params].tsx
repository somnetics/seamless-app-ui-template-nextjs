// import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
// import Image from "next/image";
// import Head from "next/head";
// import MainMenu from "@/components/MainMenu";
// import Header from "@/components/Header";
// import { Apis, Api } from "@/libs/apis";
import { ExternalLink, Trash2, Download, Edit2, Copy, ArrowLeft, KeySquare, Plus } from "lucide-react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import MainMenu from "@/components/MainMenu";
import Header from "@/components/HeaderBar";
import Page from "@/components/Page";
import Button from "@/components/Button";
import { ScrollText } from "lucide-react";
import Form from "@/components/FormOld";
import TabContent from "@/components/TabContent";

import { Services, Service } from "@/libs/services";
import { Apis, Api } from "@/libs/apis";

import Overview from "@/components/Services/Overview";
import Logs from "@/components/Services/Logs";

interface PageProps {
  session: SessionData;
  service: Api;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function ApiDetails({ session, meta, service }: PageProps) {
  const router = useRouter();

  // const [serviceDetails, setServiceDetails] = useState<Api>();

  // useEffect(() => {
  //   if (router.query.params) {
  //     const serviceName = router.query.params[0];
  //     setServiceDetails(Apis.find((app) => app.name == serviceName))
  //   }
  // }, [router.query.params])

  return (
    <>
      <Page session={session} title={service.title} breadcrumbs={[
        { link: "/services", name: "Services" },
        { link: "/services/" + service.name, name: service.title },
      ]}>
        <div className="relative mx-auto flex flex-col">
          <div className="px-12">
            <div className="w-full p-4 mx-auto1 border-b1 border-black/10 dark:border-white/101">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
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
                    <a href={`/documentation/${service.name}/v3.5`} className="text-[13px] text-blue-500 hover:text-blue-600 flex items-center">
                      <span className="me-2">API Documentation</span>
                      <ExternalLink size={15} className="text-blue-500 hover:text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TabContent ulClassName="px-12 mt-3 mb-4 justify-start" tabs={[
            { name: "Overview", icon: "BookText", link: `/services/${service.name}/overview`, content: <Overview /> },
            { name: "Logs", icon: "ScrollText", link: `/services/${service.name}/logs`, content: <Logs /> },
          ]} />
          {/* <div className="mb-4 border-b border-black/10 dark:border-white/10">
            <ul className="flex flex-wrap -mb-px text-sm font-medium px-12 text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
              <li className="me-3" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
                  API Keys
                </button>
              </li>
              <li className="me-3" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">
                  OAuth 2.0 Client IDs
                </button>
              </li>
              <li className="me-3" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="true">
                  OAuth 2.0 Client IDs
                </button>
              </li>
            </ul>
          </div> */}
          <div id="default-tab-content">
            <div className="hidden1 rounded-lg px-12" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="w-[20px] px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </th>
                    <th className="text-left p-2.5">Name</th>
                    <th className="text-left p-2.5">Creation On</th>
                    <th className="text-left p-2.5">Creation By</th>
                    <th className="text-left p-2.5">Client ID</th>
                    <th className="p-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Webclient</td>
                    <td className="text-left p-2.5">24-03-2025</td>
                    <td className="text-left p-2.5">Sayan Das</td>
                    <td className="text-left p-2.5">
                      <a href="#" className="flex items-center">
                        <span className="me-2">3569709469305-rdf...</span>
                        <Copy size={15} className="text-green-600" />
                      </a>
                    </td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-500 hover:text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-700 dark:text-gray-100 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Desktop Application</td>
                    <td className="text-left p-2.5">25-03-2025</td>
                    <td className="text-left p-2.5">Soumen Sardar</td>
                    <td className="text-left p-2.5">
                      <a href="#" className="flex items-center">
                        <span className="me-2">9669869441305-cdq...</span>
                        <Copy size={15} className="text-green-600" />
                      </a>
                    </td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-500 hover:text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-700 dark:text-gray-100 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Mobile Application</td>
                    <td className="text-left p-2.5">27-03-2025</td>
                    <td className="text-left p-2.5">Susanta Das</td>
                    <td className="text-left p-2.5">
                      <a href="#" className="flex items-center">
                        <span className="me-2">4969709441305-acd...</span>
                        <Copy size={15} className="text-green-600" />
                      </a>
                    </td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-500 hover:text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-700 dark:text-gray-100 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hidden p-4 rounded-lg dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Dashboard tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.
              </p>
            </div>
            <div className="hidden p-4 rounded-lg bg-gray-100 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Settings tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.
              </p>
            </div>
            <div className="hidden p-4 rounded-lg bg-gray-100 dark:bg-gray-800" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Contacts tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.
              </p>
            </div>
          </div>
        </div>
      </Page>
    </>
    // <>
    //   <Head>
    //     <title>Seamless 4.0 - Enterprise Service Platform</title>
    //   </Head>
    //   <main className="min-h-screen xl:flex">
    //     <MainMenu session={session} />
    //     <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[85px]">
    //       <Header session={session} />
    //       <div className="flex w-full item-center justify-between border-b border-black/10 dark:border-white/10 py-3 px-12">
    //         <div className="flex items-center">
    //           <a href="#" onClick={() => router.back()} className="hover:text-blue-500">
    //             <ArrowLeft size={24} strokeWidth={2} className="text-gray-900 hover:text-blue-600 mx-3" />
    //           </a>
    //           <h2 className="text-gray-800 font-semibold">Service Details</h2>
    //         </div>
    //         <div className="flex items-center">
    //           <button className="group flex items-center gap-2 hover:bg-blue-100 text-black font-bold py-2 px-4 rounded transition">
    //             <Plus size={16} strokeWidth={2} className="text-gray-900 group-hover:text-blue-600" />
    //             <span className="text-gray-800 text-sm font-semibold group-hover:text-blue-600">Create Credentials</span>
    //           </button>

    //           <button disabled className="group flex items-center gap-2 text-black font-bold py-2 px-4 ms-2 rounded transition">
    //             <Trash2 size={16} strokeWidth={2} className="text-gray-400 group-hover1:text-red-600" aria-disabled />
    //             <span className="text-gray-400 text-sm font-semibold group-hover1:text-red-600">Delete</span>
    //           </button>
    //         </div>
    //       </div>
    //       <div className="px-12 bg-white">
    //         <div className="w-full p-4 mx-auto1 border-b1 border-black/10 dark:border-white/101">
    //           <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
    //             <div className="flex items-center">
    //               <Image src={service.icon || ""} alt={service.title || ""} width={60} height={60} className="mr-4" />
    //               <div className="flex flex-col justify-center">
    //                 <h2 className="text-[24px] text-gray-800 font-semibold">{service.title}</h2>
    //                 <p className="text-gray-600 truncate overflow-hidden text-ellipsis">{service.description}</p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="w-full p-4 mx-auto1">
    //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    //             <div className="flex items-center border-r border-black/10 dark:border-white/10">
    //               <div className="flex flex-col justify-center">
    //                 <p className="text-gray-800 font-semibold">Name</p>
    //                 <p className="text-[13px] text-gray-600">{service.title}</p>
    //               </div>
    //             </div>
    //             <div className="flex items-center border-r border-black/10 dark:border-white/10">
    //               <div className="flex flex-col justify-center">
    //                 <p className="text-gray-800 font-semibold">Version</p>
    //                 <p className="text-[13px] text-gray-600">3.5</p>
    //               </div>
    //             </div>
    //             <div className="flex items-center border-r border-black/10 dark:border-white/10">
    //               <div className="flex flex-col justify-center">
    //                 <p className="text-gray-800 font-semibold">Type</p>
    //                 <p className="text-[13px] text-gray-600">Public API</p>
    //               </div>
    //             </div>
    //             <div className="flex items-center border-r border-black/10 dark:border-white/10">
    //               <div className="flex flex-col justify-center">
    //                 <p className="text-gray-800 font-semibold">Status</p>
    //                 <p className="text-[13px] text-gray-600">Active</p>
    //               </div>
    //             </div>
    //             <div className="flex items-center">
    //               <div className="flex flex-col justify-center">
    //                 <p className="text-gray-800 font-semibold">Documentation</p>
    //                 <a href={`/documentation/${service.name}/v3.5`} className="text-[13px] text-blue-600 flex items-center">
    //                   <span className="me-2">API Documentation</span>
    //                   <ExternalLink size={15} className="text-blue-600" />
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="mb-4 border-b border-black/10 dark:border-white/10 dark:border-gray-700 bg-white">
    //         <ul className="flex flex-wrap -mb-px text-sm font-medium px-12 text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
    //           <li className="me-3" role="presentation">
    //             <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-800 border-gray-300 hover:border-gray-600" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
    //               API Keys
    //             </button>
    //           </li>
    //           <li className="me-3" role="presentation">
    //             <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-800 border-gray-300 hover:border-gray-600" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">
    //               OAuth 2.0 Client IDs
    //             </button>
    //           </li>
    //           <li className="me-3" role="presentation">
    //             <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="true">
    //               OAuth 2.0 Client IDs
    //             </button>
    //           </li>
    //         </ul>
    //       </div>
    //       <div id="default-tab-content">
    //         <div className="hidden1 rounded-lg dark:bg-gray-800 px-12" id="profile" role="tabpanel" aria-labelledby="profile-tab">
    //           {/* <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Profile tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p> */}
    //           <table className="table-auto w-full text-sm">
    //             <thead className="bg-gray-200">
    //               <tr>
    //                 <th className="w-[20px] px-4 py-2.5">
    //                   <input type="checkbox" className="flex" />
    //                 </th>
    //                 <th className="text-left p-2.5">Name</th>
    //                 <th className="text-left p-2.5">Creation On</th>
    //                 <th className="text-left p-2.5">Creation By</th>
    //                 <th className="text-left p-2.5">Client ID</th>
    //                 <th className="p-2.5">Action</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               <tr className="border-b border-black/10 dark:border-white/10">
    //                 <td className="text-left px-4 py-2.5">
    //                   <input type="checkbox" className="flex" />
    //                 </td>
    //                 <td className="text-left p-2.5">Webclient</td>
    //                 <td className="text-left p-2.5">24-03-2025</td>
    //                 <td className="text-left p-2.5">Sayan Das</td>
    //                 <td className="text-left p-2.5">
    //                   <a href="#" className="flex items-center">
    //                     <span className="me-2">3569709469305-rdf...</span>
    //                     <Copy size={15} className="text-green-600" />
    //                   </a>
    //                 </td>
    //                 <td className="text-left p-2.5">
    //                   <div className="flex items-center justify-center">
    //                     <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
    //                     <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
    //                     <Download size={16} className="text-gray-600 cursor-pointer" />
    //                   </div>
    //                 </td>
    //               </tr>
    //               <tr className="border-b border-black/10 dark:border-white/10">
    //                 <td className="text-left px-4 py-2.5">
    //                   <input type="checkbox" className="flex" />
    //                 </td>
    //                 <td className="text-left p-2.5">Desktop Application</td>
    //                 <td className="text-left p-2.5">25-03-2025</td>
    //                 <td className="text-left p-2.5">Soumen Sardar</td>
    //                 <td className="text-left p-2.5">
    //                   <a href="#" className="flex items-center">
    //                     <span className="me-2">9669869441305-cdq...</span>
    //                     <Copy size={15} className="text-green-600" />
    //                   </a>
    //                 </td>
    //                 <td className="text-left p-2.5">
    //                   <div className="flex items-center justify-center">
    //                     <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
    //                     <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
    //                     <Download size={16} className="text-gray-600 cursor-pointer" />
    //                   </div>
    //                 </td>
    //               </tr>
    //               <tr>
    //                 <td className="text-left px-4 py-2.5">
    //                   <input type="checkbox" className="flex" />
    //                 </td>
    //                 <td className="text-left p-2.5">Mobile Application</td>
    //                 <td className="text-left p-2.5">27-03-2025</td>
    //                 <td className="text-left p-2.5">Susanta Das</td>
    //                 <td className="text-left p-2.5">
    //                   <a href="#" className="flex items-center">
    //                     <span className="me-2">4969709441305-acd...</span>
    //                     <Copy size={15} className="text-green-600" />
    //                   </a>
    //                 </td>
    //                 <td className="text-left p-2.5">
    //                   <div className="flex items-center justify-center">
    //                     <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
    //                     <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
    //                     <Download size={16} className="text-gray-600 cursor-pointer" />
    //                   </div>
    //                 </td>
    //               </tr>
    //             </tbody>
    //           </table>
    //         </div>
    //         <div className="hidden p-4 rounded-lg dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
    //           <p className="text-sm text-gray-500 dark:text-gray-400">
    //             This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Dashboard tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.
    //           </p>
    //         </div>
    //         <div className="hidden p-4 rounded-lg bg-gray-100 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
    //           <p className="text-sm text-gray-500 dark:text-gray-400">
    //             This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Settings tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.
    //           </p>
    //         </div>
    //         <div className="hidden p-4 rounded-lg bg-gray-100 dark:bg-gray-800" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
    //           <p className="text-sm text-gray-500 dark:text-gray-400">
    //             This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Contacts tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Access context properties with type safety
  const { query, req, res } = context;

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

  // get service details
  const serviceName = typeof query.params !== "undefined" ? query.params[0] : "";

  return {
    props: {
      session,
      service: Apis.find((app) => app.name == serviceName),
      meta: meta,
    },
  };
};
