import Header from "@/components/Header";
import HeaderBar from "@/components/HeaderBar";
import MainMenu from "./MainMenu";
import { JSX } from "react";
import { SessionData } from "@/libs/session";
import { Nav } from "./Breadcrumb";

export default function Page({ children, title, session, menu = <MainMenu session={session} />, breadcrumbs, border = true }: { children: React.ReactNode, title: string, session: SessionData, menu?: JSX.Element, breadcrumbs?: Nav[], border?: boolean }) {
  return (
    <>
      <Header title={title} />
      <div className="relative grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)]">
        {/* <MainMenu session={session} /> */}
        {menu}
        <main className="max-w-[100vw] flex-1">
          <HeaderBar session={session} navs={breadcrumbs} border={border} />
          {children}
        </main>
      </div>
    </>
  )
}