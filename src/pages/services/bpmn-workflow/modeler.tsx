import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import { useGlobalState } from "@/context/globalState";

import ThemeToggle from "@/components/ThemeToggle";
// import Page from "@/components/Page";

import { Icon } from "@/components/Icon";
import { RefreshCw, Save, Rocket, Play, Upload, Download, Settings } from "lucide-react";

const BpmnModeler = dynamic(() => import('@/components/Bpmn/Modeler'), {
  ssr: false,
})

export default function BpmnWorkflow({ session, border = true }: { session: SessionData, border?: boolean }) {
  const globalState = useGlobalState();

  return (
    <>
      <header className="w-full bg-white dark:bg-slate-900 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-start justify-center gap-2">
                <Image className="hidden dark:block h-[25px]" src="/icons/logo-light.svg" alt="" width={119} height={25} />
                <Image className="block dark:hidden h-[25px]" src="/icons/logo-dark.svg" alt="" width={119} height={25} />
                <span className="inline-flex items-center rounded-sm px-1 py-[2px] leading-tight text-xs h-[18px] font-medium inset-ring bg-blue-500/20 text-blue-500 inset-ring-blue-500/30 dark:bg-blue-light-400/20 dark:text-blue-light-400 dark:inset-ring-blue-light-400/30">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
              </Link>
            </div>

            <div className="h-5 w-px bg-black/10 dark:bg-white/20"></div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-slate-700 dark:text-white cursor-pointer">Services</span>
              <span>/</span>
              <span className="text-blue-500">BPMN Workflow</span>
              <span>/</span>
              <span className="text-blue-500 truncate max-w-[220px]">
                2 Step User Approval Process
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/admin/account" className={"p-[9px] text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit"}>
              <Settings size={16} className="dark:text-white text-slate-800"/>
            </Link>
            <a className="p-[9px] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="#">
              <Icon name="Bell" size={16} className="dark:text-white text-slate-800"/>
            </a>
            <ThemeToggle session={session}/>
            <div className="h-5 w-px bg-black/10 dark:bg-white/20"></div>
            <div id="user" className="order-last flex shrink-0 items-center gap-3">
              <div>
                <div className="relative z-20 flex size-8 shrink-0 flex-col">
                  <button className="shrink-0 gap-2 absolute flex size-full h-full items-center justify-center">
                    <div className="relative">
                      <Image src="/avatars/user.png" alt="" width={24} height={24} className="size-6 bg-surface-2 rounded-full object-contain" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center px-4 h-12 border-t border-black/10 dark:border-white/10">
          <div className="ml-auto flex items-center gap-6">
            <RefreshCw size={18} className="text-slate-800 dark:text-slate-200  hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer" />
            <Save size={18} className="text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer" />
            <Rocket size={18} className="text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer" />
            <Play size={18} className="text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer" />
            <div className="h-5 w-px bg-black/10 dark:bg-white/20"></div>
            <Download size={18} className="text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer" />
            <Upload size={18} className="text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer" />
          </div>
        </div>


      </header>

      <BpmnModeler theme={(globalState.theme || session.theme)} />
    </>
  )
}

export const getServerSideProps = checkSession;
