import Image from "next/image";
import Link from "next/link";
import { SessionData } from "@/libs/session";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalState } from "@/context/globalState";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";

import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { Settings, PanelLeftClose, PanelLeftOpen, Pin, Star } from "lucide-react";
import { Icon } from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { Apis, Api } from "@/libs/apis";

export default function MainMenu({ session }: { session: SessionData }) {
  const router = useRouter();
  const pathname = usePathname();

  const { addToast } = useToast();
  const { showProgress } = useProgress();
  const { isMainMenuOpen, saveMenuStateToSession, theme } = useGlobalState();

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

  useEffect(() => {
    if (localStorage) {
      // set panel collapse
      saveMenuStateToSession(localStorage.getItem("isMenuCollapse") as string);
    }
  }, []);

  useEffect(() => {
    const wrappers = document.querySelectorAll(".simplebar-content-wrapper");
    wrappers.forEach((el) => el.classList.add("simplebar-visible"));
  }, []);

  return (
    <div className={"h-full transition-[width] duration-100 ease-in-out sm:sticky sm:left-0 sm:top-0 sm:w-16 hidden sm:block " + ((isMainMenuOpen || session.isMenuCollapse) == "true" ? "lg:w-[250px]" : "lg:w-16")}>
      <nav className="bg-gray-100 dark:bg-gray-800 sm:z-[2] w-full fixed h-full sm:h-dvh translate-x-full sm:translate-x-0 sm:sticky sm:top-0 sm:left-0">
        <div className="flex h-full flex-col justify-stretch relative">
          <div className={"sticky top-0 z-10 flex shrink-0 items-center justify-between px-4 mb-4 sm:h-4 lg:h-16 border-b border-black/10 dark:border-white/10"}>
            {(isMainMenuOpen || session.isMenuCollapse) == "true" && (
              <Link href="/" className="pl-1 sm:hidden lg:flex items-start justify-center gap-2">
                <Image className="hidden dark:block h-[25px]" src="/icons/logo-light.svg" alt="" width={119} height={25} />
                <Image className="block dark:hidden h-[25px]" src="/icons/logo-dark.svg" alt="" width={119} height={25} />
                <span className="inline-flex items-center rounded-sm px-1 py-[2px] leading-tight text-xs h-[18px] font-medium inset-ring bg-blue-500/20 text-blue-500 inset-ring-blue-500/30 dark:bg-blue-light-400/20 dark:text-blue-light-400 dark:inset-ring-blue-light-400/30">v{process.env.NEXT_PUBLIC_SEAMLESS_VERSION}</span>
              </Link>
            )}
            <button
              className="cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-[9px] sm:hidden lg:block"
              onClick={(e: any) => {
                e.preventDefault();
                saveMenuStateToSession((isMainMenuOpen || session.isMenuCollapse) == "true" ? "false" : "true");
              }}
            >
              {(isMainMenuOpen || session.isMenuCollapse) == "true" ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          </div>
          <OverlayScrollbarsComponent className="px-4 flex-1" options={{ scrollbars: { autoHide: "leave", theme: (theme || session.theme) == "dark" ? "os-theme-light" : "os-theme-dark" } }}>
            <div className="flex flex-col gap-1">
              {[
                { name: "Home", icon: "Home", link: "/" },
                { name: "Services", icon: "ServerCog", link: "/services" },
                // { name: "Tenants", icon: "Building2", link: "/tenants" },
                { name: "Credentials", icon: "KeySquare", link: "/credentials" },
                // { name: "Users", icon: "User", link: "/users" },
              ].map((item: any, i) => (
                <div key={i} className="group">
                  <Link href={item.link} className={"text-sm lg:w-full sm:w-8 w-full rounded-lg flex items-center gap-1 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1 " + (pathname.startsWith(item.link) && item.link.length > 1 || item.link == pathname ? "bg-gray-200 dark:bg-gray-700" : "")}>
                    <span className="flex size-8 shrink-0 items-center justify-center text-gray-700 dark:text-white">
                      <Icon name={item.icon} size={16} />
                    </span>
                    <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 sm:hidden sm:max-w-36 lg:inline">
                      <span className="block truncate sm:hidden lg:block">{item.name}</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mb-[15px] mt-4 border-t border-black/10 dark:border-white/10"></div>
            <div className="space-y-1">
              {Apis.slice(0, 10).map((api: Api, i: number) => (
                <div key={i} className="group">
                  <Link href={`/services/${api.name}/overview`} className={"text-sm lg:w-full sm:w-8 w-full rounded-lg flex items-center gap-1 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1 " + (pathname.split("/")[1] == "services" && pathname.split("/")[2] == api.name ? "bg-gray-200 dark:bg-gray-700" : "")}>
                    <span className="flex size-8 shrink-0 items-center justify-center text-gray-700 dark:text-white">
                      <Image src={api.icon} alt="" width={16} height={16} />
                    </span>
                    <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 sm:hidden sm:max-w-36 lg:inline">
                      <span className="block truncate sm:hidden lg:block">{api.title}</span>
                    </span>
                    {(isMainMenuOpen || session.isMenuCollapse) == "true" && (
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-2 rounded cursor-pointer">
                        <Star size={16} className="stroke-black/50 fill-black/50 hover:stroke-black hover:fill-black dark:stroke-white/50 dark:fill-white/50 dark:hover:fill-white transition-colors duration-300 size-3" />
                      </button>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </OverlayScrollbarsComponent>
          <div className="sticky bottom-0 z-10 mt-auto flex flex-col gap-4 p-4">
            {(isMainMenuOpen || session.isMenuCollapse) == "true" && (
              <div className="hidden lg:block">
                <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg px-4 py-[9px]">
                  <div className="flex flex-col items-start gap-[2px] text-sm truncate">
                    <p className="text-left font-semibold text-warning-500 dark:text-warning-500">30 Days Free Trial</p>
                    <p className="text-left font-normal text-surface-foreground-0">Unlock more features</p>
                  </div>
                </button>
              </div>
            )}
            <div className={"flex items-center justify-between gap-6 flex-col " + ((isMainMenuOpen || session.isMenuCollapse) == "true" ? "lg:flex-row" : "lg:flex-col")}>
              <div className={"flex gap-2 flex-col " + ((isMainMenuOpen || session.isMenuCollapse) == "true" ? "lg:flex-row" : "lg:flex-col")}>
                <Link href="/admin/account" className={"p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit " + (pathname.startsWith("/admin") ? "bg-gray-200 dark:bg-gray-700" : "")}>
                  <Settings size={16} />
                </Link>
                <a className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="#">
                  <Icon name="Bell" size={16} />
                </a>
                <ThemeToggle session={session} />
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
