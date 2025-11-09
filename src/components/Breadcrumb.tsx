import Link from "next/link";
import React from "react";

export type Nav = {
  link: string;
  name: string;
}

export function Breadcrumb({ navs }: { navs: Nav[] }) {
  return (
    <>
      <div className="flex flex-1 items-center gap-2">
        {navs.map((nav, index) =>
          <React.Fragment key={index}>
            <Link href={nav.link}>
              <span className="hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2.5 rounded px-2 py-1 text-xs">
                {nav.name}
              </span>
            </Link>
            {navs.length - 1 > index && (<span className="opacity-50">/</span>)}
          </React.Fragment>
        )}
      </div>
    </>
  )
} 