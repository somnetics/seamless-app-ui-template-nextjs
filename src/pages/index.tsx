import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  Sun,
  Moon,
  Settings,
  Search,
  Menu,
  X,
  ArrowLeftToLine,
  ArrowRightToLine,
  PanelLeftClose,
  PanelLeftOpen

} from "lucide-react";

import { Icon } from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const [open, setOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative grid grid-cols-1 text-surface-foreground-0 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className={"h-full transition-[width] duration-100 ease-in-out sm:sticky sm:left-0 sm:top-0 sm:w-16 xl:sidebar-anchored:w-[240px] xl:sidebar-floating:w-16 hidden sm:block " + (open ? "xl:w-[240px]" : "xl:w-16")}>
        <nav aria-label="Sidebar" className="bg-gray-100 dark:bg-gray-800 sm:z-[2] w-full fixed h-full sm:h-dvh translate-x-full sm:translate-x-0 sm:sticky sm:top-0 sm:left-0">
          <div className="flex h-full flex-col justify-stretch">
            <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between px-4 sm:h-4 xl:h-16">
              {open && (
                <div className="pl-2 sm:hidden sm:sidebar-floating:hidden xl:block">
                  <a className="text-surface-accent-0 dark:text-white" aria-label="Freepik" href="#">
                    <Image className="h-[25px] w-auto hidden dark:block" src="/icons/logo-light.svg" alt="" width={0} height={0} sizes="100vw" />
                    <Image className="h-[25px] w-auto block dark:hidden" src="/icons/logo-dark.svg" alt="" width={0} height={0} sizes="100vw" />
                  </a>
                </div>
              )}
              <button aria-label="Toggle sidebar" onClick={() => setOpen(!open)} className="cursor-pointer flex items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-[9px] hover:bg-surface-2 sm:hidden xl:flex">
                {open ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
            </div>
            <div dir="ltr" className="relative flex-1 overflow-auto pl-4 pr-2">
              <div className="size-full pr-2" style={{ overflow: "hidden" }}>
                <div style={{ minWidth: "100%", display: "table" }}>
                  <div className="flex flex-col gap-1">
                    {["Home", "User", "Search"].map((m, i) => (
                      <a key={i} aria-label="Home" data-state="closed" className={"bg-surface-2 flex h-10 items-center gap-1 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 sm:h-8 w-full sm:w-8" + (open ? " xl:w-full" : " justify-center")} href="#">
                        <div className="flex w-8 items-center justify-center">
                          <Icon name={m} size={16} />
                        </div>
                        {open && (
                          <span className="inline sm:hidden sm:sidebar-floating:hidden xl:inline">{m}</span>
                        )}
                      </a>
                    ))}
                  </div>
                  <div className="mb-[15px] mt-4 border-t border-black/10 dark:border-white/10"></div>
                  <div className="flex flex-col gap-1">
                    {["Home", "User", "Search"].map((m, i) => (
                      <a key={i} aria-label="Home" data-state="closed" className={"bg-surface-2 flex h-10 items-center gap-1 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 sm:h-8 w-full sm:w-8" + (open ? " xl:w-full" : " justify-center")} href="#">
                        <div className="flex w-8 items-center justify-center">
                          <Icon name={m} size={16} />
                        </div>
                        {open && (
                          <span className="inline sm:hidden sm:sidebar-floating:hidden xl:inline">{m}</span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 z-10 mt-auto flex flex-col gap-4 p-4">
              <div className="hidden xl:block">
                {open && (
                  <button data-cy="creditsCta.getAPlan" className="w-full max-w-[240px] bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg px-4 py-[9px] duration-100 ease-in sm:sidebar-floating:hidden lg:w-[208px]">
                    <div className="flex flex-col items-start gap-[2px] text-sm">
                      <p className="text-left font-semibold text-premium-gold-700 dark:text-premium-gold-600">Get a plan</p>
                      <p className="text-left font-normal text-surface-foreground-0">Unlock more features</p>
                    </div>
                  </button>
                )}
              </div>
              <div className={"flex items-center justify-between gap-6 flex-col " + (open ? "xl:flex-row" : "xl:flex-col")}>
                <div className={"flex gap-2 flex-col " + (open ? "xl:flex-row" : "xl:flex-col")}>
                  <a className="transition-all duration-150 ease-out p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="/login">
                    <Settings size={16} />
                  </a>
                  <a className="transition-all duration-150 ease-out p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="/login">
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
                <button className="transition-all duration-150 ease-out p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R2lm9kq6:" data-state="closed">
                  <Icon name="LogOut" size={16} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <main className="max-w-[100vw] flex-1">
        <header className="sticky top-0 z-[1]">
          <div className="grid w-full grid-cols-2 grid-rows-[4rem] items-center justify-between border-b border-black/10 dark:border-white/10 px-4 pb-5 lg:flex lg:h-16 lg:pb-0">
            <div className={"flex items-center gap-2 min-w-[150px]" + (open ? " visible xl:invisible" : " sm:visible")}>
              <button className="cursor-pointer flex items-center rounded-lg hover:bg-gray-700 p-[9px] hover:bg-surface-2 sm:hidden" onClick={() => setOpen(!open)}>
                <Menu size={16} />
              </button>
              <a className="text-surface-accent-0 dark:text-white" aria-label="Freepik" href="#">
                <Image className="h-[25px] w-auto hidden dark:block" src="/icons/logo-light.svg" alt="" width={0} height={0} sizes="100vw" />
                <Image className="h-[25px] w-auto block dark:hidden" src="/icons/logo-dark.svg" alt="" width={0} height={0} sizes="100vw" />
              </a>
            </div>
            <div className="col-span-full row-[2] flex w-full flex-1 items-center gap-2">
              <div className="h-fit transition-all duration-300 ease-in-out mx-auto lg:max-w-[800px] w-full">
                <form className="relative flex w-full flex-auto items-stretch" action="/search">
                  <div className="relative mx-auto flex min-h-[42px] flex-auto items-center rounded-[24px] border transition-all border-black/10 dark:border-white/10 bg-gray-50 dark:bg-gray-800">
                    <div className="flex cursor-pointer items-center pl-7 pr-3" role="button" aria-label="Open autocomplete">
                      <Search size={16} />
                    </div>
                    <input name="term" className="placeholder:text-text-neutral-600 w-full bg-transparent py-2 text-surface-foreground-0 !outline-none sm:h-10" type="text" placeholder="Search assets or start creating" autoComplete="off" data-cy="search-pageSearch" />
                    <div className="mr-4 flex h-full items-center gap-1">
                      <div className="mx-1 h-[70%]">
                        <div className="h-full border-l border-black/10 dark:border-white/10"></div>
                      </div>
                      <button type="button" className="rounded-full hover:bg-neutral-600/10 flex justify-center items-center cursor-pointer flex-shrink-0 h-8 w-8 transition-colors ml-1" data-cy="search-by-image" data-state="closed">
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                </form>
                <div className="hidden">
                  <button className="relative top-px flex size-8 items-center justify-center">
                    <span>Search List</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 min-w-[150px] justify-end">
              <ThemeToggle />
              <div className="items-center flex justify-end lg:flex-initial">
                <div className="flex items-center gap-[15px]">
                  <button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R5tq9kq6:" data-state="closed">
                    <div data-cy="user-avatar" className="flex items-center gap-2">
                      <div className="relative size-[46px] shrink-0">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <img className="block overflow-hidden rounded-full" src="https://lh3.googleusercontent.com/a-/AOh14Gj7e34T4vp4Jjj68t8ct726o4sc39BErozvo5WWaQ=s96-c" width="24" height="24" alt="avatar" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 mx-auto max-w-screen-2xl items-center gap-2 -border-b border-black/10 dark:border-white/10 py-2 px-4">
            <a href="/pikaso/explore" className="">
              <span className="text-surface-foreground-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs" data-cy="header-ai-suite-link">AI Suite</span>
            </a>
            <span className="text-surface-foreground-4 opacity-50">/</span>
            <div className="group flex items-center gap-2">
              <a aria-current="page" href="/pikaso/ai-image-generator" className="router-link-active router-link-exact-active hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs" data-cy="header-current-mode-link">Image Generator</a>
            </div>
          </div>
        </header>
        <div className="mx-auto flex max-w-screen-2xl flex-col">
          <div className="mt-8 w-full px-5 lg:mt-12">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-custom-blue">Hello</h1>
              <a href="" className="items-center transition-colors duration-[300ms] no-underline inline-flex py-[10px] sprinkles-text-base font-semibold rounded-[6px] whitespace-nowrap bg-custom-blue text-white hover:bg-blue-700 h-11 px-4 leading-tight xl:h-12">Home</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
