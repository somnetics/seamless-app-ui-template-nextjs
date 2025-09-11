import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { Inter } from "next/font/google";
import { Sun, Moon, Home, Search } from "lucide-react";

const bokor = Inter({
  subsets: ["latin"]
});

export default function Index() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${bokor.className} flex flex-row min-h-screen text-black text-sm bg-gray-100`}
    >
      <div className="bg-gray-800 p-4 w-2xs">
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-1">
            {["Dashboard", "Orders", "Pending", "On Transit"].map(m =>
              <li className="text-gray-300 hover:text-white">
                <Link className="flex items-center p-2 rounded-lg hover:bg-gray-700" href="/">
                  <Home size={22} className="me-2" />
                  {m}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="w-full">
        <div className="px-4 flex items-center justify-between border-b bg-white border-gray-200">
          {/* <div className="flex items-center gap-2">
            <Search size={22} className="text-gray-600" />
            <input className="border bg-gray-200 p-2 border-gray-200 rounded-md" type="text" name="" id="" />
          </div> */}
          <div className="font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex gap-6 flex-wrap">
              <li>
                <a href="#" className="inline-block py-5 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Home</a>
              </li>
              <li>
                <a href="#" className="inline-block py-5 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active" aria-current="page">Orders</a>
              </li>
              <li>
                <a href="#" className="inline-block py-5 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Sales</a>
              </li>
              <li>
                <a href="#" className="inline-block py-5 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Customers</a>
              </li>
              <li>
                <a href="#" className="inline-block py-5 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Admin</a>
              </li>
              {/* <li>
              <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Disabled</a>
            </li> */}
            </ul>
          </div>
          <div className="flex gap-8">

            <div className="flex gap-2 items-center justify-between">
              <button
                className="cursor-pointer flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-gray-200 h-10 w-10" >
                <Sun size={22} className="text-gray-600" />
              </button>
              <button
                onClick={() => setOpen(!open)}
                onBlur={() => setOpen(false)}
                className="flex items-center relative gap-3 cursor-pointer">
                <span className="overflow-hidden rounded-full bg-blue-200">
                  <div className={`flex items-center justify-center h-10 w-10`}>AD</div>
                </span>
                <span className="hidden sm:inline">Administrator</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
                {open && (
                  <div className="absolute right-0 top-12 text-start w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50" onMouseDown={(e) => e.preventDefault()}>
                    <Link href={process.env["NEXT_PUBLIC_OPENPROJECT_API_HOST"] + "/my/account"} target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link href={process.env["NEXT_PUBLIC_OPENPROJECT_API_HOST"] + "/my/settings"} target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</Link>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-4 p-4 h-[calc(100vh-63px)]">
          <div className="col-span-3 border bg-white border-gray-200 rounded-lg p-4">

          </div>
          <div className="border- bg-white border-gray-200 rounded-lg p-4 shadow-2xs">

          </div>
        </div>
      </div>
      {/* <footer className="flex flex-wrap items-center justify-center">
        
      </footer> */}
    </div>
  );
}
