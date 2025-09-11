import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { Inter } from "next/font/google";
import { Sun, Moon, Home, Search, Menu, ArrowLeftToLine, ArrowRightToLine } from "lucide-react";

const bokor = Inter({
  subsets: ["latin"]
});

export default function Index() {
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`${bokor.className} min-h-screen text-black text-sm lg:flex bg-gray-100`}>
      <div className={"flex-none bg-gray-800 fixed top-0 h-full w-[300px] duration-300 " + (isMenuOpen ? "left-0" : "-left-[300px] lg:left-0 lg:w-[68px]")}>
        <div className="flex flex-col justify-between h-full">
          <ul className="grid gap-2 my-3">
            {["Home", "User", "Accounts"].map(m =>
              <li className="flex border-gray-200 -border-l-3">
                <a href="#" className={"flex items-center gap-2 mx-3 p-3 rounded-md text-gray-400 hover:text-white " + (isMenuOpen ? "" : "hover:bg-gray-700")}>
                  <Home size={20} className="duration-100" />
                  <span className={"text-sm duration-100 " + (isMenuOpen ? "" : "hidden")}>{m}</span>
                </a>
              </li>
            )}
          </ul>
          <ul className="grid gap-2 my-3">
            {["Settings"].map(m =>
              <li className="flex border-gray-200 -border-l-3">
                <a href="#" className={"flex items-center gap-2 mx-3 p-3 rounded-md text-gray-400 hover:text-white " + (isMenuOpen ? "" : "hover:bg-gray-700")}>
                  <Home size={20} className="duration-100" />
                  <span className={"text-sm duration-100 " + (isMenuOpen ? "" : "hidden")}>{m}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
        <button className="cursor-pointer bg-amber-600 flex lg:hidden" onClick={() => setIsMenuOpen(false)}>Close</button>
      </div>
      <div className={"flex-1 duration-300 " + (isMenuOpen ? "lg:ml-[300px]" : "ml-0 lg:ml-[68px]")}>
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <button className="cursor-pointer lg:flex hidden items-center justify-center rounded-full bg-white hover:bg-gray-100 border-gray-200 h-10 w-10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <ArrowLeftToLine size={22} className="text-gray-600" /> : <ArrowRightToLine size={22} className="text-gray-600" />}
          </button>

          Home

          <button className="cursor-pointer lg:hidden flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-gray-200 h-10 w-10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={22} className="text-gray-600" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-4 p-4">
          <div className="sm:col-span-3 border bg-white border-gray-200 rounded-lg p-4">

          </div>
          <div className="border- bg-white border-gray-200 rounded-lg p-4 shadow-2xs">

          </div>
        </div>
      </div>
    </div>
  );
}
