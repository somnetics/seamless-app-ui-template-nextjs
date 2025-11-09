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
import Header from "@/components/Header";
import Page from "@/components/Page";
import Button from "@/components/Button";
import { Search, Info, Pin, Star } from "lucide-react";
import Form from "@/components/Form";
import { useProgress } from "@/components/Progress";
import { useModal } from '@/components/Modal';
import { useToast, MessageTypes } from "@/components/Toast";
import TabContent from "@/components/TabContent";

import { Services, Service } from "@/libs/services";
import { Apis, Api } from "@/libs/apis";

import Overview from "@/components/BpmnWorkflow/Overview";
import Daigrams from "@/components/BpmnWorkflow/Daigrams";
import Trash from "@/components/BpmnWorkflow/Trash";

import DropDown from '@/components/Dropdown';
import Textbox from '@/components/Textbox';
import Textarea from '@/components/Textarea';

interface PageProps {
  session: SessionData;
  service: Api;
  tab: string;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function BpmnWorkflow({ session, meta, service, tab }: PageProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const { showProgress } = useProgress();
  const { showModal } = useModal();

  // const [serviceDetails, setServiceDetails] = useState<Api>();

  // useEffect(() => {
  //   if (router.query.params) {
  //     const serviceName = router.query.params[0];
  //     setServiceDetails(Apis.find((app) => app.name == serviceName))
  //   }
  // }, [router.query.params])

  const formBody = <>
    <Textbox  />

    <DropDown
      label={'status'}
      options={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]}
    />

    <Textarea rows={6} />
  </>

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[
        { link: "/services", name: "Services" },
        { link: "/services/" + service.name, name: service.title },
      ]}>
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
                <Button
                  onClick={() => {
                    showModal({
                      title: "New Task", body: formBody, onSubmit: async (formData, close) => {
                        // // let updated data
                        // const taskData: any = { project: project.id, status: "1" };

                        // // get form value
                        // formData.forEach((value, key) => taskData[key] = value);

                        // // show progress
                        // showProgress(true);

                        // // submit task
                        // const data = await SubmitTask(session.token, taskData);

                        // // on error
                        // if (data._type === "Error") {
                        //   // show message
                        //   addToast(data.message, MessageTypes.Error);
                        // } else {
                        //   // show message
                        //   addToast("Task created successfully.", MessageTypes.Success, 1500);
                        // }

                        // // show progress
                        // showProgress(false);

                        // close window
                        close(true);
                      }
                    })
                  }}
                  // className="flex items-center justify-center gap-2 font-medium transition duration-150 ease-in-out text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-2 cursor-pointer"
                  color="secondary" className="btn border dark:border-white/10">
                  <Plus size={15} className="text-green-500 hover:text-green-600" />
                  <span>Create New</span>
                </Button>
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
                    <a href={`/documentation/${service.name}/v3.5`} className="text-[13px] text-primary-500 hover:text-primary-600 flex items-center">
                      <span className="me-2">API Documentation</span>
                      <ExternalLink size={15} className="text-primary-500 hover:text-primary-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TabContent className="px-12 mt-3 mb-4 justify-start" tabs={[
            { name: "Overview", icon: "BookText", link: "/services/bpmn-workflow/overview", content: <Overview session={session} /> },
            { name: "Daigrams", icon: "Workflow", link: "/services/bpmn-workflow/daigrams", content: <Daigrams session={session} endpoint="/seamless/user/search-user/search" /> },
            { name: "Trash", icon: "Trash2", link: "/services/bpmn-workflow/trash", content: <Trash session={session} endpoint="/seamless/user/search-user/trash" /> },
          ]} />
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
  const path = resolvedUrl.split("/")

  return {
    props: {
      session,
      service: Apis.find((app) => app.name == path[2]),
      tab: path[3],
      meta: meta,
    },
  };
};
