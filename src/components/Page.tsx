import Header from "@/components/Header";
import Head from "next/head";
import MainMenu from "./MainMenu";
import { JSX } from "react";
import { SessionData } from "@/libs/session";
import { Nav } from "./Breadcrumb";

export default function Page({ children, title, session, controls, breadcrumbs, border = true }: { children: React.ReactNode, title: string, session: SessionData, controls?: JSX.Element, breadcrumbs?: Nav[], border?: boolean }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative grid grid-cols-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:grid-cols-[auto_minmax(0,1fr)]">
        <MainMenu session={session} />
        <main className="max-w-[100vw] flex-1">
          <Header session={session} navs={breadcrumbs} border={border} />
          {children}
        </main>
      </div>
    </>
  )
}