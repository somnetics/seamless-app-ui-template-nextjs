import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

type Tab = {
  name: string;
  icon: string;
  link: string;
  content: JSX.Element;
  isDefault?: boolean;
};

type TabContentType = {
  tabs: Tab[];
  controls?: JSX.Element;
  className?: string;
  ulClassName?: string;
  liClassName?: string;
  containerClassName?: string;
}

export default function TabContent({ tabs, controls, className = "", containerClassName = "px-12", ulClassName = "", liClassName = "" }: TabContentType) {
  const pathname = usePathname();

  return (
    <>
      <nav className={twMerge(controls ? "flex justify-between items-center border-b border-black/10 dark:border-white/10" : "", className)}>
        <ul className={twMerge(controls ? "" : "border-b border-black/10 dark:border-white/10", "flex justify-center gap-3 text-sm", ulClassName)}>
          {tabs.map((tab: Tab, index: number) => (
            <li key={index} className={twMerge("border-b hover:border-slate-700 dark:hover:border-slate-300 mb-[-1px]", pathname.startsWith(tab.link) || tab.link.startsWith(pathname) || tab.isDefault === true ? "border-slate-700 dark:border-slate-300" : "border-transparent")}>
              <Link href={tab.link} className={twMerge("flex items-center gap-2 py-2 px-4 text-slate-500 dark:text-slate-400", pathname.startsWith(tab.link) || tab.link.startsWith(pathname) || tab.isDefault === true ? "text-slate-700 dark:text-slate-200" : "hover:text-slate-700 dark:hover:text-slate-200", liClassName)}>
                <Icon name={tab.icon} size={16} />
                <span>{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        {controls && (
          <div className="flex justify-between items-center gap-2">
            {controls}
          </div>
        )}
      </nav>
      <div className={twMerge(containerClassName, containerClassName)}>
        {tabs.filter((tab: Tab) => pathname.startsWith(tab.link) || tab.link.startsWith(pathname) || tab.isDefault === true).map((tab: Tab, index: number) => (
          <React.Fragment key={index}>{tab.content}</React.Fragment>
        ))}
      </div>
    </>
  )
}