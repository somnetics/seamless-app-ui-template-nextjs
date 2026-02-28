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
import Header from "@/components/HeaderBar";
import Page from "@/components/Page";
import Button from "@/components/Button";
import { Search, Pin, Star, User, IdCard, Layers, Save, Files } from "lucide-react";
import Form from "@/components/FormOld";
import { useProgress } from "@/components/Progress";
import { useModal } from '@/components/Modal';
import { useToast, MessageTypes } from "@/components/Toast";
import TabContent from "@/components/TabContent";

import { Services, Service } from "@/libs/services";
import { Apis, Api } from "@/libs/apis";

import Account from "@/components/Admin/Accounts";
import Users from "@/components/Admin/Users";
import Info from "@/components/Registration/Info";

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

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[
        { link: "/services", name: "User registration" },
      ]} border={true}>
        <div className="relative mx-auto flex flex-col">
          <TabContent ulClassName="px-12 mt-3 mb-4" containerClassName="w-full mx-auto px-[20px] max-w-[1400px] py-10" tabs={[
            { name: "Info", icon: "User", link: "/registration/info", content: <Info session={session} /> },
            { name: "Personal", icon: "IdCard", link: "/registration/personal", content: <Users /> },
            { name: "Accounts", icon: "User", link: "/registration/accounts", content: <Account /> },
            { name: "Documents", icon: "Files", link: "/registration/document", content: <Account /> },
            { name: "Submit", icon: "ServerCog", link: "/registration/submit", content: <Account /> },
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
