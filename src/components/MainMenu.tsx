import Image from "next/image";
import Link from "next/link";
import { SessionData } from "@/libs/session";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/context/globalState";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";

import { Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Icon } from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { Apis, Api } from "@/libs/apis";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export default function MainMenu() {
  // const [open, setOpen] = useState(true);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const { addToast } = useToast();
  const { showProgress } = useProgress();
  const { isMainMenuOpen, setToogleMainMenu } = useGlobalState();

  const handleLogout = async (e: any) => {
    e.preventDefault();

    // activate page progress
    showProgress(true);

    // call api
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // get response data
    const data = await response.json();

    // pause
    setTimeout(() => {
      // activate page progress
      showProgress(false);

      // redirect to login
      router.push("/login");

      // pause
      setTimeout(() => {
        // show message
        addToast(data.message, MessageTypes.Success, 1500);
      }, 500);
    }, 500);
  };

  return (
    <div className={"h-full transition-[width] duration-100 ease-in-out sm:sticky sm:left-0 sm:top-0 sm:w-16 hidden sm:block " + (isMainMenuOpen ? "xl:w-[250px]" : "xl:w-16")}>
      <nav className="bg-gray-100 dark:bg-gray-800 sm:z-[2] w-full fixed h-full sm:h-dvh translate-x-full sm:translate-x-0 sm:sticky sm:top-0 sm:left-0">
        <div className="flex h-full flex-col justify-stretch">
          <div className={"sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between px-4 sm:h-4 xl:h-16 " + (isMainMenuOpen ? "justify-between" : "justify-center")}>
            {isMainMenuOpen && (
              <div className="pl-1 sm:hidden xl:block">
                <a className="text-surface-accent-0 dark:text-white flex gap-2 items-start justify-center" aria-label="Freepik" href="#">
                  <Image className="hidden dark:block" src="/icons/logo-light.svg" alt="" width={118.56} height={25} />
                  <Image className="block dark:hidden" src="/icons/logo-dark.svg" alt="" width={118.56} height={25} />
                  <span className="inline-flex items-center rounded-md bg-purple-400/10 px-1 py-[2px] text-[11px] text-purple-400 inset-ring inset-ring-purple-400/30">v4.0</span>
                </a>
              </div>
            )}
            <button aria-label="Toggle sidebar" onClick={() => setToogleMainMenu(!isMainMenuOpen)} className="cursor-pointer flex items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-[9px] sm:hidden xl:flex">
              {isMainMenuOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          </div>
          <SimpleBar className="relative flex-1 pl-4 pr-2 overflow-auto" style={{ height: 1 }}>
            <div className="size-full pr-2">
              <div className="flex flex-col gap-1">
                {[
                  { name: "Home", icon: "Home" },
                  { name: "Tenants", icon: "Building2" },
                  { name: "Credentials", icon: "KeySquare" },
                  { name: "Users", icon: "User" },
                ].map((item: any, i) => (
                  <div key={i} className="group relative">
                    <a href="#" className="text-sm lg:w-full sm:w-8 w-full rounded-lg flex items-center gap-1 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1">
                      <span className="flex size-8 shrink-0 items-center justify-center">
                        <Icon name={item.icon} size={16} />
                      </span>
                      <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 sm:hidden sm:max-w-36 xl:inline">
                        <span className="block truncate sm:hidden lg:block">{item.name}</span>
                      </span>
                    </a>
                  </div>
                ))}
              </div>

              <div className="mb-[15px] mt-4 border-t border-black/10 dark:border-white/10"></div>

              {/* {isMainMenuOpen && (
                  <p className="mb-1 hidden h-8 items-center text-xs font-semibold text-gray-800 dark:text-gray-300 xl:flex">
                    Pinned
                  </p>
                )} */}

              <div className="space-y-1">
                {Apis.slice(0, 10).map((value: Api, i: number) => (
                  <div key={i} className="group relative">
                    <a href="#" className="text-sm lg:w-full sm:w-8 w-full rounded-lg flex items-center gap-1 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1">
                      <span className="flex size-8 shrink-0 items-center justify-center">
                        <Image src={value.icon} alt="" width={16} height={16} />
                      </span>
                      <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 sm:hidden sm:max-w-36 xl:inline">
                        <span className="block truncate sm:hidden lg:block">{value.title}</span>
                      </span>
                      {isMainMenuOpen && (
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-2 rounded cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" className="fill-white/50 hover:fill-white transition-colors duration-300 size-3">
                            <path d="m5.181 9.65 2.893 2.896.418-.418a4.72 4.72 0 0 0 1.225-4.504l-.145-.591L10.803 5.8l.128.128a1.82 1.82 0 0 0 2.326.237 1.774 1.774 0 0 0 .224-2.699L10.573.55A1.82 1.82 0 0 0 8.248.314a1.773 1.773 0 0 0-.225 2.698l.173.173L6.962 4.42l-.581-.143A4.71 4.71 0 0 0 1.872 5.5l-.417.418 2.893 2.894L0 13.164.835 14z"></path>
                          </svg>
                        </button>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </SimpleBar>
          {/* <div className="mb-[15px] mt-4 mx-4 border-t border-black/10 dark:border-white/10"></div> */}
          <div className="sticky bottom-0 z-10 mt-auto flex flex-col gap-4 p-4">
            {isMainMenuOpen && (
              <div className="hidden xl:block">
                <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg px-4 py-[9px] duration-100 ease-in">
                  <div className="flex flex-col items-start gap-[2px] text-sm truncate">
                    <p className="text-left font-semibold text-yellow-500 dark:text-yellow-500">30 Days Free Trial</p>
                    <p className="text-left font-normal text-surface-foreground-0">Unlock more features</p>
                  </div>
                </button>
              </div>
            )}
            <div className={"flex items-center justify-between gap-6 flex-col " + (isMainMenuOpen ? "xl:flex-row" : "xl:flex-col")}>
              <div className={"flex gap-2 flex-col " + (isMainMenuOpen ? "xl:flex-row" : "xl:flex-col")}>
                <a className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="#">
                  <Settings size={16} />
                </a>
                <a className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="#">
                  <Icon name="Bell" size={16} />
                </a>
                <ThemeToggle />
                {/* <button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rg:" data-state="closed" aria-label="Notifications">
                    <span className="_1uvu8nb0"></span>
                    <span className="relative $transition-all font-semibold sprinkles-text-base transition-all duration-150 ease-out hover:bg-surface-2 p-[9px] rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit text-surface-foreground-0 ">
                      <span className="$absolute $top-0 $right-0 $bg-blueFreepik $rounded-full $text-center $w-[15px] $h-[15px] $text-white $text-[10px] $leading-[18px] $font-bold $flex $items-center $justify-center">4</span>
                    </span>
                  </button> */}
              </div>
              <button onClick={handleLogout} className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" type="button">
                <Icon name="LogOut" size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
