import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import MainMenu from "@/components/MainMenu";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Search, Info, Pin, Star } from "lucide-react";
import Form from "@/components/form";

import { Services, Service } from "@/libs/services";
import { Apis, Api } from "@/libs/apis";

export default function ServiceLisst({ session }: { session: SessionData }) {
  const [serviceName, setServiceName] = useState<string>("");

  const serviceOnClick = (e: any) => {
    e.preventDefault();
    setServiceName(e.target.dataset.name);
  };

  return (
    <>
      <Head>
        <title>Seamless Developer Console</title>
      </Head>
      <div className="relative grid grid-cols-1 text-gray-700 dark:text-gray-200 sm:grid-cols-[auto_minmax(0,1fr)]">
        <MainMenu session={session} />
        <main className="max-w-[100vw] flex-1">
          <Header session={session} />
          <div className="relative mx-auto flex max-w-screen-xl flex-col">
            <div className="h-fit transition-all duration-300 ease-in-out mx-auto lg:max-w-[800px] w-full pt-6">
              <form className="flex w-full flex-auto items-stretch" action="/search">
                <div className="mx-auto flex min-h-[42px] flex-auto items-center rounded-[24px] transition-all border border-transparent bg-gray-200 dark:bg-gray-700 hover:border-black/10 dark:hover:border-white/10">
                  <div className="flex cursor-pointer items-center px-4">
                    <Search size={16} />
                  </div>
                  <input name="term" className="placeholder:text-text-neutral-600 w-full bg-transparent py-2 text-surface-foreground-0 !outline-none sm:h-10 text-sm" type="text" placeholder="Search assets or start creating" autoComplete="off" autoFocus={true} />
                  {/* <div className="mr-4 flex h-full items-center gap-1">
                    <div className="mx-1 h-[70%]">
                      <div className="h-full border-l border-surface-border-alpha-2"></div>
                    </div>
                    <button type="button" className="rounded-full hover:bg-neutral-600/10 flex justify-center items-center cursor-pointer flex-shrink-0 h-8 w-8 transition-colors ml-1" data-cy="search-by-image" data-state="closed">
                      
                    </button>
                  </div> */}
                </div>
              </form>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-3 py-4 sticky top-[64px] z-50 bg-white dark:bg-gray-900">
              <button type="button" className={"transition duration-150 ease-in-out text-nowrap text-sm px-4 h-8 rounded-full border border-black/10 dark:border-white/10 cursor-pointer " + (serviceName == "" ? "bg-black dark:bg-white text-gray-200 dark:text-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200")} data-name="" onClick={serviceOnClick}>
                All Services
              </button>
              {Services.map((value: Service, index: number) => (
                <button key={index} type="button" className={"transition duration-150 ease-in-out text-nowrap text-sm px-4 h-8 rounded-full border border-black/10 dark:border-white/10 cursor-pointer " + (serviceName == value.name ? "bg-black dark:bg-white text-gray-200 dark:text-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200")} data-name={value.name} onClick={serviceOnClick}>
                  {value.title}
                </button>
              ))}
            </div>
            <div className={"grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4 py-4"}>
              {Apis.filter((value: Api) => value.service == serviceName || serviceName == "").map((value: Api, index: number) => (
                <Link key={index} href={`/services/${value.name}`}>
                  <div className="relative group rounded-2xl p-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <div className="flex items-center w-full gap-2.5">
                      <Image className="h-[40px]" src={value.icon} alt="" width={40} height={40} />
                      <div className="flex flex-col gap-1 min-w-0 max-w-full justify-center">
                        <h3>{value.title}</h3>
                        <p className="text-xs truncate">{value.description}</p>
                      </div>
                    </div>
                    <div className="flex items-start absolute top-4 right-3">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 rounded cursor-pointer">
                        <Star size={16} className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors duration-300"  />
                      </button>                     
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = checkSession;
