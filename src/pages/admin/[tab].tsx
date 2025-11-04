// import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
// import Image from "next/image";
// import Head from "next/head";
// import MainMenu from "@/components/MainMenu";
// import Header from "@/components/Header";
// import { Apis, Api } from "@/libs/apis";

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

import Account from "@/components/Admin/Accounts";
import Users from "@/components/Admin/Users";

interface PageProps {
  session: SessionData;
  service: Api;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function ApiDetails({ session, meta }: PageProps) {
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

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[
        { link: "/services", name: "Admin" },
      ]} border={false}>
        <div className="relative mx-auto flex flex-col">
          <div className="px-4">
            <TabContent containerClassName="w-full mx-auto px-[20px] max-w-[1400px] py-10" tabs={[
              { name: "Account", icon: "UserCog", link: "/admin/account", page: <Account /> },
              { name: "Tenants", icon: "Building2", link: "/admin/tenants", page: <Users /> },
              { name: "Users", icon: "User", link: "/admin/users", page: <Users /> },
              { name: "Services", icon: "ServerCog", link: "/admin/services", page: <Account /> },
            ]} />

            {/* <div className="h-fit mx-auto lg:max-w-[800px] w-full">A</div> */}

            {/* <div className="w-full mx-auto px-[20px] max-w-[1400px] py-10">
              <div className="flex items-center justify-between mb-25">
                <h1 className="text-xl font-semibold text-surface-foreground-0 leading-tight">My collections</h1>
                <button type="button" className="items-center transition-colors duration-[300ms] no-underline inline-flex py-[10px] px-[25px] sprinkles-text-base font-semibold rounded-[6px] whitespace-nowrap bg-blueFreepik text-white hover:bg-blueScience dark:text-blueScience dark:hover:bg-blueFreepik">
                  <span className="hidden sm:block pl-5 font-semibold">New collection</span>
                </button>
              </div>
              <div className="mx-auto my-12 max-w-screen-sm text-center text-surface-foreground-2">
                <div className="mb-30 flex justify-center">
                  <div className="grid justify-center items-center rounded-[6px] w-[50px] min-w-[50px] h-[50px] min-h-[50px] bg-piki-blue-100 text-piki-blue-500 dark:bg-piki-blue-700 dark:text-piki-blue-300"></div>
                </div>
                <p className="mb-10 text-lg font-semibold">No collections to show yet! Find here any of our curated collections that you save</p>
                <p className="mb-20 leading-normal">Collections let you do your own content curation and organize assets that belong together. Want to try?</p>
                <button type="button" className="items-center transition-colors duration-[300ms] no-underline inline-flex py-[10px] px-[25px] sprinkles-text-base font-semibold rounded-[6px] whitespace-nowrap bg-blueFreepik text-white hover:bg-blueScience dark:text-blueScience dark:hover:bg-blueFreepik">
                  <span className="hidden sm:block pl-5 font-semibold">New collection</span>
                </button>
              </div>
            </div> */}
          </div>
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

  // get service name
  // const serviceName = resolvedUrl.split("/").pop();

  return {
    props: {
      session,
      // service: Apis.find((app) => app.name == serviceName),
      meta: meta,
    },
  };
};
