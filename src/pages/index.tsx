import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
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
  
} from "lucide-react";

import { Icon } from "@/components/Icon";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-black text-sm lg:flex bg-gray-100">
      {/* menu */}
      <div
        className={
          "flex-none bg-gray-800 fixed top-0 h-full w-[300px] transition-all lg:transition-none duration-300 z-50 " +
          (isMenuOpen ? "left-0" : "-left-[300px] lg:left-0 lg:w-[64px]")
        }
      >
        <div className="flex flex-col justify-between h-full relative">
          <div>
            <div className="my-2 mx-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/avatars/user.png"
                  className="rounded-md overflow-hidden"
                  alt=""
                  height={40}
                  width={40}
                />
                {isMenuOpen && (
                  <div className="flex items-center justify-between w-full-">
                    <span className={"gap-2 text-sm"}>
                      <p className="text-white font-extrabold">Susanta Das</p>
                      <p className="text-gray-400 text-xs">
                        System Administrator
                      </p>
                    </span>
                  </div>
                )}
              </div>
              <button
                className="cursor-pointer flex lg:hidden items-center justify-center rounded-full text-white h-10 w-10"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={20} className="duration-100" />
              </button>
            </div>
            <ul className="grid gap-1 my-3">
              {["Home", "User", "Search"].map((m) => (
                <li className="flex border-gray-200 -border-l-3">
                  <a
                    href="#"
                    className={
                      "flex items-center gap-2 mx-3 p-2.5 rounded-md text-gray-400 hover:text-white " +
                      (isMenuOpen ? "" : "hover:bg-gray-700")
                    }
                    title={isMenuOpen ? "" : m}
                  >
                    <Icon name={m} size={20} className="duration-100" />
                    {isMenuOpen && <span className={"text-sm"}>{m}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-1 my-3">
            {["Settings"].map((m) => (
              <li className="flex border-gray-200 -border-l-3">
                <a
                  href="/login"
                  className={
                    "flex items-center gap-2 mx-3 p-2.5 rounded-md text-gray-400 hover:text-white " +
                    (isMenuOpen ? "" : "hover:bg-gray-700")
                  }
                >
                  <Settings size={20} className="duration-100" />
                  {isMenuOpen && <span className={"text-sm"}>{m}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={
          "flex-1 transition-all lg:transition-none duration-300 " +
          (isMenuOpen ? "lg:ml-[300px]" : "ml-0 lg:ml-[64px]")
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center px-4 py-2 bg-white border-b border-gray-200 -shadow-2xs">
          <button
            className="cursor-pointer lg:flex hidden items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 h-10 w-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <ArrowLeftToLine size={22} className="text-gray-600" />
            ) : (
              <ArrowRightToLine size={22} className="text-gray-600" />
            )}
          </button>
          <div className="flex gap-2 lg:justify-center">
            <Image
              src="/icons/logo-dark.svg"
              alt=""
              height={28}
              width={132.8}
            />
          </div>
          <div className="flex items-center justify-end">
            <div className="flex gap-8">
              <div className="flex gap-2 items-center justify-between">
                <button className="cursor-pointer flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 h-10 w-10">
                  <Sun size={22} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setOpen(!open)}
                  onBlur={() => setOpen(false)}
                  className="lg:flex items-center relative gap-3 cursor-pointer hidden"
                >
                  <span className="overflow-hidden rounded-full bg-blue-200">
                    <div
                      className={`flex items-center justify-center h-10 w-10`}
                    >
                      AD
                    </div>
                  </span>
                  <span className="hidden sm:inline">Administrator</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                  {open && (
                    <div
                      className="absolute right-0 top-12 text-start w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <Link
                        href={
                          process.env["NEXT_PUBLIC_OPENPROJECT_API_HOST"] +
                          "/my/account"
                        }
                        target="_blank"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href={
                          process.env["NEXT_PUBLIC_OPENPROJECT_API_HOST"] +
                          "/my/settings"
                        }
                        target="_blank"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </Link>
                    </div>
                  )}
                </button>
                <button
                  className="cursor-pointer lg:hidden flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 h-10 w-10"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu size={22} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-4 p-4">
          <div className="sm:col-span-3 border bg-white border-gray-200 rounded-lg p-4"></div>
          <div className="border- bg-white border-gray-200 rounded-lg p-4 shadow-2xs"></div>
        </div>
      </div>
    </div>
  );
}
