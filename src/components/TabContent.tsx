import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionData } from "@/libs/session";
import { Icon } from "@/components/Icon";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

type Tab = {
  name: string;
  icon: string;
  link: string;
  page: JSX.Element;
};

type TabContentType = {
  tabs: Tab[];
  className?: string;
  containerClassName?: string
}

export default function TabContent({ tabs, className = "", containerClassName = "px-12" }: TabContentType) {
  const pathname = usePathname();

  return (
    <>
      <nav>
        <ul className={twMerge("flex justify-center gap-3 border-b border-black/10 dark:border-white/10 text-sm", className)}>
          {tabs.map((tab: Tab, i: number) => (
            <li key={i} className={twMerge("border-b hover:border-gray-700 dark:hover:border-gray-300", pathname.startsWith(tab.link) ? "border-gray-700 dark:border-gray-300" : "border-transparent")}>
              <Link href={tab.link} className={twMerge("flex items-center gap-2 py-2 px-4 text-gray-500 dark:text-gray-400", pathname.startsWith(tab.link) ? "text-gray-700 dark:text-gray-200" : "hover:text-gray-700 dark:hover:text-gray-200")}>
                <Icon name={tab.icon} size={16} />
                <span>{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={twMerge(containerClassName, containerClassName)}>
        {tabs.filter((tab: Tab) => pathname.startsWith(tab.link)).map((tab: Tab) => (
          tab.page
        ))}
      </div>
    </>
  )
}