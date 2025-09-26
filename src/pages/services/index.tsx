import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import MainMenu from "@/components/MainMenu";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Search } from "lucide-react";

import { Services, Service } from "@/libs/services";
import { Apis, Api } from "@/libs/apis";

export default function ServiceList({ session }: { session: SessionData }) {
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
          <div className="mx-auto flex max-w-screen-2xl flex-col py-6">
            <div className="h-fit transition-all duration-300 ease-in-out mx-auto lg:max-w-[800px] w-full">
              <form className="relative flex w-full flex-auto items-stretch" action="/search">
                <div className="relative mx-auto flex min-h-[42px] flex-auto items-center rounded-[24px] transition-all border border-transparent bg-gray-200 dark:bg-gray-700 hover:border-black/10 dark:hover:border-white/10">
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
            <div className="flex items-center justify-center flex-wrap gap-3 py-5 sticky top-[64px] bg-white dark:bg-gray-900">
              <button type="button" className={"transition duration-150 ease-in-out text-nowrap text-sm px-4 h-8 rounded-full border border-black/10 dark:border-white/10 cursor-pointer " + (serviceName == "" ? "bg-black dark:bg-white text-gray-200 dark:text-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200")} data-name="" onClick={serviceOnClick}>
                All Services
              </button>
              {Services.map((value: Service, index: number) => (
                <button key={index} type="button" className={"transition duration-150 ease-in-out text-nowrap text-sm px-4 h-8 rounded-full border border-black/10 dark:border-white/10 cursor-pointer " + (serviceName == value.name ? "bg-black dark:bg-white text-gray-200 dark:text-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200")} data-name={value.name} onClick={serviceOnClick}>
                  {value.title}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6 pt-4">
              {Apis.filter((value: Api) => value.service == serviceName || serviceName == "").map((value: Api, index: number) => (
                <Link key={index} href={`/services/${value.name}`}>
                  <div className="flex items-start justify-between rounded-2xl p-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <div className="flex items-center w-full">
                      <Image src={value.icon} alt="" width={40} height={40} className="mr-3" />
                      <div className="flex flex-col min-w-0 max-w-full flex-1 justify-center overflow-hidden">
                        <h3>{value.title}</h3>
                        <p className="text-[13px] block truncate">{value.description}</p>
                      </div>
                    </div>
                    {/* <PinIcon
                      size={18}
                      strokeWidth={2}
                      fill={index % 2 == 0 ? "#475467" : "#fff"}
                      className="text-gray-600"
                      onClick={(e: any) => {
                        e.preventDefault();
                        console.log("clicked...");
                      }}
                    /> */}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-2 rounded cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" className="fill-black/50 hover:fill-black dark:fill-white/50 dark:hover:fill-white transition-colors duration-300 size-3">
                        <path d="m5.181 9.65 2.893 2.896.418-.418a4.72 4.72 0 0 0 1.225-4.504l-.145-.591L10.803 5.8l.128.128a1.82 1.82 0 0 0 2.326.237 1.774 1.774 0 0 0 .224-2.699L10.573.55A1.82 1.82 0 0 0 8.248.314a1.773 1.773 0 0 0-.225 2.698l.173.173L6.962 4.42l-.581-.143A4.71 4.71 0 0 0 1.872 5.5l-.417.418 2.893 2.894L0 13.164.835 14z"></path>
                      </svg>
                    </button>
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
