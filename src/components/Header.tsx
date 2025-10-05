import Image from "next/image";
import Link from "next/link";
import { SessionData } from "@/libs/session";
import { useGlobalState } from "@/context/globalState";
import { Menu } from "lucide-react";
import { useEffect } from "react";

export default function Header({ session }: { session: SessionData }) {
  const { isMainMenuOpen, saveMenuStateToSession } = useGlobalState();

  // useEffect(() => {
  //   if (localStorage) {
  //     console.log(isMainMenuOpen);
  //     console.log(localStorage.getItem("isMenuCollapse"));

  //     // set panel collapse
  //     saveMenuStateToSession(localStorage.getItem("isMenuCollapse") as string);
  //   }
  // }, []);

  return (
    <header className="sticky top-0 z-[999] flex h-14 w-full shrink-0 items-center justify-between border-b bg-white dark:bg-gray-900 border-black/10 dark:border-white/10 px-4 lg:h-16 lg:gap-4">
      <div className="relative flex min-w-0 shrink-0 items-center gap-0 sm:gap-2 flex-1">
        {(isMainMenuOpen || session.isMenuCollapse) != "true" && (
          <div className="relative flex items-start gap-4">
            <button
              className="cursor-pointer flex items-center rounded-lg hover:bg-gray-700 p-[9px] hover:bg-surface-2 sm:hidden"
              onClick={(e: any) => {
                e.preventDefault();
                saveMenuStateToSession(isMainMenuOpen == "true" ? "false" : "true");
              }}
            >
              <Menu size={16} />
            </button>
            <Link href="/" className="flex items-start justify-center gap-2">
              <Image className="hidden dark:block h-[25px]" src="/icons/logo-light.svg" alt="" width={119} height={25} />
              <Image className="block dark:hidden h-[25px]" src="/icons/logo-dark.svg" alt="" width={119} height={25} />
              <span className="inline-flex items-center rounded-sm px-1 py-[2px] leading-tight text-xs h-[18px] font-medium inset-ring bg-blue-500/20 text-blue-500 inset-ring-blue-500/30 dark:bg-blue-light-400/20 dark:text-blue-light-400 dark:inset-ring-blue-light-400/30">v{process.env.NEXT_PUBLIC_SEAMLESS_VERSION}</span>
            </Link>
          </div>
        )}
        <div className="flex flex-1 items-center gap-2">
          <a href="/pikaso/explore" className="">
            <span className="hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs" data-cy="header-ai-suite-link">
              AI Suite
            </span>
          </a>
          <span className="opacity-50">/</span>
          <div className="group flex items-center gap-2">
            <a aria-current="page" href="/pikaso/ai-image-generator" className="hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs">
              Image Generator
            </a>
          </div>
        </div>
      </div>
      <div id="action-buttons" className="flex shrink-0 items-center justify-end gap-3">
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
    </header>
  );
}

{
  /* <header className="sticky top-0 z-[1]">
  <div className="grid w-full grid-cols-2 grid-rows-[4rem] items-center justify-between border-b border-black/10 dark:border-white/10 px-4 pb-5 lg:flex lg:h-18 lg:pb-0">
    <div className={"flex items-center gap-2 -min-w-[150px]"}>
      <button className="cursor-pointer flex items-center rounded-lg hover:bg-gray-700 p-[9px] hover:bg-surface-2 sm:hidden" onClick={() => setOpen(!open)}>
        <Menu size={16} />
      </button>
      {!open && (
        <a className="text-surface-accent-0 dark:text-white" aria-label="Freepik" href="#">
          <Image className="h-[25px] w-auto hidden dark:block" src="/icons/logo-light.svg" alt="" width={0} height={0} sizes="100vw" />
          <Image className="h-[25px] w-auto block dark:hidden" src="/icons/logo-dark.svg" alt="" width={0} height={0} sizes="100vw" />
        </a>
      )}
    </div>
    <div className="flex flex-1 mx-auto max-w-screen-2xl items-center gap-2 -border-b border-black/10 dark:border-white/10 py-2 px-3">
      <a href="/pikaso/explore" className="">
        <span className="text-surface-foreground-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs" data-cy="header-ai-suite-link">AI Suite</span>
      </a>
      <span className="text-surface-foreground-4 opacity-50">/</span>
      <div className="group flex items-center gap-2">
        <a aria-current="page" href="/pikaso/ai-image-generator" className="router-link-active router-link-exact-active hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs" data-cy="header-current-mode-link">Image Generator</a>
      </div>
    </div>
    {/* <div className="col-span-full row-[2] flex w-full flex-1 items-center gap-2">
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
                  <img className="block overflow-hidden rounded-full" src="/avatars/user-01.jpg" width="24" height="24" alt="avatar" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</header> */
}
